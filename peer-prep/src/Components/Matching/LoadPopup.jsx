import React from 'react';
import {Oval} from 'react-loader-spinner';
import './LoadPopup.css'; 

export const LoadPopup= ({isOpen, isClose}) => {
  if (isOpen) {
    return (
      <div className="load-overlay">
          <div className="load-popup">
              <h3>Finding you a match...</h3>
              <div className="spinner">
                  <Oval className = "spinner"/>
              </div> 
              <div >
                  <button onClick={isClose} className="cancel-match">Cancel Matching</button>
              </div>    
        </div>
      </div>
    );
  }
};
