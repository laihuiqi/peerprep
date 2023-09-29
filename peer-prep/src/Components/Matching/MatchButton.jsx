import React, { useState } from 'react';
import MatchPopup from './MatchPopup'; 
import './MatchButton.css';

export const MatchButton = ({}) => {
    const [chosenDifficulty, setChosenDifficulty] = useState('easy'); 
    const [viewPopup, setViewPopup] = useState(false);

    return(
    <div className="match-button-container">
        <button onClick = {() => setViewPopup(true)} className="find-match-button">
            Find your Match
        </button>

        <MatchPopup 
        isOpen={viewPopup}
        isClose={() => setViewPopup(false)}
        chosenDifficulty={chosenDifficulty}
        onChosenDifficulty={(event)=>setChosenDifficulty(event.target.value)}
        ></MatchPopup>
    </div>
    );
}
