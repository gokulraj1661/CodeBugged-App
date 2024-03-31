import React from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import CaptureButton from './CaptureButton';
import RegisterButton from './RegisterButton';

const WebCam = styled.div`
    position: fixed;
    left:650px;
    top:170px;
    height:480px;
    border: 4px solid #ccc; /* Define border style */
    border-radius: 10px; /* Add border radius for a classy look */
    width: 1000px;
    
`;

const WebcamCapture = ({ webcamRef, isRegistering, onLoginClick, onRegisterClick }) => {
  return (
    <WebCam>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <CaptureButton onClick={onLoginClick}>Login</CaptureButton>
      <RegisterButton onClick={onRegisterClick}>Register</RegisterButton>
    </WebCam>
  );
};

export default WebcamCapture;
