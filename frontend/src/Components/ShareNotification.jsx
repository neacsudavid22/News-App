import { useNavigate } from "react-router";
import { Card, Form } from "react-bootstrap";
import "./textMultilineTruncate.css";
import { useState } from "react";
import { toggleShareRead } from "../Services/userService";

const ShareNotification = ({ sharedItemId, articleId, articleTitle, userFrom, read }) => {
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

    return (
        <Card
            onClick={handleNavigation}
            className={`shadow-sm border-1 hover-shadow transition mb-2 ${WAS_READ ? 'bg-light' : ''}`}
            style={{ cursor: "pointer" }}
        >
        <Card.Body className="d-flex flex-column align-items-start">
            <Card.Subtitle className="mb-2 text-muted">
                Shared by: <strong>{userFrom}</strong>
            </Card.Subtitle>
            <Card.Title className="fs-5 mb-2 text-multiline-truncate-2">
                {articleTitle}
            </Card.Title>

            <Form.Check 
                type="switch"
                id={`read-switch-${articleId}`}
                label={!read ? "Mark as read" : "Article Read"}
                disabled={WAS_READ}
                checked={WAS_READ}
                onChange={handleSwitchChange}
                onClick={(e) => e.stopPropagation()}
            />
        </Card.Body>

        </Card>
    );
};

export default ShareNotification;
