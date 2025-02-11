import React from 'react';

const LoaderPage = ({ message }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
            {/* Loader wheel */}
            <div className="radial-progress animate-spin text-primary" style={{ "--value": 80 }}></div>
            <h1 className="text-xl mt-4">{message}</h1>
        </div>
    );
};

export default LoaderPage;
