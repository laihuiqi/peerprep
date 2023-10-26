import React from 'react';
import './MatchPopup.css'; 
import { useEffect, useState } from 'react';

const MatchPopup = ({ isOpen, isClose, chosenDifficulty, onChosenDifficulty, onSubmission}) => {
    if (isOpen) {
        return (
            <div className="match-overlay">
                <div className="match-popup">
                <span className="hide-popup" onClick={isClose}>&times;</span>

                <h3>Finding Your Match</h3>
                <div className="dropdown-menu">
                    <label>Difficulty Level of Questions: </label>
                    <select value={chosenDifficulty} onChange={onChosenDifficulty}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    </select>
                </div>

                <div >
                    <button onClick={onSubmission} className="submit-match">Match</button>
                </div>
                </div>
            </div>
        );
    } 
}

export default MatchPopup;
