import { useState, useEffect} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/esm/Stack";
import Image from "react-bootstrap/Image";
import MainNavbar from "../Components/MainNavBar";
import Modal from "react-bootstrap/Modal";
import "./ArticleEditorPage.css"
import { useLocation, useNavigate } from "react-router";

const ArticleEditorPage = () => {
    const location = useLocation()
    const [selectedComponent, setSelectedComponent] = useState("hideContent");
    const [title, setTitle] = useState(location.state?.title || "");
    const [articleContent, setArticleContent] = useState(location.state?.articleContent || []);
    const [edit, setEdit] = useState([]); // Starea pentru editare
    const navigate = useNavigate();
    const [articleImages, setArticleImages] = useState(location.state?.articleImages || []);

    // this is not the main component, scroll down
    const AddImage = ({ index, content = null }) => {
        const [imagePreviewUrl, setImagePreviewUrl] = useState(content);
        const [file, setFile] = useState(null)

        return (
            <Stack direction="vertical" gap={3} className="justify-content-center  me-5">

                <Stack direction="horizontal" className="justify-content-between" gap={3} >
                    <Form.Group className="w-75 mb-3 pe-5">
                        <Form.Label><b>Image</b></Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={ (e) => {
                                setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
                                setFile(e.target.files[0])
                            } }
                        />
                    </Form.Group>

                    <Button variant={content ? "outline-success" : "primary"} type="button" 
                            onClick={async () => {
                                setArticleImages([...articleImages, file])
                                console.log(file)
                                console.log(articleImages)
                                addSelectedComponent("Image", imagePreviewUrl, index)
                            }}
                            className="mt-3"    
                    >
                        {content ? "Save" : "Add Image"}
                    </Button>
                </Stack>

                {imagePreviewUrl && <Image src={imagePreviewUrl} thumbnail fluid className="w-50 p-2" />} 
                
            </Stack>    
        );
    };

    const AddHeader = ({ index, content = null }) => {
        const [header, setHeader] = useState(content || "");
        return (
            <Stack direction="horizontal" className="w-100 justify-content-between" gap={3}>
                <Form.Group className="w-75 mb-3 pe-5">
                    <Form.Label><b>Header</b></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter header"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                    />
                </Form.Group>

                <Button variant={content ? "outline-success" : "primary"} type="button" 
                        onClick={() => addSelectedComponent("h2", header, index)}
                        className="mt-3"    
                >
                    {content ? "Save" : "Add Header"}
                </Button>
            </Stack>
        );
    };

    const AddParagraph = ({ index, content = null }) => {
        const [paragraph, setParagraph] = useState(content || "");
        return (
            <Stack direction="horizontal" className="w-100 justify-content-between" gap={3}>
                <Form.Group className="w-100 mb-3 pe-2">
                    <Form.Label><b>Paragraph</b></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={7}
                        placeholder="Enter paragraph text"
                        value={paragraph}
                        onChange={(e) => setParagraph(e.target.value)}
                    />
                </Form.Group>

                <Button variant={content ? "outline-success" : "primary"} type="button" 
                        onClick={() => addSelectedComponent("p", paragraph, index)}
                        className="mt-3"    
                >
                    {content ? "Save" : "Add Paragraph"}
                </Button>
            </Stack>
        );
    };

    const renderSelectedComponent = (index, content) => {
        switch (selectedComponent) {
            case "addImage":
                return <AddImage index={index} content={content} />;
            case "addHeader":
                return <AddHeader index={index} content={content}/>;
            case "addParagraph":
                return <AddParagraph index={index} content={content}/>;
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
            setEdit([...edit, false]); // Inițializează `edit` pentru noul element
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
        else navigate("/author/upload", { state: {articleContent, title, articleImages, fromEditor: true}});
    }

    const [EDIT_MODE, SET_EDIT_MODE] = useState(false);
    const dict = {p:"addParagraph", h2: "addHeader", Image: "addImage"};

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setInnerWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
        <MainNavbar/>

        <Container fluid className="d-flex justify-content-center h-100 pt-4">
        <Row className="w-100 justify-content-center">
        <Col sm={11} md={10} lg={8} xl={6}> {/* Responsive form width */}
            <h1 className="mb-4">Article Redactation Form</h1>
            <Form className="justify-content-center">
                <Form.Group className="mb-3">
                    <Form.Label><b>Title</b></Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
            </Form>

            <Container className="justify-content-center w-100 sticky-top sticky-offset py-2 bg-white border-bottom">

                <Tabs fill defaultActiveKey="hideContent" activeKey={selectedComponent} onSelect={setSelectedComponent} className="w-100 mb-2 ">
                    <Tab eventKey="addParagraph" title="Paragraph" />
                    <Tab eventKey="addImage" title="Image" />
                    <Tab eventKey="addHeader" title="Header" />
                    <Tab eventKey="hideContent" title="Hide" />
                </Tabs>

                { EDIT_MODE ? null : renderSelectedComponent() } 
            </Container>

            <br />
            <h2>Article Preview:</h2>
            <Stack direction="vertical" gap={2} className="justify-content-center border p-3">
                <h1>{title}</h1>
                { articleContent.map( (item, index) => {
                    const Tag = item.contentType;
                    return (
                            <div key={index} className="d-flex justify-content-between py-2 border-top">
                                { edit[index] ? renderSelectedComponent(index, item.content) 
                                    : <>
                                       {
                                        Tag === "Image" ? 
                                            <Image src={item.content} alt="Article Image" thumbnail className="w-50 p-2 my-2" /> 
                                            : <Tag className="w-100 p-2 ">{item.content}</Tag>
                                       }

                                       <Stack direction={Tag === "Image" || innerWidth < 768 ? "vertical" : "horizontal"} gap={2} className="ms-3 justify-content-center">
                                        <Button variant="outline-success" type="button" 
                                            onClick={() => { 
                                                setSelectedComponent(dict[item.contentType]); 
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
