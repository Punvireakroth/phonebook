import React from 'react';

const TooShortNotification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className='errorMessage'>
            {message}
        </div>
    )
}

export default TooShortNotification;