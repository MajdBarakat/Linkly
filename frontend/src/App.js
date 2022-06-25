import "./styles/App.scss";
import axios from "axios";
import React from "react";
import config from "./config.json";
import { Route, Router, Routes } from "react-router-dom";
import Links from "./pages/links";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = config.api;
  return (
    <Routes>
      <Route path="/admin/links" element={<Links />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={"insert home page here"} />
    </Routes>
  );
}

export default App;
