// components/AddHeader.js
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

const AddHeader = ({ index, content = null, addSelectedComponent }) => {
    const [header, setHeader] = useState(content || "");

    return (
        <Stack direction="vertical" className="w-100 justify-content-between" gap={3}>
            <Form.Group className="w-100 mb-3 pe-5">
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
                className="mb-1 w-auto text-nowrap"
            >
                {content ? "Save" : "Add Header"}
            </Button>
        </Stack>
    );
};

export default AddHeader;
