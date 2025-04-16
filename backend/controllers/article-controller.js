import Article from "../models/Article.js";

const getArticles = async (filterCategory, page = 1) => {
    try {
        const articles = await Article.find(filterCategory ? { category: filterCategory } : {})
                                      .skip((page - 1) * 20)  // Skip previous pages
                                      .limit(20)  // Limit results per page
                                      .exec();

        return articles;
    } catch (err) {
        console.error(`getArticles Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};

const getArticleById = async (id) => {
    try{
        const article = await Article.findById(id)
        if(!article){
            return { error: true, message: "Article not found" };
        }
        return article
    }
    catch (err) {
        console.error(`getArticleById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const createArticle = async (article) => {
    try{
        const newArticle = await Article.create(article)
        if(!newArticle){
            return { error: true, message: "Error creating article" };
        }
        return newArticle;
    }
    catch (err) {
        console.error(`createArticle Error: ${err.message}`);
        return { error: true, message: err.message };
    }
}

const deleteArticle = async (id) => {
    try{
        const deletedArticle = await Article.deleteOne({_id: id})
        if(!deletedArticle){
            return { error: true, message: "Error deleting article" };
        }
        return deletedArticle;
    }
    catch (err) {
        console.error(`deleteArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const updateArticle = async (id, article) => {
    try{
        const updatedArticle = await  Article.updateOne({_id: id}, article)
        if(!updatedArticle){
            return { error: true, message: "Error updating article" };
        }
        return updatedArticle;
    }
    catch (err) {
        console.error(`updateArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const likePost = async (articleId, userId) => {
    try{
        const { likes } = await Article.findById(articleId).select('likes');
        
        const likesSet = new Set(likes);
        likesSet.has(userId) ? likes.remove(userId)
                                    : likes.push(userId)

        const updatedArticlePost = await Article.updateOne({_id: articleId}, { $set: { likes: likes } })
        if(!updatedArticlePost){
            return { error: true, message: "Error updating likes on article post" };
        }
        return updatedArticlePost;
    }
    catch (err) {
        console.error(`likePost Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const savePost = async (articleId, userId) => {
    try{
        const { saves } = await Article.findById(articleId).select('saves');
        
        const savesSet = new Set(likes);
        savesSet.has(userId) ? saves.remove(userId)
                                    : saves.push(userId)

        const updatedArticlePost = await Article.updateOne({_id: articleId}, { $set: { saves: saves } }
        )
        if(!updatedArticlePost){
            return { error: true, message: "Error updating saves on article post" };
        }
        return updatedArticlePost;
    }
    catch (err) {
        console.error(`savePost Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const postComment = async (articleId, userId, content, responseTo) => {
    try{
        const { comments } = await Article.findById(articleId).select('comments');
        
        comments.push({ userId, content, responseTo });

        const updatedArticlePost = await Article.findByIdAndUpdate({_id: articleId}, { $set: { comments: comments } }, { new: true })
        if(!updatedArticlePost){
            return { error: true, message: "Error updating comments on article post" };
        }

        const newComment = updatedArticlePost.comments[updatedArticlePost.comments.length - 1];

        return newComment;
    }
    catch (err) {
        console.error(`postComment Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const deleteComment = async (articleId, commentId, isLastNode) => {
    try {
        let updatedArticlePost;

        if (isLastNode === true) {
            // Remove the entire comment from the comments array
            updatedArticlePost = await Article.findByIdAndUpdate(
                { _id: articleId},
                { $pull: { comments: { _id: commentId } } },
                { new: true }
            );
        } else {
            // If it got replies, mark it as deleted instead of removing
            updatedArticlePost = await Article.findOneAndUpdate(
                { _id: articleId, "comments._id": commentId },
                { 
                    $set: { 
                        "comments.$.content": "deleted", 
                        "comments.$.removed": true 
                    }
                },
                { new: true }
            );
        }

        if (!updatedArticlePost) {
            return { error: true, message: "Error deleting comment on article post" };
        }

        return updatedArticlePost.comments; 
    } 
    catch (err) {
        console.error(`deleteComment Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};
const deleteGarbageComments = async (articleId, deleteIds) => {
    try {
      const result = await Article.updateOne(
        { _id: articleId },
        {
          $pull: {
            comments: {
              _id: { $in: deleteIds },
            },
          },
        }
      );
  
      return {result};
    } catch (err) {
      console.error(`deleteGarbageComments Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
  };
  

const getAllImageUrls = async () => {
    try {
      const allArticles = await Article.find({}).select("_id articleContent background");
  
      const contentImageUrls = allArticles.flatMap((article) =>
        article.articleContent
          .filter((contentBlock) => contentBlock.contentType === "Image")
          .map((contentBlock) => contentBlock.content)
      );

      const backgroundUrls = allArticles.flatMap((article) => article.background);

      const imageUrls = [...contentImageUrls, ...backgroundUrls];
      
      return imageUrls
    } catch (err) {
      console.error(`getAllImageUrls Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
};

export {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
    likePost,
    savePost,
    postComment,
    deleteComment,
    deleteGarbageComments,
    getAllImageUrls
}