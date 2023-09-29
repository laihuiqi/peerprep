import { React, useState } from 'react';
import './MatchPopup.css'; 
import { LoadPopup } from './LoadPopup';

const MatchPopup = ({ isOpen, isClose, chosenDifficulty, onChosenDifficulty}) => {
    const [goToLoadPopup, setGoToLoadPopup] = useState(false);

    const handleMatchClick = () => {
      isClose();
      setGoToLoadPopup(true); 
    };
  
    if (goToLoadPopup) {
      return <LoadPopup isOpen={true} isClose={() => setGoToLoadPopup(false)} />;
    }

    if (isOpen) {
        return (
            <div className="match-overlay">
                <div className="match-popup">
                <span className="hide-popup" onClick={isClose}>&times;</span>

                <h3>Finding Your Match</h3>
                <div className="dropdown-menu">
                    <label>Question Difficulty: </label>
                    <select value={chosenDifficulty} onChange={onChosenDifficulty}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    </select>
                </div>

                <div >
                    <button onClick={handleMatchClick} className="submit-match">Match</button>
                </div>

                </div>
            </div>
        );
    } 
}

export default MatchPopup;
