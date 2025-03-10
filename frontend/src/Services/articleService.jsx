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

export {
    getArticles,
    postArticle
}