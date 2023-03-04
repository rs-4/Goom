import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Home from "../home";

const socket = io("http://localhost:8001", {
  transports: ["websocket", "polling"],
});

const App = () => {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    socket.on("stream-sharing", (stream) => {
      const video = document.getElementById("myVideo");
      videoRef.current.srcObject = stream;
      setVideoStream(stream);
    });
  }, []);

  setInterval(() => {
    socket.emit("stream", videoStream);
  }, 1000);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      });
      console.log(stream);
      setVideoStream(stream);
      const videoTrack = stream.getVideoTracks()[0];
      const sender = socket.emit("stream", videoTrack);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Client 1</h1>
      <button onClick={startVideo}>partage d'ecran </button>
      <br />
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default App;
