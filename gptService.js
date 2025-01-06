// gptService.js

const fetchGPTResponse = async (transcript) => {
    // Varsayılan prompt
    const defaultPrompt = `Sen arkadaşça bir bakıcısın. Günlük aktiviteler veya sağlık durumu hakkında sohbet tarzında bir soru oluştur ve ardından tam olarak 8 olası cevap ver. Soru samimi ve ilgili olmalı. Cevaplar pozitif, nötr ve nazik negatif yanıtların bir karışımı olmalı, ancak bunları etiketleme. Cevabını şu şekilde formatla: İlk satır soru olmalı. Sonraki her satır doğal bir cevap olmalı. Cevaplar gerçek insan konuşması gibi olsun.
    
    Kullanıcının sesli giriş transkripti: "${transcript}"`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Güncel modeli kullanın
                messages: [
                    { role: "system", content: "Sen arkadaşça bir bakıcısın." },
                    { role: "user", content: defaultPrompt }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        // Yanıt kontrolü
        if (!response.ok) {
            console.error('API yanıt hatası:', await response.text());
            const errorItem = document.createElement('li');
            errorItem.textContent = `API hatası: ${response.status} - ${response.statusText}`;
            const responsesList = document.getElementById('responsesList');
            responsesList.innerHTML = '';
            responsesList.appendChild(errorItem);
            return;
        }

        const data = await response.json();
        const responsesList = document.getElementById('responsesList');
        responsesList.innerHTML = '';

        if (data.choices && data.choices.length > 0) {
            const responseText = data.choices[0].message.content.trim(); // Güncel yanıt formatı
            const responseLines = responseText.split('\n');

            // Yanıtları listeye ekle
            responseLines.forEach((line) => {
                const listItem = document.createElement('li');
                listItem.textContent = line.trim();
                responsesList.appendChild(listItem);
            });
        } else {
            const errorItem = document.createElement('li');
            errorItem.textContent = "Yanıt alınamadı. Lütfen tekrar deneyin.";
            responsesList.appendChild(errorItem);
        }
    } catch (error) {
        console.error('GPT API çağrısı sırasında bir hata oluştu:', error);
        const errorItem = document.createElement('li');
        errorItem.textContent = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        const responsesList = document.getElementById('responsesList');
        responsesList.innerHTML = '';
        responsesList.appendChild(errorItem);
    }
};