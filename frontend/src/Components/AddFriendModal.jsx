import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { sendFriendRequest } from "../Services/userService";

const AddFriendModal = ({ show, setShowAddFriend }) => {
    const [friendId, setFriendId] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [IS_BY_ID, SET_IS_BY_ID] = useState(false);
    const [friendRequest, setFriendRequest] = useState({});
    const [content, setContent] = useState("");
    const [ANY_SUCCESSFUL_REQUEST, SET_ANY_SUCCESSFUL_REQUEST] = useState(false);

    const handleSendFriendRequest = async () => {
        const method = IS_BY_ID ? "id" : "username";
        const response = await sendFriendRequest(IS_BY_ID ? friendId : friendUsername, method)

        if (response.message) {
            setFriendRequest({ message: response.message, error: response.error });
        }

        if(!response.error){
            SET_ANY_SUCCESSFUL_REQUEST(true);
        }
    };

    const handleClose = () => {
        setShowAddFriend(false); 
        if(ANY_SUCCESSFUL_REQUEST){
            window.location.reload();
        }
    }

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
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);  
                                IS_BY_ID ? setFriendId(e.target.value) : setFriendUsername(e.target.value);
                            }}
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
                    onChange={() => {
                        SET_IS_BY_ID((prev) => !prev);
                        setContent("");  
                    }}
                />
                <div>
                    <Button variant="secondary" onClick={handleClose} className="me-2">
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleSendFriendRequest}>
                        Send Request
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default AddFriendModal;
