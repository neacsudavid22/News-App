
const authenticateUser = async (username , password) => {
    try {

        const response = await fetch(`http://localhost:3600/user-api/user-login/${username}/${password}`);
        if (!response.ok) {
            throw new Error("Failed to authenticate user, either the username or the password is wrong");
        }

        return await response.json()
        
    } catch (err) {
        console.error("authenticateUser error:", err);
    }
}

const signUpUser = async (email, name , username, password) => {
    try {
        const response = await fetch(`http://localhost:3600/user-api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email ,
                name: name , 
                username: username, 
                password: password,
                account: "standard"
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to sign up user");
        }

        return await response.json()

    } catch (err) {
        console.error("signUpUser error:", err);
    }
}

export {
    authenticateUser,
    signUpUser
}