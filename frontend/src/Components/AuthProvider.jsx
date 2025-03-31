import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async () => {
        try {
            const response = await fetch("http://localhost:3600/user-api/user-by-token", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error("Failed to fetch user");

            const result = await response.json();
            setUser(result.user);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };  

    useEffect(()=>{
        const verifyAuthentificationStatus = async () => {
            const response = await fetch("http://localhost:3600/user-api/check-auth", { 
                method: "GET",
                credentials: "include"
            })
            const { authenticated } = await response.json();
            return authenticated;
        }
        if(verifyAuthentificationStatus() === true) { login(); }
    }, []);

    const refresh = async () => {
        try {
            const response = await fetch(`http://localhost:3600/user-api/refresh-token`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error(response.message || "Failed to refresh user");

            login();

        } catch (error) {
            console.error("Error refreshing user:", error);
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:3600/user-api/logout", {
                method: "POST",
                credentials: "include"
            });

            setUser(null);
            window.location.reload(); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
