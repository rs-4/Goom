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
import Home from "./page/home";
import Item from "./page/item";
import { createGlobalStyle } from "styled-components";
import PoppinsLigth from "./assets/Poppins-Light.ttf";
import JetBrainMono from "./assets/JetBrainsMono-VariableFont_wght.ttf";
import JosefinSans from "./assets/JosefinSans-VariableFont_wght.ttf";
const FontStyles = createGlobalStyle`

body{
  min-width: 350;
}

@font-face {
  font-family: 'Poppins Ligth';
  src: url(${PoppinsLigth}) format('truetype');

};
@font-face {
  font-family: 'JetBrains Mono';
  src: url(${JetBrainMono}) format('truetype');

};@font-face {
  font-family: 'Josefin Sans';
  src: url(${JosefinSans}) format('truetype');

};
h1 {
    font-family: 'Poppins';
  }
`;

function App() {
  return (
    <div className="App">
      <FontStyles></FontStyles>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/item" element={<Item />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
