import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import useWindowSize from "../hooks/useWindowSize";

const SettingsModifyProperty = ({ property, modifiedUser, setModifiedUser }) => {
    const [userProperty, setUserProperty] = useState(modifiedUser[property] || "");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleModify = () => {
        setModifiedUser((prevUser) => ({
            ...prevUser,
            [property]: userProperty,
        }));
        handleClose();
    };

    const handleMessage = () => {
        const size = property === "username" ? 3 : 5;
        switch (property) {
            case "birthdate":
                return (
                    <Col>
                        <strong className="fs-5 me-1">
                            {`${property.charAt(0).toUpperCase() + property.slice(1)}: `}
                        </strong>
                        <strong className="fs-5">
                            {(new Date(modifiedUser[property]).toLocaleDateString() || "loading..")}
                        </strong>
                    </Col>
                );
            default:
                return (
                    <Col>
                        <strong className={`fs-${size} me-1`}>
                            {`${property.charAt(0).toUpperCase() + property.slice(1)}: `}
                        </strong>
                        <strong className={`fs-${size}`}>{modifiedUser[property] || "loading.."}</strong>
                    </Col>
                );
        }
    };

    const dict = { email: "email", name: "text", username: "text", phone: "tel", birthdate: "date" };

    const { width } = useWindowSize();

    return (
        <>
        <Container fluid className="my-2">
            <Row className="border-bottom p-2 pt-0 align-items-center">
                <Col xs={12} sm={8} className="mb-3">
                    <div>{handleMessage()}</div>
                </Col>
                <Col xs={12} sm={4} className={`mb-2 d-flex justify-content-${width < 768 ? "start" : "end"}`}>
                    <Button variant="outline-warning" size="sm" className="w-100" onClick={handleShow}>
                        {`Modify ${property}`}
                    </Button>
                </Col>
            </Row>
        </Container>
            
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{`Modify ${property}!`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="w-100">
                    <Form.Group>
                        <FloatingLabel label={`new ${property}`}>
                            {property === "gender" ? (
                                <Form.Select 
                                    aria-label={`${property} select`}  
                                    value={userProperty}
                                    onChange={(e) => setUserProperty(e.target.value)}
                                >
                                    <option value="male">male</option>
                                    <option value="female">female</option>
                                    <option value="other">other</option>
                                </Form.Select>  
                            ) : (
                                <Form.Control 
                                    type={dict[property]} 
                                    value={userProperty}
                                    onChange={(e) => setUserProperty(e.target.value)}
                                />
                            )}
                        </FloatingLabel>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer >
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleModify}>
                    Modify
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};


export default SettingsModifyProperty;