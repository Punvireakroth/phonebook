import React from 'react';

const Info = ({ name, phoneNumber }) => {
    return (
        <div>
            <p>{name}: {phoneNumber}</p>
        </div>
    );
}

export default Info;
