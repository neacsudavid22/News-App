import Article from '../models/Article.js';
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
        
        likes.includes(userId) ? likes.remove(userId)
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
        
        saves.includes(userId) ? saves.remove(userId)
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

export {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
    likePost,
    savePost
}