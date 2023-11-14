import React from "react";
import "./LoginSignUp.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import password_icon from "../Assets/password.png";
import user_icon from "../Assets/user.png";

import {registerUser} from "../../User/UserServiceAPI";

export const SignUp = ({setAction}) => {
	const navigate = useNavigate();

	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [preferredLang, setPreferredLang] = useState("");

	return (
		<div className="signup-container">
			<div className="inputs">
				<div className="input">
					<div className="input-container">
						<img src={user_icon} alt="" />
						<input
							type="text"
							placeholder="Email"
							onChange={(e) => {
								setUserEmail(e.target.value);
							}}
							value={userEmail}
						/>
					</div>
				</div>
				<div className="input">
					<div className="input-container">
						<img src={password_icon} alt="" />
						<input
							type="password"
							placeholder="Password"
							onChange={(e) => {
								setUserPassword(e.target.value);
							}}
							value={userPassword}
						/>
					</div>
				</div>
				<div className="input">
					<input
						type="text"
						placeholder="Name"
						onChange={(e) => {
							setUserName(e.target.value);
						}}
						value={userName}
					/>
				</div>
				<div className="input">
					<input
						type="text"
						placeholder="Preferred programming language"
						onChange={(e) => {
							setPreferredLang(e.target.value);
						}}
						value={preferredLang}
					/>
				</div>
			</div>

			<div className="submit-container">
				<div
					className="submit"
					onClick={async () => {
						const result = await registerUser(
							userName,
							userEmail,
							userPassword,
							"GitHub ID Placeholder",
							preferredLang
						);

						if (result) {
							navigate("/landing");
						}
					}}
				>
					Sign Up
				</div>
			</div>
			<div className="login-nav">
				{" "}
				Already have an account?{" "}
				<span onClick={() => setAction("Log In")}> Log In.</span>
			</div>
		</div>
	);
};
