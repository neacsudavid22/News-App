import { createContext, useCallback, useEffect, useRef, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const refreshInterval = useRef(null);

    const login = useCallback(async () => {
        const settingUser = async (value) => setUser(value);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/user-by-token`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                const result = await response.json();
                await settingUser(result.user);
                return true;
            }
            setUser(null);
            return false;
        } catch (error) {
            console.error("Login error:", error);
            setUser(null);
            return false;
        }
    }, []);

    const refresh = useCallback(async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/user-api/refresh-token`, {
                method: "GET",
                credentials: "include"
            });

        } catch (error) {
            console.error("Refresh failed:", error);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/user-api/logout`, {
                method: "POST",
                credentials: "include"
            });
        } finally {
            setUser(null);
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
                refreshInterval.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/check-auth`, {
                    method: "GET",
                    credentials: "include"
                });

                const result = await response.json();
                if (result.authenticated === true) {
                    await login();

                    if (!refreshInterval.current) {
                        refreshInterval.current = setInterval(refresh, 20000); 
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check error:", err);
                setUser(null);
            }
        };

        checkAuth();

        return () => {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
            }
        };
    }, [login, refresh]);

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };