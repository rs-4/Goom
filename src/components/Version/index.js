import React from "react";
import styled from "styled-components";

const Index = ({ version = "" }) => {
  return (
    <Container>
      <Version>versions : {version}</Version>
    </Container>
  );
};

const Container = styled.div`
  background: rgba(108, 105, 105, 0.1);

  border-radius: 10px;
  position: absolute;
  bottom: 0;
`;

const Version = styled.h1`
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 100;
  font-size: 20px;
  line-height: 20px;

  color: #737373;
`;

export default Index;
