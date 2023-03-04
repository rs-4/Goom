import React from "react";
import styled from "styled-components";

const Index = ({ text = "" }) => {
  return (
    <div>
      <Container>
        <Tittle>{text}</Tittle>
      </Container>
    </div>
  );
};

const Container = styled.div`
  cursor: pointer;
  width: 100vw;
  height: 100%;
  width: 298px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 2px solid #ffffff;
  border-radius: 15px;
`;

const Tittle = styled.h1`
  font-size: 2rem;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;

  line-height: 45px;

  color: #d9d9d9;
`;

export default Index;
