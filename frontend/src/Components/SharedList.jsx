import { useContext, useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername } from '../Services/userService';
import { getTitle } from '../Services/articleService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import ShareCard from './ShareCard';

const SharedList = ({ show, handleClose, setUncheckedShare }) => {
    const { user } = useContext(AuthContext);
    const [usernames, setUsernames] = useState({});
    const [titles, setTitles] = useState({});

    const shareList = (user?.shareList || []).sort(
        (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
    );

    useEffect(() => {
        setUncheckedShare(shareList.some(item => item.read === false));
    }, [shareList, setUncheckedShare]);

    useEffect(() => {
        const fetchUsernames = async () => {
            const tempUsernames = {};

            await Promise.all(
                shareList.map(async (item) => {
                    const userFrom = item.userFrom;
                    if (!tempUsernames[userFrom]) {
                        try {
                            const username = await getUsername(userFrom);
                            tempUsernames[userFrom] = username;
                        } catch {
                            tempUsernames[userFrom] = "Unknown";
                        }
                    }
                })
            );

            setUsernames(tempUsernames);
        };

        fetchUsernames();
    }, [shareList]);

    useEffect(() => {
        const fetchTitles = async () => {
            const tempTitles = {};

            await Promise.all(
                shareList.map(async (item) => {
                    const articleId = item.sharedArticle;
                    if (!tempTitles[articleId]) {
                        try {
                            const title = await getTitle(articleId);
                            tempTitles[articleId] = title;
                        } catch {
                            tempTitles[articleId] = "Unknown Title";
                        }
                    }
                })
            );

            setTitles(tempTitles);
        };

        fetchTitles();
    }, [shareList]);

    const { width } = useWindowSize();

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="start"
            className={`h-100 w-${width < 768 ? 100 : 50}`}
        >
            <Offcanvas.Header closeButton>
                <h1 className='fs-3'>Articles From Friends</h1>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={2} className='overflow-auto'>
                    {shareList.length > 0 ? (
                        shareList.map((sharedItem) => (
                            <ShareCard
                                key={sharedItem._id}
                                sharedItemId={sharedItem._id}
                                articleId={sharedItem.sharedArticle}
                                articleTitle={titles[sharedItem.sharedArticle] || "Unknown Title"}
                                sentAt={sharedItem.sentAt}
                                userFrom={usernames[sharedItem.userFrom] || "Unknown User"}
                                read={sharedItem.read || false}
                                handleClose={handleClose}
                            />
                        ))
                    ) : (
                        <p className="text-center text-muted">No article shared</p>
                    )}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SharedList;
