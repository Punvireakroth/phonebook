import React from 'react';

const ErrorNotification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className='errorMessage'>
            {message}
        </div>
    )
}

export default ErrorNotification;