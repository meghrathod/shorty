import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

const AnalyticsPage = ({ analyticsData }) => {
    const { urlDetails, analytics } = analyticsData;

    return (
        <Container className={"mt-4"}>
            <Card className="mb-4 w-50 mx-auto align-items-center">
                <Card.Body>
                    <Card.Title className="align-text-center">URL Details</Card.Title>
                    <Card.Text>Short URL: <a href={window.location.origin+"/"+urlDetails.shortURL}>{window.location.origin+"/"+urlDetails.shortURL}</a></Card.Text>
                    <Card.Text>Redirect URL: <a href={urlDetails.url}>{urlDetails.url}</a></Card.Text>
                    <Card.Text>Creation Date: {new Date(urlDetails.dateCreated).toLocaleString()}</Card.Text>
                    <Card.Text>PIN: {urlDetails.pin}</Card.Text>
                </Card.Body>
            </Card>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Access Time</th>
                    <th>User Agent</th>
                    <th>IP Address</th>
                    <th>Location</th>
                    <th>Country</th>
                </tr>
                </thead>
                <tbody>
                {analytics.map((log, index) => (
                    <tr key={index}>
                        <td>{new Date(log.accessTime).toLocaleString()}</td>
                        <td>{log.userAgent}</td>
                        <td>{log.ipAddress}</td>
                        <td>{log.location}</td>
                        <td>{log.country}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AnalyticsPage;