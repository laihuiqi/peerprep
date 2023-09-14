import React, { useState } from 'react'
import './QuestionForm.css'


export const QuestionForm = ({qId, addQuestion, setAddQ}) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("")

  const handleSubmit = (toggleAddQ, addQ) => e => {
    e.preventDefault();
    toggleAddQ(false);
    addQ(title, difficulty, topic, description)
  }
  return (
    <form className = "container" onSubmit={handleSubmit(setAddQ, addQuestion)}>
      <div className="q-header">
        <div className="q-id">#{qId}</div>
        <input type="text" className="q-title q-input" 
        placeholder='Question Title' onChange = {
          (e) => setTitle(e.target.value)
        }/>
      </div>
       
        <div className="q-tags">
          <input type="text" className="q-tag q-input" 
          placeholder = 'Difficulty'
          onChange = {
            (e) => setDifficulty(e.target.value)
          }/>
          <input type="text" className="q-tag q-input" 
          placeholder = 'Topic'
          onChange = {
            (e) => setTopic(e.target.value)
          }
          />
        </div>
        <textarea type="text" className="q-description q-input" 
        placeholder = "Question description"
        onChange = {
          (e) => setDescription(e.target.value)
        }/>

        <button type = "submit" className="submit-btn">Submit</button>
   
      
    </form>
  )
}