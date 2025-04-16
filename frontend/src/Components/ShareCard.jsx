import { useNavigate } from "react-router";
import { Card, Form } from "react-bootstrap";
import "./textMultilineTruncate.css";
import { useState } from "react";
import { toggleShareRead } from "../Services/userService";

const ShareCard = ({ sharedItemId, articleId, articleTitle, userFrom, read, sentAt }) => {
    const [WAS_READ, SET_WAS_READ] = useState(read);
    const navigate = useNavigate();

    const handleNavigation = async () => {
        handleSwitchChange();
        navigate("/article/" + articleId);
    };

    const handleSwitchChange = async () => {
        await toggleShareRead(sharedItemId);
        SET_WAS_READ(prev=>!prev);
    };

    const formattedSentTime = new Intl.DateTimeFormat("ro-RO", {  
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(sentAt));

      const formattedSentDate = new Intl.DateTimeFormat("ro-RO", {  
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(sentAt));

    return (
        <Card
            onClick={handleNavigation}
            className={`shadow-sm border-1 hover-shadow transition mb-2 ${WAS_READ ? 'bg-light' : ''}`}
            style={{ cursor: "pointer" }}
        >
        <Card.Body className="d-flex flex-column align-items-start">
            <Card.Subtitle className="mb-3 text-muted">
                <strong>{"Shared by: " + userFrom}</strong> 
            </Card.Subtitle>
            <Card.Title className="fs-5 mb-2 text-multiline-truncate-2">
                {articleTitle}
            </Card.Title>

            
        </Card.Body>
        <Card.Footer className="text-muted d-flex w-100 justify-content-between">
        <Form.Check 
                className="text-muted"
                type="switch"
                id={`read-switch-${articleId}`}
                label={!read ? "unread" : "read"}
                disabled={WAS_READ}
                checked={WAS_READ}
                onChange={handleSwitchChange}
                onClick={(e) => e.stopPropagation()}
            />
        <strong>{"Sent at: " + formattedSentTime 
                + (new Date(sentAt).getDate() !== new Date().getDate() ? formattedSentDate : "")
                }</strong>
        </Card.Footer>
        </Card>
    );
};

export default ShareCard;
