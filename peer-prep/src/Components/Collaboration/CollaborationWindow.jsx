import React, { useState } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';

const CollaborationWindow = () => {
    const [timeRemaining, setTimeRemaining] = useState('1800000');
    const [toast, setToast] = useState({ visible: false, message: '' });
    const navigate = useNavigate();

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
            {/* Placeholder for question content */}
            <p>Question content will go here...</p>
          </div>
          <div className="editor-section">
            {/* Placeholder for code editor */}
            <p>Code editor will go here...</p>
          </div>
        </div>
        <button className="submit-button">Submit</button>
        <Timer setTimeRemaining={setTimeRemaining} onSessionEnd={handleEndSession} />
        {toast.visible && <div className="toast">{toast.message}</div>}
      </div>
    );
};

export default CollaborationWindow;
