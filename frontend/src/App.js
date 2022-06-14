import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import LoginFrom from "./components/common/loginForm";
import config from "./config.json";

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  return <LoginFrom />;
}

export default App;
