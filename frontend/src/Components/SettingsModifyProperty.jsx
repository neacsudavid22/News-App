import { useContext, useState } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { AuthContext } from "./AuthProvider";

const SettingsModifyProperty = ({property}) => {
    const { user } = useContext(AuthContext);
    const [userProperty, setUserProperty] = useState(user[property]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMessage = () => {
        const size = property === "username" ? 3 : 5;
        switch(property){
            case "birthdate":
                return (<div>
                    <strong className="m-0 fs-5">
                        {`${property.charAt(0).toUpperCase() + property.slice(1)}: `}
                    </strong>
                     <h2 className="mt-1 fs-5">
                        {(new Date(user[property]).toDateString() || "loading..")}
                    </h2>
                </div>
                );
            default:
                return (<div>
                    <strong  className={`m-0 fs-${size}`}>
                        {`${property.charAt(0).toUpperCase() + property.slice(1)}: `}
                    </strong>
                    <h2 className="mt-1 fs-5">
                        {(user[property] || "loading..")}
                    </h2>
                </div>);
        }
    }

    const dict = {email: "email", name: "text", username: "text", phone:"tel", birthdate: "date"};

    return(
        <>
        <div>{handleMessage()}</div>
        <div className="border-bottom pb-3">                            
            <Button variant="outline-warning" size="sm" onClick={handleShow}>{`Modify ${property}`}</Button>
        </div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{`Modify ${property}!`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form className="w-100">
                <Form.Group>
                <FloatingLabel label={`new ${property}`}>
                {   property === "gender" &&
                    <Form.Select 
                    aria-label={`${property} select`}  
                    value={userProperty}
                    onChange={(e) => setUserProperty(e.target.value)}
                    >
                        <option value="male">male</option>
                        <option value="female">female</option>
                        <option value="other">other</option>
                    </Form.Select>  
                }
                {   property !== "gender" &&
                    <Form.Control type={dict[property]}/>
                }
                </FloatingLabel>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleClose}>
                    Modify
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default SettingsModifyProperty;