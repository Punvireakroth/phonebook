import React from 'react';
import Info from './Info';
import DeleteButton from './DeleteButton';


const Person = ({ filteredInfo, onDelete }) => {

    return (
        <div>
            {filteredInfo.map((info) => (
                <div key={info.id} style={{ display: "flex", alignItems: "center" }}>
                    <Info key={info.id} name={info.name} phoneNumber={info.number} />
                    <DeleteButton onClick={() => onDelete(info.id)} />
                </div>
            ))
            }
        </div >
    );
}

export default Person;
