import React from 'react';
import './FilterPopup.css';
import { useNavigate } from 'react-router-dom';

import { QUESTION_SERVICE_URL } from './config';

const FilterPopup = ({
  isOpen,
  isClose,
  chosenComplexity,
  onChosenComplexity,
  chosenLanguage,
  onChosenLanguage,
  chosenTopic,
  onChosenTopic,
  onSubmission,
}) => {
  const navigate = useNavigate(); 

  const handleClearFilter = () => {
    onChosenComplexity({ target: { value: 'No Preference' } });
    onChosenLanguage({ target: { value: 'No Preference' } });
    onChosenTopic({ target: { value: 'No Preference' } });
    isClose();
    navigate('/landing');
  };

  const constructFilterURL = () => {
    let currentURL = QUESTION_SERVICE_URL + '?';

    if (chosenComplexity !== 'No Preference') {
      currentURL = currentURL + `complexity=${chosenComplexity}&`;
    }

    if (chosenLanguage !== 'No Preference') {
      currentURL = currentURL + `language=${chosenLanguage}&`;
    }

    if (chosenTopic !== 'No Preference') {
      currentURL = currentURL + `category=${chosenTopic}&`;
    }

    // Remove the trailing '&' character
    currentURL = currentURL.slice(0, -1);
    console.log('Filter URL:', currentURL);
    return currentURL;
  };

  return (
    isOpen && (
      <div className="filter-overlay">
        <div className="filter-popup">
          <span className="hide-popup" onClick={isClose}>
            &times;
          </span>

          <h3>Filter Questions</h3>
          <div className="dropdown-menu">
            <label>Difficulty Level: </label>
            <select value={chosenComplexity} onChange={onChosenComplexity}>
              <option value="No Preference">No Preference</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="dropdown-menu">
            <label>Topic: </label>
            <select value={chosenTopic} onChange={onChosenTopic}>
              <option value="No Preference">No Preference</option>
              <option value="Sorting">Sorting</option>
              <option value="Data Structure">Data Structure</option>
              <option value="Optimization">Optimization</option>
              <option value="Recursion">Recursion</option>
            </select>
          </div>

          <div className="dropdown-menu">
            <label>Language: </label>
            <select value={chosenLanguage} onChange={onChosenLanguage}>
              <option value="No Preference">No Preference</option>
              <option value="Other Languages">Other Languages</option>
              <option value="SQL">SQL</option>
            </select>
          </div>

          <div className='button-container'>
            <div className="clear-filter" onClick={() => handleClearFilter()}>
             Clear Filter
            </div>
            <button
              onClick={() => {
                const currentURL = constructFilterURL();
                onSubmission(currentURL); 
                navigate('/filter');
              }}
              className="submit-filter"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterPopup;
