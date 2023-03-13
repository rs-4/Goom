import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

function App() {
  const [peer, setPeer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [theirStream, setTheirStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);

  const myVideoRef = useRef();
  const theirVideoRef = useRef();

  useEffect(() => {
    // Récupération de la liste des dispositifs audio et vidéo disponibles
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setVideoDevices(videoDevices);
      setAudioDevices(audioDevices);
      setSelectedVideoDevice(videoDevices[0]?.deviceId);
      setSelectedAudioDevice(audioDevices[0]?.deviceId);
    });
  }, []);

  useEffect(() => {
    if (!peer) return;

    // Connexion au serveur PeerJS et récupération de l'ID utilisateur
    peer.on("open", (id) => {
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: selectedVideoDevice },
          audio: { deviceId: selectedAudioDevice },
        })
        .then((stream) => {
          setMyStream(stream);
          myVideoRef.current.srcObject = stream;

          // Émission de l'événement 'join' avec l'ID utilisateur et le stream local
          peer.emit("join", id, stream);
        });
    });

    // Gestion de la réception d'un stream distant
    peer.on("stream", (stream) => {
      setTheirStream(stream);
      theirVideoRef.current.srcObject = stream;
    });

    // Gestion de la réception d'un message
    peer.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [peer, selectedVideoDevice, selectedAudioDevice]);

  // Fonction pour envoyer un message
  const sendMessage = (e) => {
    e.preventDefault();
    peer.send(message);
    setMessage("");
  };

  return (
    <div>
      <h1>PeerJS Chat and Video Demo</h1>
      <div>
        <h2>Local Video</h2>
        <video ref={myVideoRef} autoPlay muted></video>
        <h2>Remote Video</h2>
        <video ref={theirVideoRef} autoPlay></video>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
        <div>
          <h2>Video Devices</h2>
          <select
            value={selectedVideoDevice}
            onChange={(e) => setSelectedVideoDevice(e.target.value)}
          >
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2>Audio Devices</h2>
          <select
            value={selectedAudioDevice}
            onChange={(e) => setSelectedAudioDevice(e.target.value)}
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
export default App;
