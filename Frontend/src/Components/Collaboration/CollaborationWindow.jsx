import React, { useState, useEffect } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import 'firebase/auth'; 
import CommunicationWindow from './CommunicationWindow';


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

    // Use this for non hard coded request
    // useEffect(() => {
    //   const fetchQuestionData = async () => {
    //     try {
    //       const user = firebase.auth().currentUser;
    //       if (user) {
    //         const userId = user.uid; // Get the user's UID
    //         const response = await fetch(`/home/${userId}`);
    //         if (response.ok) {
    //           const data = await response.json();
    //           if (data.question) {
    //               setQuestion(data.question);
    //           } else {
    //               console.error('Unable to get question');
    //           }
    //         } else {
    //           console.error('Unable to fetch question details');
    //         }
    //       } else {
    //           console.error('User is not signed in');
    //       }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    //   };

    //   fetchQuestionData();
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
        <CommunicationWindow />
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
