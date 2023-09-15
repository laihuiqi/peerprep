import React, { useState } from 'react'
import './QuestionForm.css'
import delete_icon from '../Assets/bin.png'

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
    <div className="form-container">
      <form className = "container" onSubmit={handleSubmit(setAddQ, addQuestion)}>
        <div className="q-form-header">
          <div className="q-form-id">#{qId}</div>
          <input type="text" className="q-form-title q-form-input" 
          placeholder='Question Title' onChange = {
            (e) => setTitle(e.target.value)
          }/>
        </div>
        
          <div className="q-form-tags">
            <input type="text" className="q-form-tag q-form-input" 
            placeholder = 'Difficulty'
            onChange = {
              (e) => setDifficulty(e.target.value)
            }/>
            <input type="text" className="q-form-tag q-form-input" 
            placeholder = 'Topic'
            onChange = {
              (e) => setTopic(e.target.value)
            }
            />
          </div>
          <textarea type="text" className="q-form-description q-form-input" 
          placeholder = "Question description"
          onChange = {
            (e) => setDescription(e.target.value)
          }/>

          <button type = "submit" className="submit-btn">Submit</button>
      </form>
      <div className="ghost-btn">
        <img src= {delete_icon} alt=""/>
      </div>
    </div>
  )
}