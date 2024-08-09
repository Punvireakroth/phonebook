import React, { useState } from 'react';

const Filter = ({ type, onChange }) => {
    return (
        <div>
            filter shown with: <input
                type="text"
                onChange={onChange}
            />
        </div>

    )
}

export default Filter;