import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const { ipcRenderer } = window.require("electron");

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
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
      console.log("Chat connection established!");
      chatConnection.current.on("data", (data) => {
        setChatMessages([...chatMessages, data]);
      });
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
        currentDesktopVideoRef.current.srcObject = mediaStream;
        currentDesktopVideoRef.current.play();
        const videoTrack = mediaStream.getVideoTracks()[0];

        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        peerInstance.current.call(remotePeerIdValue, videoTrack);
      }
    );
  };

  const sendMessage = (message) => {
    chatConnection.current.send(message);
  };

  return (
    <div>
      <div>
        <div>Mon ID d'appelle : {peerId}</div>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        />
        <button onClick={() => startCall(remotePeerIdValue, false)}>
          appele
        </button>
        <button onClick={() => startCall(remotePeerIdValue, true)}>
          partage d'ecran
        </button>
        <button onClick={shareScreen}>partage d'ecran </button>
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay />
        <video ref={currentUserVideoRef} autoPlay muted />
        <video ref={currentDesktopVideoRef} autoPlay />
      </div>
      <div>
        <ul>
          {chatMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Type your message here"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
