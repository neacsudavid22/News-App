import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername, removeFriend } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import Form from "react-bootstrap/Form";

const FriendList = ({ show, handleClose }) => {
    const { user, refresh } = useContext(AuthContext);
    const [usernames, setUsernames] = useState([]);
    const [friends, setFriends] = useState(user?.friendList || []);

    const handleRemoveFriend = async (friendId)     => {
        try {
            const fetchResult = await removeFriend(friendId);
            if(fetchResult !== null) { refresh() }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const getUsernameFetch = async (id) => {
            try {
                const username = await getUsername(id);
                return username;
            } catch (err) {
                console.error(err);
            }
        };

        const fetchUsernames = async () => {
            const tempUsernames = {};
            await Promise.all(
                (user.friendList || []).map(async (fr) => {
                    const username = await getUsernameFetch(fr);
                    tempUsernames[fr] = username;
                })
            );
            setUsernames(tempUsernames);
        };

        if (user) fetchUsernames();
    }, [user]);

    const [filterName, setFilterName] = useState("");

    useEffect(()=>{
        if(user && filterName !== ""){
            const tempFriends = user.friendList.filter(friend => usernames[friend].includes(filterName));
            setFriends(tempFriends);
        }
        else if(user){
            setFriends(user.friendList);
        }
    }, [user, filterName, usernames]);

    const {width} = useWindowSize();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" className={`h-100 w-${width < 768 ? 100 : 50}`}>
            <Offcanvas.Header closeButton 
                className=' w-100 px-3 border-bottom my-2'>
                <Form.Control type="text" className='w-50' placeholder="search user" 
                    onChange={(e)=>setFilterName(e.target.value)}
                />
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={2} className='overflow-auto'>
                {friends.length > 0 ? (
                friends.map((friendId, index) => (
                    <div key={index} className={`px-${width < 768 ? "2": "5"} d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom`}>
                        <strong className='fs-5'>{usernames[friendId] || "Loading..."}</strong>
                        <Button
                            className="rounded-4"
                            variant="outline-danger"
                            onClick={() => {
                                handleRemoveFriend(friendId);
                            }}
                        >
                           <strong>Remove</strong> <i className="ps-1 bi bi-trash-fill"></i>
                        </Button>
                    </div>
                )) ) : (
                    <p className="text-center text-muted">No friends to list.</p>
                )}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FriendList;
