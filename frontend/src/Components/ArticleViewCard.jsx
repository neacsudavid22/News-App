import Card from 'react-bootstrap/Card';

import { useEffect, useState } from 'react';


const ArticleViewCard = ({ article, isBig }) => {
    
    const [backgroundPreview, setBackgroundPreview] = useState()

    useEffect( () => {
        const fetchBackgroundImage = async () => {
            try {
                const response = await fetch("http://localhost:3600/upload-api/upload-images/" + article.background);
                const imageBlob = await response.blob(); // Convert response to blob
                setBackgroundPreview(URL.createObjectURL(imageBlob)); // Set the image URL
            } catch(err) {
                console.error("cardImage error: " + err);
            }
        };
    
        fetchBackgroundImage();

    }, [article])

    return (
        <div style={{width: "100%"}}>
            <Card className="h-100 w-100 d-flex flex-column"> {/* Make card responsive */}
                <Card.Img
                    src={backgroundPreview}
                    alt="Background"
                    style={{ objectFit: "cover", aspectRatio: "16 / 9"}} // Image takes 70% of the card
                    variant='top'
                />
                <Card.Body className='border-top d-flex flex-column justify-content-between h-100'
                style={{ }} >
                    <Card.Title as={isBig ? "h2" : "h3"} className='mb-3'>{article.title}</Card.Title>
                    
                    { isBig && <Card.Text>
                                {article.articleContent[0].content.toString().slice(0, 200) + "..."}
                            </Card.Text> }
                </Card.Body>
            </Card>
        </div>
    );
};

export default ArticleViewCard;