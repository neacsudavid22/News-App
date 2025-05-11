import { useContext, useEffect, useState } from "react";
import ArticleComponent from "../Components/ArticleComponent";
import MainNavbar from "../Components/MainNavbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../Components/AuthProvider";
import { useNavigate, useParams } from "react-router";
import { getArticleById, interactOnPost } from "../Services/articleService";
import ShareArticle from "../Components/ShareArticle";
import useWindowSize from "../hooks/useWindowSize";
import CommentSection from "../Components/CommentSection";

const ArticlePage = () => { 
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [likeCount, setLikeCount] = useState(article?.likes.length || 0);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { user, refresh } = useContext(AuthContext);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showShare, setShowShare] = useState(false);
  const handleShowShare = () => setShowShare(true);
  const handleCloseShare = () => setShowShare(false);

  const { IS_SM } = useWindowSize();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        if (data) {
          setArticle(data);
          setLikeCount(data.likes.length);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    };
    
    if (id) fetchArticle();
  }, [id]);

  useEffect(() => {
    if (user && article) {
      setLiked(article.likes.includes(user._id));
      setSaved(article.saves.includes(user._id));
    }
  }, [user, article]);

  const navigate = useNavigate();

  return(
    <>
      <MainNavbar />
      <div style={{ height: "0.1rem" }} />
      {article && <ArticleComponent key={article._id} article={article} />}

      <Modal 
        className="mt-4"
        show={show}
        onHide={handleClose}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>You need an account!</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need an account to like, save or share!</Modal.Body>
        <Modal.Footer>Create an free account anytime you want!</Modal.Footer>
      </Modal>

      <Container className="d-flex justify-content-center w-100 my-4">
        <Row className="w-100 justify-content-center mb-3">
          <Col xs={12} sm={12} md={10} lg={8} xl={7}> 
            <Button
              variant={ liked ? "danger" : "outline-danger" }   
              onClick={async () => {
                if (!user) return handleShow();
                liked ? setLikeCount(prev => prev - 1) : setLikeCount(prev => prev + 1);
                setLiked(!liked);  
                await interactOnPost(id, "likes");
              }}
              size={IS_SM ? "sm" : ""}
              className="me-2 rounded-5"
            >
              <strong className="me-2">{likeCount}</strong>
              <strong>Like</strong> <i className={ liked ? "bi bi-heart-fill" : "bi bi-heart" }></i>
            </Button>
            
            <Button
              variant={ saved ? "primary" : "outline-primary" }   
              onClick={async () => {
                if (!user) return handleShow();
                setSaved(!saved);  
                await interactOnPost(id, "saves");
                await refresh();
              }}
              size={IS_SM ? "sm" : ""}
              className="me-2 rounded-5"
            >
              <strong>Save</strong> <i className={ saved ? "bi bi-save-fill" : "bi bi-save" }></i>
            </Button>
            
            <Button
              variant="outline-info"
              onClick={() => {
                if (!user) return handleShow(); 
                handleShowShare(); 
              }}
              className="me-2 rounded-5"
              size={IS_SM ? "sm" : ""}
            >
              <strong>Share</strong> <i className="bi bi-send-fill"></i>
            </Button>

            <hr />
            <strong className="me-2">Tags:</strong>
            {article && article.tags.map((tag) => (
              <Button 
                key={tag} 
                size="sm" 
                className="rounded-4 fw-bold w-auto text-nowrap me-2 my-1" 
                style={{ width: "fit-content" }} 
                onClick={() => navigate(`/?tag=${tag}`)}
              >
                {tag}
              </Button>
            ))}

            {article && <CommentSection articleId={id} comments={article?.comments}/>}
          </Col>
        </Row>
      </Container>

      <ShareArticle 
        show={showShare} 
        handleClose={handleCloseShare} 
        articleId={id}
      />
    </>
  );
};

export default ArticlePage;
