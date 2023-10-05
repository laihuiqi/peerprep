import React from 'react'
import './UserProfile.css'
import {useState} from 'react'

import edit_icon from "../Assets/pencil.png"

export const UserProfile = (user) => {
    const [isEdit, setEdit] = useState(false);
    const [name, setName] = useState("David Rose");
    const [lang, setLang] = useState("Python");

    const updateProfile = (name, lang) => {
        console.log(name, lang)
    }

  return (
    <div className="profile-container">
        <div className="edit-container">
            <img src = {edit_icon} className="profile-edit" alt = "" onClick = {()=> setEdit(true)}/>
        </div>
        
        <div className="profile-section">
            <div className="profile-info">
                <div className="profile-field">
                    Name
                </div>
                {isEdit? 
                <input type="text" className="profile-input" defaultValue = "David Rose"
                    onChange = {(e) => {setName(e.target.value)}}/> :
                <div className = "profile-detail">
                    David Rose
                </div>}
                
            </div>
            <div className="profile-info">
                <div className="profile-field">
                    Email id/Github Username
                </div>
                <div className="profile-detail">
                    david101
                </div>
            </div>
            <div className="profile-info">
                <div className="profile-field">
                    Preferred Language
                </div>
                {isEdit? 
                <input type="text" className="profile-input" defaultValue = "Python"
                    onChange = {(e) => {setLang(e.target.value)}}/> :
                <div className = "profile-detail">
                    Python
                </div>}
               
            </div>
        </div>

        {isEdit?
        <div className="profile-submit-container">
             <button className="submit-btn" 
            onClick = {(e) => {
                setEdit(false);
                updateProfile(name, lang)
                }}>Submit</button>
        </div>: 
        <div></div>}

    </div>
  )
}
