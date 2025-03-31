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
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState(Date.now);
    const [login, setLogin] = useState(true);
    const navigate = useNavigate();
    const { saveToken } = useContext(AuthContext); 

    useEffect(() => {
        setUsername("");
        setEmail("");
        setPhone("");
        setName("");
        setPassword("");
        setGender(null);
        setBirthdate(Date.now);
    }, [login]);

    const handleAuth = async () => {
        try {
            const data = login ? await authenticateUser(username, password)
                                : await signUpUser(email, phone, name, gender, birthdate, username, password);

            if (data.token) {
                saveToken(data.token);
                navigate("/");
            }
        } catch (err) {
            console.error("Error during authentication:", err);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center vh-100 pt-5">
            <Row className="w-100 justify-content-center">
                <Col sm={12} md={8} lg={8} xl={6}> {/* Responsive form width */}
                    <Form className="fs-6 p-2 mt-2 mb-5 shadow rounded bg-white">
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
                                        <FloatingLabel label="Phone number">
                                            <Form.Control
                                                type="tel"
                                                placeholder="0712345678"
                                                value={phone}
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

                                    <Form.Group>
                                        <FloatingLabel label="gender">
                                            <Form.Select 
                                                aria-label="gender select"  
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <option value="male">male</option>
                                                <option value="female">female</option>
                                                <option value="other">other</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="birthdate">
                                        <Form.Control
                                                type="date"
                                                placeholder="birthdate"
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(e.target.value)}
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

                            <Stack direction="horizontal" gap={3} className="d-flex justify-content-between">
                                <Form.Check
                                    type="switch"
                                    id="toggleAuth"
                                    label={login ? "Sign up" : "Log in"}
                                    checked={!login}
                                    onChange={() => setLogin((prev) => !prev)}
                                />
                                <Button size="sm" variant="primary" onClick={handleAuth} className="fs-5">
                                    {login ? "Log In" : "Sign Up"}
                                </Button>
                            </Stack>
                            
                        </Stack>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;