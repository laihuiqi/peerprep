import React from 'react'
import './LoginSignUp.css'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

import password_icon from '../Assets/password.png'
import user_icon from '../Assets/user.png'

import { registerUser, loginUser } from '../../User/UserServiceAPI'

export const LoginSignUp = () => {
    const navigate = useNavigate();

    const [action, setAction] = useState("Log In");

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

  return (
    <div className="container-login">
        <div className="header">
            <div className="text"> {action} </div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src= {user_icon} alt="" />
                <input type="text" placeholder = "Email" onChange={(e) => {setUserEmail(e.target.value);}} value={userEmail}/>
            </div>
            <div className="input">
                <img src= {password_icon} alt="" />
                <input type="password" placeholder = "Password"  onChange={(e) => {setUserPassword(e.target.value);}} value={userPassword}/>
            </div>
        </div>
        {action === "Sign Up" ? <div></div>: <div className="forgot-password"> Forgot Password? <span> Click Here.</span></div>}
        <div className="submit-container">
            <div className={action==="Sign Up"? "submit gray": "submit"} 
            onClick = {async () => {
                setAction("Log In")
                const result = await loginUser(userEmail, userPassword)

                if(result) {
                    navigate("/");
                }
            }}>Log In</div>
            <div className={action==="Log In"? "submit gray": "submit"} 
            onClick = {async () => {
                setAction("Sign Up")
                const result = await registerUser("Name Placeholder", userEmail, userPassword, "GitHub ID Placeholder", "Preferred Language Placeholder")

                if(result) {
                    navigate("/");
                }
            }}>Sign Up</div>
        </div>
    </div>
    
  )
}


