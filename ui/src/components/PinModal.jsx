// PinModal.jsx
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PinModal = ({ show, handleClose, url, pin, setPin, handleConfirmDelete }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You are about to delete the shortened URL <strong>if it exists</strong>:
                    <br />
                    <a href={import.meta.env.VITE_SERVER_DOMAIN+"/"+url}>{import.meta.env.VITE_SERVER_DOMAIN}/{url}</a>
                </p>
                <p>Enter the PIN associated with this shortened URL to confirm deletion:</p>
                <Form.Group controlId="pinInput">
                    <Form.Control
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        handleConfirmDelete(); // Call the confirm delete function
                    }}
                >
                    Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PinModal;