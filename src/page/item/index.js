import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import styled from "styled-components";
import Message from "../message";
import Home from "../home";

// afficher la page home
const App = styled.div`
  background-color: #181823;
  color: white;
  width: 100vw;
  height: 100vh;
`;

const Button = styled.button`
  padding: 10px 10px 10px 10px;
  margin: 10px;
  font-size: 16px;
  background-color: #0077ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Pseudo = styled.div`
  display: flex
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 2rem;
  font-family: "Poppins Ligth";
  font-weight: 400px;
  line-height: 52px;
  color: white;
`;

const Video = styled.video`
  width: 400px;
  height: 300px;
  object-fit: cover;
`;

const Sidebar = styled.div`
  position: fixed;
  overflow: scroll;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
`;

//afficher la page message
const App1 = styled.div`
  background-color: #181823;
  min-height: 100vh;
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

const ButtonSend = styled.button`
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

const Messagesend = styled.li`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
  align-items: left;
  max-width: 300px;
  text-align: ${({ isSent }) => (isSent ? "right" : "left")};
  background-color: ${({ isSent }) => (isSent ? "#0077ff" : "#e0e0e0")};
  color: ${({ isSent }) => (isSent ? "#fff" : "#000")};
`;

const InputMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350;
`;

const InputMessage = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
  flex: 1;
  max-width: 350;
`;

const Messagetext = styled.div`
  word-break: break-word;
`;

const MessageComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const currentDesktopVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const chatConnection = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    chatConnection.current = peer.connect(remotePeerIdValue);
    chatConnection.current.on("open", () => {
      console.log("Chat connection !");
    });

    peerInstance.current = peer;
  }, []);

  const startCall = (remotePeerId, isScreenShare) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    const constraints = isScreenShare
      ? { video: { cursor: "always" }, audio: true }
      : { video: true, audio: true };

    getUserMedia(constraints, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  const shareScreen = () => {
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia(
      {
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
        audio: false,
      },
      (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        const videoTrack = mediaStream.getVideoTracks()[0];

        // Replace the video track in the current media stream with the screen share track
        peerInstance.current.on("call", (call) => {
          call.answer(mediaStream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });

          // Replace the current video track with the screen share track
          const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
    );
  };

  return (
    <App>
      {/* AFFICHER L'APP APPELE ETC  */}
      <div>
        <div>
          <Pseudo>@{localStorage.getItem("username")}</Pseudo>
          <div>Mon ID d'appel : {peerId}</div>
          <Input
            type="text"
            placeholder="Remote Peer ID"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
          />
          <Button onClick={() => startCall(remotePeerIdValue, false)}>
            appel video
          </Button>

          <Button onClick={shareScreen}>partage d'ecran </Button>
        </div>
        <div>
          <video ref={remoteVideoRef} autoPlay />
          <video ref={currentUserVideoRef} autoPlay muted />
          <Video ref={currentDesktopVideoRef} autoPlay />
        </div>
      </div>
      <Sidebar open={isOpen}>
        {/* AFFICHER LA BOX MESSAGE  */}
        <Message id={peerId}></Message>
      </Sidebar>
      <Button onClick={toggleSidebar}>Open Mesage</Button>
    </App>
  );
};

export default MessageComponent;
