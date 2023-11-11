import React, { useState, useEffect } from 'react';
import { QuestionForm } from './QuestionForm';
import { Question } from './Question';
import './QuestionList.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterPopup from './FilterPopup';

import { QUESTION_SERVICE_URL } from './config';

export const Questions = () => {
  const [qs, setQs] = useState([]);
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filterQuestions, setFilteredQs] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('No Preference');
  const [selectedLanguage, setSelectedLanguage] = useState('No Preference');
  const [selectedTopic, setSelectedTopic] = useState('No Preference');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/filter')) {
      const fetchFilterQns = async () => {
        try {
          const response = await axios.get(location.pathname);
          if (response.status === 200) {
            setFilteredQs(response.data);
            setQId(response.data.length);
          } else {
            console.error('Unable to fetch filtered questions');
          }
        } catch (error) {
          console.error('Unable to fetch filtered questions:', error);
        }
      };

      fetchFilterQns();
    } else {
      fetchQuestions();
      setFilteredQs([]);
    }
  }, [location.pathname]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(QUESTION_SERVICE_URL);
      if (response.status === 200) {
        setQs(response.data);
        setQId(response.data.length);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [isAddQ]);

  const applyFilter = async (filteredLink) => {
    try {
      const response = await axios.get(filteredLink);
      console.log('Response from API:', response);
      setFilterPopupOpen(false);

      if (response.status === 200) {
        console.log('Questions after filtering:', response.data);
        setFilteredQs(response.data);
        setQId(response.data.length);

        // Store the filter URL in sessionStorage
        sessionStorage.setItem('Link after filtering', filteredLink);

        navigate('/questions/filter');
      } else {
        console.error('Error getting questions according to filter');
      }
    } catch (error) {
      console.error('Error fetching questions according to filter:', error);
    }
  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setSearchValue(searchQuery);
    const filtered = qs.filter((q) =>
      q.description.toLowerCase().includes(searchQuery.toLowerCase()||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) )
    );
    setFilteredQs(filtered);
  };

  const addQuestion = async (qTitle, qDifficulty, qTopic, qDescription, qLanguage) => {
    try {
      const question = { title: qTitle, complexity: qDifficulty, category: qTopic, description: qDescription, language: qLanguage };
      const response = await axios.post(QUESTION_SERVICE_URL, question, {
        validateStatus: function (status) {
          return status >= 200 && status <= 400;
        },
      });

      return response;
    } catch (error) {
      console.error('Creating question error:', error);
      return ['Unable to create question'];
    }
  };

  const updateQuestion = async (qId, qTitle, qDescription, qDifficulty, qTopic, qLanguage) => {
    try {
      const question = { title: qTitle, complexity: qDifficulty, category: qTopic, description: qDescription, language: qLanguage };
      const response = await axios.patch(QUESTION_SERVICE_URL + '/' + String(qId), question);

      if (response.status === 200) {
        fetchQuestions();
        return [];
      } else {
        return ['Unable to edit question'];
      }
    } catch (error) {
      console.error('Updating question error:', error);
      return ['Unable to edit question'];
    }
  };

  const deleteQuestion = async (qId) => {
    try {
      const response = await axios.delete(QUESTION_SERVICE_URL + '/' + String(qId));
      const json = response.data;

      if (response.status < 300 && response.status >= 200) {
        fetchQuestions();
        return [];
      } else {
        return ['Unable to remove question'];
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      return ['Unable to remove question'];
    }
  };

  return (
    <div className="q-wrapper">
      <div className="filter-q-btn" onClick={() => setFilterPopupOpen(true)}>
        Filter Questions
      </div>

      <div className="search-entry">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {isAddQ === false ? <div></div> : <QuestionForm questionNumber={qs.length + 1} qId={qId} setAddQ={setAddQ} setQId={setQId} addQuestion={addQuestion} />}

      {isFilterPopupOpen && (
        <FilterPopup
          isOpen={isFilterPopupOpen}
          isClose={() => setFilterPopupOpen(false)}
          chosenComplexity={selectedDifficulty}
          onChosenComplexity={(e) => setSelectedDifficulty(e.target.value)}
          chosenLanguage={selectedLanguage}
          onChosenLanguage={(e) => setSelectedLanguage(e.target.value)}
          chosenTopic={selectedTopic}
          onChosenTopic={(e) => setSelectedTopic(e.target.value)}
          onSubmission={(filteredLink) => applyFilter(filteredLink)}
        />
      )}

      {(location.pathname.includes('/filter') ? filterQuestions : (searchValue ? filterQuestions : qs)).map((q, index) => (
        <Question key={index} question={q} i={index} deleteQuestion={deleteQuestion} updateQuestion={updateQuestion} />
      ))}

      <div className="add-q-btn" onClick={() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
      }}>Add question</div>
    </div>
  );
};
