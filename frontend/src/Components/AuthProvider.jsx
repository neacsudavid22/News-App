import { useRef } from "react";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const refreshInterval = useRef(null);

    const getAuthUser = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user-api/auth-user`, {
                method: "GET",
                credentials: "include"
            });
            if(response.ok){
                const result = await response.json();
                if(result.authenticated) { setUser(result.user) }
                return { authenticated: result.authenticated }
            }
        } catch(err){
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/user-api/logout`, {
                method: "POST",
                credentials: "include"
            });
            setUser(null);
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
                refreshInterval.current = null;
            }
        } 
        catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        (async () => await getAuthUser())();
        if (!refreshInterval.current) {
            refreshInterval.current = setInterval(getAuthUser,  5 * 60 * 1000); 
        }
        return () => {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
                refreshInterval.current = null;
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, getAuthUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };