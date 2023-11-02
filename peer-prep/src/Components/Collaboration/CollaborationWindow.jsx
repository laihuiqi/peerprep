import React, { useState, useEffect, useReducer, useRef } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import socketIOClient from "socket.io-client";

const CollaborationWindow = () => {
    const [timeRemaining, setTimeRemaining] = useState('1800000');
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [question, setQuestion] = useState(null); 
    const [collaborativeInput, setCollaborativeInput] = useState([]);
    const navigate = useNavigate();
    const socket = useRef(null);
    
    useEffect(() => {
      socket.current = socketIOClient('http://localhost:3002', {
            query: {
                userId: 'user-id', // Replace with dynamic user ID
                sessionId: 'session-id' // Replace with dynamic session ID
            }
        });

        // Set up event listeners
        socket.current.on('join', (sessionId) => {
          console.log(`Joined session: ${sessionId}`);
          // Additional logic for joining session
      });

      socket.current.on('user-joined', (userId) => {
          console.log(`User ${userId} joined the session`);
          showToast('Get ready to collaborate and solve the challenge!');
          // Handle new user joining
      });

      socket.current.on('init-code', (question, codes) => {
          setCollaborativeInput(codes);
          setQuestion(question);
      });
      
      
      socket.current.on('code-changed', (line, code) => {
        // Update the specific line of code in the collaborative input
        const updatedInput = collaborativeInput.map((item, index) => 
            index === line ? { ...item, code: code } : item
        );
        setCollaborativeInput(updatedInput);
    });
    
    
    socket.current.on('cleared', (sessionId) => {
      setCollaborativeInput([]);
  });
  
  
  socket.current.on('time-extended', (totalTimeLeft) => {
      setTimeRemaining(totalTimeLeft);
  });

  socket.current.on('system-terminated', (sessionId) => {
    navigate('/'); // Navigate to home or another route
});

socket.current.on('user-disconnected', (userId) => {
  console.log(`User ${userId} has disconnected`);
  // Update the UI to reflect the user's disconnection
  // For example, show a notification or update the list of active users
  showToast(`Experiencing a temporary glitch. Reestablishing your connection...`);
  // Additional logic can be added here
});

socket.current.on('user-reconnected', (userId) => {
  console.log(`User ${userId} has reconnected`);
  // Handle the user's reconnection in the UI
  // For example, remove any disconnection notification related to this user
  showToast(`Connection restored successfully. Let's keep going!`);
  // Additional logic can be added here
});

socket.current.on('notify-terminate', (sessionId) => {
  console.log(`Session ${sessionId} has been terminated by another user`);
  // Handle the session termination in the UI
  // For example, show a dialog or redirect the user
  showToast('Session ended, redirecting to home page...');
  navigate('/'); // Redirect to home or another route
  // Any cleanup or finalization logic can be added here
});


socket.current.on('success-reconnected', (collaborativeInput) => {
    setCollaborativeInput(collaborativeInput);
});

return () => {
  socket.current.disconnect();
};
}, []);
    

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
 //      You can set the hardcoded question data directly in the state
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

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 1500);
    };

    const handleExtendTimer = () => {
        console.log("Socket instance: ", socket.current);
        if (socket.current) {
          socket.current.emit('extend-timer', 900000); // 15 minutes in milliseconds
        showToast('Timer extended for 15 minutes');
        } else {
          console.log("Socket instance not available");
        }
    };

    const handleEndSession = () => {
      // Emit a 'terminate-session' event to the server
      socket.current.emit('terminate-session', { sessionId: 'session-id' }); // Replace 'session-id' with the actual session ID
  
      // Display a toast message (optional, for better user experience)
      showToast('Session terminated');
  
      // Navigate to home or another route after a short delay
      setTimeout(() => navigate('/'), 1500);
  };
  

    const formatTime = (time) => {
        const totalSeconds = Math.floor(time / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
      showToast('Your code has been submitted');
      setTimeout(() => navigate('/'), 1500);
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
