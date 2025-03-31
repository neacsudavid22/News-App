import { createContext, useState } from "react";

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

            const { user } = await response.json();
            setUser(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

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
            window.location.reload(); // Ensure the state resets properly
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
