import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import { Button, Figure } from "react-bootstrap";
import { deleteArticle } from "../Services/articleService";
import "./textMultilineTruncate.css";
import useWindowSize from "../hooks/useWindowSize";

const SecondaryArticleCard = ({ article, toModify = false, setRefresh }) => {
  const [firstParagraph, setFirstParagraph] = useState("Loading...");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (article) {
      const firstP = article.articleContent.find((item) => item.contentType === "p");
      if (firstP) setFirstParagraph(firstP.content);
      setBackgroundUrl(article.background);
    }
  }, [article]);

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

  const formattedUpdateDate = new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.updatedAt));

  const formattedCreateDate = new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.createdAt));

  const status = formattedUpdateDate !== formattedCreateDate ? "UPDATED" : "PUBLISHED";

  const { width } = useWindowSize();

  return (
    <Row className="mb-3 justify-content-center">
      <Col xs={12} sm={12} md={10} lg={5} xl={5}>
        <Card
          className="border-1 rounded-4 shadow-sm overflow-hidden"
          style={{ cursor: "pointer", height: "auto" }}
        >
          <Row className="g-0 h-100">

            {/* Text Side */}
            <Col xs={7} className="d-flex flex-column justify-content-between p-3 pe-0 h-100">
              <Card.Body 
                className="p-0 d-flex flex-column justify-content-between h-100" 
                onClick={handleNavigation}
              >
                <div>

                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <span className="fw-medium">{formattedUpdateDate}</span>
                    <span className="px-2 py-1 fw-medium border rounded-pill" style={{ fontSize: "0.75rem" }}>
                      {status}
                    </span>
                  </div>

                  <Card.Title 
                    className={`fw-semibold text-multiline-truncate-${ width > 758 ? 2 : 3} m-0`}
                    title={article?.title}
                    style={{ fontSize: "1.1rem" }}
                  >
                    {article?.title || "Loading..."}
                  </Card.Title>
                </div>
                {
                  width > 758 &&
                <Card.Text className="text-muted text-multiline-truncate-3 mb-0">
                  {firstParagraph}
                </Card.Text>}
              </Card.Body>
            </Col>

           {/* Image Side */}
            <Col xs={5} className="d-flex align-items-center justify-content-center p-2 h-100">
              <Figure.Image
                className="mt-3"
                onClick={handleNavigation}
                src={backgroundUrl}
                style={{
                  width: '90%',
                  height: width < 758 ? "5rem" : "8rem",
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                }}
              />
            </Col>

          </Row>

          {toModify && (
            <Card.Footer className="d-flex justify-content-around">
              <Button variant="danger" className="w-25 text-nowrap" onClick={removeArticle}>
                Remove
              </Button>
              <Button variant="warning" className="w-25 text-nowrap" onClick={() => navigate(`/author`, { state: { article: article } })}>
                Modify
              </Button>
            </Card.Footer>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default SecondaryArticleCard;
