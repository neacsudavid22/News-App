import multer from "multer";
import express from "express"

// Configure storage
const storage = multer.diskStorage({
    destination: "images",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Initialize Multer middleware
const upload = multer({
    storage: storage
}).array("images");

const uploadRouter = express.Router()
const port = process.env.PORT || 3600;

// Middleware function
uploadRouter.post("/upload-images", upload, (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map((file) => `http://localhost:${port}/uploads/${file.filename}`);
    res.json({ imageUrls });
});

export default uploadRouter;
