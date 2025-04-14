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
    <Container fluid className="py-5 d-flex justify-content-center bg-light">
        <Row className="w-100 justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
            <Stack gap={4} className="p-5 bg-white shadow rounded-4">
                <h1 className="text-center fs-2 mb-2">
                {user && `Welcome ${user.name}, you are registered as ${user.account}!`}
                </h1>

                <Row className="g-3 justify-content-center">
                <Col xs={12} sm="auto">
                    <Button size="lg" variant="primary" onClick={handleCreateArticle} className="w-100">
                    Create Article
                    </Button>
                </Col>
                <Col xs={12} sm="auto">
                    <Button size="lg" variant="warning" className="w-100">
                    Modify Article
                    </Button>
                </Col>
                {user?.account === "admin" && (
                    <Col xs={12} sm="auto">
                    <Button size="lg" variant="outline-warning" className="w-100">
                        Create Author Account
                    </Button>
                    </Col>
                )}
                </Row>
            </Stack>
            </Col>
        </Row>
        </Container>

    </div>
    );
}

export default DashboardPage;