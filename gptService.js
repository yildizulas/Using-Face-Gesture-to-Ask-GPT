//gptService.js

const fetchGPTResponse = async (transcript) => {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'k-proj-PtbO6OfODaZzv7RDypWqHBeyg1n2pIedYTzPuBPWSJXAs9X10hRsiHWC-Lpt5cTl0wkplRcTO9T3BlbkFJuQRgf1HrHYLvx22YMlSrNjUYINVH-9r7T_tXy55WMc-Mkx2ZxEmO7QWec7L9EFm6iDrqZFiN8A' // OpenAI API anahtarını buraya ekle
            },
            body: JSON.stringify({
                prompt: transcript,
                max_tokens: 150,
                n: 8,
                stop: null,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const responsesList = document.getElementById('responsesList');
        responsesList.innerHTML = '';

        data.choices.forEach(choice => {
            const listItem = document.createElement('li');
            listItem.textContent = choice.text.trim();
            responsesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('GPT API hatası:', error);
    }
};