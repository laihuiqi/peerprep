import './App.css';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList';
// import {LandingPage} from './Components/LandingPage/LandingPage'


function App() {
  return (
    <Router>
    <div>
      <Navbar/>
      {/* <LoginSignUp/> */}
      <Questions/>
      {/* <LandingPage/> */}

    </div>
    </Router>
  );
}

export default App;
