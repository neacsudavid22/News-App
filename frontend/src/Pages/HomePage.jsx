import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthProvider";

function HomePage() {
  const navigate = useNavigate();
  const { user, setUser, removeToken } = useContext(AuthContext); // Access context

  const handleLogout = () => {
    removeToken(); 
    setUser(null); // Clear user in context
  }

  const handleLogin = () => {
    navigate("/login"); // Redirect to login
  };

  return (
    <div>
      <h2>Home Page</h2>
      {user ? <p>Welcome, {user.username}!</p> : <p>Loading...</p>}
      <button onClick={user ? handleLogout : handleLogin}>{user ? "Logout" : "Login"}</button>
    </div>
  );
}

export default HomePage;
