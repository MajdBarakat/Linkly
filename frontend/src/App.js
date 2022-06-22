import "./styles/App.scss";
import axios from "axios";
import LoginFrom from "./components/common/loginForm";
import config from "./config.json";
import RegisterForm from "./components/common/registerForm";
import Profile from "./components/common/profile";
import React from "react";
import Links from "./components/common/links";

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  return (
    <React.Fragment>
      <RegisterForm />
    </React.Fragment>
  );
}

export default App;
