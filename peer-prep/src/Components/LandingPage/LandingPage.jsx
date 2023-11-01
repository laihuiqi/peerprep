import React from 'react'
import {useState} from 'react'
import './LandingPage.css'
import {Dashboard} from './Dashboard'
import {UserProfile} from './UserProfile'
import { AttemptHistory } from './AttemptHistory'
import {NavigationPanel} from './NavigationPanel'

 
export const LandingPage = () => {
    const [page_name, setPageName] = useState("Dashboard");
    const [isList, setIsList] = useState(true)

  return (
    <div className = "landing-container">
        <NavigationPanel setPageName = {setPageName} setIsList = {setIsList}/>
        
        <div className="page-view">
            <div className="page-heading">
            {page_name}
            </div>
            {page_name === "Dashboard" ? <Dashboard/> : <div></div>}
            {page_name === "Attempt History" ? <AttemptHistory isList = {isList} setIsList = {setIsList}/> : <div></div>}
            {page_name === "User Profile" ? <UserProfile/> : <div></div>}
        </div>
    </div>
  )
}
