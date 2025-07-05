import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Components/AuthProvider";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import MainNavbar from "../Components/MainNavbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { cleanUpUnsuedImages, getDatabaseImageUrls, getUnsuedImagePublicIds } from "../Services/articleService";
import CommentListAdmin from "../Components/CommentListAdmin";
import useWindowSize from "../hooks/useWindowSize";

const DashboardPage = () => {   

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState([]);
    const [unusedPublicIds, setUnusedPublicIds] = useState([]);
    const [showCommentListAdmin, setShowCommentListAdmin] = useState(false);
    const {IS_SM} = useWindowSize();

    const loadingImagesRef = useRef(false);

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                loadingImagesRef.current = true;

                // Step 1: get all image URLs
                const data = await getDatabaseImageUrls();
                setImageUrls(data.imageUrls);

                // Step 2: get unused ones
                const unusedData = await getUnsuedImagePublicIds(data.imageUrls);
                setUnusedPublicIds(unusedData.unusedPublicIds);
            } catch (err) {
                console.error(err);
            } finally {
                loadingImagesRef.current = false;
            }
        };

        if (user?.account === "admin" && !loadingImagesRef.current) {
            fetchAllImages();
        }
    }, [user?.account]);

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

    return(
        
    <div className="h-100 bg-light">
    <MainNavbar/>
    
    <Container fluid className="py-5 d-flex justify-content-center bg-light">
        <Row className="w-100 justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
            <Stack gap={4} className=" p-5 bg-white shadow rounded-4">
                <h1 className="text-center fs-2 mb-2">
                {user && `Welcome ${user.name}, you are registered as ${user.account}!`}
                </h1>
                    <Button size="lg" variant="primary" onClick={()=>navigate("/author")} className={`${IS_SM ? 'w-100' : 'w-75'} mx-auto py-2 fs-5`}>
                        Create Article
                    </Button>
                    <Button size="lg" variant="warning" className={`${IS_SM ?' w-100' : 'w-75'} mx-auto py-2 fs-5`}
                        onClick={() => navigate("/?toModify=true")}
                    >
                        Modify Article
                    </Button>
                    {user?.account === "admin" && (
                        <>
                            <Button size="lg" variant="success" className={`${IS_SM ? 'w-100' : 'w-75'} mx-auto py-2 fs-5`}
                                onClick={() => navigate("/login", {state: {admin: true}})}
                            > 
                                Create Author
                            </Button>
                            <Button size="lg" variant="danger" className={`${IS_SM ?' w-100' : 'w-75'} mx-auto py-2 fs-5`}
                                onClick={() => setShowCommentListAdmin(true)}
                            >
                                Manage comments
                            </Button>
                            <Button size="lg" variant="info" className={`${IS_SM ? 'w-100' : 'w-75'} mx-auto py-2 fs-5`}
                                onClick={() => navigate("/charts")}
                            >
                                View Statistics
                            </Button>
                            <Button size="lg" variant="secondary" className={`${IS_SM ?' w-100' : 'w-75' } mx-auto py-2 fs-5`}
                                    onClick={handleCleanUp} disabled={unusedPublicIds.length === 0}
                            >
                                {unusedPublicIds.length > 0 ? 
                                    `Clean Up - ${unusedPublicIds.length} unused images` 
                                    : "No images to Clean Up"}
                                <i className={`ms-2 bi bi-${unusedPublicIds.length > 0 ? "trash" : "emoji-smile"}-fill`}></i>
                            </Button>
                        </>
                    )}
            </Stack>
            </Col>
        </Row>
        {
            user?.account === "admin" && 
            <CommentListAdmin 
                show={showCommentListAdmin} 
                setShowCommentList={setShowCommentListAdmin}
            />
        }
        </Container>
    </div>
    );
}

export default DashboardPage;