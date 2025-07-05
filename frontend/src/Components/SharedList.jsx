import { useContext, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './AuthProvider';
import { Stack } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import ShareCard from './ShareCard';

const SharedList = ({ show, handleClose, setUncheckedShare }) => {
    const { user } = useContext(AuthContext);

    const shareList = (user?.shareList || []).sort(
        (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
    );

    useEffect(() => {
        setUncheckedShare(shareList.some(item => item.read === false));
    }, [shareList, setUncheckedShare]);


    const { IS_SM } = useWindowSize();

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="start"
            className={`h-100 w-${IS_SM ? 100 : 50}`}
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
                                articleTitle={sharedItem.sharedArticle.title || "Unknown Title"}
                                sentAt={sharedItem.sentAt}
                                userFrom={sharedItem.userFrom.username || "Unknown User"}
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
