import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoaderPage from "./pages/LoaderPage.jsx";

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const shortUrl = queryParams.get('short_url');
    const pin = queryParams.get('pin');
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const verifyPin = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SERVER_DOMAIN}/analytics?short_url=${shortUrl}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ "pin": pin })
                    });
                if (response.ok) {
                    const data = await response.json();
                    setAnalyticsData(data);
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                setIsAuthorized(false);
            }
        };

        verifyPin();
    }, [shortUrl, pin]);

    if (isAuthorized === null) {
        return <LoaderPage message={"Loading"}/>;
    }
    if (!isAuthorized) {
        return <Navigate to="/404" state={{authFail: true}}/>;
    }

    return <Component {...rest} analyticsData={analyticsData} />;
};

export default ProtectedRoute;