import express from 'express';
import { getArticles, getArticleById, createArticle, deleteArticle, updateArticle } from '../controllers/article-controller.js'

const articlesRouter = express.Router()

articlesRouter.route('/article').get(async (req, res) => {
    try {
        const category = req.query.category; 
        const result = await getArticles(category); 

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error fetching users: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:id').get(async (req, res) => {
    const result = await getArticleById(req.params.id);
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

articlesRouter.route('/article/:id').delete(async (req, res) => {
    const result = await deleteArticle(req.params.id)
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

articlesRouter.route('/article').post(async (req, res) => {
    const result = await createArticle(req.body);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

articlesRouter.route('/article/:id').put(async (req, res) => {
    const result = await updateArticle(req.params.id, req.body);
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

export default articlesRouter;