// eyeTracking.js

// Get references to the video and custom cursor elements
const video = document.getElementById('video');
const cursor = document.getElementById('cursor');

// Cursor sensitivity multipliers
const sensitivity_x = 4; // Increases cursor movement speed horizontally
const sensitivity_y = 5; // Increases cursor movement speed vertically

// Start the video stream from the user's camera
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();
}

// Initialize MediaPipe Face Mesh
async function startFaceMesh() {
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1, // Detect only one face
    refineLandmarks: true, // Enable more precise face landmarks
    minDetectionConfidence: 0.5, // Confidence threshold for detection
    minTrackingConfidence: 0.5, // Confidence threshold for tracking
  });

  faceMesh.onResults(onResults); // Set callback for processing results

  const camera = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video }); // Send each video frame to FaceMesh
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

// Detect eye blinks based on landmarks
function detectBlink(landmarks) {
  const getEyeLandmarks = (eyeIndices) => eyeIndices.map((i) => landmarks[i]);

  // Indices for left and right eye landmarks
  const leftEyeIndices = [159, 145, 133, 153]; // Top, bottom, and horizontal points
  const rightEyeIndices = [386, 374, 362, 380];

  const leftEye = getEyeLandmarks(leftEyeIndices);
  const rightEye = getEyeLandmarks(rightEyeIndices);

  // Calculate the eye aspect ratio (EAR)
  const calculateEyeAspectRatio = (eye) => {
    const verticalDistance =
      Math.abs(eye[0].y - eye[1].y) + Math.abs(eye[2].y - eye[3].y);
    const horizontalDistance = Math.abs(eye[0].x - eye[2].x);
    return verticalDistance / (2 * horizontalDistance);
  };

  const leftEyeRatio = calculateEyeAspectRatio(leftEye);
  const rightEyeRatio = calculateEyeAspectRatio(rightEye);

  // Threshold to detect a blink
  const blinkThreshold = 0.2;
  return leftEyeRatio < blinkThreshold && rightEyeRatio < blinkThreshold;
}

// Handle results from FaceMesh
let isBlinking = false;

function onResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    return; // Exit if no face landmarks are detected
  }

  const landmarks = results.multiFaceLandmarks[0];
  const noseTip = landmarks[1]; // Nose tip coordinates
  moveCursor(noseTip.x, noseTip.y); // Move the cursor based on nose position

  // Check for blinking
  if (detectBlink(landmarks)) {
    if (!isBlinking) {
      isBlinking = true;
      console.log("Blink detected"); // Log the blink
      if (currentHoverElement) {
        currentHoverElement.click(); // Simulate a click if hovering over a button
      }

      // Reset blinking status after 0.5 seconds
      setTimeout(() => {
        isBlinking = false;
      }, 500); 
    }
  }
}

// Move the custom cursor
let initialX = null;
let initialY = null;

let hoverTimer = null; // Timer for hover actions
let currentHoverElement = null; // Currently hovered element

function moveCursor(x, y) {
  // Initialize the cursor position
  if (initialX === null) initialX = (1 - x) * video.videoWidth;
  if (initialY === null) initialY = y * video.videoHeight;

  // Calculate movement deltas
  const deltaX = ((1 - x) * video.videoWidth - initialX) * sensitivity_x;
  const deltaY = (y * video.videoHeight - initialY) * sensitivity_y;

  // Map movement to screen coordinates
  const screenX = (window.innerWidth / video.videoWidth) * deltaX + window.innerWidth / 2;
  const screenY = (window.innerHeight / video.videoHeight) * deltaY + window.innerHeight / 2;

  // Constrain the cursor within the screen boundaries
  const boundedX = Math.min(Math.max(screenX, 0), window.innerWidth - cursor.offsetWidth);
  const boundedY = Math.min(Math.max(screenY, 0), window.innerHeight - cursor.offsetHeight);

  cursor.style.left = `${boundedX}px`; // Update cursor X position
  cursor.style.top = `${boundedY}px`; // Update cursor Y position

  // Handle hover interactions with buttons
  const buttons = document.querySelectorAll('.interactive-btn, #microphoneButton');
  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    if (
      boundedX >= rect.left &&
      boundedX <= rect.right &&
      boundedY >= rect.top &&
      boundedY <= rect.bottom
    ) {
      if (currentHoverElement !== button) {
        currentHoverElement = button;
        button.classList.add('hovering'); // Add hover effect

        // Simulate a click after 2 seconds of hovering
        hoverTimer = setTimeout(() => {
          button.click();
          button.classList.remove('hovering');
          hoverTimer = null;
          currentHoverElement = null;
        }, 2000);
      }
    } else {
      if (currentHoverElement === button) {
        clearTimeout(hoverTimer); // Clear hover timer
        button.classList.remove('hovering');
        currentHoverElement = null;
        hoverTimer = null;
      }
    }
  });
}

startCamera();
startFaceMesh();