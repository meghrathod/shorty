import React from 'react';
import Container from 'react-bootstrap/Container';
import UrlCard from './UrlCard.jsx';

const UrlList = ({ urls, handleDelete }) => {

    return (
        <Container
            className="scrollable-container w-75 p-3"
            hidden={urls.length === 0}
            style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
            }}
        >
            {urls.map((urlObj, index) => (
                <UrlCard  key={index} urlObj={urlObj} handleDelete={handleDelete} margin={
                    index===urls.length-1 ? '' : 'mb-3'
                } />
            ))}
        </Container>
    );
};

export default UrlList;