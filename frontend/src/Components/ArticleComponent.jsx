import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Image from "react-bootstrap/Image";

const ArticleComponent = ( {article} ) => { 
    const [imageUrls, setImageUrls] = useState({}); 

    useEffect(() => {
        if (!article?.articleContent) return;
        const newImageUrls = {};
        for (const item of article.articleContent) {
            if (item.contentType === "Image") {
                newImageUrls[item.content] = item.content;
            }
        }
        setImageUrls(newImageUrls);
    }, [article]);

    return (
        <Container className="w-100 my-4 ps-4">
            <Row className="w-100 justify-content-center ms-1 mb-3">
                <Col xs={12} sm={12} md={8} lg={8} xl={7} > 
                    <h1>{article?.title || "Loading..."}</h1>
                </Col>
            </Row>
            <Row className="w-100 justify-content-center ms-1 my-2">
                <Col xs={12} sm={12} md={8} lg={8} xl={7} > 
                    <h5>{article?.author?.name ? "Author: " + article?.author?.name : "Loading..."}</h5>
                </Col>
            </Row>
                {article?.articleContent?.map((a, index) => {
                    const Tag = a.contentType;
                    return (
                        <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={12} md={8} lg={8} xl={7} className="mb-1" key={index}>
                            {Tag === "Image" ? (
                                <div key={index} className="d-flex justify-content-center">
                                <Image fluid thumbnail src={imageUrls[a.content] || ""} alt="Image" className="w-auto p-2 my-3"/>
                                </div>
                            ) : (
                                <div key={index} className=" justify-content-start">
                                    <Tag className="p-2 my-2">{a.content}</Tag>
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
