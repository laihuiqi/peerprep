import React, { useState } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';

const CollaborationWindow = () => {
    const [isSessionActive, setIsSessionActive] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState('1800000');
    const [toast, setToast] = useState ( {visible: false, message: ''} );

    const handleEndSession = () => {
        setIsSessionActive(false);
    };

    const showToast = (message) => {
        setToast({visible: true, message });
        setTimeout(() => {
            setToast({visible: false, message: ''});
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


    if (!isSessionActive) {
        return null;
    }
    
    return (
    <div className='collaboration-overlay'>
      <div className="collaboration-window"> {/* Changed from <CollaborationWindow /> to a div */}
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
      </div>
      {toast.visible && <div className="toast">{toast.message}</div>}
    </div>
  );
};

export default CollaborationWindow;