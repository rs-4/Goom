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
  background: #537fe7;
  border-radius: 15px;
  width: 100vw;
  height: 100%;
  width: 300px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tittle = styled.h1`
  font-size: 2rem;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;

  line-height: 52px;

  color: #ffffff;
`;

export default Index;
