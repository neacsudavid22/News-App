import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js'
import articlesRouter from './routes/article-routes.js';
import usersRouter from './routes/user-routes.js';
import postsRouter from './routes/post-routes.js';

dotenv.config();
// Conectează la MongoDB
await connectDB();

const corsOptions = {
    // TO-DO cookies
}


const app = express();
app.use(express.json());
app.use(cors());

//start server
const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
});

//routes
app.use('/article-api', articlesRouter);
app.use('/user-api', usersRouter);
app.use('/post-api', postsRouter);
