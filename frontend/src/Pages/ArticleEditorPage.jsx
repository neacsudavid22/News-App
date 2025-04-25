import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/esm/Stack";
import Image from "react-bootstrap/Image";
import MainNavbar from "../Components/MainNavbar";
import Modal from "react-bootstrap/Modal";
import useWindowSize from "../hooks/useWindowSize";
import AddImage from "../Components/AddImage";
import AddHeader from "../Components/AddHeader";
import AddParagraph from "../Components/AddParagraph";
import { useLocation, useNavigate, } from "react-router";
import "./ArticleRedactationForm.css";

const ArticleEditorPage = () => {
    const location = useLocation();
    const article = location.state?.article || null;
    const [selectedComponent, setSelectedComponent] = useState("hideContent");

    const [title, setTitle] = useState(article?.title ||  "");
    const [articleContent, setArticleContent] = useState(article?.articleContent || []);
    const [articleImages, setArticleImages] = useState(article?.articleImages || []);
    const [edit, setEdit] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    if (article !== null) {
        setEdit(new Array(articleContent.length).fill(false));
    }
    }, [article, articleContent.length]);

    const renderSelectedComponent = (contentType, index, content) => {
        switch (contentType) {
            case "Image":
                return <AddImage index={index} content={content} articleImages={articleImages} setArticleImages={setArticleImages} addSelectedComponent={addSelectedComponent} />;
            case "h2":
                return <AddHeader index={index} content={content} addSelectedComponent={addSelectedComponent} />;
            case "p":
                return <AddParagraph index={index} content={content} addSelectedComponent={addSelectedComponent} />;
            case "hideContent":
                return;
            default:
                return;
        }
    };

    const addSelectedComponent = (contentType, content, index) => {
        if(contentType !=="Image") content = content.trim();

        if (content !== "" && index === undefined) {
            setArticleContent([...articleContent, { contentType, content }]);
            setEdit([...edit, false]); 
        } else if(content !== "" && index !== undefined){ 
            const newArticle = [...articleContent];
            newArticle[index] = { contentType, content };
            setArticleContent(newArticle);
            handleEdit(index)
        }
        return 0;   
    };

    const removeSelectedComponent = (index) => {

            if(articleContent[index].contentType === "Image"){
                const images = [...articleImages];
                images.splice(index, 1);
                setArticleImages(images);
            }

            const newArticle = [...articleContent];
            newArticle.splice(index, 1)
            setArticleContent(newArticle);

            const newEdit = [...edit]
            newEdit.splice(index, 1)
            setEdit(newEdit)

            console.log(articleImages)
    };
    
    const handleEdit = (index) => {
        const newEdit = [...edit]; // Creează un nou array (evită mutația directă)
        newEdit[index] = !newEdit[index]; // Inversează starea pentru elementul respectiv
        setEdit(newEdit); // Setează noua stare
        SET_EDIT_MODE(!EDIT_MODE);
    };

    const handleSubmit = () => {
        if(title.length < 10) handleShow()
        else navigate("/author/upload", { state: {
                                                articleContent,
                                                title,
                                                articleImages, 
                                                fromEditor: true,
                                                id: article?._id || null ,
                                                background: article?.background
                                            }
                                        });
    }

    const [EDIT_MODE, SET_EDIT_MODE] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {width} = useWindowSize();

    return (
        <>
        <MainNavbar/>

        <Container fluid className="d-flex justify-content-center h-100 pt-4">
        <Row className="w-100 justify-content-center">
        <Col sm={11} md={10} lg={8} xl={8}>
            <Form className="justify-content-center">
                <Form.Group className="mb-3">
                    <Form.Label><h2>Article Title</h2></Form.Label>
                    <Form.Control type="text" placeholder="Enter article title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
            </Form>

            <Container className="justify-content-center sticky-offset py-2 bg-white border-bottom">

                <Tabs fill defaultActiveKey="hideContent" activeKey={selectedComponent} onSelect={setSelectedComponent} 
                    className="w-100 mb-2 ">
                    <Tab eventKey="p" title="Paragraph" />
                    <Tab eventKey="Image" title="Image" />
                    <Tab eventKey="h2" title="Header" />
                    <Tab eventKey="hideContent" title="Hide" />
                </Tabs>

                {EDIT_MODE ? null : renderSelectedComponent(selectedComponent)}
            </Container>

            <br />
            <h2>Article Preview:</h2>
            <Stack direction="vertical" gap={2} className="justify-content-center border p-3">
                <h1>{title}</h1>
                { articleContent.map( (item, index) => {
                    const Tag = item.contentType;
                    return (
                            <div key={index} className="d-flex justify-content-between py-2 border-top">
                                { edit[index] ? renderSelectedComponent(item.contentType, index, item.content) 
                                    : <>
                                       {
                                        Tag === "Image" ? 
                                            <Image src={item.content} alt="Article Image" thumbnail className="w-50 p-2 my-2" /> 
                                            : <Tag className="w-100 p-2 ">{item.content}</Tag>
                                       }

                                       <Stack direction={Tag === "Image" || width < 768 ? "vertical" : "horizontal"} gap={2} className="ms-3 justify-content-center">
                                        <Button variant="outline-success" type="button" 
                                            onClick={() => { 
                                                handleEdit(index); 
                                            }}>Modify
                                        </Button>
                                        <Button variant="danger" type="button" 
                                            onClick={() => { 
                                                removeSelectedComponent(index); 
                                            }}>Remove</Button>
                                        </Stack>
                                    </> }
                            </div>
                        );
                    })
                }
            </Stack>

            <Button variant="primary" type="button" className="my-4" onClick={handleSubmit}>
                Next
            </Button>
        </Col>
        </Row>
        </Container>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Title error</Modal.Title>
            </Modal.Header>
            <Modal.Body>The title should be at least 10 characters long</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </>  
    );
};

export default ArticleEditorPage;
