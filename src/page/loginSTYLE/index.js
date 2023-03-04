import React from "react";
import styled from "styled-components";
import Border from "../../components/Border";
import PrimaryButton from "../../components/PrimaryButton";
import SecondButton from "../../components/SecondButton";
import Version from "../../components/Version";

const Index = () => {
  return (
    <>
      <App>
        <Border />
        <Tittle>GOOM</Tittle>
        <PrimaryButton text="Start meeting" />
        <SecondButton text="Sign up" />
        <Version version="1.0.0" />
      </App>
    </>
  );
};

const App = styled.div`
  position: absolute;
  background-color: #181823;
  width: 100vw;
  height: 100%;
`;

const Tittle = styled.h1`
  font-weight: 600;
  font-size: 100px;
  line-height: 100px;
  color: #537fe7;
`;
const Logo = styled.img``;

export default Index;
