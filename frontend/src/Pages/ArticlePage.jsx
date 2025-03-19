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
import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import Card from "react-bootstrap/Card";
import Collapse from 'react-bootstrap/Collapse';

const ArticlePage = () => { 

    const { id } = useParams(); 
    const [article, setArticle] = useState(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const { user } = useContext(AuthContext);

    const [commentList, setCommentList] = useState([]);
    const [commentTree, setCommentTree] = useState(null);
    const [commentContent, setCommentContent] = useState("");

    const [openMap, setOpenMap] = useState({});
    const [replyMap, setReplyMap] = useState({});
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    }, [id, commentList]);

    useEffect(() => {
        if (article?.comments) {
            setCommentList(article.comments);
        }
    }, [article]);
    
    useEffect(() => {
        if (!commentList) return;
    
        const commentMap = {};
        const treeList = [];
    
        commentList.forEach((comment) => {
            commentMap[comment._id] = { ...comment, replies: [] };
        });
    
        commentList.forEach((comment) => {
            if (comment.responseTo !== null && commentMap[comment.responseTo]) {
                commentMap[comment.responseTo].replies.push(commentMap[comment._id]);
            } else {
                treeList.push(commentMap[comment._id]);
            }
        });
    
        setCommentTree(treeList);
    }, [commentList]);
    

    useEffect(() => {
        if(user && article){
            setLiked(article.likes.includes(user._id));
            setSaved(article.saves.includes(user._id));
        }
    }, [user, article]);
    
    const handleOpen = (index) => {
        setOpenMap((prevOpenMap) => ({
            ...prevOpenMap,
            [index]: !prevOpenMap[index],
        }));
    };

    const handleReplyForm = (index) => {
        setReplyMap((prevReplyMap) => ({
            ...prevReplyMap,
            [index]: !prevReplyMap[index],
        }));
    };
    
    const handleCommentPost = async (responseTo = null) => {
        if (!user) return handleShow();
        try {
            const addedComment = await interactOnPost(id, user._id, "comment", commentContent, responseTo);
            if (addedComment) {
                setCommentList((prev) => [...prev, addedComment]);
                
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    
    const createCommentSection = (commentTreeNode, depth = 0) => {
        if (!commentTreeNode) return null;
    
        const Wrapper = depth === 0 ? Container : "div"; 
    
        return commentTreeNode.map((comment, index) => {
            const nodeId = `${index}-${depth}`;
    
            return (
                <Wrapper gap={3} direction="vertical" className="min-w-vw" key={nodeId} >
                    <Row className="w-100">
                        <Col lg={12} className="w-100 d-flex flex-column pt-2 border-top " style={{ marginLeft: depth * 20 }}>
                            <div className="small">
                                <strong>{"@" + (comment.userId || "username")}</strong>
                                <p className="mt-2">{comment.content}</p>
                            </div>
                        </Col>
                        <Col xs={12} className="w-100 vw-100">
                            <Stack gap={2} direction="horizontal" className="mb-2"
                                    style={{ marginLeft: depth * 20 }}>
                            <Button
                                id="Reply-Button"
                                size="sm" 
                                variant={replyMap[nodeId] ? "warning" : "outline-warning" }
                                aria-expanded={replyMap[nodeId] || false}
                                aria-controls={nodeId}
                                onClick={() => handleReplyForm(nodeId)}
                            >{replyMap[nodeId] ? <i className="bi bi-reply-fill"></i> : <i class="bi bi-reply"></i>}
                            </Button> 
                            {comment.replies.length > 0 &&
                            <Button 
                                id="Collapse-Button"
                                size="sm" 
                                variant={openMap[nodeId] ? "outline-danger" : "outline-primary"}
                                onClick={() => handleOpen(nodeId)}
                                aria-expanded={openMap[nodeId] || false}
                                aria-controls={nodeId}
                            > {openMap[nodeId] ? <i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i>}
                            </Button>
                            }      
                            </Stack>
                            
                        </Col>  
                    </Row>
                    <Collapse in={replyMap[nodeId] || false}>
                            <div id={nodeId}>
                                <div className="border-top mb-3 ">
                                <FloatingLabel controlId="floatingTextarea" label="Leave a comment" className="mt-4" >
                                    <Form.Control as="textarea" disabled={!user} 
                                                style={{ height: '100px' }} placeholder="Leave a comment here"
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                />
                                </FloatingLabel>
                                </div>
                                
                                <Button style={{borderRadius: "25%"}} 
                                        variant="outline-secondary"
                                        onClick={() => {
                                            handleCommentPost(comment._id);
                                            handleReplyForm(nodeId);
                                            setTimeout(() => handleOpen(nodeId), 600);
                                        }}
                                        className="me-2 mb-3 "
                                >
                                    <i className="bi bi-chat-square-text"></i>
                                </Button>   
                            </div>
                            </Collapse>
                    <Row className="w-100">
                        <Collapse in={openMap[nodeId] || false}>
                            <div id={nodeId} className="mt-2">
                                {comment.replies.length > 0 && createCommentSection(comment.replies, depth + 1)}
                            </div>
                        </Collapse>
                    </Row>        
                </Wrapper>
            );
        });
    };
    
    
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
                                    style={{ height: '100px' }} placeholder="Leave a comment here"
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    />
                    </FloatingLabel>
                    </div>
                    

                    <Button style={{borderRadius: "25%"}} 
                            variant="outline-secondary"
                            onClick={handleCommentPost}
                            className="me-2 mb-3 "
                    >
                        <i className="bi bi-chat-square-text"></i>
                    </Button>   
                    
                    <Card className="w-100 fs-6 p-0" body>
                        {commentTree ? createCommentSection(commentTree) : <p>Be the first to comment!.</p>}
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
            
    );
};

export default ArticlePage;