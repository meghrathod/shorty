import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const LoaderPage = ({message}) => {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <Row>
                <Col className="text-center">
                    {/*loader wheel*/}
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h1 className="display-5 mt-2">{message}</h1>
                </Col>
            </Row>
        </Container>
    );
}

export default LoaderPage;