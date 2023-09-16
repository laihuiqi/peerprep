import React, {useState} from 'react'
import './Question.css'
import delete_icon from '../Assets/bin.png'

export const Question = ({question, i}) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        if(selected === i) {
            return setSelected(null)
        }
        setSelected(i)
    }
  return (
    <div className="question-container">
        <div className="question">
        <div className="q-header" onClick = {() => toggle(i)}>
            <div className="q-name">
                <div className="q-id">#{question.id}</div>
                <div className="q-title">{question.title}</div>
            </div>
           <span> {selected === i ? "-" : "+"}</span>
        </div>
        <div className= {selected === i ? "q-content-show": "q-content"}>
            <div className="q-tags">
                <div className="q-tag">{question.complexity}</div>
                <div className="q-tag">{question.category}</div>
            </div>
            <div className="q-description">{question.description}</div>
        </div>
       
        
    </div>
    <div className="delete-btn">
        <img src= {delete_icon} alt="" />
    </div>
    </div>
    
  )
}
