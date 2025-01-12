// gptService.js

let isResponseGenerated = false; // Flag to track if responses have already been generated

const fetchGPTResponse = async (transcript) => {
    // Prevent fetching if no transcript is provided or a response has already been generated
    if (!transcript || isResponseGenerated) {
        return;
    }

    // Prompt template for GPT
    const systemPrompt = `You are a human responding to someone who asked a question or said something. 
    Generate exactly 8 different natural and genuine responses to this input.
    
    Responses should be:
    - In casual conversational language, like responses from a close friend
    - Mix of humorous, serious, and thoughtful responses
    - Use conversational phrases like "Absolutely!", "Well actually...", "Oh man...", "Hmm...", "You know what..."
    - Each response should be short and single line
    - Never robotic or formal
    - Should feel like a real human responding
    
    Example format:
    User: I'm so tired today
    
    Responses:
    Oh man, I know that feeling, was like that last week...
    You should take a hot shower, it'll help trust me
    Wish I was there to get you some coffee right now
    Maybe take it easy today? Netflix and chill?
    I totally get you, we all have those days
    Sending you a virtual hug 🤗
    Just take a break, no need to push yourself
    Hey, take a deep breath first, okay?

    Just provide the list of responses, no other text.`;

    try {
        // API call to OpenAI GPT
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: transcript || "Hello!"
                    }
                ],
                temperature: 0.9 // Temperature for more creative responses
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const responsesList = document.getElementById('responsesList');
        responsesList.innerHTML = ''; // Clear any existing responses

        if (data.choices && data.choices[0]?.message?.content) {
            const lines = data.choices[0].message.content.trim().split('\n');
            
            // Filter out unnecessary lines like "User:" or "Responses:"
            const responses = lines.filter(line => line && !line.startsWith('User:') && !line.startsWith('Responses:'));
            
            // Generate and display 8 response items
            for (let i = 0; i < 8; i++) {
                const responseItem = document.createElement('li');
                responseItem.className = 'response-item interactive-btn'; // Style for response items
                responseItem.textContent = responses[i] || `Option ${i + 1}`; // Default text if response is missing
                
                responseItem.addEventListener('click', () => {
                    document.querySelectorAll('.response-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    responseItem.classList.add('selected');
                });
                
                responsesList.appendChild(responseItem); // Append response to the list
            }

            isResponseGenerated = true; // Mark responses as generated
        } else {
            // Handle error if no valid response is found
            const errorItem = document.createElement('li');
            errorItem.className = 'response-item error';
            errorItem.textContent = "Something went wrong. Please try again.";
            responsesList.appendChild(errorItem);
        }
    } catch (error) {
        // Handle connection or API errors
        console.error('GPT API error:', error);
        const responsesList = document.getElementById('responsesList');
        responsesList.innerHTML = '';
        const errorItem = document.createElement('li');
        errorItem.className = 'response-item error';
        errorItem.textContent = "Connection error. Please try again later.";
        responsesList.appendChild(errorItem);
    }
};

// Resets the response generation state (used when microphone recording starts)
function resetResponseState() {
    isResponseGenerated = false;
}

// Export the reset function for external use
window.resetGPTResponseState = resetResponseState;

// Add CSS styles dynamically for response items
const style = document.createElement('style');
style.textContent = `
.response-item {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.response-item.interactive-btn {
    cursor: pointer;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 1rem;
    line-height: 1.4;
}

.response-item.interactive-btn:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.response-item.selected {
    background: var(--primary);
    color: var(--surface);
    border-color: var(--primary);
}

.response-item.error {
    grid-column: 1 / -1;
    border-color: var(--error);
    color: var(--error);
    text-align: center;
}
`;

// Append the style to the document head
document.head.appendChild(style);