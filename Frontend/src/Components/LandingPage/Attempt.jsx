import React, {useEffect, useState} from "react";
import "./Attempt.css";
import Utility from "../../Utility/Utility";


export const Attempt = ({i, attempt, setSelectedAttempt, setIsList}) => {
	let tagClass = Utility.setDifficultyTag("user-q-tag", question.complexity);

	return (
		<div
			className="attempt-container"
			onClick={() => {
				setSelectedAttempt(attempt);
				setIsList(false);
			}}
		>
			<div className="attempt-name">
				<div className="attempt-id"> #{i + 1} </div>
				<div className="attempt-title">{attempt.title}</div>
			</div>
			<div className="attempt-tags">
				<div className="user-q-tag attempt-date">{question.attempt_time}</div>
				<div className={tagClass}>{question.complexity}</div>
				<div className="user-q-tag">{question.category}</div> 
			</div>
		</div>
	);
};
