import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/", // Save in 'uploads/' directory
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;