import "./styles/App.scss";
import axios from "axios";
import React from "react";
import config from "./config.json";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login, Register, RegisterSuccess, Profile, Links, Appearance, User } from "./pages"

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = config.api;
  const jwt = localStorage.getItem('jwt')

  return (
    <Routes>
      <Route path="/login" element={jwt ? <Navigate to="/" /> :<Login />} />
      <Route path="/register" element={jwt ? <Navigate to="/" /> : <Register />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/links" element={<Links />} />
      <Route path="/admin/appearance" element={<Appearance />} />
      <Route path="/:username" element={<User />} />
      <Route path="/" element={"insert home page here"} />
    </Routes>
  );
}

export default App;
