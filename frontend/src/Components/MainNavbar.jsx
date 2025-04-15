import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';
import Badge from "react-bootstrap/Badge";
import AddFriendModal from './AddFriendModal';
import ShareIdModal from './ShareIdModal';
import FriendRequestsModal from './FriendRequestsModal';
import Collapse  from 'react-bootstrap/Collapse';
import FriendList from "./FriendList";
import SharedList from "./SharedList";

const MainNavbar = () => {
    const { user, logout } = useContext(AuthContext); 

    const handleLogout = () => {
        if(user){ logout() }
    }

    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showShareId, setShowShareId] = useState(false);
    const [showFriendRequests, setShowFriendRequests] = useState(false);
    const [showFriendList, setShowFriendList] = useState(false);
    const [showShareNotifications, setShowShareNotifications] = useState(false);

    const navigate = useNavigate();

    const handleProfile = () => {
        if(user._id)
            navigate('/profile/' + user._id);
        return;
    }

    const [unchekedRequest, setUnchekedRequest] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        if (unchekedRequest) {
            const timeout = setTimeout(() => {
                setFadeIn(true);
            }, 1000);
            return () => clearTimeout(timeout); 
        } else {
            setFadeIn(false); 
        }
    }, [unchekedRequest]);

    return(
        <>
        <Navbar fixed="top" bg="dark" variant="dark" expand="lg" className="w-100 p-2 px-3">
            <Stack direction="horizontal" className="d-flex justify-content-between w-100">

                <Navbar.Brand as={Link} to="/"> NewsWebApp </Navbar.Brand>
            
                {user ? (
                    <Stack direction="horizontal">
                    {unchekedRequest && (
                       <Collapse  in={fadeIn}>
                        <Badge pill bg="danger" className="mx-2">
                            <i className="bi bi-bell small"/>
                        </Badge> 
                        </Collapse>
                    )}
                        <SplitButton
                        variant="danger"
                        align="end"
                        title={('@' + user?.username) || "loading.." }
                        id="dropdown-menu-align-end"
                        >
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowAddFriend(true)}>Add a friend</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowShareId(true)}>Share your id</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowFriendRequests(true)}>
                                View friend requests
                                {unchekedRequest && (
                                    <Badge pill bg="danger" className="ms-2"><i className="bi bi-bell small"></i></Badge> 
                                )}
                            </Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowFriendList(true)}>Show friend list</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowShareNotifications(true)}>Articles from friends</Dropdown.Item>

                            { (user?.account === "author" || user?.account === "admin") &&
                            <>
                            <Dropdown.Divider />
                            <Dropdown.Item type="button" variant="danger" onClick={handleProfile}>Go to profile</Dropdown.Item>
                            <Dropdown.Divider />

                            <Dropdown.Item type="button" variant="danger" onClick={() => navigate("/dashboard")}>Go to Dashboard</Dropdown.Item>
                            </>
                            }
                            <Dropdown.Divider />
                            <Dropdown.Item type="button" as={Link} to="/" onClick={handleLogout}>Logout</Dropdown.Item>
                        </SplitButton>

                        <AddFriendModal show={showAddFriend} handleClose={() => setShowAddFriend(false)} />
                        <ShareIdModal show={showShareId} handleClose={() => setShowShareId(false)} userId={user._id} />
                        <FriendRequestsModal 
                            show={showFriendRequests} 
                            setUnchekedRequest={setUnchekedRequest}
                            handleClose={() => setShowFriendRequests(false)} 
                        />
                        <FriendList show={showFriendList} handleClose={() => setShowFriendList(false)}/>
                        <SharedList show={showShareNotifications} handleClose={() => setShowShareNotifications(false)}/>
                    </Stack>
                ) : (
                    <Button className="text-light" variant="danger" as={NavLink} to="/login">Login</Button>
                )}
            </Stack>
        </Navbar>
        <div className="mb-5" style={{height:"0.5rem"}}></div>
        </>

    );
}

export default MainNavbar;
