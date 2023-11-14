import React, { useState } from 'react';
import axios from 'axios';
import { SuccessOutput } from './SuccessOutput';
import './MatchPopup.css'; // Ensure this path is correct
import { LoadPopup } from './LoadPopup';
import { getUserId } from '../../User/UserState'; 
import { useNavigate } from 'react-router-dom';

const MatchPopup = ({ isOpen, isClose }) => {
    const [goToLoadPopup, setGoToLoadPopup] = useState(false);
    const [showSuccessOutput, setShowSuccessOutput] = useState(false);
    const [collaboratorId, setCollaboratorId] = useState(null);
    const navigate = useNavigate();

    // States for the matching criteria
    const [chosenDifficulty, setChosenDifficulty] = useState("No Preference");
    const [chosenLanguage, setChosenLanguage] = useState("No Preference");
    const [chosenProficiency, setChosenProficiency] = useState("No Preference");
    const [chosenTopic, setChosenTopic] = useState("No Preference");

    const initiateMatching = () => {

        // Show the loading popup
        setGoToLoadPopup(true);

        const userId = getUserId();
        if (!userId) {
            console.error("User not logged in");
            setGoToLoadPopup(false); // Close the loading popup
            return;
        }

        const formatPreference = (preference) => {
            return preference === "No Preference" ? "None" : preference;
        };

        const payload = {
            userId: userId,
            difficulty: formatPreference(chosenDifficulty),
            language: formatPreference(chosenLanguage),
            proficiency: formatPreference(chosenProficiency),
            topic: formatPreference(chosenTopic)
        };

       // Make a post request to backend with the payload
       const URL = `http://localhost:3004/home/${userId}`;
       axios.post(URL, payload) // replace /${props.userId} with how we access userId
           .then(response => {
               setGoToLoadPopup(false); // Close the loading popup
               if (response.data.status === 'success') {
                   console.log("Matched with: ", response.data.collaboratorId);
                   const sessionId = response.data.sessionId;
                   const collaboratorId = response.data.collaboratorId;
                   setCollaboratorId(collaboratorId);
                   setShowSuccessOutput(true); // Triggers the SuccessOutput popup
                   // Delay navigation for 1.5 seconds
                   setTimeout(() => {
                    navigate('/collaboration', { state: { sessionId, collaboratorId, userId: getUserId() } });
                }, 1000);
               } else {
                   console.log("No match found");
                   setShowSuccessOutput(false); // SuccessOutput popup does not show
               }
//               setGoToLoadPopup(false); // Close the loading popup
           })
           .catch(error => {
               console.error("Error finding a match: ", error);
               setGoToLoadPopup(false); // Close the loading popup
           
           });
        };

   if (!isOpen) return null;

    return (
        <div className="match-popup-overlay">
            <div className="match-popup-container">
                <button className="match-popup-close" onClick={isClose}>&times;</button>
                <h2 className="match-popup-title">Find Your Perfect Match</h2>
                <div className="match-criteria-container">
                    <div className="criteria-field">
                        <label>Question Difficulty:</label>
                        <select value={chosenDifficulty} onChange={(e) => setChosenDifficulty(e.target.value)}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                    </div>
                    <div className="criteria-field">
                        <label>Language:</label>
                        <select value={chosenLanguage} onChange={(e) => setChosenLanguage(e.target.value)}>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="C++">C++</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                        </div>
                    <div className="criteria-field">
                        <label>Proficiency:</label>
                        <select value={chosenProficiency} onChange={(e) => setChosenProficiency(e.target.value)}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                        </div>
                    <div className="criteria-field">
                        <label>Topic:</label>
                        <select value={chosenTopic} onChange={(e) => setChosenTopic(e.target.value)}>
                            <option value="Sorting">Sorting</option>
                            <option value="Data Structure">Data Structure</option>
                            <option value="Optimisation">Optimisation</option>
                            <option value ="Recursion">Recursion</option>
                            <option value = "No Preference">No Preference</option>
                        </select>
                        </div>
                </div>
                <button className="match-button" onClick={initiateMatching}>Match</button>
                </div>
                {goToLoadPopup && <LoadPopup isOpen={true} isClose={() => setGoToLoadPopup(false)} />}

                {showSuccessOutput && 
                <SuccessOutput isOpen={true} isClose={() => setShowSuccessOutput(false)} />}
            </div>
    );
}

export default MatchPopup;
