import { Modal, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { requestService } from '../Services/userService';

const FriendRequestsModal = ({ show, setShowFriendRequests, setUncheckedRequest }) => {
    const { user, getAuthUser } = useContext(AuthContext);
    const [friendRequests, setFriendRequests] = useState([]);

    const handleClose = async () => {
        await getAuthUser();
        setShowFriendRequests(false);
    }
    useEffect(() => {
        setFriendRequests(user?.friendRequests || []);
        setUncheckedRequest(user?.friendRequests.length > 0);
    }, [user, setUncheckedRequest]);

    const handleRequest = async (requestUserId, action) => {
        try {
            const fetchResult = await requestService(requestUserId, action);
            if (fetchResult !== null) {
                setFriendRequests(prev => {
                    const updated = prev.filter(req => req._id !== requestUserId);
                    setUncheckedRequest(updated.length > 0);
                    return updated;
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal scrollable show={show} className='mt-4 overflow-visible' onHide={handleClose} style={{height: "90vh"}}>
            <Modal.Header closeButton >
                <Modal.Title className='px-2'>Friend Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-3" >
                <ListGroup>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((friendRequest, index) => (
                            <ListGroup.Item key={index} className="mb-3 border rounded-3 shadow-sm over">
                                <div className="d-flex flex-column align-items-center py-1">
                                    <strong className="fs-5 mb-2 text-center">
                                        {friendRequest.username || "Loading..."}
                                    </strong>
                                    <div className="d-flex gap-3">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="px-4"
                                            onClick={() => handleRequest(friendRequest._id, "accept")}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="px-4"
                                            onClick={() => handleRequest(friendRequest._id, "decline")}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-center text-muted my-4">No friend requests.</p>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
};

export default FriendRequestsModal;
