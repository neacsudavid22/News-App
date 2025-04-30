import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { getUsername, shareArticle } from '../Services/userService';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import Form from "react-bootstrap/Form";

const ShareArticle = ({ show, handleClose, articleId }) => {
    const { user } = useContext(AuthContext);
    const [usernames, setUsernames] = useState([]);
    const [friends, setFriends] = useState(user?.friendList || []);

    const handleShareArticle = async (userToShareId)     => {
        try {
            const fetchResult = await shareArticle(articleId, userToShareId);
            return fetchResult;
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

    const { IS_SM } = useWindowSize();
    const [filterName, setFilterName] = useState("");

    useEffect(()=>{
        if(user && filterName !== ""){
            const tempFriends = user.friendList.filter(friend => usernames[friend].includes(filterName));
            setFriends(tempFriends);
        }
        else if(user){
            setFriends(user.friendList);
        }
    }, [user, filterName, usernames]);

    return (
        <Offcanvas show={show} onHide={handleClose} placement="bottom" className="h-75">
            <Offcanvas.Header closeButton 
                className={`w-${IS_SM ? 100 : 50} m-auto border-bottom my-2`}>
                <Form.Control type="text" className={`w-${IS_SM? 50 : 25}`} placeholder="search user" 
                    onChange={(e)=>setFilterName(e.target.value)}
                />
            </Offcanvas.Header>
            <Offcanvas.Body className={`w-${IS_SM ? 100 : 50} m-auto`}>
                <Stack gap={2}>
                {friends.map((friendId, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <strong className='fs-5'>{usernames[friendId] || "Loading..."}</strong>
                        <Button
                            className="rounded-4"
                            variant="outline-info"
                            onClick={() => {
                                const result = handleShareArticle(friendId);
                                if(result !== null)
                                    handleClose();
                            }}
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
