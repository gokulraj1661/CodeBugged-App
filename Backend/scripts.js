const express = require('express');
const bodyParser = require('body-parser');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const fs = require('fs');
const cors = require('cors');
const { loadImage } = require('canvas');
const path = require('path');
//const { initializeApp, cert } = require('firebase-admin/app'); For FireBase Storage
//const { getStorage,listAll } = require('firebase-admin/storage');
const app = express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//FireBase Acc detailes
// const ServiceAccount = require("./codebugged-task-firebase-adminsdk-71nic-6af730c9f9.json");
// initializeApp({
//   credential: cert(ServiceAccount),
//   storageBucket: 'gs://codebugged-task.appspot.com'
// });

//FireBase Upload
// async function saveImageToFirebase(base64Data, filename) {
//   const bucket = getStorage().bucket();
//   const file = bucket.file(filename);
//   await file.save(Buffer.from(base64Data, 'base64'), {
//     contentType: 'image/jpeg', // Specify the content type of the image
//     public: true // Make the image publicly accessible
//   });
//   const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
//   return imageUrl;
// }


faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
const faceRecognition = faceapi.nets.faceRecognitionNet;
const faceLandmarks=faceapi.nets.faceLandmark68Net;
// Load models
async function loadModels() {
  await faceDetectionNet.loadFromDisk('./models');
  await faceRecognition.loadFromDisk('./models');
  await faceLandmarks.loadFromDisk('./models');
}
loadModels();

async function saveImage(base64Data, filename) {
  const base64DataWithoutHeader = base64Data.replace(/^data:image\/jpeg;base64,/, "");
  const filePath = path.join('./', filename);
  await fs.promises.writeFile(filePath, base64DataWithoutHeader, 'base64');
  return filePath;
}
//Endpoint 1
app.post('/rec', async (req, res) => {
  try {
    const { image } = req.body;
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const filename = './uploads/image.jpg';
    const filePath = await saveImage(image, filename);
    const img = await loadImage(filePath);

    // Load the database images
    const dbImagesPath = './db';
    const dbImageFiles = fs.readdirSync(dbImagesPath).filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
    const dbDetectionsPromises = dbImageFiles.map(async file => {
      const dbImagePath = path.join(dbImagesPath, file);
      const dbImage = await loadImage(dbImagePath);
      return faceapi.detectAllFaces(dbImage).withFaceLandmarks().withFaceDescriptors();
    });
    const dbDetectionsArray = await Promise.all(dbDetectionsPromises);
    const dbDetections = dbDetectionsArray.flat(); 

    // Initialize FaceMatcher with descriptors from all images in the database folder
    const faceMatcher = new faceapi.FaceMatcher(dbDetections);

    // Detect faces and compute descriptors for the query image
    const queryDetections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // Iterate over detected faces in the query image and find the best match from the database
    const matches = queryDetections.map(queryFace => {
      const bestMatch = faceMatcher.findBestMatch(queryFace.descriptor);
      return bestMatch.toString() !== 'unknown'; // Check if the best match is not 'unknown'
    });

    // Check if any face in the query image is matched with a face in any image from the database folder
    const isMatched = matches.includes(true);

    console.log('Image Recognition Result: ' + (isMatched ? 'Matched' : 'Not Matched'));
    res.json({ isMatched });
  } catch (error) {
    console.log('Error detecting faces: ' + error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

//Recoginse through FireBase
// app.post('/rec', async (req, res) => {
//   try {
//     const { image } = req.body;
//     const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

//     // Convert base64 image to buffer
//     const imgBuffer = Buffer.from(base64Data, 'base64');

//     // Save the image buffer to a temporary file
//     const tempFilePath = path.join('./uploads', 'image.jpg');
//     fs.writeFileSync(tempFilePath, imgBuffer);

//     // Load the saved image
//     const img = await loadImage(tempFilePath);

//     // Fetch photos from Firebase Storage
//     const bucket = getStorage().bucket();
//     const files = await bucket.getFiles();

//     // Perform face recognition on each photo
//     const dbDetectionsPromises = files.map(async file => {
//       const [fileData] = await file.download();
//       const dbImage = await loadImage(fileData);

//       // Perform face detection and recognition on the fetched photo
//       return faceapi.detectAllFaces(dbImage).withFaceLandmarks().withFaceDescriptors();
//     });

//     const dbDetectionsArray = await Promise.all(dbDetectionsPromises);
//     const dbDetections = dbDetectionsArray.flat(); // Flatten the array of detections

//     // Initialize FaceMatcher with descriptors from all images in Firebase Storage
//     const faceMatcher = new faceapi.FaceMatcher(dbDetections);

//     // Detect faces and compute descriptors for the query image
//     const queryDetections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

//     // Iterate over detected faces in the query image and find the best match from Firebase Storage
//     const matches = queryDetections.map(queryFace => {
//       const bestMatch = faceMatcher.findBestMatch(queryFace.descriptor);
//       return bestMatch.toString() !== 'unknown'; // Check if the best match is not 'unknown'
//     });

//     // Check if any face in the query image is matched with a face in any image from Firebase Storage
//     const isMatched = matches.includes(true);

//     console.log('Image Recognition Result:', isMatched ? 'Matched' : 'Not Matched');
//     res.json({ isMatched });
//   } catch (error) {
//     console.error('Error detecting faces:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// });

//Endpoint 2
app.post('/register', async (req, res) => {
  try {
 
    const { image } = req.body;
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const filename = `image_${Date.now()}.jpg`;
    const filePath = path.join('./db', filename);

    // Save the image to file
    await saveImage(base64Data, filePath);
    const img = await loadImage(filePath);

    // Log success message
    console.log('Image saved successfully: ' + filename);
    // Send a response back to the client
    res.status(200).json({ message: 'Photo registered successfully' });
  } catch (error) {
    // Handle errors
    console.log('Error registering photo:', error);
    res.status(500).json({ message: 'Failed to register photo' });
  }
});

//FirBase Register
// app.post('/register', async (req, res) => {
//   try {
//     // Assume the photo data is sent in the request body
//     const { image } = req.body;

//     // Replace the data URL prefix
//     const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

//     // Define the filename and file path
//     const filename = `image_${Date.now()}.jpg`;
//     // const filePath = path.join('./db', filename);

//     // // Save the image to file
//     // await saveImage(base64Data, filePath);

//     // // Load the saved image
//     // const img = await loadImage(filePath);
//     const imageUrl = await saveImageToFirebase(base64Data, filename);
//     // Log success message
//     console.log('Image saved successfully:', imageUrl);

//     // Send a response back to the client
//     res.status(200).json({ message: 'Photo registered successfully' });
//   } catch (error) {
//     // Handle errors
//     console.error('Error registering photo:', error);
//     res.status(500).json({ message: 'Failed to register photo' });
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

