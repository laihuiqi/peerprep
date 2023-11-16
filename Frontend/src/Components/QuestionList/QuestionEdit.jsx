import React, { useState } from 'react';
import './QuestionEdit.css';
import { QDifficultyDropdown } from './QDifficultyDropdown';
import { QLanguageDropdown } from './QLanguageDropdown'; 
import { QTopicDropdown } from './QTopicDropdown'; 

import delete_icon from '../Assets/bin.png';

export const QuestionEdit = ({ q, index, updateQ, setEdit }) => {
    const [title, setTitle] = useState(q.title);
    const [difficulty, setDifficulty] = useState(q.complexity);
    const [topic, setTopic] = useState(q.category);
    const [description, setDescription] = useState(q.description);
    const [language, setLanguage] = useState(q.language);

    const [isDuplicateTitle, setIsDuplicateTitle] = useState(true);
    const [isDuplicateDesc, setIsDuplicateDesc] = useState(false);
    const [isMissingField, setIsMissingField] = useState(false);

    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");
    const [missingFieldError, setMissingFieldError] = useState("Please fill all fields!")


    const isEmpty = (str) => {
        return str === ""
    };

    const setErrorVar = (errors) => {
        if('duplicateDescription' in errors) {
        setIsDuplicateDesc(true);
        setDescError(errors.duplicateDescription)
        } else {
        setIsDuplicateDesc(false);
        }
        
        if('duplicateTitle' in errors) {
        setIsDuplicateTitle(true);
        setTitleError(errors.duplicateTitle);
        } else {
        setIsDuplicateTitle(false);
        }
    };

    const handleSubmit = async (toggleEdit, editQ) => {
        // e.preventDefault();
        if(isEmpty(title) || isEmpty(difficulty) || isEmpty(topic) || isEmpty(description)) {
            setIsMissingField(true);
        } else {
        
            setIsMissingField(false);

            const response = await editQ(q._id, title, description, difficulty, topic, language);
            
            if(response.status === 200) {
                toggleEdit(false);
            } else {
                let res = await response.json();
                setErrorVar(res.errors)
            }
        }
    }

    function handleChosenDifficulty(e) {
        return setDifficulty(e.target.value);
    }

  return (
    <div className= "form-container">
        <div className="container">
            <div className="q-form-header">
                <div className="q-form-name">
                    <div className="q-form-id">#{index + 1}</div>
                    <input type="text" className="q-form-title q-form-input" defaultValue = {q.title}
                    onChange = {(e) => {setTitle(e.target.value)}}/> 
                </div>
                <span> - </span>
            </div>

            {isDuplicateTitle? <div className="error-text">{titleError}</div> : <div></div>}
            
            <div className="q-form-content">
                <div className="q-form-tags-container">
                    <div className= "q-form-tags">
                        <QDifficultyDropdown chosenDifficulty = {difficulty} setDifficulty = {handleChosenDifficulty}/>
                        <QTopicDropdown chosenTopic={topic} setTopic={(e) => setTopic(e.target.value)} />
                        <QLanguageDropdown chosenLanguage={language} setLanguage={(e) => setLanguage(e.target.value)}/>
                </div>
            </div>

            <textarea type="text" className="q-form-description q-form-input" defaultValue={q.description}
            onChange={(e) => {setDescription(e.target.value);}}/>

           {isDuplicateDesc? <div className="error-text">{descError}</div> : <div></div>}
           {isMissingField? <div className = "error-text">{missingFieldError}</div>: <div></div>}

            <div className="btn-container">
                    <button type = "cancel" className="cancel-btn" onClick = {(e)=> {setEdit(false)}}>Cancel</button>
                    <button className="submit-btn" onClick = {(e) => {
                        e.preventDefault();
                        handleSubmit(setEdit, updateQ);
                    }}>Submit
                    </button> 
                </div> 
            </div>


        </div>
        <div className="delete-btn">
                <img src= {delete_icon} alt="" />
        </div>
    </div>
  )
}
