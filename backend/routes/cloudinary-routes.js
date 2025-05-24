import express from 'express';
import {
  uploadImages,
  getUnusedImagesPublicIds,
  cleanUpUnusedImages,
  deleteImages
} from "../controllers/cloudinary-controller.js";
import { uploadMulter } from '../config/cloudinary.js';

const cloudinarydRouter = express.Router();

cloudinarydRouter.post("/upload-images", uploadMulter, (req, res) => {
  try {
    const result = uploadImages(req.files);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

cloudinarydRouter.post('/get-unused-images-public-ids', async (req, res) => {
  try {
    const result = await getUnusedImagesPublicIds(req.body.imageUrls);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error during getting unused images", error });
  }
});

cloudinarydRouter.post("/cleanup-unused-images", async (req, res) => {
  try {
    const result = await cleanUpUnusedImages(req.body.unusedPublicIds);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

cloudinarydRouter.delete("/delete-images", async (req, res) => {
  try {
    const result = await deleteImages(req.body.imageUrls);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default cloudinarydRouter;