import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
const MainNavbar = () => {
    const { user, setUser, removeToken } = useContext(AuthContext); 

    const handleLogout = () => {
        removeToken(); 
        setUser(null); 
    }

    return(
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="w-100 p-2 px-3">
            <Stack direction="horizontal" className="d-flex justify-content-between w-100">

                <Navbar.Brand as={Link} to="/"> NewsWebApp </Navbar.Brand>
            
                {user ? (
                    <Stack direction="horizontal">
                        <Navbar.Text className="text-light px-3">@{user?.username}</Navbar.Text>
                        <Nav.Link className="text-light" as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
                    </Stack>
                ) : (
                    <Nav.Link className="text-light" as={NavLink} to="/login">Login</Nav.Link>
                )}
            </Stack>
        </Navbar>
    );
}

export default MainNavbar;