import React from "react";
import "./Attempt.css";
import Utility from "../../Utility/Utility";

export const Attempt = ({ i, attempt, setSelectedAttempt, setIsList }) => {
  let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.complexity);

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
        {/* to be replaced with date passed as component parameter */}
        <div className="user-q-tag attempt-date">31/10/2023</div>

        <div className={tagClass}>{attempt.complexity}</div>
        <div className="user-q-tag">{attempt.category}</div>
      </div>
    </div>
  );
};