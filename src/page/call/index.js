import React from "react";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { saveAs } from "file-saver";
import { CopyToClipboard } from "react-copy-to-clipboard";

const App = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #181823;
  width: 100vw;
  height: 100vh;
`;

const ButtonLog = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: #0069d9;
  }
  &:focus {
    outline: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  height: 100vh;
  font-family: sans-serif;
`;

const PeerIdContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ligtgray;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0077ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const Message = styled.li`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  text-align: ${({ isSent }) => (isSent ? "right" : "left")};
  background-color: ${({ isSent }) => (isSent ? "#0077ff" : "#e0e0e0")};
  color: ${({ isSent }) => (isSent ? "#fff" : "#000")};
`;

const InputMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputMessage = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
  flex: 1;
`;

const Lefttexte = styled.div``;

const Righttexte = styled.div``;

const Index = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const peer = useRef(null);
  const chatConnection = useRef(null);

  useEffect(() => {
    peer.current = new Peer();

    peer.current.on("open", (id) => {
      setPeerId(id);
    });

    peer.current.on("error", (err) => {
      setError(err);
    });

    peer.current.on("connection", (conn) => {
      setConnected(true);

      chatConnection.current = conn;

      conn.on("data", (data) => {
        console.log("Message reçu:", data);
        setChatMessages((messages) => [
          ...messages,
          { text: data.text, isSentByMe: false, timestamp: new Date() },
        ]);
      });

      conn.on("close", () => {
        setConnected(false);
        chatConnection.current = null;
      });
    });

    return () => {
      peer.current && peer.current.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const conn = peer.current.connect(remotePeerId);

    conn.on("open", () => {
      setConnected(true);

      chatConnection.current = conn;

      conn.on("data", (data) => {
        console.log("Message reçu:", data);
        setChatMessages((messages) => [
          ...messages,
          {
            text: data.text,
            isSentByMe: false,
            timestamp: new Date(),
          },
        ]);
      });

      conn.on("close", () => {
        setConnected(false);
        chatConnection.current = null;
      });
    });

    console.log("Connexion établie");
  };

  const sendMessage = (message, isSentByMe) => {
    if (chatConnection.current) {
      chatConnection.current.send({ text: message, isSentByMe });
      console.log("Message envoyé:", message);
      setChatMessages((messages) => [
        ...messages,
        { text: message, isSentByMe, timestamp: new Date() },
      ]);
      setMessage("");
    }
  };

  console.log(JSON.stringify(chatMessages, null, 2));

  function sauvegarderTableau() {
    const fileContent = chatMessages
      .map((obj) => JSON.stringify(obj))
      .join("\n");
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });

    saveAs(blob, `Log Chat GOOM ${new Date()}.txt`);
  }

  return (
    <App>
      <Container>
        <PeerIdContainer>
          <CopyToClipboard text={peerId}>
            <div>
              {localStorage.getItem("username")} mon ID d'appelle : {peerId}
            </div>
          </CopyToClipboard>
        </PeerIdContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Remote Peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <Button onClick={connectToPeer}>Connecter</Button>
        </InputContainer>
        <ChatContainer>
          {error && <div>Erreur: {error.message}</div>}
          {connected && <div>Connecté avec succès</div>}
          <MessageList>
            {chatMessages.map((message, index) => (
              <Message key={index} isSent={message.isSentByMe}>
                <Lefttexte>
                  {message.isSentByMe ? "Vous" : "Autre personne"}{" "}
                </Lefttexte>
                {" - "}
                <Righttexte>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  : {message.text}
                </Righttexte>
              </Message>
            ))}
          </MessageList>
          <InputMessageContainer>
            <InputMessage
              type="text"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && sendMessage(message, true)
              }
            />
            <Button onClick={() => sendMessage(message, true)}>Envoyer</Button>
          </InputMessageContainer>
        </ChatContainer>
      </Container>
      <div>
        <ButtonLog onClick={sauvegarderTableau}>
          Sauvegarder le tableau
        </ButtonLog>
      </div>
    </App>
  );
};

export default Index;
