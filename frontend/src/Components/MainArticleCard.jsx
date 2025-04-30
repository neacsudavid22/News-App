import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import { deleteArticle } from "../Services/articleService";
import "./textMultilineTruncate.css";
import useWindowSize from "../hooks/useWindowSize";

const MainArticleCard = ({ article, toModify = false }) => {
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

  const removeArticle = async () => {
    try {
      const result = await deleteArticle(article?._id);
      if(result !== null)
        window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const formattedUpdateDate = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.updatedAt));

  const formattedCreateDate = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.createdAt));

  const status = formattedUpdateDate !== formattedCreateDate ? "UPDATED" : "PUBLISHED";

  const { IS_SM } = useWindowSize()

  return (

        <Card
          className="border-1 rounded-4 shadow-sm overflow-hidden"
          style={{ cursor: "pointer", height: "auto"}}
        >
          {backgroundUrl && (
            <Figure.Image
              onClick={handleNavigation}
              src={backgroundUrl}
              className="w-100 m-0"
              style={{
                height: IS_SM ? "15rem" : "20rem",
                objectFit: "cover",
              }}
            />
          )}

          <Card.Body 
            className="pt-3 px-3 pb-4"
            style={{ height: "12rem" }}
            onClick={handleNavigation}
          >
            <div className="d-flex align-items-center gap-3 mb-2 text-muted small">
              <span className="fw-medium">{formattedUpdateDate}</span>
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

          {toModify && (
            <Card.Footer className="d-flex justify-content-around">
              <Button variant="danger" className="w-25 p-0 text-nowrap" onClick={removeArticle}>
                Remove
              </Button>
              <Button variant="warning" className="w-25 text-nowrap" onClick={() => navigate(`/author`, { state: { article: article } })}>
                Modify
              </Button>
            </Card.Footer>
          )}
        </Card>

  );
};

export default MainArticleCard;
