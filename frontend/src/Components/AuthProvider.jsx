import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:3600/user-api/token", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        removeToken();
      }
    };

    fetchUser();
  }, [token]); 

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Triggers fetchUser via useEffect
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveToken, removeToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
