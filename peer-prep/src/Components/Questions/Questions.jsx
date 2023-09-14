import React, { useState } from 'react'
import { QuestionForm } from './QuestionForm'
import './Questions.css'

export const Questions = () => {
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  return (
    <div className="q-wrapper">
      {isAddQ === false ? <div></div> : <QuestionForm qId = {qId}/>}
      <div className="add-q-btn" onClick = {() => {
        setQId(qId + 1);
        setAddQ(true);
      }}> Add question</div>
    </div>
    
  )
}
