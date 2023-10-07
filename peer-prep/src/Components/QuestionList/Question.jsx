import React, {useState} from 'react'
import './Question.css'
import delete_icon from '../Assets/bin.png'
import edit_icon from '../Assets/pencil.png'

export const Question = ({question, i, deleteQuestion, updateQuestion}) => {
    const [selected, setSelected] = useState(null);
    const [title, setTitle] = useState(question.title);
    const [difficulty, setDifficulty] = useState(question.complexity);
    const [topic, setTopic] = useState(question.category);
    const [description, setDescription] = useState(question.description)

    const toggle = (i) => {
        if (!isEdit) {
            if(selected === i) {
                setSelected(null)
            }
            setSelected(i)
        }
    };
    const [isEdit, setEdit] = useState(false);
    let tagClass = "q-tag";

    if(question.complexity.toLowerCase() === "easy") {
        tagClass += " q-tag-green"
    } else if (question.complexity.toLowerCase() === "medium") {
        tagClass += " q-tag-orange"
    } else if (question.complexity.toLowerCase() === "hard"){
        tagClass += " q-tag-red"
    } else {
        tagClass += " q-tag-white"
    }
  return (
    <div className= {isEdit ? "form-container": "question-container"}>
        <div className={isEdit ? "container": "question"}>
            <div className="q-header" onClick = {() => toggle(i)}>
                <div className="q-name">
                    <div className={isEdit ? "q-form-id": "q-id"}>#{i + 1}</div>
                    {isEdit === true? <input type="text" className="q-form-title q-form-input" defaultValue = {question.title}
                    onChange = {(e) => {setTitle(e.target.value)}}/> : 
                    <div className={selected === i ? "q-title-show": "q-title"}>{question.title}</div>}
                </div>
                <span> {selected === i ? "-" : "+"}</span>
            </div>
            
            {!isEdit 
                ? 
                <div className= {selected === i ? "q-content-show": "q-content"}>
                    <div className="q-tag-container">
                        <div className={isEdit ? "q-form-tags" : "q-tags"}>
                            {isEdit === true? <input type="text" className="q-form-tag q-form-input" defaultValue = {question.complexity} 
                            onChange = {(e) => {setDifficulty(e.target.value)}}/> : 
                            <div className= {tagClass}>{question.complexity}</div>}
                            {isEdit === true? <input type="text" className="q-form-tag q-form-input" defaultValue = {question.category}
                            onChange = {(e) => {setTopic(e.target.value)}}/> : 
                            <div className="q-tag">{question.category}</div>}
                        </div>
                        <div className="q-edit" onClick = {()=> setEdit(true)}>
                            <img src = {edit_icon} alt=""/>
                        </div>
                    </div>

                    {isEdit === true? <textarea type="text" className="q-form-description q-form-input" defaultValue = {question.description}
                    onChange = {(e) => {setDescription(e.target.value)}}/> : 
                    <div className="q-description">{question.description}</div>}
                    
                    {isEdit === true? <button className="submit-btn" 
                    onClick = {(e) => {
                        setEdit(false);
                        updateQuestion(question.id, title, description, difficulty, topic)
                        }}>Submit</button> : <div></div>}
                </div>
                : 
                <div className="q-tag-container">
                    <div className={isEdit ? "q-form-tags" : "q-tags"}>
                        {isEdit === true? <input type="text" className="q-form-tag q-form-input" defaultValue = {question.complexity} 
                        onChange = {(e) => {setDifficulty(e.target.value)}}/> : 
                        <div className= {tagClass}>{question.complexity}</div>}
                        {isEdit === true? <input type="text" className="q-form-tag q-form-input" defaultValue = {question.category}
                        onChange = {(e) => {setTopic(e.target.value)}}/> : 
                        <div className="q-tag">{question.category}</div>}
                    </div>
                </div>}

            {isEdit === true? <textarea type="text" className="q-form-description q-form-input" defaultValue = {question.description}
            onChange = {(e) => {setDescription(e.target.value)}}/> : null}
            
            {isEdit === true? 
            <div className="btn-container">
                <button className="submit-btn" 
            onClick = {(e) => {
                setEdit(false);
                updateQuestion(question.id, title, description, difficulty, topic)
                }}>Submit</button> </div> : null}
            
        </div>
        <div className="delete-btn" onClick = {(e) => deleteQuestion(question.id)}>
            <img src= {delete_icon} alt="" />
        </div>
    </div>
    
  )
}
