import { useState, useEffect } from "react";
import { authenticateUser, signUpUser } from "../Services/userService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthProvider";
import { useContext } from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();
    const { saveToken } = useContext(AuthContext); 

    useEffect(() => {
        // Reset input fields when toggling between Login & Sign-up
        setUsername("");
        setEmail("");
        setName("");
        setPassword("");
    }, [login]);

    const handleAuth = async () => {
        try {
            const data = login ? await authenticateUser(username, password)
                                : await signUpUser(email, name, username, password);

            if (data.token) {
                saveToken(data.token);
                navigate("/home");
            }
        } catch (err) {
            console.error("Error during authentication:", err);
        }
    };

    return (
        <div style={styles.container}>
            <h1>{login ? "Login Form" : "Sign Up Form"}</h1>
            <form style={styles.form}>
                {!login && (
                    <>
                        <label>Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </>
                )}

                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="button" onClick={handleAuth}>
                    {login ? "Log In" : "Sign Up"}
                </button>
            </form>

            <label>
                {login ? "I want to sign up" : "I want to log in"}
            </label>
            <input
                type="checkbox"
                checked={!login}
                onChange={() => setLogin((prev) => !prev)}
            />
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        width: "500px",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        width: "500px",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
    },
};

export default LoginPage;
