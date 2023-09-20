import React, { useState, useEffect } from 'react'
import { QuestionForm } from './QuestionForm'
import { Question } from './Question'
import './QuestionList.css'

import QuestionModel from '../../DataModel/QuestionModel'
import { setupQuestionDatabase, retrieveQuestionDatabase, updateLocalQuestionDatabase } from "../../Utility/localStorage"

export const Questions = () => {
  // Initializing Database
  setupQuestionDatabase();

  const [database, setDatabase] = useState(retrieveQuestionDatabase());
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [qs, setQs] = useState([])
 

  // Add a new Question
  const addQuestion = (qTitle, qDifficulty, qTopic, qDescription) => {
    // Add in Database and Upload into Storage
    let newQuestion = new QuestionModel(qId, qTitle, qDescription, qDifficulty, qTopic);
    database.addQuestion(newQuestion);
    
    updateLocalDatabase();
    updateStates();

    // setQs([...qs, {id: qId, title: qTitle, difficulty: qDifficulty,
    //   topic: qTopic, description: qDescription}]);
  }

  // Delete a Question
  const deleteQuestion = (questionId) => {
    database.deleteQuestion(questionId);

    updateLocalDatabase();
    updateStates();
  }

  // Update an existing Question
  const updateQuestion = (qId, qTitle, qDescription, qDifficulty, qTopic) => {
    let updatedQuestion = new QuestionModel(qId, qTitle, qDescription, qDifficulty, qTopic);
    database.updateQuestion(updatedQuestion);

    updateLocalDatabase();
    updateStates();
  }

  const updateLocalDatabase = () => {
    // Updating Database in Local Storage
    updateLocalQuestionDatabase(database);
  }

  const updateStates = () => {
    // Update States
    setQs(Array.from(database.database));
    setQId(Array.from(database.database).length == 0 ? 0 : Array.from(database.database).sort((a, b) => a[0] < b[0]).slice(-1)[0][0]);
  }

  // To load data on mount
  useEffect(() => {
    updateStates();
  }, [])

  return (
    
    <div className="q-wrapper">
      <div className="accordion">
        {qs.map((q, i) => (
          <Question key = {q[0]} question = {q[1]} i = {q[0]} deleteQuestion = {deleteQuestion} updateQuestion = {updateQuestion}/>
        ))}
      </div>

      {isAddQ === false ? <div></div> : 
                          <QuestionForm qId = {qId} addQuestion = {addQuestion} setAddQ = {setAddQ} setQId = {setQId}/>}
      <div className="add-q-btn" onClick = {() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
    }}> Add question</div>
    </div>
  )
}
