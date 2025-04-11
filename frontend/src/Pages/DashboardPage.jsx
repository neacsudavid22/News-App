import { useContext } from "react";
import { AuthContext } from "../Components/AuthProvider";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import MainNavbar from "../Components/MainNavbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";

const DashboardPage = () => {   

    const {user} = useContext(AuthContext);
    const navigation = useNavigate();

    const handleCreateArticle = () => {
        navigation("/author");
    }

    return(
    <div className="vh-100 bg-light">
    <MainNavbar/>
    <Container fluid className="d-flex justify-content-center">
        <Row className="w-100 justify-content-center">
            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <Stack gap={5} className="p-5 my-4 bg-white shadow rounded-3">
                <h1 className="fs-2">{user && "Welcome " + user?.name + ", you are registered as " + user?.account + "!"}</h1>
                <Stack direction="horizontal" className=" justify-content-evenly">
                <Button size="lg" variant="primary" onClick={handleCreateArticle}>
                    Create Article
                </Button>
                <Button size="lg" variant="warning">
                    Modify Article
                </Button>
                { user?.account === "admin" && 
                <Button size="lg" variant="outline-warning">
                    Create Author Account
                </Button> }
                </Stack>
            </Stack>
            </Col>
        </Row>
    </Container>
    </div>
    );
}

export default DashboardPage;