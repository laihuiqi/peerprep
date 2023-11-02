import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginSignUp } from "./Components/LoginSignUp/LoginSignUp";
import { Navbar } from "./Components/Navbar/Navbar";
import { Questions } from "./Components/QuestionList/QuestionList";
import { LandingPage } from "./Components/LandingPage/LandingPage";
import CollaborationWindow from "./Components/Collaboration/CollaborationWindow";
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
// import {LandingPage} from './Components/LandingPage/LandingPage'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
{/* <LoginSignUp/> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/questions" element={<Questions />} />
          {/* Adding CollaborationWindow for testing */}
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/collaboration" element={<CollaborationWindow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
