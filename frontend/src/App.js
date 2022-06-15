import "./App.css";
import axios from "axios";
import LoginFrom from "./components/common/loginForm";
import config from "./config.json";
import RegisterForm from "./components/common/registerForm";
import Profile from "./components/common/profile";

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  return <RegisterForm />;
}

export default App;
