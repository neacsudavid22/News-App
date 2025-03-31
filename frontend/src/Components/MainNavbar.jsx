import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Stack from "react-bootstrap/Stack";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';
import { sendFriendRequestById, sendFriendRequestByUsername } from "../Services/userService";

const MainNavbar = () => {
    const { user, logout } = useContext(AuthContext); 
    const [friendRequest, setFriendRequest] = useState({});
    const [friendId, setFriendId] = useState(null);
    const [friendUsername, setFriendUsername] = useState(null);

    const [IS_BY_ID, SET_IS_BY_ID] = useState(true);

    const handleLogout = () => {
        if(user){ logout() }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setFriendRequest({});
    }

    const navigate = useNavigate();

    const handleProfile = () => {
        if(user._id)
            navigate('/profile/' + user._id);
        return;
    }

    const sendFriendRequest = async () => {
        const response = IS_BY_ID ? await sendFriendRequestById(user._id, friendId)
                                : await sendFriendRequestByUsername(user._id, friendUsername);
        console.log(IS_BY_ID ? "sendFriendRequestById" : "sendFriendRequestByUsername");
        if(response.message){
            setFriendRequest({ message: response.message, error: response.error });
        }
    }

    return(
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="w-100 m-0 p-2 px-3">
            <Stack direction="horizontal" className="d-flex justify-content-between w-100">

                <Navbar.Brand as={Link} to="/"> NewsWebApp </Navbar.Brand>
            
                {user ? (
                    <Stack direction="horizontal">

                        <SplitButton
                        variant="danger"
                        align="end"
                        title={('@' + user?.username) || "loading.." }
                        id="dropdown-menu-align-end"
                        
                        >
                            <Dropdown.Item type="button" variant="danger" onClick={handleShow}>Add a friend</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={handleProfile}>Go to profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item type="button" as={Link} to="/" onClick={handleLogout}>Logout</Dropdown.Item>
                        </SplitButton>

                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Add a friend!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control type="text" className=" mb-3" 
                                                      placeholder={`Insert friend's unique ${IS_BY_ID ? "id" : "username"}`}
                                                      onChange={
                                                        (e) => {
                                                            IS_BY_ID ? setFriendId(e.target.value)
                                                                     : setFriendUsername(e.target.value)
                                                        }
                                                    } />
                                        <Form.Text className="text-muted" >
                                        { IS_BY_ID ? "The id can be found in the profile page and must be shared before" 
                                                  : "Introduce the username of the user you want to befriend" }
                                        </Form.Text>
                                        <br/><br/>
                                        {   
                                        friendRequest.message && 
                                        <Form.Text style={{color: friendRequest.error ? "red" : "green"}}>
                                        {friendRequest.message}
                                        </Form.Text>
                                        }
                                       
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer className="d-flex justify-content-between">
                            <Form.Check
                                    type="switch"
                                    id="toggleAuth"
                                    label={IS_BY_ID ? "id on" : "username on"}
                                    checked={IS_BY_ID}
                                    onChange={() => SET_IS_BY_ID((prev) => !prev)}
                                />
                                <div>
                                <Button variant="secondary" onClick={handleClose} className="me-2">
                                    Close
                                </Button>
                                <Button variant="danger" onClick={sendFriendRequest}>
                                    Send Request
                                </Button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    </Stack>
                ) : (
                    <Button className="text-light" variant="danger" as={NavLink} to="/login">Login</Button>
                )}
            </Stack>
        </Navbar>
    );
}

export default MainNavbar;