import { useState, useEffect, useContext } from "react";
import { authenticateUser, signUpUser } from "../Services/userService";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AuthContext } from "../Components/AuthProvider";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [TRY_TO_LOGIN, SET_TRY_TO_LOGIN] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);

    // Validation helpers
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = /^[0-9]{10}$/.test(phone);
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);

    useEffect(() => {
        setUsername("");
        setEmail("");
        setPhone("");
        setName("");
        setPassword("");
        setGender("");
        setBirthdate("");
        setErrorMsg("");
        setValidated(false);
    }, [TRY_TO_LOGIN]);

    const handleAuth = async () => {
        setValidated(true);
        setErrorMsg("");
    
        if (TRY_TO_LOGIN) {
            if (!username || !password) {
                setErrorMsg("Please fill in all fields correctly.");
                return;
            }
    
            try {
                const response = await authenticateUser(username, password);

                if (!response || !response.token) {
                    throw new Error("No token received");
                }

                if (response.token) {
                    await login();
                    if(user.account === "author")
                        navigate("/dashboard");
                    else navigate(-1);
                }
            } catch (err) {
                console.error("Login error:", err);
                setErrorMsg("Incorrect username or password.");
            }
        } else {
            const allValid =
                email && isEmailValid &&
                phone && isPhoneValid &&
                name && gender && birthdate &&
                username &&
                password && isPasswordValid;
    
            if (!allValid) {
                setErrorMsg("Please fill in all fields correctly.");
                return;
            }
    
            try {
                const { token } = await signUpUser(email, phone, name, gender, birthdate, username, password);
                if (token) {
                    login();
                    navigate("/");
                }
            } catch (err) {
                console.error("Signup error:", err);
                setErrorMsg("Failed to create account. Please try again.");
            }
        }
    };
    

    return (
        <Container fluid className="d-flex justify-content-center vh-100 pt-5">
            <Row className="w-100 justify-content-center">
                <Col sm={12} md={8} lg={8} xl={6}>
                    <Form className="fs-6 p-2 mt-2 mb-5 shadow rounded bg-white">
                        <Stack direction="vertical" gap={4} className="text-center m-4">
                            <h2>{TRY_TO_LOGIN ? "Login Form" : "Sign Up Form"}</h2>

                            {errorMsg && (
                                <Form.Text className="text-danger fs-6">
                                    {errorMsg}
                                </Form.Text>
                            )}

                            {!TRY_TO_LOGIN && (
                                <>
                                    <Form.Group>
                                        <FloatingLabel label="Email address">
                                            <Form.Control
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                isInvalid={validated && (!email || !isEmailValid)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid email address.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="Phone number">
                                            <Form.Control
                                                type="tel"
                                                placeholder="0712345678"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onKeyDown={(e) => {
                                                    const allowedKeys = [ "Backspace", "Delete", "ArrowLeft", "ArrowRight" ];
                                                    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                isInvalid={validated && (!phone || !isPhoneValid)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid 10-digit phone number.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="Full Name">
                                            <Form.Control
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
                                                    if (!/^[a-zA-Z]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                isInvalid={validated && !name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Name is required.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="Gender">
                                            <Form.Select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                isInvalid={validated && !gender}
                                            >
                                                <option value="">Select...</option>
                                                <option value="male">male</option>
                                                <option value="female">female</option>
                                                <option value="other">other</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Gender is required.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    <Form.Group>
                                        <FloatingLabel label="Birthdate">
                                            <Form.Control
                                                type="date"
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(e.target.value)}
                                                isInvalid={validated && !birthdate}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Birthdate is required.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group>
                                <FloatingLabel label="Username">
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={(e) => {
                                            const allowedKeys = [ "Backspace", "Delete", "ArrowLeft", "ArrowRight"];
                                            if (!/^[a-zA-Z0-9._]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        isInvalid={!TRY_TO_LOGIN && (validated && !username)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Username is required.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group>
                                <FloatingLabel label="Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        isInvalid={!TRY_TO_LOGIN && (validated && (!password || !isPasswordValid))}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    <ul className="text-start mb-0">
                                        <li>At least 8 characters</li>
                                        <li>At least one lowercase letter</li>
                                        <li>At least one uppercase letter</li>
                                        <li>At least one number</li>
                                        <li>At least one special character</li>
                                    </ul>
                                    </Form.Control.Feedback>

                                </FloatingLabel>
                            </Form.Group>

                            <Stack direction="horizontal" gap={3} className="d-flex justify-content-between">
                                <Form.Check
                                    type="switch"
                                    id="toggleAuth"
                                    label={TRY_TO_LOGIN ? "Sign up" : "Log in"}
                                    checked={!TRY_TO_LOGIN}
                                    onChange={() => SET_TRY_TO_LOGIN((prev) => !prev)}
                                />
                                <Button size="sm" variant="primary" onClick={handleAuth} className="fs-5">
                                    {TRY_TO_LOGIN ? "Log In" : "Sign Up"}
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
