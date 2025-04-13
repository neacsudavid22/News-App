import { useLocation, useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/esm/Stack";
import Image from "react-bootstrap/Image";
import { useContext, useEffect, useState } from "react";
import "./ArticleUploadPage.css";
import { AuthContext } from "../Components/AuthProvider";
import MainNavbar from "../Components/MainNavbar";
import { postArticle } from "../Services/articleService";
import Modal from "react-bootstrap/esm/Modal";

const ArticleUploadPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const author = useContext(AuthContext).user;

    const articleContent = location.state.articleContent || [];
    const articleImages = location.state.articleImages || [];
    const title = location.state.title || "";

    const [category, setCategory] = useState("politics")
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState(""); 
    const [tagSelect, setTagSelect] = useState(""); 
    const [background, setBackground] = useState();
    const [backgroundPreview, setBackgroundPreview] = useState();
    const [UPLOAD_SUCCESFULL, SET_UPLOAD_SUCCESFULL] = useState(false);
    const [articleId, setArticleId] = useState("");

    const uploadImages = async () => {
        const formData = new FormData();

        formData.append("images", background);
        articleImages.forEach((file) => {
            formData.append("images", file);
        });
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-api/upload-images`, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) throw new Error("Image upload failed");
    
            const data = await response.json(); // Expecting an array of URLs
            return data.imageUrls; // Return array of uploaded image URLs
        } catch (error) {
            console.error("Error uploading images:", error);
            return [];
        }
    };
    
    const handlePublish = async () => {
        try {
            const uploadedImageUrls = await uploadImages();
    
            let imgIndex = 0;
            const backgroundUrl = uploadedImageUrls[imgIndex++];
            const updatedContent = articleContent.map((item) => {
                if (item.contentType === "Image") {
                    return { contentType: item.contentType, content: uploadedImageUrls[imgIndex++] };
                }
                return item;
            });
    
            const article = {
                title,
                author: author._id,
                articleContent: updatedContent,
                category,
                tags,
                background: backgroundUrl
            };
    
            const result = await postArticle(article);
    
            if (result) {
                SET_UPLOAD_SUCCESFULL(true);
                localStorage.removeItem("article");
                setArticleId(result._id);
            } else {
                SET_UPLOAD_SUCCESFULL(false);
            }
    
            handleShow();
    
        } catch (error) {
            console.error("Error during article creation:", error);
            SET_UPLOAD_SUCCESFULL(false);
            handleShow();
        }
    };
    

    const removeTag = () => {
        if (tags.includes(tagSelect)) { 
            const currentTags = [...tags]
            currentTags.splice(currentTags.indexOf(tagSelect), 1)
            setTags(currentTags);
            setTagSelect(""); 
        }
    }

    const addTag = () => {
        if (tagInput.trim() !== "" && !tags.includes(tagInput)) { 
            setTags([...tags, tagInput]);
            setTagInput(""); 
        }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow((prev) => !prev);

    const handleBack = () => {
        navigate("/author", { state: {...location.state} });
    }

    useEffect(() => {
        if (!location.state?.fromEditor) {
            navigate("/author", { state: {...location.state} }); // Dacă nu vine din Author, îl redirecționezi
            return null;
        }
    }, [location.state, navigate]);

    return (
        <>
        <Modal show={show} onHide={handleClose} className="mt-4">
            <Modal.Header closeButton>
                <Modal.Title>{UPLOAD_SUCCESFULL ? "Success" : "Problem occured" }</Modal.Title> 
            </Modal.Header>

            <Modal.Body>
                <p>{UPLOAD_SUCCESFULL ? "Article Published Succesfully" : "Problem at Publishing" }</p>
            </Modal.Body>

            <Modal.Footer>
                { UPLOAD_SUCCESFULL && 
                <div>
                    <Button Button variant="success" onClick={()=>navigate("/dashboard")}>
                        Go to Dashboard
                    </Button>
                    <Button onClick={()=>navigate(`/article/${articleId}`)}>
                        See Article
                    </Button>
                </div> }
            </Modal.Footer>
        </Modal>

        <MainNavbar/>
        
        <Container fluid className="mt-4 border-0 pe-0">
        <Row className="w-100 justify-content-center">
        <Col sm={12} md={10} lg={8} xl={6} className=" h-100"> {/* Responsive form width */}

            <h1>Article Preview</h1> 

            <Stack sm={12} md={10} lg={8} xl={6} direction="vertical" gap={2} className="border p-3 overflow-y-auto h-75 mb-4">
                <h1>{title}</h1>
                { articleContent.map( (item, index) => {
                    const Tag = item.contentType
                        return (
                            <>
                                {
                                item.contentType === "Image" ? 
                                    <div key={index} className="d-flex justify-content-center">
                                        <Image src={item.content} alt="Article Image" thumbnail className="w-75 p-2 my-3" /> 
                                    </div>
                                    :
                                    <div key={index} className="d-flex justify-content-start">
                                        <Tag className="p-2 my-2">{item.content}</Tag>
                                    </div>
                                }
                            </>
                        );
                    })
                }
            </Stack>

            <Stack direction="verical" className="d-flex justify-content-center border-top py-3 mb-1" gap={3} >
                <Form.Group className="w-75 mb-3 pe-5">
                    <Form.Label><b>Background</b></Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={ (e) => {
                            setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
                            setBackground(e.target.files[0])
                        } }
                    />
                </Form.Group>

                { backgroundPreview && <Image src={backgroundPreview} thumbnail fluid className="w-75 p-2" /> }
   
            </Stack>

            <Form.Select aria-label="Category" onChange={(e) => setCategory(e.target.value)} className="w-50">
                <option value="politics">politics</option>
                <option value="extern">extern</option>
                <option value="finance">finance</option>
                <option value="sports">sports</option>
                <option value="tech">tech</option>
                <option value="lifestyle">lifestyle</option>
            </Form.Select>

            <Stack direction="horizontal" className="mt-4 mb-3" gap={3}>
                <Form.Control
                    type="text" 
                    placeholder="add tags" 
                    className="w-50" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                /> 
                <Button type="button" variant="primary" onClick={ () => addTag() }>Add</Button>
                <Button type="button" variant="danger" onClick={ () => removeTag() }>Remove</Button>
            </Stack>

            <Tabs
                variant="pills"
                id="justify-tab-example"
                className="mb-3 nav-pills"
                onSelect={(e) => setTagSelect(e)}
                onDoubleClick={ () => removeTag() }
            > {tags.map((tag) => <Tab className="m-2" eventKey={tag} title={tag}></Tab>)}
            </Tabs>
            
            <div className="d-flex justify-content-between">
            <Button variant="success" type="button" className="mb-5 text-nowrap" 
                    onClick={ handlePublish }>
                Publish Article
            </Button>
            <Button variant="danger" type="button" onClick={handleBack} className="mb-5 text-nowrap"> 
                    Go Back to Editing
            </Button>
    
            </div>
            
        </Col>
        </Row>
        </Container>
        </>
    );
}

export default ArticleUploadPage