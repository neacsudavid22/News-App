import { Modal, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const FriendRequestsModal = ({ show, handleClose }) => {
    const { user } = useContext(AuthContext);

    const handleAccept = () => {
        //TO-DO
    }

    const handleRemove = () => {
        //TO-DO
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
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
                                        <code>{requestId}</code>
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