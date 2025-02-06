import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NotFoundPage from "./pages/404.jsx";
import LoaderPage from "./pages/LoaderPage.jsx";


const RedirectHandler = () => {
    const { shortUrl } = useParams();
    const navigate = useNavigate();

    const ipData = {
        YourFuckingIPAddress: 'a.b.c.d',
        YourFuckingCity: 'New York, NY',
        YourFuckingCountry: 'US',
    }



    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await fetch('https://wtfismyip.com/json');
                if (response.ok) {
                    const data = await response.json();
                    ipData.YourFuckingIPAddress = data.YourFuckingIPAddress;
                    ipData.YourFuckingCity = data.YourFuckingCity;
                    ipData.YourFuckingCountry = data.YourFuckingCountry;
                    return data;
                } else {
                    return {};
                }
            } catch (error) {
                return {};
            }
        }

        const fetchUrl = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/${shortUrl}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "url": shortUrl,
                            accessTime: new Date(),
                            userAgent: navigator.userAgent,
                            ipAddress: ipData.YourFuckingIPAddress,
                            location: ipData.YourFuckingCity,
                            country: ipData.YourFuckingCountry,
                        })
                    }

                );
                if (response.ok) {
                    const data = await response.json();
                    window.location.href = data.url;
                } else {
                    navigate('/404');
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                navigate('/');
            }
        };
        fetchIp().then(() => fetchUrl());
    }, [shortUrl, navigate]);

    return <LoaderPage message={"Redirecting..."}/>;
};

export default RedirectHandler;