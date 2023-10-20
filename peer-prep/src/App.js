import React from 'react';
import './App.css';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList';
import CollaborationWindow from './Components/Collaboration/CollaborationWindow';


function App() {
  return (
    <div>
      <Navbar/>
      {/* <LoginSignUp/> */}
      <Questions/>
       {/* Adding CollaborationWindow for testing */}
       <CollaborationWindow />
    </div>
  );
}

export default App;
