import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Components/AuthProvider";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import MainNavbar from "../Components/MainNavbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { cleanUpUnsuedImages, getDatabaseImageUrls, getUnsuedImagePublicIds } from "../Services/articleService";

const DashboardPage = () => {   

    const {user} = useContext(AuthContext);
    const [LOADING_ALL_URLS, SET_LOADING_ALL_URLS] = useState(false);
    const [LOADING_UNUSED_URLS, SET_LOADING_UNUSED_URLS] = useState(false);

    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState([]);
    const [unusedPublicIds, setUnusedPublicIds] = useState([]);

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                SET_LOADING_ALL_URLS(true);
                const data = await getDatabaseImageUrls();
                setImageUrls(data.imageUrls);
            } catch (err) {
                console.error(err);
            }
        };

        if (user?.account === "admin" && !LOADING_ALL_URLS) {
            fetchImageUrls();
        }
    }, [user?.account, LOADING_ALL_URLS]);

    useEffect(() => {
        const fetchUnusedImageUrls = async () => {
            try {
                SET_LOADING_UNUSED_URLS(true);
                const data = await getUnsuedImagePublicIds(imageUrls);
                setUnusedPublicIds(data.unusedPublicIds);
            } catch (err) {
                console.error(err);
            }
        };

        if (!LOADING_UNUSED_URLS) {
            fetchUnusedImageUrls();
        }
    }, [imageUrls, LOADING_UNUSED_URLS]);


    const handleCleanUp = async () => {
        try{
            const result = await cleanUpUnsuedImages(unusedPublicIds);
            if(result !== null){
                const data = await getUnsuedImagePublicIds(imageUrls);
                if (data !== null) {
                    setUnusedPublicIds(data.unusedPublicIds);
                }
            }
        }catch(err){
            console.error(err);
        }
    } 

    const handleCreateArticle = () => {
        navigate("/author");
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
                    <Button size="lg" variant="warning" className="w-100"
                        onClick={() => navigate("/?toModify=true")}
                    >
                    Modify Article
                    </Button>
                </Col>
                {user?.account === "admin" && (
                    <>
                    <Col xs={12} sm="auto">
                    <Button size="lg" variant="success" className="w-100" 
                        onClick={() => navigate("/login", {state: {admin: true}})}
                    > Create Author
                    </Button>
                    </Col>
                    <Col xs={12} sm="auto">
                        <Button size="lg" variant="secondary" className="w-100"
                                onClick={handleCleanUp} disabled={unusedPublicIds.lenght === 0}
                        >
                        {unusedPublicIds.length > 0 ? 
                        `Clean Up - ${unusedPublicIds.length} unused images` 
                        : "No images to Clean Up"}
                        <i className={`ms-2 bi bi-${unusedPublicIds.length > 0 ? "trash" : "emoji-smile"}-fill`}></i>
                        </Button>
                    </Col>
                    </>
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