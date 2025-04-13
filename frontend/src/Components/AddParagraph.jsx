// components/AddParagraph.js
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

const AddParagraph = ({ index, content = null, addSelectedComponent }) => {
    const [paragraph, setParagraph] = useState(content || "");

    return (
        <Stack direction="vertical" className="w-100 justify-content-between" gap={3}>
            <Form.Group className="w-100 mb-3 pe-2">
                <Form.Label><b>Paragraph</b></Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter paragraph text"
                    value={paragraph}
                    onChange={(e) => setParagraph(e.target.value)}
                />
            </Form.Group>

            <Button variant={content ? "outline-success" : "primary"} type="button"
                onClick={() => addSelectedComponent("p", paragraph, index)}
                className="mb-1 w-auto text-nowrap"
            >
                {content ? "Save" : "Add Paragraph"}
            </Button>
        </Stack>
    );
};

export default AddParagraph;
