import React, { useState } from 'react'
import './QuestionForm.css'


export const QuestionForm = ({qId}) => {
  return (
    <form className = "container">
      <div className="q-header">
        <div className="q-id">#{qId}</div>
        <input type="text" className="q-title q-input" 
        placeholder='Question Title'/>
      </div>
       
        <div className="q-tags">
          <input type="text" className="q-tag q-input" placeholder = 'Difficulty'/>
          <input type="text" className="q-tag q-input" placeholder = 'Topic'/>
        </div>
        <textarea type="text" className="q-description q-input" 
        placeholder = "Question description"/>

        <div className="submit-btn">Submit</div>
   
      
    </form>
  )
}