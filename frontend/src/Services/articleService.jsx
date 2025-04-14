const getArticles = async (category, page) => {
    try {
        const query = category !== "allNews" ? `category=${category}` : '';
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article` + `?page=${page}` + "&" + query);

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        return await response.json();
    } catch (err) {
        console.error("getArticles error:", err);
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
        console.error("getTitle error:", err);
        return null;
    }
}

const postArticle = async (article) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article),
        });

        if (!response.ok) throw new Error("Article creation failed");

        return await response.json();
    } catch (error) {
        console.error("Error publishing article:", error);
    }
}

const interactOnPost = async (articleId, userId, interaction = "like", content = null, responseTo) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${interaction}/${articleId}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({content, responseTo}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw new Error(response?.message || `Failed to interact on post on ${interaction} action`);
        }

        return await response.json()

    } catch(err){
        console.error(`nteractOnPost error on ${interaction} action: `, err);
        return null;
    }
}

const deleteComment = async (articleId, commentId, isLastNode) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/delete-comment/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({isLastNode}),
            headers: {
                'Content-Type': 'application/json'
            }
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

const deleteGarbageComment = async (articleId, commentList) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/article-api/article/${articleId}/delete-garbage-comments`, {
            method: 'PUT',
            body: JSON.stringify({comments: commentList}),
            headers: {
                'Content-Type': 'application/json'
            }
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

export {
    getArticles,
    postArticle,
    getArticleById,
    interactOnPost,
    deleteComment,
    deleteGarbageComment,
    getTitle
}