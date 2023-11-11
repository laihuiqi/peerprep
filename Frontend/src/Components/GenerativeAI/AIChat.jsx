import { getAIResponse } from './AIService';
import './AIChat.css';
import React, { useState, useEffect } from 'react';

const AIChat = ({ userId }) => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]); // Initialize as an array
  const [chatOpen, setChatOpen] = useState(false);
  const [defaultMessageShown, setDefaultMessageShown] = useState(false);

  useEffect(() => {
    if (chatOpen && !defaultMessageShown) {
      const defaultMessage = {
        text: "Hello! 👋 I'm your AI assistant powered by GPT-3.5. Feel free to ask me anything, but remember, I might not always get things right!",
        fromSelf: false,
      };
      setResponses([defaultMessage]);
      setDefaultMessageShown(true);
    }
  }, [chatOpen, defaultMessageShown]);


  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
        const aiResponse = await getAIResponse(userId, prompt);
        if (aiResponse.status === 'success') {
          setResponses((prevResponses) => [
            ...prevResponses,
            { text: prompt, fromSelf: true },
            { text: aiResponse.reply, fromSelf: false },
          ]);
          setPrompt('');
        } else {
          console.error('Error from AI:', aiResponse.message);
        }
      } catch (error) {
        console.error('Failed to submit prompt to AI:', error);
      }
    };
    
    return (
        <>
          <div className={`aichat-toggle-btn-container ${chatOpen ? 'hide' : ''}`}>
            <button className="aichat-toggle-btn" onClick={() => setChatOpen(true)} />
          </div>
          {chatOpen && (
            <div className="aichat-container">
              <div className="aichat-header">
                <span>Chat with ChatGPT</span>
                <button onClick={() => setChatOpen(false)}>X</button> {/* Close button */}
              </div>
              <div className="aichat-history">
                {responses.map((message, index) => (
                  <div key={index} className={`aimessage ${message.fromSelf ? 'aimy-message' : 'aitheir-message'}`}>
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="aichat-input-area">
                <textarea
                  className="aimessage-input"
                  placeholder="Type your question..."
                  value={prompt}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button className="aisend-btn" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </div>
          )}
        </>
      );
    };
    
    export default AIChat;
    
    
    
    
      
    