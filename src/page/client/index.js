import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const VideoChat = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [peerId, setPeerId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peer = useRef(null);
  const chatConnection = useRef(null);
  const videoConnection = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    peer.current = new Peer();

    peer.current.on("open", (id) => {
      setPeerId(id);
    });

    peer.current.on("error", (err) => {
      setError(err);
    });

    peer.current.on("call", (call) => {
      call.answer(localStream);

      videoConnection.current = call;

      call.on("stream", (stream) => {
        setRemoteStream(stream);
        remoteVideoRef.current.srcObject = stream;
      });

      call.on("close", () => {
        setConnected(false);
        setRemoteStream(null);
        remoteVideoRef.current.srcObject = null;
        videoConnection.current = null;
      });
    });

    peer.current.on("connection", (conn) => {
      setConnected(true);

      chatConnection.current = conn;

      conn.on("data", (data) => {
        console.log("Message received:", data);
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
      localStream.getTracks().forEach((track) => track.stop());
      peer.current && peer.current.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const call = peer.current.call(remotePeerId, localStream);

    videoConnection.current = call;

    call.on("stream", (stream) => {
      setRemoteStream(stream);
      remoteVideoRef.current.srcObject = stream;
    });

    call.on("close", () => {
      setConnected(false);
      setRemoteStream(null);
      remoteVideoRef.current.srcObject = null;
      videoConnection.current = null;
    });

    const conn = peer.current.connect(remotePeerId);

    conn.on("open", () => {
      setConnected(true);

      chatConnection.current = conn;

      conn.on("data", (data) => {
        console.log("Message received:", data);
        setChatMessages((messages) => [
          ...messages,
          { text: data.text, isSentByMe: false, timestamp: new Date() },
        ]);
      });
      const sendMessage = () => {
        if (!connected) {
          return;
        }
        chatConnection.current.send({ text: message });

        setChatMessages((messages) => [
          ...messages,
          { text: message, isSentByMe: true, timestamp: new Date() },
        ]);
        setMessage("");
      };
      conn.on("close", () => {
        setConnected(false);
        chatConnection.current = null;
      });
    });
  };

  const sendMessage = () => {
    chatConnection.current.send({ text: message });

    setChatMessages((messages) => [
      ...messages,
      {
        text: message,
        isSentByMe: true,
        timestamp: new Date(),
      },
    ]);

    setMessage("");
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted></video>
        <video ref={remoteVideoRef} autoPlay></video>
      </div>
      <div>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>
      <div>
        <ul>
          {chatMessages.map((message, index) => (
            <li key={index}>
              <span>{message.text}</span>
              <span>{message.timestamp.toLocaleTimeString()}</span>
              {message.isSentByMe && <span>You</span>}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default VideoChat;
