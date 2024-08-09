import React from 'react';

const PersonForm = ({ onSubmit, newName, newPhoneNumber, newContent, handlePerson, handleContent, onChange }) => {

    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input
                    value={newName}
                    onChange={handlePerson}
                />
            </div>
            <div>
                phone number: <input
                    value={newPhoneNumber}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
                content: <input
                    value={newContent}
                    onChange={handleContent}
                    required
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

export default PersonForm;