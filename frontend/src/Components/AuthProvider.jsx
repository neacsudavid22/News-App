import { createContext, useCallback, useEffect, useRef, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const intervalRef = useRef(null); // using ref to persist interval without rerenders

    const login = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user-by-token`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                const result = await response.json();
                setUser(result.user);

                // Start interval if not already started
                if (!intervalRef.current) {
                    intervalRef.current = setInterval(refresh, 10000);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    }, [refresh]);

    const refresh = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/refresh-token`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error("Failed to refresh user");

            await login();
        } catch (error) {
            console.error("Error refreshing user:", error);
            setUser(null);
        }
    }, [login]);

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/user-api/logout`, {
                method: "POST",
                credentials: "include"
            });

            setUser(null);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            window.location.reload();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/check-auth`, {
                    method: "GET",
                    credentials: "include"
                });

                const result = await response.json();
                if (result.authenticated) {
                    await login(); // login handles interval too
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check error:", err);
            }
        };

        checkAuth();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [login]);

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };