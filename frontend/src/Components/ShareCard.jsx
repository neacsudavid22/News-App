import { useNavigate } from "react-router";
import { Card, Form } from "react-bootstrap";
import "./textMultilineTruncate.css";
import { useContext, useState } from "react";
import { markAsRead } from "../Services/userService";
import { AuthContext } from "./AuthProvider";

const ShareCard = ({ sharedItemId, articleId, articleTitle, userFrom, read, sentAt, handleClose }) => {
    const { getAuthUser } = useContext(AuthContext);
    const [wasRead, setWasRead] = useState(read);
    const navigate = useNavigate();

    const handleSwitchChange = async () => {
        const result = await markAsRead(sharedItemId);
        if (!result.error) {
            setWasRead(true);
            await getAuthUser();
        } else {
            console.warn("Could not mark as read:", result.message);
        }
    };

    const handleNavigation = async () => {
        if(articleTitle === "Removed article")
            return;
        handleClose();
        if (!wasRead) await handleSwitchChange();
        navigate("/article/" + articleId);
        window.location.reload();
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

    const isToday = new Date(sentAt).toDateString() === new Date().toDateString();

    return (
        <Card
            onClick={handleNavigation}
            className={`shadow-sm border-1 hover-shadow transition mb-2 ${wasRead ? 'bg-light' : ''}`}
            style={{ cursor: "pointer" }}
            disabled={articleTitle === "Removed article"}
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
                    label={wasRead ? "read" : "unread"}
                    disabled={wasRead}
                    checked={wasRead}
                    onChange={handleSwitchChange}
                    onClick={(e) => e.stopPropagation()}
                />
                <strong>{"Sent at: " + formattedSentTime + (isToday ? "" : ` (${formattedSentDate})`)}</strong>
            </Card.Footer>
        </Card>
    );
};

export default ShareCard;
