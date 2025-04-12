import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername, shareArticle } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';

const ShareArticle = ({ show, handleClose, articleId }) => {
    const { user } = useContext(AuthContext);
    const [usernames, setUsernames] = useState([]);

    const handleShareArticle = async (userToShareId) => {
        try {
            const fetchResult = await shareArticle(user._id, articleId, userToShareId);
            console.log(fetchResult);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const getUsernameFetch = async (id) => {
            try {
                const username = await getUsername(id);
                return username;
            } catch (err) {
                console.error(err);
            }
        };

        const fetchUsernames = async () => {
            const tempUsernames = {};
            await Promise.all(
                (user.friendList || []).map(async (fr) => {
                    const username = await getUsernameFetch(fr);
                    tempUsernames[fr] = username;
                })
            );
            setUsernames(tempUsernames);
        };

        if (user) fetchUsernames();
    }, [user]);

    const { width } = useWindowSize();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="bottom" className="h-50">
            <Offcanvas.Header closeButton className={`w-${width < 768 ? 100 : 50} m-auto border-bottom mb-1`}>
                <Offcanvas.Title>Share Article</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className={`w-${width < 768 ? 100 : 50} m-auto`}>
                <Stack gap={2}>
                {(user?.friendList || []).map((friendId, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <strong className='fs-5'>{usernames[friendId] || "Loading..."}</strong>
                        <Button
                            className="rounded-4"
                            variant="outline-info"
                            onClick={() => handleShareArticle(friendId)}
                        >
                           <strong>Send article</strong> <i className="ps-1 bi bi-send-fill"></i>
                        </Button>
                    </div>
                ))}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ShareArticle;
