import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";

const MainArticleCard = ({article}) => {

    const [firstParagraph, setFirstParagraph] = useState("Loading...");
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const navigation = useNavigate();

    useEffect(()=>{
        if(article){
            for(const item of article.articleContent){
                if(item.contentType === 'p'){
                    setFirstParagraph(item.content);
                    break;
                }
            }
        }
        
    }, [article, setFirstParagraph]);

    useEffect(()=>{
        if (!article?.background) return;
        setBackgroundUrl(article.background); 
        
    }, [article.background]);

    const handleNavigation = () => {
        navigation(`/article/${article._id}`);
    }

    return(
        <Row className="mb-4 justify-content-center">
        <Col xs={12} sm={12} md={10} lg={8} xl={6} style={{height: "28rem"}} >
        <Card className="d-flex flex-column h-100" style={{cursor:"pointer"}} onClick={handleNavigation}>
            {
                backgroundUrl &&
                <div style={{ flex: "8", overflow: "hidden" }}> 
                    <Card.Img 
                    variant="top" 
                    src={backgroundUrl} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                </div>
            }
            <Card.Body className="border-top" style={{ flex: "2" }} > 
                <Card.Title className="fs-4">{article?.title || "Loading..."}</Card.Title>
                <Card.Text className="fs-6" style={{textAlign: "justify", textJustify: "inter-word"}}>
                {firstParagraph?.slice(0,172) + "..."}
                </Card.Text>
            </Card.Body>
            </Card>

        </Col>
        </Row>
    );
}

export default MainArticleCard;
