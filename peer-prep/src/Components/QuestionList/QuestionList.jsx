import React, { useState, useEffect } from 'react';
import { QuestionForm } from './QuestionForm';
import { Question } from './Question';
import './QuestionList.css';
import axios from 'axios';

export const Questions = () => {
  const [qs, setQs] = useState([]);
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/questions');
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

  const addQuestion = async (qTitle, qDifficulty, qTopic, qDescription, qLanguage) => {
    try {
      const question = { title: qTitle, complexity: qDifficulty, category: qTopic, description: qDescription, language: qLanguage };
      const response = await axios.post('http://localhost:4000/api/questions', question, {
        validateStatus: function (status) {
          return status >= 200 && status <= 400; // Resolve the promise for all status codes in the 200 range
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
      const response = await axios.patch('http://localhost:4000/api/questions/' + String(qId), question);

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
      const response = await axios.delete('http://localhost:4000/api/questions/' + String(qId));
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
      {qs.map((q, index) => (
        <Question key={index} question={q} i={index} deleteQuestion={deleteQuestion} 
        updateQuestion={updateQuestion} />
      ))}

      {isAddQ === false ? <div></div> : (
        <QuestionForm
          questionNumber={qs.length + 1}
          qId={qId}
          setAddQ={setAddQ}
          setQId={setQId}
          addQuestion={addQuestion}
        />
      )}

      <div className="add-q-btn" onClick={() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
      }}>Add question</div>
    </div>
  );
};
