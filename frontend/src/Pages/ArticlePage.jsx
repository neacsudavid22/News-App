import { useContext, useEffect, useState } from "react";
import ArticleComponent from "../Components/ArticleComponent";
import MainNavbar from "../Components/MainNavBar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../Components/AuthProvider";
import { useParams } from "react-router";
import { getArticleById, interactOnPost } from "../Services/articleService";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

const ArticlePage = () => { 

    const { id } = useParams(); 
    const [article, setArticle] = useState(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getArticleById(id);
                if (data) {
                    setArticle(data);
                }
            } catch (err) {
                console.error("Error fetching article:", err);
            }
        };
        
        if (id) fetchArticle();
    }, [id]);

    useEffect(() => {
        if(user && article){
            setLiked(article.likes.includes(user._id));
            setSaved(article.saves.includes(user._id));
        }
    }, [user, article]);

    // const createCommentTree = (commentList) => {
    //     let map = {};
    //     let treeList = [];
        
    //     // Create a map of all nodes
    //     commentList.forEach((item, index) => {
    //         map[index] = { ...item, responses: [] };
    //     });
        
    //     // Link children to parents or add to root list
    //     commentList.forEach((item, index) => {
    //         if (item.responseTo === null) {
    //         treeList.push(map[index]); // Multiple root nodes
    //         } else {
    //         map[index]?.responses.push(map[index]);
    //         }
    //     });
    //     console.log(treeList);
        
    //     return treeList;
    // }
    return(
        <>
        <MainNavbar />
        <ArticleComponent article={article}/>

        <Modal 
            show={show}
            onHide={handleClose}
            size="md"
        >
            <Modal.Header closeButton>
                <Modal.Title>You need an account!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You need an account in order to like, save, share or comment!</Modal.Body>
            <Modal.Footer>Create an free account anytime you want!</Modal.Footer>
        </Modal>

        <Container className="d-flex justify-content-center w-100 my-4">
            <Row className="w-100 justify-content-center mb-3">
                <Col xs={12} sm={12} md={10} lg={8} xl={7}> 
                   
                    <Button style={{borderRadius: "25%"}} 
                            variant="secondary"   
                            disabled
                            className="me-2"
                    >
                         <strong>{article?.likes.length}</strong>
                    </Button>
                    <Button style={{borderRadius: "25%"}} 
                            variant={ liked ? "danger" : "outline-danger" }   
                            onClick={() => {
                                if (!user) return handleShow();
                                setLiked(!liked);  
                                const interaction = "like";
                                interactOnPost(id, user._id, interaction)
                            }}

                            className="me-2"
                    >
                        <i className={ liked ? "bi bi-heart-fill" : "bi bi-heart" }></i> 
                    </Button>
                    <Button style={{borderRadius: "25%"}} 
                            variant={ saved ? "primary" : "outline-primary" }   
                            onClick={() => {
                                if (!user) return handleShow();
                                setSaved(!saved);  
                                const interaction = "save";
                                interactOnPost(id, user._id, interaction);
                            }}
                            className="me-2"
                    >
                        <i className={ saved ? "bi bi-save-fill" : "bi bi-save"}></i>
                    </Button>
                    <Button style={{borderRadius: "25%"}} 
                            variant="outline-warning"
                            onClick={() => {
                                if (!user) return handleShow();
                                
                            }}
                            className="me-2"
                    >
                        <i className="bi bi-send-fill"></i>
                    </Button>


                    <div className="border-top my-3">
                    <h3 className="mt-4">Comment Section</h3>
                    <FloatingLabel controlId="floatingTextarea" label="Leave a comment" className="mt-4" >
                        <Form.Control as="textarea" disabled={!user} 
                                    style={{ height: '100px' }} placeholder="Leave a comment here" />
                    </FloatingLabel>
                    </div>
                    

                    <Button style={{borderRadius: "25%"}} 
                            variant="outline-secondary"
                            onClick={(e) => {
                                if (!user) return handleShow();
                                const comment = e.target.value;
                                interactOnPost(id, user._id, "comment", comment);

                            }}
                            className="me-2"
                    >
                        <i className="bi bi-chat-square-text"></i>
                    </Button>   

                </Col>
            </Row>
        </Container>
        </>
            
    );
};

export default ArticlePage;