import React from 'react'
import './UserProfile.css'

import edit_icon from "../Assets/pencil.png"

export const UserProfile = () => {
  return (
    <div className="profile-container">
        <div className="edit-container">
            <img src = {edit_icon} className="profile-edit" alt = ""/>
        </div>
        
        <div className="profile-info">
            <div className="profile-field">
                Name
            </div>
            <div className="profile-detail">
                David Rose
            </div>
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
            <div className="profile-detail">
                Python
            </div>
        </div>
    </div>
  )
}
