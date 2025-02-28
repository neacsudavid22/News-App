import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost } from '../controllers/post-controller.js'

const postsRouter = express.Router()

postsRouter.route('/post').get(async (req, res) => {
    const result = await getPosts();

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

postsRouter.route('/post').post(async (req, res) => {
    const result = await createPost(req.body);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

postsRouter.route('/post/:id').get(async (req, res) => {
    const result = await getPostById(req.params.id)
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

postsRouter.route('/post/:id').delete(async (req, res) => {
    const result = await deletePost(req.params.id)
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

postsRouter.route('/post/:id').put(async (req, res) => {
    const result = await updatePost(req.params.id, req.body);
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

export default postsRouter;