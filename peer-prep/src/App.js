import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList';
import CollaborationWindow from './Components/Collaboration/CollaborationWindow';


function App() {
  return (
    <Router>
    <div>
      <Navbar/>
      <Routes>
      {/* <LoginSignUp/> */}
      <Route path = "/" element = {<Questions/>}/>
       {/* Adding CollaborationWindow for testing */}
       <Route path="/collaboration" element={<CollaborationWindow />}/>
       </Routes>
    </div>
    </Router>
  );
}

export default App;
