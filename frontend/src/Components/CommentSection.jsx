import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Stack from "react-bootstrap/esm/Stack";
import Collapse from "react-bootstrap/Collapse";
import { AuthContext } from "../Components/AuthProvider";
import { deleteComment, deleteGarbageComment } from "../Services/articleService";
import { getUsername } from "../Services/userService";
import CommentForm from "../Components/CommentForm";

const CommentSection = ({ articleId, comments }) => {
  const { user } = useContext(AuthContext);
  const [commentList, setCommentList] = useState(comments);
  const [commentMap, setCommentMap] = useState({});
  const [commentTree, setCommentTree] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [openMap, setOpenMap] = useState({});
  const [replyMap, setReplyMap] = useState({});
  const garbageDeletedRef = useRef(false);

  // Build commentMap
  useEffect(() => {
    if (!commentList || commentList.length === 0) return;

    const tempMap = {};
    commentList.forEach((comment) => {
      tempMap[comment._id] = { ...comment, replies: [] };
    });

    setCommentMap(tempMap);
  }, [commentList]);

  // Fetch usernames
  useEffect(() => {
    const fetchUsernames = async () => {
      const tempUsernames = {};

      await Promise.all(
        Object.values(commentMap).map(async (comment) => {
          if (!tempUsernames[comment.userId]) {
            try {
              const username = await getUsername(comment.userId);
              tempUsernames[comment.userId] = username;
            } catch (err) {
              console.error(err);
            }
          }
        })
      );

      setUsernames(tempUsernames);
    };

    if (Object.keys(commentMap).length > 0) {
      fetchUsernames();
    }
  }, [commentMap]);

  // Build tree structure
  useEffect(() => {
    const tree = [];

    Object.values(commentMap).forEach((comment) => {
      if (comment.responseTo && commentMap[comment.responseTo]) {
        commentMap[comment.responseTo].replies.push(comment);
      } else {
        tree.push(comment);
      }
    });

    setCommentTree(tree);
  }, [commentMap]);

  // Garbage cleanup logic (send only IDs)
  useEffect(() => {
    if (!commentList || commentList.length === 0 || garbageDeletedRef.current) return;

    const deleteIds = [];
    const remainingComments = [];

    commentList.forEach((comment) => {
      const hasReplies = commentMap[comment._id]?.replies.length > 0;
      if (!hasReplies && comment.removed) {
        deleteIds.push(comment._id);
      } else {
        remainingComments.push(comment);
      }
    });

    if (deleteIds.length > 0) {
      garbageDeletedRef.current = true;
      (async () => {
        try {
          await deleteGarbageComment(articleId, deleteIds);
          setCommentList(remainingComments);
        } catch (err) {
          console.error("Error deleting garbage comments:", err);
        }
      })();
    }
  }, [articleId, commentList, commentMap]);

  const handleOpen = (nodeId) => {
    setOpenMap((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleReplyToggle = (nodeId) => {
    setReplyMap((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleDeleteComment = async (comment) => {
    if (user?._id !== comment.userId) return;

    try {
      const isLeaf = commentMap[comment._id]?.replies.length === 0;
      const updatedCommentList = await deleteComment(articleId, comment._id, isLeaf);
      if (updatedCommentList) {
        garbageDeletedRef.current = false; // allow garbage cleanup to rerun
        setCommentList(updatedCommentList);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const onCommentPosted = (newComment) => {
    if (newComment) {
      garbageDeletedRef.current = false;
      setCommentList((prev) => [...prev, newComment]);
    }
  };

  const createCommentSection = (nodes, depth = 0) => {
    if (!nodes || nodes.length === 0) return null;

    return nodes.map((comment) => {
      const nodeId = comment._id;
      return (
        <div key={nodeId}>
          <Row>
            <Col
              xs={{ span: Math.max(12 - depth, 9), offset: Math.min(depth, 3) }}
              className="d-flex flex-column flex-wrap pt-2 border-top"
            >
              <Stack direction="vertical" className="small mb-1">
                <p className="mt-2 text-break">
                  <strong>
                    {comment.removed
                      ? "deleted"
                      : "@" + (usernames[comment.userId] || "loading...")}
                  </strong>
                </p>
                <p className="mb-1 text-break">{comment.content}</p>
              </Stack>

              <Stack gap={2} direction="horizontal" className="my-2">
                <Button
                  className="rounded-4"
                  size="sm"
                  variant={replyMap[nodeId] ? "warning" : "outline-warning"}
                  aria-expanded={replyMap[nodeId] || false}
                  onClick={() => handleReplyToggle(nodeId)}
                >
                  <strong className="pe-1">Reply</strong>
                  {replyMap[nodeId] ? (
                    <i className="bi bi-reply-fill"></i>
                  ) : (
                    <i className="bi bi-reply"></i>
                  )}
                </Button>

                {comment.replies.length > 0 && (
                  <Button
                    className="rounded-4"
                    size="sm"
                    variant={openMap[nodeId] ? "outline-danger" : "outline-primary"}
                    onClick={() => handleOpen(nodeId)}
                    aria-expanded={openMap[nodeId] || false}
                  >
                    <strong>{`See ${openMap[nodeId] ? "less" : "more"}`}</strong>
                    {openMap[nodeId] ? (
                      <i className="bi bi-caret-up-fill"></i>
                    ) : (
                      <i className="bi bi-caret-down-fill"></i>
                    )}
                  </Button>
                )}

                {!comment.removed && user?._id === comment.userId && (
                  <Button
                    className="rounded-4"
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteComment(comment)}
                  >
                    <strong>Delete</strong>
                    <i className="bi bi-trash"></i>
                  </Button>
                )}
              </Stack>
            </Col>
          </Row>

          <Row>
            <Col>
              <Collapse in={replyMap[nodeId] || false}>
                <div id={nodeId}>
                  <CommentForm
                    articleId={articleId}
                    responseTo={nodeId}
                    onCommentPosted={onCommentPosted}
                  />
                </div>
              </Collapse>
            </Col>
          </Row>

          <Collapse in={openMap[nodeId] || false}>
            <div id={nodeId} className="mt-2">
              {comment.replies.length > 0 &&
                createCommentSection(comment.replies, depth + 1)}
            </div>
          </Collapse>
        </div>
      );
    });
  };

  return (
    <Container className="mt-4">
      <CommentForm articleId={articleId} onCommentPosted={onCommentPosted} />
      <Container fluid className="fs-6">
        {commentList.length > 0 ? (
          createCommentSection(commentTree)
        ) : (
          <p>Be the first to comment!</p>
        )}
      </Container>
    </Container>
  );
};

export default CommentSection;
