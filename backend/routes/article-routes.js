import express from 'express';
import { getArticles, getArticleById, createArticle, deleteArticle, updateArticle } from '../controllers/article-controller.js'

const articlesRouter = express.Router()

articlesRouter.route('/article').get(async (req, res) => {
    res.status(200).json(await getArticles())
})

articlesRouter.route('/article/:id').get(async (req, res) => {
    res.status(200).json(await getArticleById(req.params.id))
})

articlesRouter.route('/article').post(async (req, res) => {
    res.status(200).json(await createArticle(req.body))
})

articlesRouter.route('/article/:id').delete(async (req, res) => {
    res.status(200).json(await deleteArticle(req.params.id))
})

articlesRouter.route('/article/:id').put(async (req, res) => {
    res.status(200).json(await updateArticle(req.params.id, req.body))
})

export default articlesRouter;