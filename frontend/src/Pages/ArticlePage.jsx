import { useContext, useEffect, useState } from "react";
import ArticleComponent from "../Components/ArticleComponent";
import MainNavbar from "../Components/MainNavbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../Components/AuthProvider";
import { useParams } from "react-router";
import { deleteComment, deleteGarbageComment, getArticleById, interactOnPost } from "../Services/articleService";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import Collapse from 'react-bootstrap/Collapse';
import { getUsername } from "../Services/userService";
import ShareArticle from "../Components/ShareArticle";
import useWindowSize from "../hooks/useWindowSize";

const ArticlePage = () => { 

    const { id } = useParams(); 
    const [article, setArticle] = useState(null);
    const [likeCount, setLikeCount] = useState(article?.likes.length || 0);

    const [IS_ARTICLE_FETCH_NEDEED, SET_IS_ARTICLE_FETCH_NEDEED] = useState(false);

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

    const [usernames, setUsernames] = useState([]);

    const [showShare, setShowShare] = useState(false);

    const handleShowShare = () => setShowShare(true);
    const handleCloseShare = () => setShowShare(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getArticleById(id);
                if (data) {
                    setArticle(data);
                    setCommentList([...data.comments]);
                    setLikeCount(() => data.likes.length);
                    console.log(data);
                }
            } catch (err) {
                console.error("Error fetching article:", err);
            }
        };
        
        if (id) fetchArticle();
    }, [id, IS_ARTICLE_FETCH_NEDEED]);

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

        const handleUsernames = async () => {
            const getUsernameFetch = async (id) => {
                try {
                    const username = await getUsername(id);
                    return username;
                } catch (err) {
                    console.error(err);
                }
            };
        
            const tempUsernames = {};
            
            await Promise.all(
                Object.values(tempCommentMap).map(async (c) => {
                    const username = await getUsernameFetch(c.userId);
                    tempUsernames[c.userId] = username;
                })
            );
        
            setUsernames(tempUsernames);
        };
        
        
        handleUsernames();

        const tempCommentList = [...commentList];

        let KEEP_VERIFYING = false;
        let IS_MODIFIED = false
        do {
            KEEP_VERIFYING = false;
            tempCommentList.forEach((comment) => { 
                if (tempCommentMap[comment._id]?.replies.length === 0 && comment.removed) {
                    tempCommentList.splice(tempCommentList.findIndex(c => c._id === comment._id), 1);
                    KEEP_VERIFYING = true;
                    IS_MODIFIED = true
                }
            });
        } while(KEEP_VERIFYING);

        if(IS_MODIFIED) {
            const garbageFetch = async () => {
                try{
                    await deleteGarbageComment(id, tempCommentList);
                    // the value doesnt matter, I just need to know I entered here for the fetch
                    SET_IS_ARTICLE_FETCH_NEDEED(prev => !prev);
                } catch(err){
                    console.error(err);
                }
            }
            garbageFetch();
        }

    }, [id, commentList]);
    

    useEffect(() => {
        if(user && article){
            setLiked(article.likes.includes(user._id));
            setSaved(article.saves.includes(user._id));
        }
    }, [user, article]);
    
    const handleOpen = (nodeId) => {
        setOpenMap((prevOpenMap) => ({
            ...prevOpenMap,
            [nodeId]: !prevOpenMap[nodeId],
        }));
    };

    const handleReplyForm = (nodeId) => {
        setCommentContent("");
        setReplyMap((prevReplyMap) => ({
            ...prevReplyMap,
            [nodeId]: !prevReplyMap[nodeId],
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

    const searchbyTag = async () => {
        //:TO-DO
    }
    
    const createCommentSection = (commentTreeNode, depth = 0) => {
        
        if (!commentTreeNode) return null;
    
        return commentTreeNode.map((comment) => {
            const nodeId = comment._id
            return (
                <div key={nodeId} >
                    <Row>
                        <Col xs={{ span: Math.max((12 - depth), 9), offset: Math.min(depth, 3) }}
                             className="d-flex flex-column flex-wrap pt-2 border-top">
                            
                            <Stack direction="vertical" className="small mb-1">
                                <p className="mt-2 text-break">
                                    <strong>{comment.removed ? "deleted" : "@" + (usernames[comment.userId] || "loading..")}</strong>
                                </p>
                                <p className="mb-1 text-break">{comment.content}</p>
                            </Stack>

                            <Stack gap={2} direction="horizontal" className="my-2">
                            <Button
                                className="rounded-4"
                                id="Reply-Button"
                                size="sm" 
                                variant={replyMap[nodeId] ? "warning" : "outline-warning" }
                                aria-expanded={replyMap[nodeId] || false}
                                aria-controls={nodeId}
                                onClick={() => handleReplyForm(nodeId)}
                            ><strong className="pe-1">Reply</strong>{replyMap[nodeId] ? <i className="bi bi-reply-fill"></i> : <i className="bi bi-reply"></i>}
                            </Button> 
                            
                            {comment.replies.length > 0 &&
                            <Button 
                                className="rounded-4"
                                id="Collapse-Button"
                                size="sm" 
                                variant={openMap[nodeId] ? "outline-danger" : "outline-primary"}
                                onClick={() => handleOpen(nodeId)}
                                aria-expanded={openMap[nodeId] || false}
                                aria-controls={nodeId}
                            > <strong>{`See ${openMap[nodeId] ? "less" : "more"}`}</strong>
                                {openMap[nodeId] ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
                            </Button>
                            }      

                            {
                            (comment?.userId === user?._id && !comment.removed) &&
                            <Button 
                                className="rounded-4"
                                id="Delete-Button"
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteComment(comment)}
                            > <strong>Delete</strong><i className="bi bi-trash"></i>
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
                            
                            <Button 
                                variant="outline-secondary"
                                onClick={() => {
                                    handleCommentPost(comment._id);
                                    handleReplyForm(nodeId);
                                    setTimeout(() => handleOpen(nodeId), 600);
                                }}
                                disabled={commentContent !== ""}
                                className="me-2 mb-3 rounded-4"
                            >
                                <strong className="pe-2">Comment</strong><i className="bi bi-chat-square-text"></i>
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

    const {width} = useWindowSize();
    
    return(
        <>
        <MainNavbar />
        {article && <ArticleComponent key={article?._id} article={article}/>}

        <Modal 
            className="mt-4"
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
                   
                   
                    <Button
                            variant={ liked ? "danger" : "outline-danger" }   
                            onClick={async () => {
                                if (!user) return handleShow();
                                liked ? setLikeCount(prev=>prev-1) : setLikeCount(prev=>prev+1) 
                                setLiked(!liked);  
                                const interaction = "like";
                                await interactOnPost(id, user._id, interaction)
                            }}
                            size={width < 758 ? "sm" : ""}

                            className="me-2 rounded-5"
                    >
                    <strong className="me-2">{likeCount}</strong>
                    <strong>Like</strong>  <i className={ liked ? "bi bi-heart-fill" : "bi bi-heart" }></i> 
                    </Button>
                    <Button
                            variant={ saved ? "primary" : "outline-primary" }   
                            onClick={async () => {
                                if (!user) return handleShow();
                                setSaved(!saved);  
                                const interaction = "save";
                                await interactOnPost(id, user._id, interaction);
                            }}
                            size={width < 758 ? "sm" : ""}
                            className="me-2 rounded-5"
                    >
                         <strong>Save</strong> <i className={ saved ? "bi bi-save-fill" : "bi bi-save"}></i>
                    </Button>
                    <Button
                            variant="outline-info"
                            onClick={() => {
                                if (!user) return handleShow(); 
                                handleShowShare(); 
                            }}
                            className="me-2 rounded-5"
                            size={width < 758 ? "sm" : ""}

                    >
                       <strong>Share</strong> <i className="bi bi-send-fill"></i>
                    </Button>

                    <hr></hr>
                    <strong>Tags:</strong>
                    <Stack className="mt-2 flex-wrap" direction="horizontal" gap={2}>
                        {article && article.tags.map((tag)=>
                        <Button key={tag} size="sm" className="rounded-4 fw-bold w-auto text-nowrap" 
                        style={{ width: "fit-content" }} onClick={searchbyTag}
                        >{tag}</Button>)}
                    </Stack>

                    <div className="border-top my-3">
                        <h3 className="mt-4">Comment Section</h3>
                        <FloatingLabel label="Leave a comment" className="mt-4 border-top mb-3 " >
                            <Form.Control as="textarea" disabled={!user} 
                                        style={{ height: '100px' }} placeholder="Leave a comment here"
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        />
                        </FloatingLabel>
                        
                        <Button 
                                variant="outline-secondary"
                                onClick={() => {
                                    handleCommentPost();
                                }}
                                className="me-2 mb-3 rounded-4"
                                disabled={commentContent === ""}
                        >
                           <strong>Comment</strong> <i className="mx-1 bi bi-chat-square-text"></i>
                        </Button>   
                    </div>                    

                    <Container fluid className="fs-6" body>
                        {commentList ? createCommentSection(commentTree) : <p>Be the first to comment!.</p>}
                    </Container>
                    
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