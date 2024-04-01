import React, { useRef, useState } from 'react';
import axios from 'axios';
import WebCam from './WebCam';
import styled from 'styled-components';
import NavBar from './Nav';
import Footer from './Footer';
const FaceDetectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height:1015px;
  background-color: #1e1e1e;
  padding: 20px;
  color: #fff;
`;

const FaceDetection = () => {
  const [faces, setFaces] = useState([]);
  const webcamRef = useRef(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  };

  const detectFaces = async () => {
    const imageSrc = captureImage();
    if (imageSrc) {
      try {
        const response = await axios.post('https://codebugged-app-3.onrender.com/rec', { image: imageSrc });
        setFaces(response.data.faces);
        alert('Login Succesfully!!');
      } catch (error) {
        console.error('Error detecting faces:', error);
      }
    }
  };

  const handleRegister = async () => {
    const imageSrc = captureImage();
    if (imageSrc) {
      try {
        const response = await axios.post('https://codebugged-app-3.onrender.com/register', { image: imageSrc });
        setFaces(response.data.faces);
        alert('Registered Sucessfully!!');
      } catch (error) {
        console.error('Error registering image:', error);
        alert('Failed to register image');
      }
    }
  };

  const handleLoginClick = () => {
    setIsRegistering(false);
    detectFaces();
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
    handleRegister();
  };

  return (
    <FaceDetectionContainer>
      <NavBar></NavBar>
      <h1>{isRegistering ? 'Face Registration' : 'Face Login'}</h1>
      <WebCam
        webcamRef={webcamRef}
        isRegistering={isRegistering}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <Footer></Footer>
    </FaceDetectionContainer>
  );
};

export default FaceDetection;
