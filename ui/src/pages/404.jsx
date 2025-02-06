import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authFail = location.state?.authFail || false;

    const handleGoHome = () => {
        navigate('/');
    };

    const renderMessage = () => {
        console.log(authFail);
        if (authFail) {
            return "Invalid PIN or the page does not exist.";
        } else {
            return "Aw, snap! Page does not exist.";
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <Row>
                <Col className="text-center">
                    <h1 className="display-1">404</h1>
                    <p className="lead">{renderMessage()}</p>
                    <Button variant="primary" onClick={handleGoHome}>Go Home</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;