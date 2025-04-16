import { useContext, useState } from "react";
import { AuthContext } from "../Components/AuthProvider";
import { interactOnPost } from "../Services/articleService";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const CommentForm = ({ articleId, responseTo = null, onCommentPosted }) => {
  const { user } = useContext(AuthContext);
  const [commentContent, setCommentContent] = useState("");

  const handleCommentPost = async () => {
    if (!user) return;
    try {
      const addedComment = await interactOnPost(articleId, user._id, "comment", commentContent, responseTo);
      setCommentContent("");
      if (onCommentPosted) {
        onCommentPosted(addedComment);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="border-top my-3">
      <FloatingLabel label="Leave a comment" className="mt-4 border-top mb-3">
        <Form.Control
          as="textarea"
          disabled={!user}
          style={{ height: "100px" }}
          placeholder="Leave a comment here"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
      </FloatingLabel>
      <Button
        variant="outline-secondary"
        onClick={handleCommentPost}
        className="me-2 mb-3 rounded-4"
        disabled={commentContent === ""}
      >
        <strong>Comment</strong> <i className="mx-1 bi bi-chat-square-text"></i>
      </Button>
    </div>
  );
};

export default CommentForm;
