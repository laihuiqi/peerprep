import React, {useEffect, useState} from "react";
import "./Attempt.css";
import Utility from "../../Utility/Utility";
import axios from "axios";
import {QUESTION_SERVICE_URL} from "../QuestionList/config";

export const Attempt = ({i, attempt, setSelectedAttempt, setIsList}) => {
	let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.complexity);

	const [attemptDetails, setAttempt] = useState({});
	const fetchQuestion = async (id) => {
		try {
			let response;

			response = await axios.get(QUESTION_SERVICE_URL + "/" + id);
			console.log(response);
			if (response.status === 200) {
				return response.data;
			} else {
				console.error("Error fetching questions:", response);
				return {};
			}
		} catch (error) {
			console.error("Error fetching questions:", error);
		}
	};

	return (
		<div
			className="attempt-container"
			onClick={() => {
				// setSelectedAttempt(attempt);
				// setIsList(false);
			}}
		>
			<div className="attempt-name">
				<div className="attempt-id"> #{i + 1} </div>
				<div className="attempt-title">{attempt.questionId}</div>
			</div>
			<div className="attempt-tags">
				{/* to be replaced with date passed as component parameter */}
				<div className="user-q-tag attempt-date">31/10/2023</div>
				<div className={tagClass}>{attempt.complexity}</div>
				<div className="user-q-tag">{attempt.category}</div>
			</div>
		</div>
	);
};
