import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Version from "../../components/Version";

const Index = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setError("");
  };

  const verify = () => {
    localStorage.setItem("username", inputValue);
  };

  return (
    <div>
      <App>
        <Tittle>GOOM</Tittle>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Veuillez saisir votre nom d'utilisateur"
        />
        <Link to="message" style={{ textDecoration: "none" }}>
          <Button
            type="submit"
            disabled={inputValue.trim().length < 3}
            onClick={verify}
          >
            Démarrer la réunion
          </Button>
        </Link>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Version version="1.0.0" />
      </App>
    </div>
  );
};

const App = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #181823;
  width: 100vw;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid grey;
  font-size: 16px;
  width: 300px;
`;

const Button = styled.button`
  cursor: pointer;
  border-radius: 30px;
  width: 300px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "Poppins Ligth";
  font-weight: 400px;
  line-height: 52px;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "grey" : "#537fe7")};
  color: white;
  font-size: 16px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: opacity 0.3s ease;
  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
  }
`;

const Tittle = styled.h1`
  font-family: "Josefin Sans";
  font-weight: 600;
  font-size: 100px;
  line-height: 100px;
  color: #537fe7;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

export default Index;
