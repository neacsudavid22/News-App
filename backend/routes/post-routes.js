import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost } from '../controllers/post-controller.js'

const postsRouter = express.Router()

postsRouter.route('/post').get(async (req, res) => {
    res.status(200).json(await getPosts())
})

postsRouter.route('/post/:id').get(async (req, res) => {
    res.status(200).json(await getPostById(req.params.id))
})

postsRouter.route('/post').post(async (req, res) => {
    res.status(200).json(await createPost(req.body))
})

postsRouter.route('/post/:id').delete(async (req, res) => {
    res.status(200).json(await deletePost(req.params.id))
})

postsRouter.route('/post/:id').put(async (req, res) => {
    res.status(200).json(await updatePost(req.params.id, req.body))
})

export default postsRouter;