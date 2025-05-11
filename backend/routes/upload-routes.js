import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import multer from 'multer';
import express from 'express';
  
// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    signing_algorithm: null,
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
    access_mode: 'public'
  },
  type: 'upload',
}); 

const upload = multer({ storage: storage }).array("images");

const uploadRouter = express.Router();

uploadRouter.post("/upload-images", upload, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map(file => file.path); 
    
    res.status(200).json({ 
      message: "Images uploaded successfully",
      imageUrls: imageUrls
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

uploadRouter.post('/get-unused-images-public-ids', async (req, res) => {
  try {
    const imageUrls = req.body.imageUrls || [];

    const result = await cloudinary.search
      .expression(`folder:images`)
      .sort_by('public_id')
      .max_results(100)
      .execute();

    const allPublicIds = result.resources.map(resource => resource.public_id);

    console.log(imageUrls)

    if(imageUrls.length === 0)
      return res.status(200).json({ unusedPublicIds: allPublicIds });

    const imageUrlsSet = new Set(imageUrls.map(url => extractPublicId(url)));

    const unusedUrls = allPublicIds.filter((url) => !imageUrlsSet.has(url));

    const unusedPublicIds = unusedUrls.map(url=>extractPublicId(url))

    res.status(200).json({ unusedPublicIds });

  } catch (error) {
    console.error("get-unused error:", error);
    res.status(500).json({ message: "Error during getting unused images", error });
  }
}); 

uploadRouter.post("/cleanup-unused-images", async (req, res) => {
  try {
    const unusedPublicIds = req.body.unusedPublicIds;

    if (unusedPublicIds.length === 0) {
      return res.status(400).json({ message: 'No unused images to delete' });
    }

    const result = await cloudinary.api.delete_resources(unusedPublicIds);

    res.status(200).json({
      message: 'Unused images deleted successfully',
      result: result,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ message: "Error during cleanup", error });
  }
});

uploadRouter.delete("/delete-images", async (req, res) => {
  try {
    const imageUrls = req.body.imageUrls;

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'No images to delete' });
    }

    const imagePublicIds = imageUrls.map(url=>extractPublicId(url))

    const result = await cloudinary.api.delete_resources(imagePublicIds);

    res.status(200).json({
      message: 'Images deleted successfully',
      result: result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error during Delete", error });
  }
});


export default uploadRouter;
