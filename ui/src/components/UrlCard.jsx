import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const UrlCard = ({ urlObj, handleDelete, margin }) => {
    return (
        <Card className={margin}>
            <Card.Body className={"d-flex flex-column align-items-center"}>
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
                        href={window.location.origin+"/"+urlObj.shortURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-bold text-primary"
                    >
                        {window.location.origin+"/"+urlObj.shortURL}
                    </a>
                    <br />
                    PIN: <span className="text-secondary fw-bold">{urlObj.pin}</span>
                </p>
                <div className="d-flex justify-content-center">
                    <Button
                        variant="danger"
                        size="sm"
                        className={"me-2"}
                        onClick={() => handleDelete(urlObj.shortURL, urlObj.pin)}
                    >
                        Delete
                    </Button>
                    <Button
                        variant={"info"}
                        size="sm"
                        className={"me-2"}
                        onClick={() => window.location.href = `/analytics?short_url=${urlObj.shortURL}&pin=${urlObj.pin}`}
                    >
                        View Analytics
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default UrlCard;