import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Collapse from "react-bootstrap/Collapse";
import { AuthContext } from "../Components/AuthProvider";
import { deleteComment, deleteGarbageComment } from "../Services/articleService";
import CommentForm from "../Components/CommentForm";
import Card from "react-bootstrap/Card";

const CommentSection = ({ articleId, comments }) => {
  const { user } = useContext(AuthContext);
  const [commentList, setCommentList] = useState(comments);
  const [commentMap, setCommentMap] = useState({});
  const [commentTree, setCommentTree] = useState([]);
  const [openMap, setOpenMap] = useState({});
  const [replyMap, setReplyMap] = useState({});

  // Build commentMap
  useEffect(() => {
    if (!commentList || commentList.length === 0) return;

    const tempMap = {};
    commentList.forEach((comment) => {
      tempMap[comment._id] = { ...comment, replies: [] };
    });

    setCommentMap(tempMap);
  }, [commentList]);

  // Build tree structure
  useEffect(() => {
    const tree = [];

    Object.values(commentMap).forEach((comment) => {
      if (comment.responseTo && commentMap[comment.responseTo]) {
        commentMap[comment.responseTo].replies.push(comment);
      } else {
        tree.push(commentMap[comment._id]);
      }
    });

    setCommentTree(tree);
  }, [commentMap]);

  // Garbage cleanup logic (send only IDs)
  useEffect(() => {
    let IS_MODIFIED = false;
    do{
      IS_MODIFIED = false;
      if (!commentList || commentList.length === 0) return;
      if (Object.keys(commentMap).length === 0) return;

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
        //garbageDeletedRef.current = true;
        (async () => {
          try {
            const modifiedCount = await deleteGarbageComment(articleId, deleteIds);
            IS_MODIFIED = modifiedCount > 0
            setCommentList(remainingComments);
          } catch (err) {
            console.error("Error deleting garbage comments:", err);
          }
        })();
      }
    } while(IS_MODIFIED);
  }, [articleId, commentList, commentMap]);

  const handleOpen = (nodeId) => {
    setOpenMap((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleReplyToggle = (nodeId) => {
    setReplyMap((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleDeleteComment = async (comment) => {
    if(!(user?._id === comment.userId || user.account === "admin"))  return;

    try {
      const isLeaf = commentMap[comment._id]?.replies.length === 0;
      const updatedCommentList = await deleteComment(articleId, comment._id, isLeaf);
      if (updatedCommentList) {
        setCommentList(updatedCommentList);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const onCommentPosted = (newComment) => {
    if (newComment) {
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
              className="d-flex flex-column flex-wrap"
            >
            <Card className="mb-3 border-1 rounded-4">
              {(() => {
                const postedAt = comment.postedAt;
                const formattedSentTime = new Intl.DateTimeFormat("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(postedAt));

                const formattedSentDate = new Intl.DateTimeFormat("ro-RO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }).format(new Date(postedAt));

                const isToday = new Date(postedAt).toDateString() === new Date().toDateString();
                const dateString = `Sent at ${formattedSentTime}${isToday ? "" : ` (${formattedSentDate})`}`

                return (
                  <Card.Header className=" rounded-top-4 d-flex justify-content-between align-items-center bg-light py-2 px-3">
                    <Card.Title className="mb-0 h6 ">
                      {comment.removed
                        ? "deleted"
                        : "@" + (comment.userId.username || "loading...")}
                    </Card.Title>
                    <small className="text-muted fst-italic fw-bold">
                      {dateString}
                    </small>
                  </Card.Header>
                );
              })()}

              <Card.Body className="py-3 px-3">
                <Card.Text className="mb-0 text-break">{comment.content}</Card.Text>
              </Card.Body>

              <Card.Footer className="rounded-bottom-4 d-flex bg-light-subtle flex-wrap gap-2 py-2 px-3">
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
                      <i className="bi bi-caret-up-fill ms-1"></i>
                    ) : (
                      <i className="bi bi-caret-down-fill ms-1"></i>
                    )}
                  </Button>
                )}

                {!comment.removed &&
                  (user?._id === comment.userId || user?.account === "admin") && (
                    <Button
                      className="rounded-4"
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      <strong>Delete</strong>
                      <i className="bi bi-trash ms-1"></i>
                    </Button>
                  )}
              </Card.Footer>
            </Card>

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
      <Container fluid>
        {commentList.length > 0 ? (
          createCommentSection(commentTree)
        ) : (
          <Card className=" border-1 round-5 shadow-sm bg-light">
            <Card.Body className="d-flex justify-content-center">
              <Card.Title className="fs-3"> Be the first to comment!</Card.Title>
            </Card.Body>
          </Card>
        )}
      </Container>
    </Container>
  );
};

export default CommentSection;
