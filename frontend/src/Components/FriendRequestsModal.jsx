import { Modal, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { getUsername, requestService } from '../Services/userService';

const FriendRequestsModal = ({ show, setShowFriendRequests, setUncheckedRequest }) => {
    const { user, refresh } = useContext(AuthContext);
    const [friendRequests, setFriendRequests] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [handledRequests, setHandledRequests] = useState(0);

    const handleClose = () => {
        setShowFriendRequests(false);
        if(handledRequests > 0){
            window.location.reload();
        }
    }
    useEffect(() => {
        setFriendRequests(user?.friendRequests || []);
        setUncheckedRequest(user?.friendRequests.length > 0);
    }, [user, setUncheckedRequest]);

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
            const tempUsernames = {}
                
            await Promise.all(
                (friendRequests).map(async (fr) => {
                    const username = await getUsernameFetch(fr);
                    tempUsernames[fr] = username;
                })
            );
        
            setUsernames(tempUsernames);
        }

        fetchUsernames();
    }, [friendRequests]);

    const handleRequest = async (requestUserId, action) => {
        try {
            const fetchResult = await requestService(requestUserId, action);
            if (fetchResult !== null) {
                setFriendRequests(prev => prev.filter(id => id !== requestUserId));

                setUsernames(prev => {
                    const updated = { ...prev };
                    delete updated[requestUserId];
                    return updated;
                });

                setHandledRequests(prev=>prev+1);

                setUncheckedRequest(prev => prev && friendRequests.length - 1 > 0);
                await refresh();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} className='mt-4' onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Friend Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((requestUserId, index) => (
                            <ListGroup.Item key={index}>
                                <Row className="align-items-center justify-content-between">
                                    <Col xs={6} className="text-truncate">
                                        <strong>{usernames[requestUserId] || "Loading..."}</strong>
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleRequest(requestUserId, "accept")}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRequest(requestUserId, "decline")}
                                        >
                                            Decline
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-center text-muted">No friend requests.</p>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FriendRequestsModal;
