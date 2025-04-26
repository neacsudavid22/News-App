import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import "./textMultilineTruncate.css";
import { deleteArticle } from "../Services/articleService";

const SecondaryArticleCard = ({ article, toModify = false, setRefresh }) => {
  const [firstParagraph, setFirstParagraph] = useState("Loading...");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const navigate = useNavigate();
  const { width } = useWindowSize();

  useEffect(() => {
    if (article) {
      const firstP = article.articleContent.find((item) => item.contentType === "p");
      if (firstP) setFirstParagraph(firstP.content);
      setBackgroundUrl(article.background);
    }
  }, [article]);

  const formattedUpdateDate = new Intl.DateTimeFormat("ro-RO", {  
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.updatedAt));

  const formattedCreateDate = new Intl.DateTimeFormat("ro-RO", {  
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.createdAt));

  const status = formattedUpdateDate !== formattedCreateDate ? "UPDATED" : "PUBLISHED";

  const handleNavigation = () => {
    navigate(`/article/${article._id}`);
  };

  const removeArticle = async () => {
    try {
      const result = await deleteArticle(article?._id);
      if(result !== null)
        setRefresh(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Row className="mb-3 justify-content-center">
      <Col xs={12} sm={12} md={10} lg={5} xl={5}>
        <Card 
          className="shadow-sm rounded-4 overflow-hidden h-100"
          style={{ cursor: "pointer" }}
        >
          <Row className="g-0 h-100">
            {/* Text Section */}
            <Col xs={7} className="d-flex flex-column justify-content-between p-3">
              <Card.Body className="p-0 d-flex flex-column justify-content-between h-100"
                onClick={handleNavigation}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <span className="fw-medium">{formattedUpdateDate}</span>
                    <span className="px-2 py-1 fw-semibold border rounded-pill text-uppercase" style={{ fontSize: "0.75rem" }}>
                      {status}
                    </span>
                  </div>

                  <Card.Title 
                    className={`fw-semibold text-multiline-truncate-3 `}
                    title={article?.title}
                    style={{ fontSize: "1.1rem" }}
                  >
                    {article?.title || "Loading..."}
                  </Card.Title>
                </div>

                {width > 758 && (
                  <Card.Text className="text-muted text-multiline-truncate-3 mb-0">
                    {firstParagraph}
                  </Card.Text>
                )}
              </Card.Body>
            </Col>

            {/* Image Section */}
            <Col xs={5} className="d-flex align-items-center justify-content-center p-3">
              <Card.Img 
                variant="top"
                src={backgroundUrl}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "80%",
                  objectFit: "cover",
                  borderRadius: "0.75rem",
                  boxShadow: "0 0 5px rgba(0,0,0,0.1)"
                }}
              />
            </Col>
          </Row>

          {/* Optional Footer for Modify/Remove */}
          {toModify && (
            <Card.Footer className="d-flex justify-content-around">
              <Button variant="danger" className="w-25 text-nowrap"
                onClick={removeArticle}
              >Remove</Button>
              <Button variant="warning" className="w-25 text-nowrap"
                onClick={() => navigate(`/author`, { state: { article: article } }) }
              >Modify</Button>
            </Card.Footer>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default SecondaryArticleCard;
