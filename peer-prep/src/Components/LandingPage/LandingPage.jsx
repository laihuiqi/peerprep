import React from 'react'
import {useState} from 'react'
import './LandingPage.css'
import {Dashboard} from './Dashboard'
import {UserProfile} from './UserProfile'
import { AttemptHistory } from './AttemptHistory'

import home_icon from '../Assets/home.png'
import user_icon from '../Assets/user-prof.png'
import dummy_user from '../Assets/David.png'
import history_icon from '../Assets/history.png'

 
export const LandingPage = () => {
    const [page_name, setPageName] = useState("Dashboard");

  return (
    <div className = "landing-container">
        <div className="navigation-panel">
            <div className="user-header">
                <img src = {dummy_user} className="user-icon" alt = ""/>
                <div className="user-name">david101</div>
            </div>
            <div className="nav-tabs">
                <div className="nav-tab" onClick = {() => {setPageName("Dashboard")}}>
                    <img src = {home_icon} className="nav-icon" alt= ""/>
                    <div className="nav-text"> Dashboard </div>
                </div>
                <div className="nav-tab" onClick = {() => {setPageName("Attempt History")}}>
                    <img src = {history_icon} className="nav-icon" alt= ""/>
                    <div className="nav-text"> Attempt History </div>
                </div>
                <div className="nav-tab" onClick = {() => {setPageName("User Profile")}}>
                    <img src = {user_icon} className="nav-icon" alt= ""/>
                    <div className="nav-text"> User Profile</div>
                </div>
            </div>
        </div>
        <div className="page-view">
            <div className="page-heading">
            {page_name}
            </div>
            {page_name === "Dashboard" ? <Dashboard/> : <div></div>}
            {page_name === "Attempt History" ? <AttemptHistory/> : <div></div>}
            {page_name === "User Profile" ? <UserProfile/> : <div></div>}
        </div>
    </div>
  )
}
