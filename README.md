# Face Detection and Recognition System (CodeBugged Full Stack Application)

This project implements a web-based face detection and recognition system using React.js for the frontend and Express.js with face-api.js for the backend. It allows users to register their faces and subsequently login by detecting and recognizing faces through the webcam.

## Features

- **Face Login**: Detect faces captured by the webcam then logged in based on user presence in storage.
- **Face Registration**: Allows users to register their faces for recognition.

### Prerequisites

- Node.js and npm should be installed on your machine.

### Frontend Setup
1. Clone the repository and Navigate to Repo:
    ```bash
    git clone https://github.com/gokulraj1661/CodeBugged-App.git
    cd face-recognition-app
    ```
2. Start Frontend
    ```bash
    npm start
    ```
### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/gokulraj1661/FarmwiseAITask.git
    cd Backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
3. Start Backend
    ```bash
    node scripts.js
    ```

## EndPoints-Backend
1. **Recognizing through Login:**
   - **URL:** `https://codebugged-app-3.onrender.com/rec`
   - **Method:** `POST`
   - **Parameters:**
     - `image`: ScreenShot of frame on Login click.
       
1. **Register New User:**
  - **URL:** `https://codebugged-app-3.onrender.com/register`
   - **Method:** `POST`
   - **Parameters:**
     - `image`: ScreenSot of frame on Register click.

## Usage

1. Access the application through your browser.
2. Choose whether to register your face or login.
3. If registering, follow the instructions to capture your face through the webcam.
4. If logging in, the system will attempt to recognize your face and grant access accordingly.

## Deployment
1. Frontend `https://code-bugged-7dblu9km6-gokulraj1661s-projects.vercel.app/`
2. Backend `https://codebugged-app-3.onrender.com`

## Credits

- This project utilizes the [`face-api.js`](https://github.com/justadudewhohacks/face-api.js/) library for face detection and recognition.
- This project deployed frontedn on Vercel
- This project deployed backend on Render

