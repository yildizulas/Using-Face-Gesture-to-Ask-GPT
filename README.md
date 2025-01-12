# **EyeCare.ai**

EyeCare.ai is a modern web application for eye tracking and voice-controlled interactions. This project integrates **MediaPipe FaceMesh** for real-time face detection, **OpenAI GPT API** for natural language processing, and **OpenAI TTS API** for text-to-speech capabilities.

---

## **Features**

- **Real-Time Eye Tracking**:
  - Tracks the user's gaze and moves a custom cursor based on nose and eye landmarks.
  - Detects blinking movements and triggers actions such as button clicks.

- **Voice-Controlled Interaction**:
  - Records the user's voice and converts it to text with the **Google Speech-to-Text API**.
  - Sends the transcribed text to **OpenAI GPT** to generate natural and varied responses.

- **Text-to-Speech (TTS)**:
  - Voices the generated responses with the **OpenAI TTS API**.
  - Supports multiple languages (default: Turkish).

- **Dynamic Themes**:
  - Allows users to switch between dark and light themes.

---

## **Usage**

1. **Eye Tracking**:
   - Start eye tracking by granting camera access.
   - Use blinking movements to simulate button clicks.

2. **Voice Control**:
   - Press the "Record" button to start voice recording.
   - The recorded voice will be transcribed into text, and responses will be generated.

3. **Listening to Responses**:
   - View the list of generated responses and click on one to play it back using text-to-speech.

4. **Change Theme**:
   - Use the theme toggle button at the top of the page to select either a light or dark theme.

---

## **Technologies**

- **HTML5 / CSS3 / JavaScript**
- **MediaPipe FaceMesh**
- **OpenAI GPT and TTS API**
- **Google Speech-to-Text API**

---

This README provides an overview of the project's features, usage, and technologies. Feel free to customize it based on your specific requirements. Let me know if you'd like further refinements!
