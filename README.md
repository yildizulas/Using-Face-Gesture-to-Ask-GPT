**Nose Movements and Voice Control System**

This project allows users to perform different interactions on a web page via webcam and microphone. It includes the ability to move the cursor with nose movements and to transcribe audio recording via microphone.

**Features**
	
 1. Cursor Control with Nose Movements
	- Using MediaPipe Face Mesh, the cursor is moved according to the movement of the user's nose.
	- The cursor is dynamically adjusted taking into account sensitivity control and screen boundaries.
	- When the cursor hovers over a button for a certain time (2 seconds), the button is clicked.
	
 2. Audio Recording and Transcript Conversion
	- The user starts the voice recording by clicking the microphone button.
	- The recorded voice is converted into a transcript in Turkish and English using the Google Speech-to-Text API.
	- The transcript is displayed at the bottom of the screen.

**Technologies Used**
- HTML5 / CSS3: User interface design.
- JavaScript (Vanilla): Ensuring functionality.
- MediaPipe Face Mesh: Face tracking and nose coordinates.
- Google Speech-to-Text API: Conversion of audio recordings into transcripts.
- OpenAI GPT-3 API: Generating suggestions and responses from transcripts.

**Usage**
1. Cursor Movement
	- After webcam permission is granted, the cursor moves on the screen according to facial movements.
	- When you hover over a button for 2 seconds, the button is automatically clicked.

2. Audio Recording
	- 🎤 You can start the audio recording by clicking the Microphone button.
	- ⏹ You can stop the voice recording by clicking the Stop Recording button.
	- The recorded audio is displayed at the bottom of the screen as a transcript in Turkish or English.

GPT-3 Responses
- According to the transcript, a request is made to the GPT-3 API and the responses are listed in the upper right corner of the screen.
