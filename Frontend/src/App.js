import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginSignUp } from "./Components/LoginSignUp/LoginSignUp";
import { Navbar } from "./Components/Navbar/Navbar";
import { Questions } from "./Components/QuestionList/QuestionList";
import { LandingPage } from "./Components/LandingPage/LandingPage";
import CollaborationWindow from "./Components/Collaboration/CollaborationWindow";
import AIChat from "./Components/GenerativeAI/AIChat";

function App() {

  const userId = 'some-unique-user-id';

  return (
    <Router>
      <div>
        <Navbar />
        <AIChat userId={userId} />
        <Routes>
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
