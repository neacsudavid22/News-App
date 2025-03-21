import multer from "multer";
import express from "express"
import path from "path";
import url from "url";
 
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

// Middleware function
uploadRouter.post("/upload-images", upload, (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map((file) => `${file.filename}`); // the url of each uploaded image
    res.status(200).json({ imageUrls });
});

uploadRouter.get("/get-image/:url", (req, res) => {

    const __filename = url.fileURLToPath(import.meta.url);  // convertește URL-ul fișierului în path absolut.

    const __dirname = path.dirname(__filename); // extrage directorul fișierului curent (upload-routes.js).

    const filePath = path.resolve(__dirname, "../images", req.params.url); // creează un path absolut către imagine.

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: "No corresponding image for given URL" });
        }
    });
});

export default uploadRouter;
