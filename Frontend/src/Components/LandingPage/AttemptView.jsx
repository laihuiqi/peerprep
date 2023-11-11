import React, {useState} from 'react'
import "./AttemptView.css"
import CodeEditor from '../Collaboration/CodeEditor'
import Utility from "../../Utility/Utility"

import back_icon from "../Assets/back.png"

export const AttemptView = ({attempt, setIsList}) => {
    //to be replaced with attempt.code
    const [code, setCode] = useState("# This is the code from your attempt");

    let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.complexity);

  return (
    <div className="attempt-view-container">
        <div className="back-container">
            <img src = {back_icon} className="back-button" alt = "" onClick = {() => setIsList(true)}/>
        </div>
        <div className="attempt-details-container">
            <div className="attempt-q">
                <div className="attempt-q-header">
                    <div className="attempt-q-name">{attempt.title}</div>
                    <div className="attempt-q-tags">
                        <div className={tagClass}>{attempt.complexity}</div>
                        <div className="user-q-tag">{attempt.category}</div>
                    </div>
                </div>
                <div className="attempt-q-desc">
                    {attempt.description}
                </div>
            </div>
            <div className="attempt-code">
                {/* replace language with state variable - attempt.language*/}
                <CodeEditor code={code} setCode={setCode} language={'python'} isReadOnly = {true}/>
            </div>
        </div>
    </div>
  )
}