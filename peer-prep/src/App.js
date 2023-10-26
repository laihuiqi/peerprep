import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
<<<<<<< HEAD
import { Questions } from './Components/QuestionList/QuestionList';
import CollaborationWindow from './Components/Collaboration/CollaborationWindow';

=======
import { Questions } from './Components/QuestionList/QuestionList'; 
import { MatchButton } from './Components/Matching/MatchButton';
>>>>>>> add-matching-ui

function App() {
  return (
    <Router>
    <div>
      <Navbar/>
      <Routes>
      {/* <LoginSignUp/> */}
<<<<<<< HEAD
      <Route path = "/" element = {<Questions/>}/>
       {/* Adding CollaborationWindow for testing */}
       <Route path="/collaboration" element={<CollaborationWindow />}/>
       </Routes>
=======
      <MatchButton/>
      <Questions/>

>>>>>>> add-matching-ui
    </div>
    </Router>
  );
}

export default App;
