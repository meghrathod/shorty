import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
    const { shortUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/${shortUrl}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    window.location.href = data.url;
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                navigate('/');
            }
        };

        fetchUrl();
    }, [shortUrl, navigate]);

    return <div>Redirecting...</div>;
};

export default RedirectHandler;