import React, { useState, useEffect, useReducer, useRef } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import 'firebase/auth';
import CodeEditor from './CodeEditor';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getUserId } from '../../User/UserState'; 
import { useLocation } from 'react-router-dom';

const CollaborationWindow = () => {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [question, setQuestion] = useState(null); 
    const [collaborativeInput, setCollaborativeInput] = useState([]);
    const [code, setCode] = useState("#Enter your code here");
    const [language, setLanguage] = useState('python');
    const [popup, setPopup] = useState(false);
    const onClosePopup = () => setPopup(false);
    const navigate = useNavigate();
    const socket = useRef(null);
    const [canExtend, setCanExtend] = useState(false);
    const location = useLocation();
    const { sessionId, collaboratorId } = location.state || {};
    
    useEffect(() => {
      if (sessionId && collaboratorId) {
        socket.current = socketIOClient('http://localhost:3005', {
            query: {
                userId: getUserId(), // Replace with dynamic user ID
                sessionId: sessionId // Replace with dynamic session ID
            }
        });

        // Set up event listeners
        socket.current.on('join', (sessionId) => {
          console.log(`Joined session: ${sessionId}`);
          setSessionStarted(true);
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

  socket.current.on('system-terminate', (sessionId) => {
    navigate('/'); // Navigate to home or another route
});

socket.current.on('user-disconnected', (userId) => {
  console.log(`User ${userId} has disconnected`);
  // Update the UI to reflect the user's disconnection
  showToast(`Experiencing a temporary glitch. Reestablishing your connection...`);
  // Additional logic can be added here
});

socket.current.on('user-reconnected', (userId) => {
  console.log(`User ${userId} has reconnected`);
  // Handle the user's reconnection in the UI
  showToast(`Connection restored successfully. Let's keep going!`);
  // Additional logic can be added here
});

socket.current.on('notify-terminate', (sessionId) => {
  console.log(`Session ${sessionId} has been terminated by another user`);
  // Handle the session termination in the UI
  showToast('Session ended, redirecting to home page...');
  navigate('/'); // Redirect to home or another route
  // Any cleanup or finalization logic can be added here
});


socket.current.on('success-reconnected', (collaborativeInput) => {
    setCollaborativeInput(collaborativeInput);
});

return () => {
  socket.current.disconnect();
  socket.current.off('session-started');
};
 }
}, [sessionId, collaboratorId]);
    

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
  
    const userId = getUserId();

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`home/${userId}`);
        if (response.ok) {
          const json = await response.json();
          setQuestion(json.questionId);
        } else {
          console.log('Response is not ok:', response.statusText);
        }
      } catch (error) {
        console.error('Loading questions encountered error:', error);
      }
    };

    useEffect(() => {
      fetchQuestion();
    }, []);


    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 1500);
    };



//    const handleExtendTimer = () => {
 //       console.log("Socket instance: ", socket.current);
   //     if (socket.current) {
    //      socket.current.emit('extend-timer', 900000); // 15 minutes in milliseconds
     //   showToast('Timer extended for 15 minutes');
     //   } else {
      //    console.log("Socket instance not available");
      //  }
   // };

    const handleEndSession = () => {
      // Emit a 'terminate-session' event to the server
      socket.current.emit('user-terminate', { sessionId: 'session-id' }); // Replace 'session-id' with the actual session ID
  
      showToast('Session terminated');
  
      // to home or another route after a short delay
      setTimeout(() => navigate('/'), 1500);
  };
  


//    const handleExtendTimer = () => {
//        setTimeRemaining(timeRemaining + 900000);
//        showToast('Timer extended for 15 minutes');
//    };

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


            // Modify the handleExtendTimer function
            const handleExtendTimer = () => {
              // Only allow extending if less than 2 minute is remaining
              if (timeRemaining > 120000) {
                  showToast("You can extend the timer in the last 2 minutes of this session.");
              } else if (socket.current) {
                  socket.current.emit('extend-time'); 
                  showToast('Request to extend time sent successfully!');
                  // Reset the canExtend flag
                  setCanExtend(false);
              }
          };
    
              // useEffect for the countdown logic
        useEffect(() => {
          if (sessionStarted && timeRemaining > 0) {
              const interval = setInterval(() => {
                  setTimeRemaining((prevTime) => {
                      // If there's only 1 minute left, allow for extension
                      if (prevTime <= 60000 && !canExtend) {
                          setCanExtend(true);
                      }
                      // If time runs out, show the popup
                      if (prevTime <= 0) {
                          clearInterval(interval);
                          setPopup(true);
                      }
                      return prevTime > 0 ? prevTime - 1000 : 0;
                  });
              }, 1000);
    
              // Cleanup interval on component unmount
              return () => clearInterval(interval);
          }
      }, [sessionStarted, timeRemaining, canExtend]);

 //   useEffect(() => {
 //       if (sessionStarted && timeRemaining > 0) {
 //         const interval = setInterval(() => {
 //           setTimeRemaining((prevTime) => prevTime - 1000);
 //         }, 1000);
//
 //           return () => clearInterval(interval);
 //       }
 //   }, [sessionStarted, timeRemaining]);


    return (
      <div className="collaboration-window">
        <Timer sessionId={sessionId} userId={userId} setTimeRemaining={setTimeRemaining} onSessionEnd={handleEndSession}/>
          <Popup open={popup}>
              <div className="modal">
                  <div className="header"> Time Up </div>
                  <div className="content">
                      <div>Do you want to extend the time ?</div>
                  </div>
                  <div className="actions">
                      <button className="button extend-popup" onClick={(e) => {handleExtendTimer(); onClosePopup()}}>
                          Yes
                      </button>
                      <button className="button close-popup" onClick={(e) => {onClosePopup(); handleEndSession()}}>
                          No
                      </button>
                  </div>
              </div>
          </Popup>
        <div className="timer-bar">
          <div className="left">
            <span className="time-remaining">Time remaining: {formatTime(timeRemaining)}</span>
            <button className="extend-time" onClick={handleExtendTimer} disabled={timeRemaining > 120000}>Extend Timer</button>
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
            {/*<p>Code editor will go here...</p>*/}
              <div className="editor-section-inner">
                    <CodeEditor code={code} setCode={setCode} language={language} isReadOnly={false}/>
              </div>
              <div className="submit-button-container">
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
              </div>
          </div>

        </div>
        <Timer setTimeRemaining={setTimeRemaining} onSessionEnd={handleEndSession} />
        {toast.visible && <div className="toast">{toast.message}</div>}
      </div>
    );
};

export default CollaborationWindow;