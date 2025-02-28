import Post from '../models/Post.js';

async function getPosts(){
    try {
        const posts = await Post.find();
        if (posts.length === 0) {
            return { error: true, message: "No posts found" };
        }
        return posts;
    } catch (err) {
        console.error(`getPosts Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

async function getPostById(id){
    try{
        const post = await Post.findById(id)
        if(!post){
            return { error: true, message: "Post not found" };
        }
        return post
    }
    catch (err) {
        console.error(`getPostById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }

}

async function createPost(post){
    try{
        const newPost = await  Post.create(post)
        if(!newPost){
            return { error: true, message: "Error creating post" };
        }
        return newPost;
    }
    catch (err) {
        console.error(`createPost Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

async function deletePost(id){
    try{
        const deletedPost = await Post.deleteOne({_id: id})
        if(!deletedPost){
            return { error: true, message: "Error deleting post" };
        }
        return deletedPost;
    }
    catch (err) {
        console.error(`deletePost Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

async function updatePost(id, post){
    try{
        const postedUser = await Post.updateOne({_id: id}, post)
        if(!postedUser){
            return { error: true, message: "Error updating post" };
        }
        return postedUser;
    }
    catch (err) {
        console.error(`updatePost Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

export {
    getPosts,
    getPostById,
    createPost,
    deletePost,
    updatePost
}