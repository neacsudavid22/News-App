import Card from 'react-bootstrap/Card';

import { useEffect, useState } from 'react';


const ArticleViewCard = ({ article, isBig }) => {
    
    const [backgroundPreview, setBackgroundPreview] = useState()

    useEffect( () => {
        const fetchBackgroundImage = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/get-image/${article.background}`);
                const imageBlob = await response.blob(); // Convert response to blob
                setBackgroundPreview(URL.createObjectURL(imageBlob)); // Set the image URL
            } catch(err) {
                console.error("cardImage error: " + err);
            }
        };
    
        fetchBackgroundImage();

    }, [article])

    return (
            <Card> {/* Make card responsive */}
 
                <Card.Img
                    src={backgroundPreview}
                    alt="Background"
                    style={{ objectFit: "cover", aspectRatio: "2",  overflow: "hidden" }} // Image takes 70% of the card
                    variant='top'
                />
                
                <Card.Body className='border-top d-flex flex-column justify-content-between h-100'
                style={{ }} >
                    <Card.Title as={isBig ? "h2" : "h4"} className='my-2'>{article.title}</Card.Title>
                    
                    { <Card.Text>
                                {article.articleContent[0].content.toString().slice(0, isBig ? 100 : 200) + "..."}
                            </Card.Text> }
                </Card.Body>
            </Card>
    
    );
};

export default ArticleViewCard;