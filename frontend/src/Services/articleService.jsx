const getArticles = async (category) => {
    try {
        const query = category !== "allNews" ? `?category=${category}` : '';
        const response = await fetch(`http://localhost:3600/article-api/article` + query);

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        return await response.json();
    } catch (err) {
        console.error("getArticles error:", err);
        return null; 
    }
}

export {
    getArticles 
}