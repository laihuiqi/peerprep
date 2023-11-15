import React, {useState} from 'react'
import "./AttemptView.css"
import CodeEditor from '../Collaboration/CodeEditor'
import Utility from "../../Utility/Utility"

import back_icon from "../Assets/back.png"

const {getCollaborativeInput} = require("../../../../CollaborationService/database/collaborativeInputDb");

export const AttemptView = ({attempt, setIsList}) => {
    //to be replaced with attempt.code
    const [code, setCode] = useState("#Here is the code from your attempt");
    const [lang, setLang] = useState("python")

    let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.complexity);

    const fetchCode = async () => {
        const collaborativeInput = await getCollaborativeInput(attempt.sessionId);
        setCode(collaborativeInput[2]);
        setLang(collaborativeInput[1]);
    }

    useEffect(() => {
        fetchCode();
    }, [])

  return (
    <div className="attempt-view-container">
        <div className="back-container">
            <img src = {back_icon} className="back-button" alt = "" onClick = {() => setIsList(true)}/>
        </div>
        <div className="attempt-details-container">
            <div className="attempt-q">
                <div className="attempt-q-header">
                    <div className="attempt-q-name">{attempt.questionTitle}</div>
                    <div className="attempt-q-tags">
                        <div className={tagClass}>{attempt.questionComplexity}</div>
                        <div className="user-q-tag">{attempt.questionCategory}</div>
                    </div>
                </div>
                <div className="attempt-q-desc">
                    {attempt.questionDescription}
                </div>
            </div>
            <div className="attempt-code">
                {/* replace language with state variable - attempt.language*/}
                <CodeEditor code={code} setCode={setCode} language={lang} isReadOnly = {true}/>
            </div>
        </div>
    </div>
  )
}