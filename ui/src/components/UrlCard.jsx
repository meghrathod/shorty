// UrlCard.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


const UrlCard = ({ urlObj, handleDelete }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <p>
                    Original URL:{" "}
                    <a
                        href={urlObj.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-underline fw-bold"
                    >
                        {urlObj.originalUrl}
                    </a>
                    <br />
                    Shortened:{" "}
                    <a
                        href={import.meta.env.VITE_SERVER_DOMAIN+"/"+urlObj.shortURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-bold text-primary"
                    >
                        {import.meta.env.VITE_SERVER_DOMAIN+"/"+urlObj.shortURL}
                    </a>
                    <br />
                    PIN: <span className="text-secondary fw-bold">{urlObj.pin}</span>
                </p>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(urlObj.shortURL, urlObj.pin)}
                >
                    Delete
                </Button>
            </Card.Body>
        </Card>
    );
};

export default UrlCard;