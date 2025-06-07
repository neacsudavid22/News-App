import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getUsername } from '../Services/userService';
import { ButtonGroup, Col, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import { deleteComment, getAllComments, getInappropriateComments } from '../Services/articleService';
import useElementInView from "../hooks/useElementInView";
import { Gemini } from '@lobehub/icons';

const CommentListAdmin = ({ show, setShowCommentList }) => {
    const [commentList, setCommentList] = useState([]); 
    const [usernames, setUsernames] = useState({});
    const { IS_SM } = useWindowSize();
    const [selectMode, setSelectMode] = useState("chronological");
    const [page, setPage] = useState(0);
    const [targetRef, isInView] = useElementInView({ threshold: 0.5 });

    const handleClose = () => {
        setShowCommentList(false);
    };

    useEffect(()=>{
        setPage(0);
    },[selectMode])

    useEffect(() => {
    if (isInView && commentList.length >= 20) {
      setPage(prev => prev + 1);
    }
  }, [isInView, commentList]);

    useEffect(() => {
        const fetchComments = async () => {
            switch(selectMode){
                case "chronological":
                    {
                        const result = await getAllComments(page);
                        setCommentList(result);
                    } break;
                case "gemini": {
                        const result = await getInappropriateComments(page);
                        setCommentList(result);
                } break;
                default: 
                    setCommentList([]);
                    break;
            }
            
        };
        fetchComments();
    }, [selectMode, page]);

    useEffect(() => {
        const fetchUsernames = async () => {
            const temp = {};
            await Promise.all(
                commentList.map(async (comment) => {
                    const uid = comment.userId;
                    if (!temp[uid]) {
                        try {
                            temp[uid] = await getUsername(uid);
                        } catch {
                            temp[uid] = "Unknown";
                        }
                    }
                })
            );
            setUsernames(temp);
        };

        if (commentList) {
            fetchUsernames();
        }
    }, [commentList]);

    const handleDeleteComment = async (comment) => {
        try {
            const isLastNode = false
            const result = await deleteComment(comment.articleId, comment._id, isLastNode);
            if (result) {
                setCommentList(prev=>prev.filter(c=>c._id !== comment._id));
            }
        } catch (err) {
        console.error("Error deleting comment:", err);
        }
    };


    return (
     <Offcanvas show={show} onHide={handleClose} placement="bottom" className="h-75">
            <Offcanvas.Header closeButton className={`w-${IS_SM ? 100 : 75} m-auto border-bottom`}>
                <ButtonGroup
                    className="mx-3" 
                >
                    <Button onClick={()=>setSelectMode("chronological")}
                            variant={selectMode === "chronological" ? 'secondary' : 'outline-secondary'}
                            size={IS_SM ? "sm" : "lg"}
                        >Chronological</Button>
                    <Button  onClick={()=>setSelectMode("gemini")}
                            variant={selectMode === "gemini" ? 'info' : 'outline-info'}
                            size={IS_SM ? "sm" : "lg"}
                        >Gemini detection <Gemini size={20} /></Button>
                </ButtonGroup>
            </Offcanvas.Header>
            <Offcanvas.Body className={`w-${IS_SM ? 100 : 75} m-auto`}>
                <Stack gap={2}>
                    {commentList.length > 0 ? (
                        commentList.map((comment) => (
                            <div
                                key={comment._id}
                                className={` px-${IS_SM ? "2" : "5"} d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom`}
                            >
                                <div>
                                    <strong className='fs-5'>{"user: " + usernames[comment.userId] || "loading..."}</strong>
                                    <div className='mt-3 text-muted'>Comment content: {comment.content}</div>
                                </div>
                                <Button
                                    className="rounded-4"
                                    variant="outline-danger"
                                    onClick={() => handleDeleteComment(comment)}
                                >
                                    <strong>Delete</strong> <i className="ps-1 bi bi-trash-fill"></i>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <strong className="text-center fs-3 text-muted">No comments found.</strong>
                    )}
                    {commentList.length >= 50 && <div ref={targetRef}></div>}

                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CommentListAdmin;
