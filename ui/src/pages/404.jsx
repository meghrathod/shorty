import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <Row>
                <Col className="text-center">
                    <h1 className="display-1">404</h1>
                    <p className="lead">Page Not Found</p>
                    <Button variant="primary" onClick={handleGoHome}>Go Home</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;