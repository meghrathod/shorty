import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

const AnalyticsPage = () => {
    // find the shortUrl parameter lis in the URL
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const shortUrl = queryParams.get('short_url');


    const [urlDetails, setUrlDetails] = useState({});
    const [accessLogs, setAccessLogs] = useState([
        {
            accessTime: new Date(),
            userAgent: '',
            ipAddress: '',
            location: '',
            country: ''
        }
    ]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/analytics?short_url=${shortUrl}`);
                if (response.ok) {
                    const data = await response.json();
                    setUrlDetails(data.urlDetails);
                    setAccessLogs(data.analytics);
                } else {
                    console.error('Error fetching analytics data');
                }
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalytics()
    }, [shortUrl]);

    // const urlDetails = {
    //     shortUrl: 'http://localhost:3000/abc123',
    //     longUrl: 'https://example.com',
    // }

    // const accessLogs = [
    //     {
    //         accessTime: new Date(),
    //         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //         ipAddress: 'a.b.c.d',
    //         location: 'New York, NY',
    //         country: 'US'
    //     },
    //     {
    //         accessTime: new Date(),
    //         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //         ipAddress: 'a.b.c.d',
    //         possibleLocation: 'New York, NY',
    //         country: 'US'
    //     },
    // ];

    return (
        <Container>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>URL Details</Card.Title>
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
                    {accessLogs.map((log, index) => (
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