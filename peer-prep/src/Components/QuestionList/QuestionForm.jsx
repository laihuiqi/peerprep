import React, { useState } from 'react';
import './QuestionForm.css';
import delete_icon from '../Assets/bin.png';
import { QDifficultyDropdown } from './QDifficultyDropdown';
import { QLanguageDropdown } from './QLanguageDropdown'; 

export const QuestionForm = ({ qId, addQuestion, setAddQ, setQId, questionNumber }) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
<<<<<<< HEAD
=======
  const [language, setLanguage] = useState("SQL");
>>>>>>> eb2e6c00a34bcc8211f4445e592ad0a3be47bf7c

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
      console.log(titleError)
    } else {
      setIsDuplicateTitle(false);
    }
  };

<<<<<<< HEAD
  const handleSubmit = (toggleAddQ, addQ) => async e => {
    e.preventDefault();
    if(isEmpty(title) || isEmpty(difficulty) || isEmpty(topic) || isEmpty(description)) {
      setIsMissingField(true);
      console.log(setIsMissingField);
    } else {
      setIsMissingField(false);
      const response = await addQ(title, difficulty, topic, description);
      if(response.status === 200) {
        toggleAddQ(false);
        let res = await response.json();
        console.log(res);
      } else {
        let res = await response.json();
        console.log(res);
        setErrorVar(res.errors)
      }
    }
=======
    const response = addQ(title, difficulty, topic, description, language);
    return response; // If array length is 0, then successful, else can index through it for errors
>>>>>>> eb2e6c00a34bcc8211f4445e592ad0a3be47bf7c
  }

  function handleChosenDifficulty(e) {
    return setDifficulty(e.target.value)
  }

  return (
    <div className="form-container">
      <form className = "container" onSubmit={handleSubmit(setAddQ, addQuestion)}>
        <div className="q-form-header">
          <div className="q-form-id">#{questionNumber}</div>
          <input type="text" className="q-form-title q-form-input" 
          placeholder='Question Title' onChange = {
            (e) => setTitle(e.target.value)
          }/>
        </div>

<<<<<<< HEAD
        {isDuplicateTitle? <div className="error-text">{titleError}</div> : <div></div>}
        
=======
>>>>>>> eb2e6c00a34bcc8211f4445e592ad0a3be47bf7c
        <div className="q-form-content">
          <div className="q-form-tags">
              <QDifficultyDropdown chosenDifficulty = {difficulty} setDifficulty = {handleChosenDifficulty}/>
              <input type="text" className="q-form-tag q-form-input" 
              placeholder = 'Topic'
              onChange = {
                (e) => setTopic(e.target.value)
              }
              />
<<<<<<< HEAD
          </div>
          <textarea type="text" className="q-form-description q-form-input" 
=======
            <QLanguageDropdown chosenLanguage={language} setLanguage={(e) => setLanguage(e.target.value)} />
            </div>
            <textarea type="text" className="q-form-description q-form-input" 
>>>>>>> eb2e6c00a34bcc8211f4445e592ad0a3be47bf7c
            placeholder = "Question description"
            onChange = {
              (e) => setDescription(e.target.value)
           }/>

           {isDuplicateDesc? <div className="error-text">{descError}</div> : <div></div>}
           {isMissingField? <div className = "error-text">{missingFieldError}</div>: <div></div>}

            <div className="btn-container">
              <button type = "cancel" className="cancel-btn" onClick = {(e)=> {setAddQ(false); 
                setQId(qId - 1)}}>Cancel</button>
              <button type = "submit" className="submit-btn">Submit</button>
            </div>
        </div>
      </form>

      <div className="ghost-btn">
        <img src= {delete_icon} alt=""/>
      </div>
    </div>
  )
}
