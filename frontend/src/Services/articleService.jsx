
const getArticles = async (category = '', tag = '', page = '', authorId = '') => {

    try {
        if(category === "allNews") category = "";
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article` 
            + `?page=${page}&category=${category}&tag=${tag}&authorId=${authorId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        return await response.json();
    } catch (err) {
        console.error("getArticles error:", err);
        return null; 
    }
}


const getSavedArticles = async (page = 0) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/saved-articles?page=${page}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Failed to fetch saved articles");
        }

        const { savedArticles } = await response.json();
        const data = [...savedArticles];

        return data;
    } catch (err) {
        console.error("getSavedArticles error:", err);
        return null; 
    }
}

const deleteImages = async(imageUrls = []) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/delete-images`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({imageUrls}),
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to delete images from cloudinary");
        }
        const result = await response.json();
        return result;

    } catch(err){
        console.error("deleteImages error:", err);
        return null;
    }
}

const deleteArticle = async (articleId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error("No article found!")
        }

        const result = await response.json();

        const imageUrls = result.articleContent.filter(a=>a.contentType === "Image").map(a=>a.content);
        imageUrls.push(result.background)

        const lastResponse = await deleteImages(imageUrls)

        if(!lastResponse.ok){
            throw new Error("No images to delete on cloudinary!")
        }
        const lastResult = await lastResponse.json();

        return lastResult;

    } catch (err) {
        console.error("deleteArticle error:", err);
        return null; 
    }
}

const getArticleById = async (articleId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }

        return await response.json();
    } catch (err) {
        console.error("getArticleById error:", err);
        return null;
    }
}

const getTitle = async (articleId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article-title/${articleId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }

        return await response.json();
    } catch (err) {
        console.log("getTitle error or the article might not exist anymore:", err);
        return null;
    }
}

const postArticle = async (article) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article),
        });

        if (!response.ok) throw new Error("Article creation failed");

        return await response.json();
    } catch (error) {
        console.error("Error publishing article:", error);
    }
}

const putArticle = async (article, articleId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(article),
        });

        if (!response.ok) throw new Error("Article creation failed");

        return await response.json();
    } catch (error) {
        console.error("Error publishing article:", error);
    }
}

const interactOnPost = async (articleId, interaction = "like") => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/interaction?type=${interaction}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || `Failed to interact on post on ${interaction} action`);
        }

        return await response.json()

    } catch(err){
        console.error(`InteractOnPost error on ${interaction} action: `, err);
        return null;
    }
}

const postComment = async (articleId, content = null, responseTo = null) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/comment/post`, {
            method: 'PUT',
            body: JSON.stringify({content, responseTo}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || `Failed to post comment `);
        }

        return await response.json()

    } catch(err){
        console.error(`postComment error: `, err);
        return null;
    }
}

const deleteComment = async (articleId, commentId, isLastNode) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/comment/delete/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({isLastNode}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to delete comment");
        }

        return await response.json()

    } catch(err){
        console.error("deleteComment error:", err);
        return null;
    }
}

const deleteGarbageComment = async (articleId, deleteIds) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/delete-garbage-comments`, {
            method: 'PUT',
            body: JSON.stringify({deleteIds: deleteIds}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:"include"
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to delete garbage comments");
        }

        return await response.json()

    } catch(err){
        console.error("deleteGarbageComment error:", err);
        return null;
    }
}

const getDatabaseImageUrls = async () => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/get-all-cloudinary-urls`,
           { method: "GET",
            headers: { 'Content-Type': 'application/json'},
            credentials: "include"}
        );

        if(!response.ok){
            throw new Error(response?.message || "Failed to get all image urls from database");
        }
        const result = await response.json();
        return result;

    } catch(err){
        console.error("getDatabaseImageUrls error:", err);
        return null;
    }
}

const getUnsuedImagePublicIds = async (imageUrls = []) => {
    try{
        console.log(imageUrls);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/get-unused-images-public-ids`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({imageUrls}),
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to get unsued image urls from cloudinary");
        }
        const result = await response.json();
        return result;

    } catch(err){
        console.error("getUnsuedImagePublicIds error:", err);
        return null;
    }
}

const cleanUpUnsuedImages = async (unusedPublicIds) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/cleanup-unused-images`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({unusedPublicIds}),
            credentials: "include"
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to delete unsued images from cloudinary");
        }
        const result = await response.json();
        return result;

    } catch(err){
        console.error("cleanUpUnsuedImages error:", err);
        return null;
    }
}

const generateTagsWithLangchain = async (articleText) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/langchain-api/generate-tags`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({articleText: articleText}),
        });

        if (!response.ok) throw new Error("Tags generation failed");
        const result = await response.json();
        const generatedTags = result.tags.split(",").map(tag => tag.trim()); 
        return generatedTags; 
    } catch (error) {
        console.error("Error generating tags:", error);
    }
}

const generateTitleWithLangchain = async (articleText) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/langchain-api/generate-title`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({articleText: articleText}),
        });

        if (!response.ok) throw new Error("Title generation failed");
        const { title } = await response.json(); 
        return title;
    } catch (error) {
        console.error("Error generating title:", error);
    }
}

const getAllComments = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/comments`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("comment retrieval failed");
        const { comments } = await response.json(); 
        return comments;
    } catch (error) {
        console.error("Error on getAllComments: ", error);
    }
}

export {
    getArticles,
    postArticle,
    getArticleById,
    interactOnPost,
    deleteComment,
    deleteGarbageComment,
    getTitle,
    getDatabaseImageUrls,
    getUnsuedImagePublicIds,
    cleanUpUnsuedImages,
    putArticle,
    deleteArticle,
    postComment,
    getSavedArticles,
    generateTagsWithLangchain,
    generateTitleWithLangchain
    getAllComments,
}