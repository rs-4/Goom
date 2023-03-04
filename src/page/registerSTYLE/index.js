import React from "react";
import styled from "styled-components";
import Border from "../../components/Border";
import PrimaryButton from "../../components/PrimaryButton";
import SecondButton from "../../components/SecondButton";
import Version from "../../components/Version";
import Input from "../../components/Input";

const Index = () => {
  const [userForm, setUserForm] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <App>
        <Border />
        <Tittle>GOOM</Tittle>
        <Input
          label="Username"
          type="username"
          name="username"
          placeholder="veuillez saisir votre username"
          required={true}
          onChange={(e) => handleChange(e)}
          value={userForm.username}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="veuillez saisir votre email"
          required={true}
          onChange={(e) => handleChange(e)}
          value={userForm.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="veuillez saisir votre mot de passe"
          required={true}
          onChange={(e) => handleChange(e)}
          value={userForm.password}
        />
        <PrimaryButton text="Sign up" />
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
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Tittle = styled.h1`
  font-weight: 600;
  font-size: 100px;
  line-height: 100px;
  color: #537fe7;
`;
const Logo = styled.img``;

export default Index;
