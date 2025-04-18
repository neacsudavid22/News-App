import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername, removeFriend } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import Form from "react-bootstrap/Form";

const FriendList = ({ show, setShowFriendList }) => {
    const { user, refresh } = useContext(AuthContext);
    const [friendList, setFriendList] = useState(user?.friendList || []); // Start with user data or empty array
    const [usernames, setUsernames] = useState({});
    const [filterName, setFilterName] = useState("");
    const { width } = useWindowSize();
    const [ANY_FRIEND_REMOVED, SET_ANY_FRIEND_REMOVED] = useState(false);

    const handleClose = () =>{ 
        setShowFriendList(false);
        if(ANY_FRIEND_REMOVED){
            window.location.reload();
        }
    }

    useEffect(() => {
        if (user?.friendList) {
            setFriendList(user.friendList);
        }
    }, [user]);

    useEffect(() => {
        const fetchUsernames = async () => {
            const tempUsernames = {};
            await Promise.all(
                friendList.map(async (id) => {
                    try {
                        const username = await getUsername(id);
                        tempUsernames[id] = username;
                    } catch (err) {
                        console.error(err);
                        tempUsernames[id] = "Unknown";
                    }
                })
            );
            setUsernames(tempUsernames);
        };

        if (friendList.length > 0) {
            fetchUsernames();
        }
    }, [friendList]);

    const handleRemoveFriend = async (friendId) => {
        try {
            const result = await removeFriend(friendId);
            if (result !== null) {
                setFriendList(prev => prev.filter(id => id !== friendId)); 
                SET_ANY_FRIEND_REMOVED(true);
                await refresh(); 
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredFriends = friendList.filter(friendId =>
        usernames[friendId]?.toLowerCase().includes(filterName.toLowerCase())
    );

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className={`h-100 w-${width < 768 ? 100 : 50}`}
        >
            <Offcanvas.Header closeButton className='w-100 px-3 border-bottom my-2'>
                <Form.Control
                    type="text"
                    className='w-50'
                    placeholder="Search user"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={2} className='overflow-auto'>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friendId, index) => (
                            <div
                                key={index}
                                className={`px-${width < 768 ? "2" : "5"} d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom`}
                            >
                                <strong className='fs-5'>{usernames[friendId] || "loading..."}</strong>
                                <Button
                                    className="rounded-4"
                                    variant="outline-danger"
                                    onClick={() => handleRemoveFriend(friendId)}
                                >
                                    <strong>Remove</strong> <i className="ps-1 bi bi-trash-fill"></i>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No friends to list.</p>
                    )}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FriendList;
