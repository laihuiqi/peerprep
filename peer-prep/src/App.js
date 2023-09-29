import './App.css';
// import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';
import { Questions } from './Components/QuestionList/QuestionList'; 
import { MatchButton } from './Components/Matching/MatchButton';

function App() {
  return (
    <div>
      <Navbar/>
      {/* <LoginSignUp/> */}
      <MatchButton/>
      <Questions/>

    </div>
  );
}

export default App;
