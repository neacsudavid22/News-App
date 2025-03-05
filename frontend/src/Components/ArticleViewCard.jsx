import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"


const ArticleViewCard = ({ article }) => {
    //const size = order % 5 === 0 ? 100 : 50;
    return (
        <Row className={`w-100 justify-content-center`}>
            <Col xs={11} sm={10} md={8} lg={6} xl={6}> {/* Responsive column width */}
            <Card className="w-100"> {/* Ensure card takes full width of column */}
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>
                        {article.articleContent[0].content.toString().slice(0,200) + "..."}
                    </Card.Text>
                </Card.Body>
            </Card>
            </Col>
        </Row>
    );
};

export default ArticleViewCard;