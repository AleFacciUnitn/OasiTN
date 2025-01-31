"use client";
import "./adminpage.css"
import React, { useState } from 'react';


export default function Home() {


const [selectedOption, setSelectedOption] = useState(null);

const handleOptionClick = (option) => {
    setSelectedOption(option);
};

return (
    <div className="container">
        <div id="sidebar">
            <div id="admin">Admin</div>
            <div id="options" onClick={() => handleOptionClick('edit')}>Edit</div>
            <div id="options" onClick={() => handleOptionClick('segnalazioni')}>Segnalazioni</div>
        </div>
        <div id="content">
            {selectedOption === 'edit' && <div>Edit Content</div>}
            {selectedOption === 'segnalazioni' && <div>Segnalazioni Content</div>}
        </div>
    </div>
);
}