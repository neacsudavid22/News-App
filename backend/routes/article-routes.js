import express from 'express';
import { 
        getArticles, getArticleById, createArticle, deleteArticle, 
        updateArticle, postComment, deleteComment, 
        deleteGarbageComments, getAllImageUrls,
        interactOnArticle, getSavedArticles, getComments,
        getUserInteractionData, getArticlesForHomepage
    } from '../controllers/article-controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';

const articlesRouter = express.Router()

articlesRouter.route('/article').get(async (req, res) => {
    try {
        const category = req.query.category; 
        const tag = req.query.tag; 
        const page = req.query.page; 
        const authorId = req.query.authorId; 

        const result = await getArticles(category, tag, page, authorId); 

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error fetching users: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/homepage').get(async (req, res) => {
    try {
        const category = req.query.category; 
        const tag = req.query.tag; 
        const page = req.query.page; 
        const authorId = req.query.authorId; 

        const result = await getArticlesForHomepage(category, tag, page, authorId); 

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
        const result = await getArticleById(req.params.id, req.query.comments || false);
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
    
        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error fetching article: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/saved-articles').get(authMiddleware, async (req, res) => {
    try{
        console.log(req.user.savedArticles)
        const result = await getSavedArticles(req.user._id, req.query.page);
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
    
        return res.status(200).json({savedArticles: result});
    } catch (err) {
        console.error(`Error fetching article: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/comments').get(authMiddleware, async (req, res) => {
    try{
        if(req.user.account !== 'admin') 
            return res.status(403).json({ message: "access forbiden for non-admins" });
        
        const result = await getComments(req.query.page || 1);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }    

        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error fetching comments: ${err.message}`);
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

articlesRouter.route('/article/:id').put(authMiddleware, async (req, res) => {
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

articlesRouter.route('/article/:articleId/interaction').put(authMiddleware, async (req, res) => {
    try{
        const result = await interactOnArticle(req.params.articleId, req.user, req.query.type)

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error(query + "Post error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:articleId/comment/post').put(authMiddleware, async (req, res) => {
    try{
        const result = await postComment(req.params.articleId, req.user._id, req.body.content, req.body.responseTo);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("postComment error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:articleId/comment/delete/:commentId/').put(authMiddleware, async (req, res) => {
    try{
        
        const result = await deleteComment(req.params.articleId, req.params.commentId, req.body.isLastNode, req.user.account);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result);

    } catch(err){
        console.error("deleteComment error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/article/:articleId/delete-garbage-comments').put(async (req, res) => {
    try {
      const result = await deleteGarbageComments(req.params.articleId, req.body.deleteIds);
      if (result.error) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error("deleteGarbageComments error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

articlesRouter.route('/get-all-cloudinary-urls').get(authMiddleware , async(req, res)=>{
    try{
        const result = await getAllImageUrls();

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({ imageUrls: result });

    } catch(err){
        console.error("getAllImageUrls error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

articlesRouter.route('/analytics-data/:interaction').get(authMiddleware, async(req, res)=>{
    try { 
        if(req.user.account !== "admin")
            return res.status(403).json({message: "Only administrators are allowed!"})
        const result = await getUserInteractionData(req.params.interaction);
        if(result.error){
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ data: result });
    } catch(err) {
        console.error("");
        return res.status(500).json({message: "Internal Server Error"});
    }
})

export default articlesRouter;