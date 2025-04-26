import { useState, useEffect } from "react";
import { Button, Form, Stack, Image } from "react-bootstrap";

const AddImage = ({ index, content = null, setArticleImages, articleImages, addSelectedComponent }) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (content && !imagePreviewUrl) {
            setImagePreviewUrl(content);
        }
    }, [content, imagePreviewUrl]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImagePreviewUrl(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!imagePreviewUrl) {
            return;
        }

        if (file) {
            setArticleImages([...articleImages, file]);
        }

        await addSelectedComponent("Image", imagePreviewUrl, index);
        setImagePreviewUrl(null);
        setFile(null);
    };

    return (
        <Stack direction="vertical" gap={3} className="justify-content-center me-5">
            <Form.Group className="w-100 mb-3 pe-5">
                <Form.Label><b>Image</b></Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </Form.Group>

            <Button
                variant={content ? "outline-success" : "primary"}
                type="button"
                onClick={handleSave}
                className="mb-1 w-auto text-nowrap"
            >
                {content ? "Save" : "Add Image"}
            </Button>

            {imagePreviewUrl && (
                 <div className="w-100 d-flex justify-content-center">
                 <Image
                    src={imagePreviewUrl}
                    thumbnail="true"
                    fluid="true"
                    className="w-75 p-2 my-2" 
                    alt="Image preview"
                />
             </div>
            )}
        </Stack>
    );
};

export default AddImage;
