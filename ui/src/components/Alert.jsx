// Alert.jsx
import React from 'react';
import Alert from 'react-bootstrap/Alert';

const AlertComponent = ({ alert, onClose }) => {
    return (
        alert.show && (
            <Alert
                variant={alert.variant}
                onClose={onClose}
                dismissible
                className="position-fixed mt-5 top-0 start-50 translate-middle"
            >
                {alert.message}
            </Alert>
        )
    );
};

export default AlertComponent;