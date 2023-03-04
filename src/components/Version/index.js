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
`;

const Version = styled.h1`
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 400;
  font-size: 38px;
  line-height: 50px;

  color: #737373;
`;

export default Index;
