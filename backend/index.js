import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'
import articlesRouter from './routes/article-routes.js';
import usersRouter from './routes/user-routes.js';
import postsRouter from './routes/post-routes.js';

const app = express();

// Conectează la MongoDB
await connectDB();

app.use(cors());
app.use(express.json());

//start server
const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
});

//routes

app.use('/article-api', articlesRouter);
app.use('/user-api', usersRouter);
app.use('/post-api', postsRouter);