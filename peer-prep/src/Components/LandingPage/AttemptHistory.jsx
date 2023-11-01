import React, {useState, useEffect} from 'react'
import {Attempt} from "./Attempt"
import {AttemptView} from "./AttemptView"
import './AttemptHistory.css'

export const AttemptHistory = () => {
    const [attempts, setAttempts] = useState([]);
    const [isList, setIsList] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    const fetchQuestions = async () => {
        try {
          const response = await fetch('/api/questions');
          const json = await response.json()
          if (response.ok) {
            setAttempts(json);
          }
        } catch (error) {
          console.error('Error loading questions:', error);
        }
      };
    
      useEffect(() => {
        fetchQuestions();
      }, []);

  return (
    <div className="attempt-history-container">
         {isList?
            <div className="attempt-list-container">
                {attempts.map((a, index) => (
                    <Attempt key = {index} attempt = {a} i = {index} 
                    setSelectedAttempt = {setSelectedAttempt} setIsList = {setIsList}/>))}
            </div>:
            <AttemptView attempt = {selectedAttempt} setIsList = {setIsList}/>
        }
    </div>
  )
}
