const authenticateUser = async (username, password) => {
    try {
        const response = await fetch("http://localhost:3600/user-api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to authenticate user, either the username or password is wrong");
        }

        return await response.json();
    } catch (err) {
        console.error("authenticateUser error:", err);
        return null;
    }
};

const signUpUser = async (email, phone, name, gender, birthdate, username, password) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                phone,
                name,
                username,
                password,
                gender,
                birthdate,
                account: "standard",
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
        const response = await fetch(`http://localhost:3600/user-api/author/${authorId}`);
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
        const response = await fetch(`http://localhost:3600/user-api/username/${userId}`);
        if(!response.ok){
            throw new Error(response?.message || "Failed to get username");
        }
        
        return await response.json();

    }catch(err){
        console.error("getUsername error:", err);
        return null;
    }
}

const sendFriendRequestById = async (userId, friendId) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/user/${userId}/friend-request-by-id`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ friendId })
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

const sendFriendRequestByUsername = async (userId, friendUsername) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/user/${userId}/friend-request-by-username`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ friendUsername })
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
        const response = await fetch(`http://localhost:3600/user-api/user/${userId}`, {
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


export { authenticateUser, signUpUser, getAuthorName, getUsername, sendFriendRequestById, sendFriendRequestByUsername, updateUser };
