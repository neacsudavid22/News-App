import { Modal, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { getUsername } from '../Services/userService';

const FriendRequestsModal = ({ show, handleClose }) => {
    const { user } = useContext(AuthContext);
    const friendRequests = user?.friendRequests;
    const [usernames, setUsernames] = useState([]);

    const handleAccept = () => {
        //TO-DO
    }

    const handleRemove = () => {
        //TO-DO
    }

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

    return (
        <Modal show={show} className='mt-4' onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Friend Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {user?.friendRequests?.length > 0 ? (
                        user.friendRequests.map((requestId, index) => (
                            <ListGroup.Item key={index}>
                                <Row className="align-items-center">
                                    <Col xs={6} className="text-truncate">
                                        <strong>{usernames[requestId] || "Loading.."}</strong>
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleAccept(requestId)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemove(requestId)}
                                        >
                                            Remove
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