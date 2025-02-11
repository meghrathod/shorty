import React from 'react';

const AlertComponent = ({ alert, onClose }) => {
    if (!alert.show) return null;

    const alertClasses = {
        success: 'alert-success',
        danger: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    const svgs = {
        success: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7" />
            </svg>
        ),
        danger: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4v.01" />
            </svg>
        ),
        info: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4v.01" />
            </svg>
        )
    }

    return (
        <div role="alert" className={`alert ${alertClasses[alert.variant]} fixed top-4 flex items-center space-x-1 p-2`}>
            {svgs[alert.variant]}
            <span>{alert.message}</span>
            <button
                className="btn btn-ghost btn-square"
                onClick={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default AlertComponent;
