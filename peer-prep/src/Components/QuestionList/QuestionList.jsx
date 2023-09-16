import React, { useState, useEffect } from 'react'
import { QuestionForm } from './QuestionForm'
import { Question } from './Question'
import './QuestionList.css'

import QuestionModel from '../../DataModel/Question'
import { setupQuestionDatabase, retrieveQuestionDatabase, updateLocalQuestionDatabase } from "../../Utility/localStorage"

export const Questions = () => {
  // Initializing Database
  setupQuestionDatabase();

  const [database, setDatabase] = useState(retrieveQuestionDatabase());
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [qs, setQs] = useState([])
  const toggle = (i) => {
    return i
  }

  const addQuestion = (qTitle, qDifficulty, qTopic, qDescription) => {
    // Add in Database and Upload into Storage
    let newQuestion = new QuestionModel(qId, qTitle, qDescription, qDifficulty, qTopic);
    database.addQuestion(newQuestion);
    updateLocalQuestionDatabase(database);

    // Update States
    setQs(Array.from(database.database));
    setQId(Array.from(database.database).length);

    // setQs([...qs, {id: qId, title: qTitle, difficulty: qDifficulty,
    //   topic: qTopic, description: qDescription}]);
  }

  // To load data on mount
  useEffect(() => {
    setQs(Array.from(database.database));
    setQId(Array.from(database.database).length);
  }, [])
  
  useEffect(() => console.log(qs), [qs]);

  return (
    
    <div className="q-wrapper">
      <div className="accordion">
        {qs.map((q, i) => (
          <Question key = {q[0]} question = {q[1]} i = {i}/>
        ))}
      </div>

      {isAddQ === false ? <div></div> : 
                          <QuestionForm qId = {qId} addQuestion = {addQuestion} setAddQ = {setAddQ}/>}
      <div className="add-q-btn" onClick = {() => {
      setQId(qId + 1);
      setAddQ(true);
    }}> Add question</div>
    </div>
  )
}
