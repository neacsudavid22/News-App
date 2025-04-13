import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import useWindowSize from "../hooks/useWindowSize";

const SecondaryArticleCard = ({ article }) => {
    const [firstParagraph, setFirstParagraph] = useState("Loading...");
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const navigation = useNavigate();
    const { width } = useWindowSize();

    useEffect(() => {
        if (article) {
            for (const item of article.articleContent) {
                if (item.contentType === "p") {
                    setFirstParagraph(item.content);
                    break;
                }
            }
        }
    }, [article, setFirstParagraph]);

    useEffect(() => {
        const getBackground = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/get-image/${article.background}`);
                if (!response.ok) {
                    throw new Error(response?.message || "Failed to get background image");
                }
                const backgroundBlob = await response.blob();
                const backgroundBlobUrl = URL.createObjectURL(backgroundBlob);
                setBackgroundUrl(backgroundBlobUrl);
            } catch (err) {
                console.error("getBackground error: ", err);
            }
        };
        getBackground();
    }, [article.background]);

    const handleNavigation = () => {
        navigation(`/article/${article._id}`);
    };

    return (
        <Row className="mb-4 justify-content-center">
            <Col xs={12} sm={12} md={10} lg={8} xl={6} 
                style={{ height: "18vh", minHeight: "10vw" }}>
                
                <Card className="d-flex flex-row align-items-center h-100" style={{ cursor: "pointer" }} onClick={handleNavigation}>

                    {/* Left Side - Text */}
                    <Col xs={8} sm={9} md={8} lg={8} xl={9} className="d-flex align-items-center">
                        <Card.Body className="d-flex flex-column justify-content-center"> 
                            <Card.Title className="fs-5">{article?.title || "Loading..."}</Card.Title>
                            <Card.Text className="fs-6">
                                {firstParagraph?.slice(0, width < 768 ? 40 : 121) + "..."}
                            </Card.Text>
                        </Card.Body>
                    </Col>

                    {/* Right Side - Image */}
                    <Col xs={3} sm={3} md={4} lg={4} xl={2} className="d-flex justify-content-center align-items-center">
                    {
                    backgroundUrl &&
                        <Image 
                            thumbnail
                            src={backgroundUrl} 
                            style={{ aspectRatio: "4 / 3", objectFit: "cover" }} 
                        />
                    }
                    </Col>

                </Card>
            </Col>
        </Row>
    );
};

export default SecondaryArticleCard;
