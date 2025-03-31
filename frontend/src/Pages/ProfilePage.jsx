import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Stack from "react-bootstrap/esm/Stack";
import MainNavbar from "../Components/MainNavbar";
import SettingsModifyProperty from "../Components/SettingsModifyProperty"
import { useContext, useState } from "react";
import { AuthContext } from "../Components/AuthProvider";
import { updateUser } from "../Services/userService";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";

const ProfilePage = () => {
    const { user, refresh } = useContext(AuthContext);
    const [modifiedUser, setModifiedUser] = useState(user);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow((prev) => !prev);

    const handleChanges = async () => {
        try{
            const result = await updateUser(user._id, modifiedUser);
            if(result){ 
                refresh(); 
                handleShow();
            }
        }
        catch(err){
            console.error(err);
        }
    }

    return (
        <>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{color: "green"}}>Success!</Modal.Title> 
            </Modal.Header>

            <Modal.Body>
                <p>Profile info updated succesfully</p>
            </Modal.Body>
        </Modal>
        <MainNavbar/> 
        <div className="h-100 bg-light">
        <Container fluid className="d-flex justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Stack gap={3} className="p-4 my-4 bg-white shadow rounded-3">
                        <SettingsModifyProperty property="username" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <SettingsModifyProperty property="name" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <SettingsModifyProperty property="email" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <SettingsModifyProperty property="phone" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <SettingsModifyProperty property="birthdate" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <SettingsModifyProperty property="gender" modifiedUser={modifiedUser} setModifiedUser={setModifiedUser}/>
                        <div className="d-flex justify-content-between">
                        <Button size="sm" variant="success" onClick={handleChanges}>Save Changes</Button>
                        <Button size="sm" variant="danger" type="button" onClick={() => navigate("/")}>Go Back</Button>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </Container>
        </div>
        </>
    );
};


export default ProfilePage;