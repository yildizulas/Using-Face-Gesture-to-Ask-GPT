// voiceRecorder.js

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your Google API key

let isRecording = false; // Flag to track recording status
let mediaRecorder; // MediaRecorder instance
let audioChunks = []; // Array to store audio data chunks

// Add click event listener to the microphone button
document.getElementById("microphoneButton").addEventListener("click", async () => {
    console.log("Microphone button clicked");
    if (isRecording) {
        stopRecording(); // Stop recording if it's currently active
    } else {
        startRecording(); // Start recording if it's not active
    }
});

// Function to start recording audio
async function startRecording() {
    try {
      isRecording = true;
      audioChunks = []; // Clear any previous audio chunks
      document.getElementById("microphoneButton").querySelector('.button-text').textContent = "STOP";
      document.getElementById("microphoneButton").classList.add('recording');
  
      // Reset GPT response state when a new recording starts
      window.resetGPTResponseState();
  
      // Request microphone access from the user
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
  
      // Collect audio data as it becomes available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
  
      // Process the audio once recording stops
      mediaRecorder.onstop = () => {
        processAudio();
      };
  
      mediaRecorder.start(); // Start recording
  
      // Automatically stop recording after 60 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 60000);
    } catch (error) {
      console.error("Microphone permission denied or another error occurred:", error);
      alert("Microphone permission is required. Please enable it in browser settings.");
      isRecording = false;
      document.getElementById("microphoneButton").querySelector('.button-text').textContent = "START";
      document.getElementById("microphoneButton").classList.remove('recording');
    }
  }
  
  // Function to stop recording audio
  function stopRecording() {
    isRecording = false;
    document.getElementById("microphoneButton").querySelector('.button-text').textContent = "START";
    document.getElementById("microphoneButton").classList.remove('recording');
    mediaRecorder.stop();  // Stop the MediaRecorder
  }

// Function to process the recorded audio
async function processAudio() {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  
    // Convert the audio blob to Base64 format
    const audioBase64 = await audioBlobToBase64(audioBlob);
  
    // Send the audio to Google Speech-to-Text API for transcription
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config: {
            encoding: "WEBM_OPUS", // Audio encoding format
            sampleRateHertz: 48000, // Audio sample rate
            languageCode: "tr-TR", // Primary language: Turkish
            alternativeLanguageCodes: ["en-US"], // Alternative languages
          },
          audio: {
            content: audioBase64, // Audio content in Base64 format
          },
        }),
      }
    );
  
    const result = await response.json();
    console.log("Google API Response:", result); // Debugging log
  
    // Extract and display the transcript from the API response
    if (result.results && result.results.length > 0) {
      const transcriptText = result.results[0].alternatives[0].transcript;
      document.getElementById("transcriptText").textContent = transcriptText;
      fetchGPTResponse(transcriptText); // Send transcript to GPT for response generation
    } else {
      console.error("Failed to get transcript from Google API:", result);
      document.getElementById("transcriptText").textContent = "Not Clear!";
    }
  }

// Function to convert audio blob to Base64 format
function audioBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract Base64 content
    reader.onerror = reject;
    reader.readAsDataURL(blob); // Read the blob as a Data URL
  });
}