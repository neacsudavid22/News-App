import Post from '../models/Post.js';

async function getPosts(){
    try{
        return await Post.find()
    }
    catch (err) {
        console.error(`getPosts Error: ${err.message}`);
        process.exit(1);
    }
}

async function getPostById(id){
    try{
        return await Post.findById(id)
    }
    catch (err) {
        console.error(`getPostsById Error: ${err.message}`);
        process.exit(1);
    }
}

async function createPost(post){
    try{
        return await Post.create(post)
    }
    catch (err) {
        console.error(`createPost Error: ${err.message}`);
        process.exit(1);
    }
}

async function deletePost(id){
    try{
        return await Post.deleteOne({_id: id})
    }
    catch (err) {
        console.error(`deletePost Error: ${err.message}`);
        process.exit(1);
    }
}

async function updatePost(id, post){
    try{
        return await Post.updateOne({_id: id}, post)
    }
    catch (err) {
        console.error(`updatePost Error: ${err.message}`);
        process.exit(1);
    }
}

export {
    getPosts,
    getPostById,
    createPost,
    deletePost,
    updatePost
}