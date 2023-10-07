import React, { useState, useEffect } from 'react'
import {UserQuestion} from "./UserQuestion"
import './UserQuestionList.css'

export const UserQuestionList = () => {
    const [qs, setQs] = useState([]);

    const fetchQuestions = async () => {
        try {
          const response = await fetch('/api/questions');
          const json = await response.json()
          if (response.ok) {
            setQs(json);
          }
        } catch (error) {
          console.error('Error loading questions:', error);
        }
      };
    
      useEffect(() => {
        fetchQuestions();
      }, []);
  return (
    <div className = "q-list-container">
        {qs.map((q, index) => (
          <UserQuestion key ={index} question ={q} i ={index} />
        ))}
    </div>
  )
}
