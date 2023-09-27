import React, { useState } from 'react';
import MatchPopup from './MatchPopup'; 
import './MatchButton.css';

export const MatchButton = ({}) => {
    const [chosenDifficulty, setChosenDifficulty] = useState('easy'); 
    const [viewPopup, setViewPopup] = useState(false);

    function hidePopup() {
        return setViewPopup(false);
    }

    function openPopup() {
        return setViewPopup(true)
    }

    function handleChosenDifficulty(event) {
        return setChosenDifficulty(event.target.value)
    }
    return(
    <div className="match-button-container">
        <button onClick = {openPopup} className="find-match-button">
            Find your Match
        </button>

        <MatchPopup 
        isOpen={viewPopup}
        isClose={hidePopup}
        chosenDifficulty={chosenDifficulty}
        onChosenDifficulty={handleChosenDifficulty}
        ></MatchPopup>
    </div>
    );
}