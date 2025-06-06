const authenticateUser = async (username, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to authenticate user, either the username or password is wrong");
    }

    return await response.json();
};
const removeFriend = async (friendId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/remove-friend/${friendId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Unknown error occurred");
        }
        return result; 

    }catch(err){
        console.error(err);
        return null;
    }
}

const signUpUser = async (email, phone, name, gender, birthdate, address, username, password, admin) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, phone, name, username,
                password, gender, birthdate, address,
                account: admin ? "author" : "standard",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to sign up user");
        }
        await response.json();

        return await authenticateUser(username, password);
    } catch (err) {
        console.error("signUpUser error:", err);
        return null;
    }
};

const getAuthorName = async (authorId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/author/${authorId}`);
        if(!response.ok){
            throw new Error(response?.message || "Failed to get author");
        }
        return await response.json();

    }catch(err){
        console.error("getAuthor error:", err);
        return null;
    }
}

const getUsername = async (userId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/username/${userId}`);
        if(!response.ok){
            throw new Error(response?.message || "Failed to get username");
        }
        const username = await response.json();
        return username;
    } catch(err){
        console.log("getUsername error, the user might not exist anymore:", err);
        return null;
    }
}

const requestService = async (requestUserId, action = "accept") => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/handle-request/${requestUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({action}),
            credentials: "include"
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Unknown error occurred");
        }
        return result; 

    } catch (err) {
        console.error("requestService error:", err);
        return null;
    }
}

const sendFriendRequest = async (friend, method = "id") => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/friend-request/${friend}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ method }),
            credentials: "include"
        });

        const data = await response.json();
        
        if (!response.ok && !data.show) {
            throw new Error(data.message || "Unknown error occurred");
        }

        return data; 

    } catch (err) {
        console.error("sendFriendRequestService error:", err);
        return { error: true, message: err.message };
    }
};

const updateUser = async (userId, user) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            credentials: "include"
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Unknown error occurred");
        }
        return result; 

    } catch (err) {
        console.error("updateUser error:", err);
        return { error: true, message: err.message };
    }
};

const markAsRead = async (sharedItemId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/mark-as-read/${sharedItemId}`, {method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });      
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unknown error occurred");
        }
        return result; 

    } catch (err) {
        console.error("setNotificationRead error:", err);
        return { error: true, message: err.message };
    }
}

const shareArticle = async (articleId, friendId) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/share-article-to/${friendId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({articleId: articleId}),
            credentials: "include"
        });     
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unknown error occurred");
        }
        return result; 

    } catch (err) {
        console.error("updateUser error:", err);
        return { error: true, message: err.message };
    }
}


export { 
    authenticateUser, 
    signUpUser, 
    getAuthorName, 
    getUsername, 
    sendFriendRequest,  
    updateUser, 
    requestService,
    shareArticle,
    removeFriend,
    markAsRead
};
