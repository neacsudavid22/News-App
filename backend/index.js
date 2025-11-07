import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from './config/db.js'
import articlesRouter from './routes/article-routes.js';
import usersRouter from './routes/user-routes.js';
import cloudinarydRouter from "./routes/cloudinary-routes.js";
import cookieParser from "cookie-parser";
import { dirname, join } from 'path'; 
import { fileURLToPath } from "url";
import langchainRouter from "./routes/langchain-routes.js";
import { connectCloudinary } from "./config/cloudinary.js";

await connectDB();
await connectCloudinary();

const port = process.env.PORT || 5000;

const app = express();

app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: ["https://newswebapp-qvgp.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
  credentials: true,
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

app.use('/article-api', articlesRouter);
app.use('/user-api', usersRouter);
app.use('/cloudinary-api', cloudinarydRouter);
app.use('/langchain-api', langchainRouter);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

