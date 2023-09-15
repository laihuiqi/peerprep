import React, {useState} from 'react'
import './Question.css'
import delete_icon from '../Assets/bin.png'
import edit_icon from '../Assets/pencil.png'

export const Question = ({question, i}) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        if(selected === i) {
            return setSelected(null)
        }
        setSelected(i)
    };
    let tagClass = "q-tag";

    if(question.difficulty.toLowerCase() === "easy") {
        tagClass += " q-tag-green"
    } else if (question.difficulty.toLowerCase() === "medium") {
        tagClass += " q-tag-orange"
    } else if (question.difficulty.toLowerCase() === "hard"){
        tagClass += " q-tag-red"
    } else {
        tagClass += " q-tag-white"
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
            <div className="q-tag-container">
                <div className="q-tags">
                    <div className= {tagClass}>{question.difficulty}</div>
                    <div className="q-tag">{question.topic}</div>
                </div>
                <div className="q-edit">
                    <img src = {edit_icon} alt=""/>
                </div>
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
