import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Image from "react-bootstrap/Image";
import { getAuthorName } from "../Services/userService";

const ArticleComponent = ( {article} ) => { 
    const [imageUrls, setImageUrls] = useState({}); // Store image URLs
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                    const authorName = await getAuthorName(article.author);
                    if(authorName){
                        setAuthor(authorName);
                    }
                }
            catch (err) {
                console.error("Error fetching article:", err);
            }
        };

        fetchAuthor();
    }, [article]);

    useEffect(() => {
        const fetchImages = async () => {
            if (!article?.articleContent) return;

            const newImageUrls = {};
            for (const item of article.articleContent) {
                if (item.contentType === "Image") {
                    try {
                        const response = await fetch(`http://localhost:3600/upload-api/upload-images/${item.content}`);
                        const imageBlob = await response.blob();
                        newImageUrls[item.content] = URL.createObjectURL(imageBlob);
                    } catch (err) {
                        console.error("Error fetching image:", err);
                    }
                }
            }
            setImageUrls(newImageUrls);
        };

        fetchImages();
    }, [article]);

    return (
        <Container className="w-100 my-4">
            <Row className="w-100 justify-content-center ms-1 mb-3">
                <Col xs={12} sm={10} md={8} lg={6} xl={6} > 
                    <h1>{article?.title || "Loading..."}</h1>
                </Col>
            </Row>
            <Row className="w-100 justify-content-center ms-1 my-2">
                <Col xs={12} sm={10} md={8} lg={6} xl={6} > 
                    <h6>{"Author: " + author || "Loading..."}</h6>
                </Col>
            </Row>
                {article?.articleContent?.map((a, index) => {
                    const Tag = a.contentType;
                    return (
                        <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={10} md={8} lg={6} xl={6} className="mb-1" key={index}>
                            {Tag === "Image" ? (
                                <div key={index} className="d-flex justify-content-center">
                                    <Image src={imageUrls[a.content] || ""} alt="Image" className="w-75 p-2 my-3" />
                                </div>
                            ) : (
                                <div key={index} className="d-flex justify-content-start">
                                    <Tag className="p-2 my-2" style={{textAlign: "justify", texJustify: "inter-word"}}>{a.content}</Tag>
                                </div>
                            )}
                        </Col>
                        </Row>
                    );
                })}
        </Container>
    );
};

export default ArticleComponent;
