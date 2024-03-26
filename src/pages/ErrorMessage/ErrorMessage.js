import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
    return (
        <p className="error-message">{message}</p>
    );
};

export default ErrorMessage;