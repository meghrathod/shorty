import React from 'react';

const AlertComponent = ({ alert, onClose }) => {
    if (!alert.show) return null;

    const alertClasses = {
        success: 'alert-success',
        danger: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`alert ${alertClasses[alert.variant]} shadow-lg`}>
                <div>
                    <span>{alert.message}</span>
                    <button className="btn btn-circle btn-xs" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertComponent;
