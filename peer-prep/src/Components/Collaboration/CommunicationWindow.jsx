import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Draggable from 'react-draggable';
import './CommunicationWindow.css';

const CommunicationWindow = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const remoteStream = useRef(null);

  useEffect(() => {
    // Initialize WebRTC peer connection
    peerConnection.current = new RTCPeerConnection();

    // Event listener for when remote track is received
    peerConnection.current.ontrack = event => {
      remoteStream.current = event.streams[0];
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream.current;
      }
    };

    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3003', {
      query: { userId: 'user-id', sessionId: 'session-id' }
    });

    setSocket(newSocket);

    // Event listeners for WebRTC signaling
    newSocket.on('call', handleReceiveCall);
    newSocket.on('answer', handleAnswer);
    newSocket.on('ice-candidate', handleNewICECandidateMsg);

    // Cleanup on component unmount
    return () => {
      newSocket.close();
      peerConnection.current.close();
    };
  }, []);

  useEffect(() => {
    // Add a default message to the chat history on component mount
    setMessages([{
      text: "Welcome to the chat! You can drag this window around, and click the chat toggle button to open or close the chat.",
      fromSelf: false,
      isDefaultMessage: true
    }]);
  }, []);

  const handleSendMessage = () => {
    if (!socket) return;
    if (!inputValue.trim()) return;

    const message = { text: inputValue, fromSelf: true };
    socket.emit('message', message);
    setMessages(prevMessages => 
        prevMessages.filter(m => !m.isDefaultMessage).concat(message)
      );
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localAudioRef.current.srcObject = localStream;

    localStream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localStream);
    });

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('call', { offer });
  };

  const handleReceiveCall = async (incoming) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incoming.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit('answer', { answer });
  };

  const handleAnswer = async (incoming) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incoming.answer));
  };

  const handleNewICECandidateMsg = async (incoming) => {
    try {
      await peerConnection.current.addIceCandidate(incoming.candidate);
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  };

  const toggleCall = () => {
    if (isInCall) {
      endCall();
    } else {
      startCall();
    }
    setIsInCall(!isInCall);
  };

  const endCall = () => {
    // Stop all tracks on the local stream
    if (localAudioRef.current && localAudioRef.current.srcObject) {
      localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  
    // Stop all tracks on the remote stream
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach(track => track.stop());
    }
  
    // Close the peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = new RTCPeerConnection();
    }
  
    // Update the call state
    setIsInCall(false);
  };

  return (
    <>
      {/* Chat toggle button */}
      <div className="chat-toggle-btn-container">
        <button 
          className="chat-toggle-btn" 
          onClick={() => setChatOpen(!chatOpen)}
        />
      </div>
  
      {/* Draggable chat window */}
      <Draggable bounds="parent">
        <div className={`chat-window-container ${chatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <span>Chat</span>
            {/* Call button */}
            <button 
              className={`call-btn ${isInCall ? 'hang-up-btn' : ''}`}
              onClick={toggleCall}
            >
              {isInCall ? 'Hang Up' : 'Call'}
            </button>
            {/* Local audio stream (hidden) */}
            <audio ref={localAudioRef} style={{ display: 'none' }} autoPlay muted></audio>
            {/* Remote audio stream */}
            <audio ref={remoteAudioRef} style={{ display: 'none' }} autoPlay></audio>
          </div>
          <div className="chat-history">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`message ${message.fromSelf ? 'my-message' : 'their-message'} ${message.isDefaultMessage ? 'default-message' : ''}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </Draggable>
    </>
  );
};  
  
  export default CommunicationWindow;
  
             