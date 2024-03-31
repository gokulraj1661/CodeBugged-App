import React from 'react';
import styled from 'styled-components';

const CaptureButton = styled.button`
  position: fixed;
  bottom: 750px;
  left: 61.5%;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;  
  &:hover {
    background-color: #0056b3;
  }
`;

export default CaptureButton;
