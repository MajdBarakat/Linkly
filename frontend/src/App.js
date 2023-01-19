import "./styles/App.scss";
import axios from "axios";
import React from "react";
import config from "./config.json";
import { Route, Router, Routes } from "react-router-dom";
import { Login, Register, Profile, Links, Appearance} from "./pages"

function App() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = config.api;
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/links" element={<Links />} />
      <Route path="/admin/appearance" element={<Appearance />} />
      <Route path="/" element={"insert home page here"} />
    </Routes>
  );
}

export default App;
