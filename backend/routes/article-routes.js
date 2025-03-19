import express from 'express';
import { getArticles, getArticleById, createArticle, deleteArticle, updateArticle, savePost, likePost, postComment, deleteComment, deleteGarbageComments } from '../controllers/article-controller.js'

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
    try{
        const result = await getArticleById(req.params.id);
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
    
        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error fetching article: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:id').delete(async (req, res) => {
    try{
        const result = await deleteArticle(req.params.id)
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
    
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(`deleteArticle Error: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article').post(async (req, res) => {
 
    try {
        const result = await createArticle(req.body);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(`createArticle Error: ${err.message}`);   
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:id').put(async (req, res) => {
    try
    {
        const result = await updateArticle(req.params.id, req.body);
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(`updateArticle Error: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/like/:articleId/:userId').put(async (req, res) => {
    try{
        const result = await likePost(req.params.articleId, req.params.userId);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("likePost error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/comment/:articleId/:userId').put(async (req, res) => {
    try{
        const result = await postComment(req.params.articleId, req.params.userId, req.body.content, req.body.responseTo);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("postComment error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:articleId/delete-comment/:commentId').put(async (req, res) => {
    try{
        const result = await deleteComment(req.params.articleId, req.params.commentId, req.body.isLastNode);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("deleteComment error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/save/:articleId/:userId').put(async (req, res) => {
    try{
        const result = await savePost(req.params.articleId, req.params.userId, req.body.responseTo);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("savePost error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:articleId/delete-garbage-comments').put(async (req, res) => {
    try{
        const result = await deleteGarbageComments(req.params.articleId, req.body.comments);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("deleteGarbageComments error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export default articlesRouter;