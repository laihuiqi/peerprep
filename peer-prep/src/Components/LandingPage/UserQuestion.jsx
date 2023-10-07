import React from 'react'
import './UserQuestion.css'
import {useState} from 'react'

export const UserQuestion = ({question, i}) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        selected === i ? setSelected(null) : setSelected(i)
    }

    
    let tagClass = "q-tag"; 
    
    if(question.complexity) {
        if(question.complexity.toLowerCase() === "easy") {
            tagClass += " q-tag-green"
        } else if (question.complexity.toLowerCase() === "medium") {
            tagClass += " q-tag-orange"
        } else if (question.complexity.toLowerCase() === "hard") {
            tagClass += " q-tag-red"
        } else {
            tagClass += " q-tag-white"
        }
    }
    
  return (
    <div className="q-container">
        <div className="q-info">
            <div className="q-header" onClick = {() => toggle(i)}>
                <div className="q-name">
                    <div className="q-id">
                        #{i + 1}
                    </div>
                    <div className= {selected === i? "q-title-show" : "q-title"}>
                        {question.title}
                    </div>
                </div>
                <span> {selected === i? "-" : "+"} </span>
            </div>
            <div className= {selected === i? "q-show-content" : "q-content"}>
                {question.description} 
            </div>
        </div>
        <div className= {tagClass}>
            {question.complexity}
        </div>
        <div className="q-tag">
            {question.category}
        </div>
    </div>
  )
}
