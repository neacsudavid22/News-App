import { useContext, useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import { getTitle } from '../Services/articleService';
import ShareNotification from './ShareNotification';

const SharedList = ({ show, handleClose }) => {
    const { user } = useContext(AuthContext);
    const [usernames, setUsernames] = useState([]);
    const [titles, setTitles] = useState([]);
    const [shareList, setShareList] = useState([]);

    useEffect(() => {
        if (user?.shareList) {
            setShareList(user.shareList);
        } else {
            setShareList([]);
        }
    }, [user]);

    useEffect(() => {

        const fetchUsernames = async () => {
            const tempUsernames = {};
            await Promise.all(
                shareList.map(async (item) => {
                    const userFrom = item.userFrom;
                    if (!tempUsernames[userFrom]) {
                        const username = await getUsername(userFrom);
                        tempUsernames[userFrom] = username;
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
                    const sharedArticle = item.sharedArticle;
                    if (!tempTitles[sharedArticle]) {
                        const title = await getTitle(sharedArticle);
                        tempTitles[sharedArticle] = title;
                    }
                })
            );
            setTitles(tempTitles);
        };        

        fetchTitles();
    }, [shareList]);

    const {width} = useWindowSize();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className={`h-100 w-${width < 768 ? 100 : 50}`}>
            <Offcanvas.Header closeButton>
                <h1 className='fs-3'>Articles From Friends</h1>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={2} className='overflow-auto'>
                    {shareList.length > 0 ?
                    shareList.map((sharedItem) => (
                        <ShareNotification
                            sharedItemId={sharedItem["_id"]}
                            articleId={sharedItem["sharedArticle"]} 
                            articleTitle={titles[sharedItem["sharedArticle"]] || "Unknown Title"}
                            userFrom={usernames[sharedItem["userFrom"]] || "Unknown User"}
                            read={sharedItem["read"] || false}
                            key={sharedItem["_id"]}
                        />
                        
                        )
                    ): <p className="text-center text-muted">No article shared</p>}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SharedList;
