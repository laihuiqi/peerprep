import React, { useState, useEffect} from 'react'
import { QuestionForm } from './QuestionForm'
import './QuestionList.css'

export const Questions = () => {
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [qs, setQs] = useState([])

  const addQuestion = (qTitle, qDifficulty, qTopic, qDescription) => {
    setQs([...qs, {id: qId, title: qTitle, difficulty: qDifficulty,
      topic: qTopic, description: qDescription}]);
  }
  
  useEffect(() => console.log(qs), [qs]);

  return (
    <div className="q-wrapper">
      {isAddQ === false ? <div></div> : <QuestionForm qId = {qId} addQuestion = {addQuestion}
      setAddQ = {setAddQ}/>}
      <div className="add-q-btn" onClick = {() => {
        setQId(qId + 1);
        setAddQ(true);
      }}> Add question</div>
    </div>
    
  )
}
