import './App.css';
import { LoginSignUp } from './Components/LoginSignUp/LoginSignUp';
import { Navbar } from './Components/Navbar/Navbar';

function App() {
  return (
    <div>
      <Navbar/>
      <LoginSignUp/>
    </div>
  );
}

export default App;
