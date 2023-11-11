import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import { LoginSignUp } from "./Components/LoginSignUp/LoginSignUp";
import { Navbar } from "./Components/Navbar/Navbar";
import { Questions } from "./Components/QuestionList/QuestionList";
import { LandingPage } from "./Components/LandingPage/LandingPage";
import CollaborationWindow from "./Components/Collaboration/CollaborationWindow";
<<<<<<< HEAD
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
// import {LandingPage} from './Components/LandingPage/LandingPage'
=======
import AIChat from "./Components/GenerativeAI/AIChat";

import { isUserAdmin } from "./User/UserState";
import { isUserLoggedIn } from "./Authentication/AuthenticationState";
import useUserStatusHook from "./CustomHooks/userHook";

import "./App.css";

const ProtectedRoute = ({
  checkAdminStatus,
  redirectPath = "/login",
  children,
}) => {
  const userStatus = useUserStatusHook(isUserLoggedIn, isUserAdmin);

  if (userStatus.isLoading) {
    return <div>Loading...</div>;
  }

  if (!userStatus.isLoggedIn || (checkAdminStatus && !userStatus.isAdmin)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
>>>>>>> origin/merge-question-service-with-all-services

function App() {

  const userId = 'some-unique-user-id';

  return (
    <Router>
      <div>
        <Navbar />
        <AIChat userId={userId} />
        <Routes>
<<<<<<< HEAD
{/* <LoginSignUp/> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/questions" element={<Questions />} />
          {/* Adding CollaborationWindow for testing */}
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/collaboration" element={<CollaborationWindow />} />
       </Routes>
      <Questions/>
      {/* <LandingPage/> */}
    </div>
=======
          <Route path="/login" element={<LoginSignUp />} />

          <Route element={<ProtectedRoute checkAdminStatus={false} />}>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/collaboration" element={<CollaborationWindow />} />
            <Route
              path="/unauthorized"
              element={<p>Peer, You Should'nt Be Here: 401!</p>}
            />
            <Route path="*" element={<p>Peer, Nothing To Prep Here: 404!</p>} />
          </Route>

          <Route
            path="/questions/*"
            element={
              <ProtectedRoute
                redirectPath="/unauthorized"
                checkAdminStatus={true}
              >
                <Questions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
>>>>>>> origin/merge-question-service-with-all-services
    </Router>
  );
}

export default App;
