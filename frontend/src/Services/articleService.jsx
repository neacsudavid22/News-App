const getArticles = async (category, page) => {
    try {
        const query = category !== "allNews" ? `category=${category}` : '';
        const response = await fetch(`http://localhost:3600/article-api/article` + `?page=${page}` + "&" + query);

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
        const response = await fetch(`http://localhost:3600/article-api/article/${articleId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }

        return await response.json();
    } catch (err) {
        console.error("getArticleById error:", err);
        return null;
    }
}

const postArticle = async (article) => {
    try {
        const response = await fetch("http://localhost:3600/article-api/article", {
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

const interactOnPost = async (articleId, userId, interaction = "like", content = null, responseTo = null) => {
    try{
        console.log("userId:", userId, "content:", content);
        const response = await fetch(`http://localhost:3600/article-api/article/${interaction}/${articleId}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({content, responseTo}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw new Error(response?.message || "Failed to get author");
        }

        return await response.json()

    } catch(err){
        console.error("getAuthor error:", err);
        return null;
    }
}

export {
    getArticles,
    postArticle,
    getArticleById,
    interactOnPost
}