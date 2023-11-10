import React from "react";
import "./QDifficultyDropdown.css";

export const QLanguageDropdown = ({chosenLanguage, setLanguage}) => {
  return (
    <div className="dropdown-menu">
      <select defaultValue={chosenLanguage} onChange={setLanguage}>
        <option value="SQL">SQL</option>
        <option value="Other Languages">Other Languages</option>
      </select>
    </div>
  );
};
