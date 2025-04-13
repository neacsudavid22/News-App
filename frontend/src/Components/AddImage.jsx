// components/AddImage.js
import { useState } from "react";
import { Button, Form, Stack, Image } from "react-bootstrap";

const AddImage = ({ index, content = null, setArticleImages, articleImages, addSelectedComponent }) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(content);
    const [file, setFile] = useState(null);

    return (
        <Stack direction="vertical" gap={3} className="justify-content-center me-5">
            <Form.Group className="w-100 mb-3 pe-5">
                <Form.Label><b>Image</b></Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
                        setFile(e.target.files[0]);
                    }}
                />
            </Form.Group>

            <Button variant={content ? "outline-success" : "primary"} type="button"
                onClick={async () => {
                    if (file !== null) {
                        setArticleImages([...articleImages, file]);
                        addSelectedComponent("Image", imagePreviewUrl, index);
                    }
                }}
                className="mb-1 w-auto text-nowrap"
            >
                {content ? "Save" : "Add Image"}
            </Button>

            {imagePreviewUrl && <Image src={imagePreviewUrl} thumbnail fluid className="w-50 p-2" />}
        </Stack>
    );
};

export default AddImage;
