import { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { sendFriendRequestById, sendFriendRequestByUsername } from "../Services/userService";
import { AuthContext } from './AuthProvider';

const AddFriendModal = ({ show, handleClose }) => {
    const { user } = useContext(AuthContext);
    const [friendId, setFriendId] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [IS_BY_ID, SET_IS_BY_ID] = useState(true);
    const [friendRequest, setFriendRequest] = useState({});

    const sendFriendRequest = async () => {
        const response = IS_BY_ID
            ? await sendFriendRequestById(user._id, friendId)
            : await sendFriendRequestByUsername(user._id, friendUsername);

        if (response.message) {
            setFriendRequest({ message: response.message, error: response.error });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add a friend!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            className="mb-3"
                            placeholder={`Insert friend's unique ${IS_BY_ID ? "id" : "username"}`}
                            onChange={(e) =>
                                IS_BY_ID
                                    ? setFriendId(e.target.value)
                                    : setFriendUsername(e.target.value)
                            }
                        />
                        <Form.Text className="text-muted">
                            {IS_BY_ID
                                ? "The id can be found in the profile page and must be shared before"
                                : "Introduce the username of the user you want to befriend"}
                        </Form.Text>
                        <br />
                        {friendRequest.message && (
                            <Form.Text style={{ color: friendRequest.error ? "red" : "green" }}>
                                {friendRequest.message}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Form.Check
                    type="switch"
                    id="toggleAuth"
                    label={IS_BY_ID ? "id" : "username"}
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
    );
};

export default AddFriendModal;
