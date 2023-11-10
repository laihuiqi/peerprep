import React, { useState, useEffect } from 'react'
import {UserQuestion} from "./UserQuestion"
import './UserQuestionList.css'
import axios from 'axios';

export const UserQuestionList = () => {
    const [qs, setQs] = useState([]);

    const fetchQuestions = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/questions');
           setQs(response.data);
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
          <UserQuestion key = {index} question = {q} i = {index}/>
        ))}
    </div>
  )
}
