import React from "react";
import styled from "styled-components";

const Index = () => {
  return (
    <div>
      <Container>
        <redClose></redClose>
        <orangeMinimize></orangeMinimize>
        <greenMaximize></greenMaximize>
      </Container>
    </div>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 40px;
  background: rgba(108, 105, 105, 0.1);
  z-index: 0;
`;

const redClose = styled.div`
  background-color: #ff0000;
  height: 100px;
  width: 100px;
  display: flex;
  z-index: 2;
`;

const orangeMinimize = styled.div`
  background-color: #ff8c00;
`;

const greenMaximize = styled.div`
  background-color: #00ff00;
`;

export default Index;
