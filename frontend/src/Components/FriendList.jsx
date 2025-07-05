import { useContext,  useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { removeFriend } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import Form from "react-bootstrap/Form";
import { useEffect } from 'react';

const FriendList = ({ show, setShowFriendList }) => {
    const { user, getAuthUser } = useContext(AuthContext);
    const [friendList, setFriendList] = useState(user?.friendList || []); 
    const [filterName, setFilterName] = useState("");
    const { IS_SM } = useWindowSize();

    const handleClose = async () =>{ 
        await getAuthUser();
        setShowFriendList(false);
    }

    const handleRemoveFriend = async (friendId) => {
        try {
            const result = await removeFriend(friendId);
            if (result !== null) {
                setFriendList(prev => prev.filter(friend => friend._id !== friendId)); 
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        setFriendList(user?.friendList || []);
    },[user?.friendList])

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className={`h-100 w-${IS_SM ? 100 : 50}`}
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
                    {friendList.length > 0 ? (
                        friendList
                        .filter(friend =>
                            !filterName ||
                            friend.username.toLowerCase().includes(filterName.toLowerCase())
                        )
                        .map((friend, index) => (
                            <div
                                key={index}
                                className={`px-${IS_SM ? "2" : "5"} d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom`}
                            >
                                <strong className='fs-5'>{friend.username|| "loading..."}</strong>
                                <Button
                                    className="rounded-4"
                                    variant="outline-danger"
                                    onClick={() => handleRemoveFriend(friend._id)}
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
