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
import { AuthContext } from "../Components/AuthProvider";
import MainNavbar from "../Components/MainNavbar";
import { generateTagsWithLangchain, postArticle, putArticle } from "../Services/articleService";
import Modal from "react-bootstrap/esm/Modal";
import "./ArticleRedactationForm.css";
import { Gemini } from "@lobehub/icons";
import useWindowSize from "../hooks/useWindowSize";
import { Card } from "react-bootstrap";

const ArticleUploadPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const author = useContext(AuthContext).user;

    const articleContent = location.state.articleContent || [];
    const articleImages = location.state.articleImages || [];
    const title = location.state.title || "";

    const [category, setCategory] = useState(location.state?.category || "politics")
    const [tags, setTags] = useState(location.state?.tags || []);
    const [tagInput, setTagInput] = useState(""); 
    const [tagSelect, setTagSelect] = useState(""); 
    const [background, setBackground] = useState(location.state?.background || null);
    const [backgroundPreview, setBackgroundPreview] = useState(location.state?.background || null);
    const [UPLOAD_SUCCESFULL, SET_UPLOAD_SUCCESFULL] = useState(false);
    const [articleId, setArticleId] = useState(location.state?.id || null);

    const uploadImages = async () => {
        const formData = new FormData();
    
        if (typeof background !== "string") {
            formData.append("images", background);
        }
    
        articleImages.forEach((file) => {
            if (file instanceof File) {
                formData.append("images", file);
            }
        });
    
        if (formData.getAll("images").length === 0) return [];
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cloudinary-api/upload-images`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
    
            if (!response.ok) throw new Error("Image upload failed");
    
            const data = await response.json();
            return data.imageUrls;
        } catch (error) {
            console.error("Error uploading images:", error);
            return [];
        }
    };
    
    
    const handlePublish = async () => {
        try {
            const uploadedImageUrls = await uploadImages(); 
    
            let imgIndex = 0;
    
            const backgroundUrl = typeof background === "string"
                ? background
                : uploadedImageUrls[imgIndex++];
    
            const updatedContent = articleContent.map((item) => {
                if (item.contentType === "Image" && !item.content.startsWith("http")) {
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
                background: backgroundUrl,
                main: mainArticle
            };
    
            const result = articleId ? await putArticle(article, articleId) : await postArticle(article);
    
            if (result) {
                SET_UPLOAD_SUCCESFULL(true);
                localStorage.removeItem("article");
                if(result._id)setArticleId(result._id);
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

    const generateTags = async () => {
        const articleText = articleContent
            .filter(a => a.contentType === "p" || a.contentType === "h2")
            .map(a => a.content)
            .join(" ");

        const generatedTags = await generateTagsWithLangchain(articleText);

        if (generatedTags && generatedTags.length > 0) {
            setTags([...tags, ...generatedTags]);
        }
    };


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow((prev) => !prev);

    const handleBack = () => {
        navigate("/author", { state: {article: location.state} });
    }

    useEffect(() => {
        if (!location.state?.fromEditor) {
            navigate("/author", { state: {article: location.state} }); 
            return null;
        }
    }, [location.state, navigate]);

    const [mainArticle, setMainArticle] = useState(false);
    const { IS_MD } = useWindowSize();

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
                <Stack direction="horizontal" gap={2}>
                    <Button size="sm" Button variant="success" onClick={()=>navigate("/dashboard")}>
                        Go to Dashboard
                    </Button>
                    <Button size="sm" onClick={()=>navigate(`/article/${articleId}`)}>
                        See Article
                    </Button>
                </Stack> }
            </Modal.Footer>
        </Modal>

        <MainNavbar/>
        
        <Container fluid className="mt-4 border-0 pe-0">
        <Row className="w-100 justify-content-center">
        <Col sm={12} md={10} lg={8} xl={7} className=" h-100"> {/* Responsive form width */}

            <h1 className="my-4">Article Preview</h1> 

            <Stack sm={12} md={10} lg={8} xl={6} direction="vertical" gap={2} className="border p-3 overflow-y-auto h-75 mb-4">
                <h2>{title}</h2>
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
                <Form.Group className="w-100 mb-3 pe-5">
                    <Form.Label className="fs-2 fw-bold">Background</Form.Label>
                    <div className={IS_MD ? "w-100" : "w-50"}>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={ (e) => {
                            setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
                            setBackground(e.target.files[0])
                        } }
                    />
                    </div>
                </Form.Group>

                {backgroundPreview && 
                <Card className="w-100 mb-3 overflow-hidden border">
                    <Card.Body className="p-2">
                        <div className="d-flex justify-content-center my-2">
                        <Card.Text className="text-muted fs-4 mb-2">
                            This is how the background will look like on cards
                        </Card.Text>
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            <Card.Img
                                variant="top"
                                src={backgroundPreview}
                                alt="Background Preview"
                                className="w-75 rounded-3"
                                style={{
                                    height: IS_MD ? "15rem" : "20rem",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </Card.Body>
                </Card>
                }
   
            </Stack>

            <Form.Group className="border-top border-bottom d-flex flex-row justify-content-between align-items-center">
            <Form.Select aria-label="Category" onChange={(e) => setCategory(e.target.value)} className="w-50 h-25">
                <option value="politics">politics</option>
                <option value="extern">extern</option>
                <option value="finance">finance</option>
                <option value="sports">sports</option>
                <option value="tech">tech</option>
                <option value="lifestyle">lifestyle</option>
            </Form.Select>

            <Form.Check 
                className="my-4 text-nowrap"
                type="switch"
                id={`main-switch-${articleId}`}
                label={mainArticle ? "Main" : "Secondary"}
                onChange={()=>setMainArticle(prev=>!prev)}
                onClick={(e) => e.stopPropagation()}
            />
            </Form.Group>

            <Stack direction={IS_MD ? "vertical" : "horizontal"}  className="mt-4 mb-3" gap={3}>
                <Form.Control
                    type="text" 
                    placeholder="add tags" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                /> 
                <Stack gap={3} direction="horizontal" className=" justify-content-evenly">
                <Button type="button" variant="outline-success" style={{width: "120px"}} onClick={ () => addTag() }> Add</Button>
                <Button type="button" variant="outline-danger" style={{width: "120px"}} onClick={ () => removeTag() }>Remove</Button>
                <Button type="button" variant="outline-info" style={{width: "120px"}} className="text-nowrap" onClick={ () => generateTags() }>Generate <Gemini size={20}/></Button>
                </Stack>
            </Stack>

            <Tabs
                variant="pills"
                id="justify-tab-example"
                className=" mb-3 nav-pills justify-content-between"
                onSelect={(e) => setTagSelect(e)}
                onDoubleClick={ () => removeTag() }
            > {tags.map((tag) => <Tab className="m-2" eventKey={tag} title={tag}></Tab>)}
            </Tabs> 
            
            <div className="d-flex justify-content-between pt-3 border-top">
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