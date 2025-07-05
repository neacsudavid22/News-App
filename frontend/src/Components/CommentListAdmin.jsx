import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { ButtonGroup, Col, Row, Spinner, Stack, Tab, Tabs } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import { deleteComment, getAllComments, getInappropriateComments } from '../Services/articleService';
import useElementInView from "../hooks/useElementInView";
import { Gemini } from '@lobehub/icons';
import { useRef } from 'react';

const CommentListAdmin = ({ show, setShowCommentList }) => {
    const [commentList, setCommentList] = useState([]); 
    const { IS_SM } = useWindowSize();
    const [selectMode, setSelectMode] = useState("chronological");
    const FETCHING = useRef(false);
    const [chronologicalPage, setChronologicalPage] = useState(1);
    const [geminiPage, setGeminiPage] = useState(1);
    const [targetRef, isInView] = useElementInView({ threshold: 0.5 });

    const handleClose = () => {
        setShowCommentList(false);
    };

    const handleSelectMode = (mode) => {
        setSelectMode(mode);
        setCommentList([]);
        setChronologicalPage(1); 
        setGeminiPage(1);
    }

    useEffect(() => {
        const fetchComments = async () => {
            FETCHING.current = true
            switch(selectMode){
                case "chronological":
                    {
                        const comments = await getAllComments(chronologicalPage);
                        setCommentList(prev => [...prev, ...(comments || [])]);
                    } break;
                case "gemini": {
                        const comments = await getInappropriateComments(geminiPage);
                        setCommentList(prev => [...prev, ...(comments || [])]);
                } break;
                default: 
                    setCommentList([]);
                    break;
            }
            FETCHING.current = false
        };
        if (isInView && !FETCHING.current) {
            fetchComments();
            selectMode === 'chronological' ? 
                setChronologicalPage(prev => prev + 1) : setGeminiPage(prev => prev + 1)
        }
    }, [selectMode, chronologicalPage, geminiPage, isInView]);

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
                    <Button onClick={()=>handleSelectMode("chronological")}
                            variant={selectMode === "chronological" ? 'secondary' : 'outline-secondary'}
                            size={IS_SM ? "sm" : "lg"}
                        >Chronological</Button>
                    <Button onClick={()=>handleSelectMode("gemini")}
                            variant={selectMode === "gemini" ? 'info' : 'outline-info'}
                            size={IS_SM ? "sm" : "lg"}
                        >Gemini detection <Gemini size={20} /></Button>
                </ButtonGroup>
            </Offcanvas.Header>
            <Offcanvas.Body className={`w-${IS_SM ? 100 : 75} m-auto`}>
                <Stack gap={2}>
                    {commentList.length > 0 ? (
                        commentList.map((comment, index) => (
                            <div
                                key={comment._id + index}
                                className={`px-${IS_SM ? "2" : "5"} mb-3 pb-2 border-bottom`}
                            >
                                <strong className='fs-5'>
                                    {comment.username || "loading..."}
                                </strong>
                                <div className='mt-3 text-muted'>Comment content: {comment.content}</div>
                                <div className="mt-2 mb-4 pt-3 border-top d-flex justify-content-start">
                                    <Button
                                        className="rounded-4"
                                        variant="outline-danger"
                                        onClick={() => handleDeleteComment(comment)}
                                    >
                                    <strong>Remove comment</strong><i className="ps-1 bi bi-trash-fill"></i>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <strong className="text-center fs-3 text-muted">No comments found.</strong>
                    )}
                    {FETCHING.current && 
                    <div className='d-flex justify-content-center'>
                        <Spinner className=' align-center' animation='grow'></Spinner>
                        <strong className='ps-3 fs-3 align'>Loading comments</strong>
                    </div> }
                    {<div ref={targetRef}></div>}

                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CommentListAdmin;
