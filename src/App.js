import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Login from "./page/login";
import Register from "./page/register";
import MainPage from "./page/home";
import Call from "./page/call";
import Home from "./page/home";
import Client from "./page/client";
import Try from "./page/loginSTYLE";
import Registerstyle from "./page/registerSTYLE";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          <Route path="/register" element={<Call />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
