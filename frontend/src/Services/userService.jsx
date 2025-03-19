const authenticateUser = async (username, password) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
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

const signUpUser = async (email, name, username, password) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                name,
                username,
                password,
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

export { authenticateUser, signUpUser, getAuthorName, getUsername };
