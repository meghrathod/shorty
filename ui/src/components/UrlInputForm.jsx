import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UrlInputForm = ({ url, setUrl, handleGenerate, handleDeleteClick }) => {
    // Handles the "Enter" key press inside the input box
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default form submission behavior
            handleGenerate();
        }
    };

    return (
        <Form className="mb-4 w-100">
            <Row className="mb-3 w-100">
                <Form.Group controlId="formURL" className="w-100">
                    <Form.Control
                        type="text"
                        placeholder="Enter URL to shorten or <shorty-keyword> for deletion"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        required
                    />
                    <Form.Text className="text-muted">
                        After generation, keep your PIN safe if you need to delete the URL in the future.
                    </Form.Text>
                    <Form.Label className="text-muted mt-3" >
                        You may also add <code>{"<shorty-keyword>"}</code> from <code>{import.meta.env.VITE_SERVER_DOMAIN}/{"<shorty-keyword>"}</code> for requesting URL deletion from our database.
                    </Form.Label>
                </Form.Group>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Button
                        variant="primary"
                        className="w-10"
                        onClick={handleGenerate} // Trigger Generate
                    >
                        Generate
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="danger"
                        className="w-10"
                        onClick={() => handleDeleteClick(url)} // Triggers delete modal
                    >
                        Delete
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default UrlInputForm;