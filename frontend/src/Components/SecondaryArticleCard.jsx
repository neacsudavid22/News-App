import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import "./textMultilineTruncate.css";
import { useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";

const SecondaryArticleCard = ({ article }) => {
  const [firstParagraph, setFirstParagraph] = useState("Loading...");
  const navigate = useNavigate();
  const { width } = useWindowSize();

  useEffect(() => {
    if (article) {
      const firstP = article.articleContent.find((item) => item.contentType === "p");
      if (firstP) setFirstParagraph(firstP.content);
    }
  }, [article]);

  const formattedDate = new Intl.DateTimeFormat("ro-RO", {  
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.updatedAt));

  const status = article.createdAt !== article.updatedAt ? "UPDATED" : "PUBLISHED";

  return (
    <Row className="mb-3 justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card
          className="d-flex flex-row shadow-sm rounded-4 overflow-hidden"
          style={{ cursor: "pointer", maxHeight: "13rem", height: "auto" }}
          onClick={() => navigate(`/article/${article._id}`)}
        >
          {/* Left: Text content */}
          <div className="d-flex flex-column justify-content-between p-3" style={{ width: "55%" }}>
            <div className="d-flex align-items-center gap-2 text-muted small mb-1">
              <span className="fw-medium">{formattedDate}</span>
              <span className="px-2 py-1 fw-semibold border rounded-pill text-uppercase" style={{ fontSize: "0.75rem" }}>
                {status}
              </span>
            </div>

            <Card.Title
              className={`fw-semibold text-multiline-truncate-${width < 758 ? "3" : "2"}`}
              title={article?.title}
            >
              {article?.title || "Loading..."}
            </Card.Title>

            {width > 758 && (
              <Card.Text className=" text-muted text-multiline-truncate-3 mb-0">
                {firstParagraph}
              </Card.Text>
            )}
          </div>

          {/* Right: Image */}
          {article?.background && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "45%",
              }}
            >
              <Image
                src={article.background}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default SecondaryArticleCard;
