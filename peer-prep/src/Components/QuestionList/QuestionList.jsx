import React, { useState, useEffect} from 'react'
import { QuestionForm } from './QuestionForm'
import {Question} from './Question'
import './QuestionList.css'

export const Questions = () => {
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [qs, setQs] = useState([])
  const toggle = (i) => {
    return i
  }

  const addQuestion = (qTitle, qDifficulty, qTopic, qDescription) => {
    setQs([...qs, {id: qId, title: qTitle, difficulty: qDifficulty,
      topic: qTopic, description: qDescription}]);
  }
  
  useEffect(() => console.log(qs), [qs]);

  return (
    
    <div className="q-wrapper">
      <div className="accordion">
        {qs.map((q, i) => (
          <Question question = {q} key = {q.id} i = {i}/>
        ))}
      </div>

      {isAddQ === false ? <div></div> : <QuestionForm qId = {qId} addQuestion = {addQuestion}
      setAddQ = {setAddQ}/>}
      <div className="add-q-btn" onClick = {() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
    }}> Add question</div>
    </div>
    
   
    
  )
}
