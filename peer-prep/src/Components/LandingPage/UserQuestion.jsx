import React from 'react'
import './UserQuestion.css'
import {useState} from 'react'

export const UserQuestion = (q, i) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        selected === i ? setSelected(null) : setSelected(i)
    }

    
    let tagClass = "q-tag"; 
    
    if(q.difficulty.toLowerCase() === "easy") {
        tagClass += " q-tag-green"
    } else if (q.difficulty.toLowerCase() === "medium") {
        tagClass += " q-tag-orange"
    } else if (q.difficulty.toLowerCase() === "hard") {
        tagClass += " q-tag-red"
    } else {
        tagClass += " q-tag-white"
    }
   

  return (
    <div className="q-container">
        <div className="q-info">
            <div className="q-header" onClick = {() => toggle(i)}>
                <div className="q-name">
                    <div className="q-id">
                        #{q.id}
                    </div>
                    <div className= {selected === i? "q-title-show" : "q-title"}>
                        {q.title}
                    </div>
                </div>
                <span> {selected === i? "-" : "+"} </span>
            </div>
            <div className= {selected === i? "q-show-content" : "q-content"}>
                {q.description} 
            </div>
        </div>
        <div className= "q-tag q-tag-green">
            {q.difficulty}
        </div>
        <div className="q-tag">
            {q.topic}
        </div>
    </div>
  )
}
