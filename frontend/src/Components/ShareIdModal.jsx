import { Modal, Button, Form } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const ShareIdModal = ({ show, handleClose }) => {
    const { user } = useContext(AuthContext);

    const handleCopy = () => {
        navigator.clipboard.writeText(user._id);
        setTimeout(() => handleClose(), 1000);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Share your ID</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="Id couldn't be get"
                    value={user._id}
                    aria-label="Disabled input example"
                    readOnly
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleCopy}>
                    Copy Id
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShareIdModal;