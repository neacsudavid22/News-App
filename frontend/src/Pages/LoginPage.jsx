import { useState, useEffect } from "react";
import { authenticateUser, signUpUser } from "../Services/userService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthProvider";
import { useContext } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();
    const { saveToken } = useContext(AuthContext); 

    useEffect(() => {
        // Reset input fields when toggling between Login & Sign-up
        setUsername("");
        setEmail("");
        setName("");
        setPassword("");
    }, [login]);

    const handleAuth = async () => {
        try {
            const data = login ? await authenticateUser(username, password)
                                : await signUpUser(email, name, username, password);

            if (data.token) {
                saveToken(data.token);
                navigate("/");
            }
        } catch (err) {
            console.error("Error during authentication:", err);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center vh-100 pt-5 bg-light ">
            <Row className="w-100 justify-content-center">
                <Col sm={12} md={8} lg={8} xl={6}> {/* Responsive form width */}
                    <Form className="fs-6 p-2 mt-2 shadow rounded bg-white">
                        <Stack direction="vertical" gap={4} className="text-center m-4">
                            <h2>{login ? "Login Form" : "Sign Up Form"}</h2>

                            {!login && (
                                <>
                                    <Form.Group>
                                        <FloatingLabel label="Email address">
                                            <Form.Control
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="Full Name">
                                            <Form.Control
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group>
                                <FloatingLabel  label="Username">
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group>
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Container className="d-flex justify-content-center">
                                <Row>
                                    <Col>
                                        <Button variant="primary" onClick={handleAuth} className="fs-5">
                                            {login ? "Log In" : "Sign Up"}
                                        </Button>
                                    </Col>
                                </Row>  
                            </Container>

                            <div className="d-flex justify-content-center w-100">
                                <Form.Check
                                    type="switch"
                                    id="toggleAuth"
                                    label={login ? "I want to sign up" : "I want to log in"}
                                    checked={!login}
                                    onChange={() => setLogin((prev) => !prev)}
                                />
                            </div>
                        </Stack>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;