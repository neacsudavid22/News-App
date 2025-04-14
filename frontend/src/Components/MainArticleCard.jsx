import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import "./textMultilineTruncate.css";

const MainArticleCard = ({ article }) => {
  const [firstParagraph, setFirstParagraph] = useState("Loading...");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (article) {
      const firstP = article.articleContent.find((item) => item.contentType === "p");
      if (firstP) setFirstParagraph(firstP.content);
    }
  }, [article]);

  useEffect(() => {
    if (article?.background) {
      setBackgroundUrl(article.background);
    }
  }, [article?.background]);

  const handleNavigation = () => {
    navigate(`/article/${article._id}`);
  };

  const formattedDate = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.updatedAt));

  const status = article.createdAt !== article.updatedAt ? "UPDATED" : "PUBLISHED";

  return (
    <Row className="mb-3 justify-content-center">
      <Col xs={12} sm={12} md={10} lg={8} xl={6}>
        <Card
          className="border-1 rounded-4 shadow-sm overflow-hidden"
          style={{ cursor: "pointer", height: "auto", minHeight:"35vw" }}
          onClick={handleNavigation}
        >
          {backgroundUrl && (
            <Card.Img
              src={backgroundUrl}
              style={{
                width: "100%",
                height: "12rem", minHeight:"20vw",
                objectFit: "cover",
              }}
            />
          )}

          <Card.Body className="pt-3 px-3 pb-4">
            <div className="d-flex align-items-center gap-3 mb-2 text-muted small">
              <span className="fw-medium">{formattedDate}</span>
              <span className="px-2 py-1 fw-medium border rounded-pill" style={{fontSize: "0.9rem"}}>
                {status}
              </span>
            </div>

            <Card.Title className="fs-5 fw-semibold text-multiline-truncate-2" title={article?.title}>
              {article?.title || "Loading..."}
            </Card.Title>

            <Card.Text className="fs-6 text-muted mt-1 text-multiline-truncate-3">
              {firstParagraph || "Loading..."}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MainArticleCard;
