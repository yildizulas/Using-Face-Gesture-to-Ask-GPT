// ttsService.js

// OpenAI API key for Text-to-Speech functionality
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your OPENAI API key

// Function to convert text to speech and play audio
async function playText(text) {
    try {
        // Make a request to OpenAI's Text-to-Speech API
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'tts-1', // Specify the TTS model
                input: text, // Text to convert to speech
                voice: 'nova' // Specify the voice style
            })
        });

        // Handle API errors
        if (!response.ok) {
            throw new Error('TTS API error');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob); // Create a URL for the audio
        const audio = new Audio(audioUrl);
        await audio.play(); // Play the audio

    } catch (error) {
        console.error('TTS error:', error); // Log errors to the console
    }
}

// Add click event listener to response items
document.addEventListener('DOMContentLoaded', () => {
    const responsesList = document.getElementById('responsesList'); // Get the list of responses
    if (responsesList) {
        responsesList.addEventListener('click', async (event) => {
            const responseItem = event.target.closest('.response-item'); // Get the clicked response item
            if (responseItem && !responseItem.classList.contains('system-message') && !responseItem.classList.contains('error')) {
                await playText(responseItem.textContent); // Convert and play the text as speech
            }
        });
    }
});