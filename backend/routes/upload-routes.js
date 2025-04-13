import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import express from 'express';

// Config Cloudinary
cloudinary.config({
  cloud_name: 'dappl0lrc',
  api_key: '931842912256358',
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage }).array("images");

const uploadRouter = express.Router();

uploadRouter.post("/upload-images", upload, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const imageUrls = req.files.map((file) => file.path); 
  res.status(200).json({ imageUrls });
});

export default uploadRouter;
