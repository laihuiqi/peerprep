import React from 'react'
import './LoginSignUp.css'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

import password_icon from '../Assets/password.png'
import user_icon from '../Assets/user.png'

import { loginUser } from '../../User/UserServiceAPI'
import {resetUserPasswordUsingFirebase} from "../../Authentication/UserAuthenticationController"

export const Login = ({setAction}) => {
    const navigate = useNavigate();

    const [action, setAction] = useState("Log In");

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");


  return (
    <div>
        <div className="inputs">
            <div className="input">
                <div className="input-container">
                    <img src= {user_icon} alt="" />
                    <input type="text" placeholder = "Email" onChange={(e) => {setUserEmail(e.target.value);}} value={userEmail}/>
                </div>
            </div>
            <div className="input">
                <div className="input-container">
                    <img src= {password_icon} alt="" />
                    <input type="password" placeholder = "Password"  onChange={(e) => {setUserPassword(e.target.value);}} value={userPassword}/>
                </div>
            </div>
           
        </div>
        <div className="forgot-password"> Forgot Password? <span onClick={()=>resetUserPasswordUsingFirebase(userEmail)}> Click Here.</span></div>
        <div className="submit-container">
            <div className="submit"
            onClick = {async () => {
                const result = await loginUser(userEmail, userPassword)
                if(result) {
                    navigate("/landing");
                }
            }}>Log In</div>
        </div>
        <div className="signup-nav"> Don't have an account? <span onClick={()=>setAction("Sign Up")}> Sign Up.</span></div>
    </div>
    
  )
}


