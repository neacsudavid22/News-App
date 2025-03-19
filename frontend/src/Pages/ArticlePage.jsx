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
import { deleteComment, getArticleById, interactOnPost } from "../Services/articleService";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import Collapse from 'react-bootstrap/Collapse';

const ArticlePage = () => { 

    const { id } = useParams(); 
    const [article, setArticle] = useState(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const { user } = useContext(AuthContext);

    const [commentList, setCommentList] = useState([]);
    const [commentTree, setCommentTree] = useState(null);
    const [commentMap, setCommentMap] = useState({});
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
    }, [id]);

    useEffect(() => {
        if (article?.comments) {
            setCommentList([...article.comments]);
        }
    }, [article]);
    
    useEffect(() => {
        
        if (!commentList) {
           return;
        }

        const tempCommentMap = {};
        const treeList = [];
    
        commentList.forEach((comment) => {
            tempCommentMap[comment._id] = { ...comment, replies: [] };
        });
    
        commentList.forEach((comment) => {
            if (comment.responseTo !== null && tempCommentMap[comment.responseTo]) {
                tempCommentMap[comment.responseTo].replies.push(tempCommentMap[comment._id]);
            } else {
                treeList.push(tempCommentMap[comment._id]);
            }
        });
    
        setCommentTree(treeList);
        setCommentMap(tempCommentMap);

        let IS_CHANGED = false;
    
        commentList.forEach((comment) => { 
            if (tempCommentMap[comment._id]?.replies.length === 0 && comment.removed) {
                commentList.splice(commentList.findIndex(c => c._id === comment._id), 1);
                IS_CHANGED = true;
            }
        });

        if(IS_CHANGED) setCommentList(commentList);

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
        setCommentContent("");
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
                if(responseTo){
                    setCommentList((prev) => [...prev, addedComment]);
                }
                else{
                    setCommentList((prev) => [addedComment, ...prev,]);
                }
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (comment) => {
        if (user?._id !== comment.userId) return handleShow();
        try {
            const isLastNode = !commentMap[comment._id]?.replies.length;
            console.log(isLastNode);
            const updatedCommentList = await deleteComment(id, comment._id, isLastNode);
            if (updatedCommentList) {
                setCommentList(() => [...updatedCommentList]);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }
    
    const createCommentSection = (commentTreeNode, depth = 0) => {
        if (!commentTreeNode) return null;
    
        return commentTreeNode.map((comment, index) => {
            const nodeId = `${index}-${depth}`;
    
            return (
                <div key={nodeId} >
                    <Row>
                        <Col xs={{ span: Math.max((12 - depth), 6), offset: Math.min(depth, 6) }}
                             className="d-flex flex-column flex-wrap pt-2 border-top">

                            <Stack direction="vertical" className="small mb-1">
                                <p className="mt-2 text-break">
                                    <strong>{comment.removed ? "deleted" : "@" + (comment.userId || "username")}</strong>
                                </p>
                                <p className="mb-1 text-break">{comment.content}</p>
                            </Stack>

                            <Stack gap={2} direction="horizontal" className="my-2">
                            <Button
                                id="Reply-Button"
                                size="sm" 
                                variant={replyMap[nodeId] ? "warning" : "outline-warning" }
                                aria-expanded={replyMap[nodeId] || false}
                                aria-controls={nodeId}
                                onClick={() => handleReplyForm(nodeId)}
                            >{replyMap[nodeId] ? <i className="bi bi-reply-fill"></i> : <i className="bi bi-reply"></i>}
                            </Button> 
                            
                            {comment.replies.length > 0 &&
                            <Button 
                                id="Collapse-Button"
                                size="sm" 
                                variant={openMap[nodeId] ? "outline-danger" : "outline-primary"}
                                onClick={() => handleOpen(nodeId)}
                                aria-expanded={openMap[nodeId] || false}
                                aria-controls={nodeId}
                            > {openMap[nodeId] ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
                            </Button>
                            }      

                            {
                            (comment.userId === user?._id && !comment.removed) &&
                            <Button 
                                id="Delete-Button"
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteComment(comment)}
                                className="ms-3"
                            > <i className="bi bi-trash"></i>
                            </Button>
                            }           
                            </Stack>
                            
                        </Col>  
                    </Row>
                    
                    <Row>
                    <Col>
                        <Collapse in={replyMap[nodeId] || false}>
                        <div id={nodeId}>
                            <div className="border-top mb-3 ">
                            <FloatingLabel label="Leave a comment" className="mt-4" >
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
                    </Col>
                    </Row>
                   

                    <Collapse in={openMap[nodeId] || false}>
                        <div id={nodeId} className="mt-2">
                            {comment.replies.length > 0 && createCommentSection(comment.replies, depth + 1)}
                        </div>
                    </Collapse>
                </div>
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
                        <FloatingLabel label="Leave a comment" className="mt-4 border-top mb-3 " >
                            <Form.Control as="textarea" disabled={!user} 
                                        style={{ height: '100px' }} placeholder="Leave a comment here"
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        />
                        </FloatingLabel>
                        
                        <Button style={{borderRadius: "25%"}} 
                                variant="outline-secondary"
                                onClick={() => {
                                    handleCommentPost();
                                }}
                                className="me-2 mb-3 "
                        >
                            <i className="bi bi-chat-square-text"></i>
                        </Button>   
                    </div>
                    
                    <Container fluid className="fs-6" body>
                        {commentList ? createCommentSection(commentTree) : <p>Be the first to comment!.</p>}
                    </Container>
                    
                </Col>
            </Row>
        </Container>
        </>
            
    );
};

export default ArticlePage;