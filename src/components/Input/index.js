import React from "react";
import styled from "styled-components";

const Index = ({
  label,
  type,
  name,
  value,
  isRequired,
  placeholder,
  onChange,
}) => {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <Input
        name={name}
        value={value}
        required={isRequired}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
`;

const Input = styled.input`
  width: 270px;
  height: 30px;
  padding: 8px 12px;
  color: black;
  font-family: "Poppins Ligth";
  border: 1px solid #537fe7;
  border-radius: 10px;
`;

export default Index;
