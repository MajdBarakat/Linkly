import "./App.css";
import axios from "axios";
import LoginFrom from "./components/common/loginForm";
import config from "./config.json";
import RegisterForm from "./components/common/registerForm";
import Profile from "./components/common/profile";
import React from "react";

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  return (
    <React.Fragment>
      <LoginFrom />
      <Profile />
    </React.Fragment>
  );
}

export default App;
