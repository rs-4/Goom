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
  width: 100%;
  padding: 8px 12px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: black;
  border: 1px solid #b8b8b5;
  border-radius: 4px;
  transition: border-color 0.5s;
`;

export default Index;
