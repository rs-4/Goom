 import React from 'react';
 import { Link } from 'react-router-dom';
 import styled from 'styled-components';
 import io from "socket.io-client"

const socket = io('http://localhost:8001', { transports: ['websocket', 'polling'] });

const Index = () => {
  const [videoStream, setVideoStream] = React.useState(null);

  const handleStream = (stream) => {
    const video = document.getElementById('myVideo');
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
    setVideoStream(stream);
    console.log(stream , video)
    const videoTrack = stream.getVideoTracks()[0];
    const sender = socket.emit('stream', videoTrack);
  };
  const closeVideo = () => {
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop());
      setVideoStream(null);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    })
      .then(handleStream)
      .catch((error) => console.log(error));
  };
    return (
        <div>
            <h1>Login</h1>
            <div>
          <Video stream={videoStream} id="myVideo"></Video>
      {videoStream ? (
        <div>
          <button onClick={closeVideo}>Close video</button>
        </div>
      ) : (
        <button onClick={startVideo}>Start video</button>
      )}
    </div>
        
      <Link to="register">Register</Link>
        </div>
    );
}

const Video = styled.video`
  width: 100%;
  display: ${(props) => (props.stream ? 'flex' : 'none')};
`;

export default Index;