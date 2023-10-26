import React, { useState, useEffect } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';

const CollaborationWindow = () => {
    const [timeRemaining, setTimeRemaining] = useState('1800000');
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [question, setQuestion] = useState(null); 
    const navigate = useNavigate();

    // Hardcoded question data
    const questionData = {
      "status": "success",
      "isMatched": true,
      "sessionId": "your-session-id",
      "question": {
          "title": "Test Question",
          "description": "This is a Test question.",
          "complexity": "Easy",
          "category": "Data Structures",
          "language": "Other Languages"
      },
      "collaboratorId": 456
   };
    useEffect(() => {
      // You can set the hardcoded question data directly in the state
      setQuestion(questionData.question);
    }, []);

    // Use this for action question input based on user
    // useEffect(() => {
    //   const userId = 123; // Get user id from session
    //   fetch(`/home/${userId}`)
    //     .then((response) => response.json())
    //     .then((data) => {         
    //       if (data.question) {
    //           setQuestion(data.question);
    //       } else {
    //           console.error('Unable to find question');
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Unable to fetch question data:', error);
    //     });
    // }, []);

    const handleEndSession = () => {
        navigate('/'); // navigating to home or any other path after the session ends
    };

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 1500);
    };

    const handleExtendTimer = () => {
        showToast('Timer extended for 15 minutes');
    };

    const formatTime = (time) => {
        const totalSeconds = Math.floor(time / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
      navigate('/');
    };
  
    return (      
      <div className="collaboration-window"> 
        <div className="timer-bar">
          <div className="left">
            <span className="time-remaining">Time remaining: {formatTime(timeRemaining)}</span>
            <button className="extend-timer" onClick={handleExtendTimer}>Extend Timer</button>
          </div>
          <div className="right">
            <button className="end-session" onClick={handleEndSession}>End Session</button>
          </div>
        </div>
        <div className="content-area">
          <div className="question-section">
          {question && (
            <>
              <h2>{question.title}</h2>
              <p>{question.description}</p>
            </>
          )}
          </div>
          <div className="editor-section">
            {/* Placeholder for code editor */}
            <p>Code editor will go here...</p>
          </div>
        </div>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        <Timer setTimeRemaining={setTimeRemaining} onSessionEnd={handleEndSession} />
        {toast.visible && <div className="toast">{toast.message}</div>}
      </div>
    );
};

export default CollaborationWindow;
