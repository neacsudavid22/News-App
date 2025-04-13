import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user-by-token`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok){
                const result = await response.json();
                setUser(result.user);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };  

    const refresh = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/refresh-token`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error(response.message || "Failed to refresh user");

            await login();

        } catch (error) {
            console.error("Error refreshing user:", error);
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/user-api/logout`, {
                method: "POST",
                credentials: "include"
            });

            setUser(null);
            
            window.location.reload(); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("cheking")
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/check-auth`, {
                    method: "GET",
                    credentials: "include"
                });
                const result = await response.json();
                if (result.authenticated === true) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user-by-token`, {
                        method: "GET",
                        credentials: "include"
                    });
        
                    if (response.ok){
                        const result = await response.json();
                        setUser(result.user);
                    }
                }
            } catch (err) {
                console.error("Auth check error:", err);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
