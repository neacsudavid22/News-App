import { useState } from "react";
import { authenticateUser, signUpUser } from "../Services/userService";
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {

    const [currentUser, setCurrentUser] = useState()
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [login, setLogin] = useState(true); 

    const handleLogin = async () => {
        try{
            const user = login ? await authenticateUser(username, password) : signUpUser(email, name, username, password);
            setCurrentUser(user);
            console.log("current user", currentUser)
            if (user) {
                navigate("/home", { 
                    state: { user },
                    replace: true }); 
            }
        }
        catch(err){
            console.error("Error at LogIn:", err)
        }
    }

    return(
        <>  
        {
            (login) ? (
                <div
                style={{
                    display: "flex", 
                    flexDirection: "column",
                    textAlign: "center", 
                    width: "500px",  
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "auto"
                    }}>
                <h1>{`Login form ${currentUser?.username}`}</h1>
                <form style={{
                    display: "flex", 
                    flexDirection: "column",
                    textAlign: "center", 
                    width: "500px",  
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "auto"
                    }}>

                    <label>Nume de utilizator</label>
                    <input type="text"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    
                    <label>Parola</label>
                    <input type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => handleLogin()}>Log In</button>
                </form>
                
                <label>I want to sign up</label>
                <input type="checkbox" onChange={()=>{setLogin(!login); console.log(login)}} />  
                </div> 
            ) : (
                <div
                style={{
                    display: "flex", 
                    flexDirection: "column",
                    textAlign: "center", 
                    width: "500px",  
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "auto"
                    }}>
                <h1>Sign up form</h1>
                <form style={{
                    display: "flex", 
                    flexDirection: "column",
                    textAlign: "center", 
                    width: "500px",  
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "auto"
                    }}>

                    <label>Email</label>
                    <input type="text"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Nume si Prenume</label>
                    <input type="text"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Nume de utilizator</label>
                    <input type="text"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Parola</label>
                    <input type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => handleLogin()}>Sign Up</button>
                </form>
 
                <label>I want to log in</label>
                <input type="checkbox" onChange={()=>{setLogin(!login); console.log(login)}} />  
                </div> 
            )
        }
        </>
    );
}

export default LoginPage;