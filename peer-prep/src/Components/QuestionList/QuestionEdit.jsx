import React, {useState} from 'react'
import './QuestionEdit.css'

import delete_icon from '../Assets/bin.png'

export const QuestionEdit = ({q, index, updateQ, setEdit}) => {
    const [title, setTitle] = useState(q.title);
    const [difficulty, setDifficulty] = useState(q.complexity);
    const [topic, setTopic] = useState(q.category);
    const [description, setDescription] = useState(q.description)
  
  return (
    <div className= "edit-container">
        <div className="edit-q-container">
            <div className="edit-q-header">
                <div className="edit-q-name">
                    <div className="edit-q-id">#{index + 1}</div>
                    <input type="text" className="edit-q-title edit-q-input" defaultValue = {q.title}
                    onChange = {(e) => {setTitle(e.target.value)}}/> 
                </div>
                <span> - </span>
            </div>
            
            <div className="edit-q-content">
                <div className="edit-q-tags-container">
                    <div className= "edit-q-tags">
                        <input type="text" className="edit-q-tag edit-q-input" defaultValue = {q.complexity} 
                        onChange = {(e) => {setDifficulty(e.target.value)}}/> 
                        <input type="text" className="edit-q-tag edit-q-input" defaultValue = {q.category}
                        onChange = {(e) => {setTopic(e.target.value)}}/> 
                    </div>
                </div>
               
            
                <textarea type="text" className="edit-q-description edit-q-input" defaultValue = {q.description}
                onChange = {(e) => {setDescription(e.target.value)}}/> 
                
                <div className="edit-btn-container">
                    <button type = "cancel" className="edit-cancel-btn" onClick = {(e)=> {setEdit(false)}}>Cancel</button>
                    <button className="edit-submit-btn" onClick = {(e) => {
                    setEdit(false);
                    updateQ(q._id, title, description, difficulty, topic)
                    }}>Submit
                    </button> 
                </div> 
            </div>
            
            
        </div>
        <div className="edit-delete-btn">
                <img src= {delete_icon} alt="" />
        </div>
    </div>
  )
}
