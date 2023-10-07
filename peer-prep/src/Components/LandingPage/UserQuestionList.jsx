import React from 'react'
import './UserQuestionList.css'
import {UserQuestion} from "../LandingPage/UserQuestion"

export const UserQuestionList = () => {
  return (
    <div className = "q-list-container">
        {qs.map((q, index) => (
          <UserQuestion key = {index} question = {q[1]} i = {index}/>
        ))}
    </div>
  )
}
