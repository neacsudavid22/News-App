import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Stack from "react-bootstrap/esm/Stack";
import MainNavbar from "../Components/MainNavbar";
import SettingsModifyProperty from "../Components/SettingsModifyProperty"

const ProfilePage = () => {

    return (
        <>
        <MainNavbar/> 
        <div className="h-100 bg-light">
        <Container fluid className="d-flex justify-content-center ">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Stack gap={3} className="p-4 my-4 bg-white shadow rounded-3" >
                        <SettingsModifyProperty property={"username"}/>
                        <SettingsModifyProperty property={"name"}/>
                        <SettingsModifyProperty property={"email"}/>
                        <SettingsModifyProperty property={"phone"}/>
                        <SettingsModifyProperty property={"birthdate"}/>
                        <SettingsModifyProperty property={"gender"}/>
                    </Stack>
                </Col>
            </Row>
        </Container>
        </div>
        </>
    );
}

export default ProfilePage;