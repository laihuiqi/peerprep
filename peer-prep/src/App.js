import './App.css';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList';
// import {LandingPage} from './Components/LandingPage/LandingPage'


function App() {
  return (
    <div>
      <Navbar/>
      {/* <LoginSignUp/> */}
      <Questions/>
      {/* <LandingPage/> */}

    </div>
  );
}

export default App;
