import Article from '../models/Article.js';

async function getArticles(){
    try{
        const data = await Article.find()
        return data
    }
    catch (err) {
        console.error(`getArticles Error: ${err.message}`);
        process.exit(1);
    }
}

async function getArticleById(id){
    try{
        return await Article.findById(id)
    }
    catch (err) {
        console.error(`getArticlesById Error: ${err.message}`);
        process.exit(1);
    }
}

async function createArticle(article){
    try{
        return data = await Article.create(article)
    }
    catch (err) {
        console.error(`createArticle Error: ${err.message}`);
        process.exit(1);
    }
}

async function deleteArticle(id){
    try{
        return await Article.deleteOne({_id: id})
    }
    catch (err) {
        console.error(`deleteArticle Error: ${err.message}`);
        process.exit(1);
    }
}

async function updateArticle(id, article){
    try{
        return await Article.updateOne({_id: id}, article)
    }
    catch (err) {
        console.error(`updateArticle Error: ${err.message}`);
        process.exit(1);
    }
}

export {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle
}