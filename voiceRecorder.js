// voiceRecorder.js

const GOOGLE_API_KEY = "AIzaSyCLFRqOur6obldnIykkafNfAU_Ik6JDIck";

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

document.getElementById("microphoneButton").addEventListener("click", async () => {
    console.log("Mikrofon butonuna tıklandı");
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

async function startRecording() {
  try {
    isRecording = true;
    audioChunks = [];
    document.getElementById("microphoneButton").textContent = "⏹ Kaydı Durdur";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      processAudio();
    };

    mediaRecorder.start();

    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 60000);
  } catch (error) {
    console.error("Mikrofon izni verilmedi veya başka bir hata oluştu:", error);
    alert("Mikrofon izni gerekli. Lütfen tarayıcı ayarlarından mikrofon izni verin.");
    isRecording = false;
    document.getElementById("microphoneButton").textContent = "🎤 Mikrofon";
  }
}

function stopRecording() {
  isRecording = false;
  document.getElementById("microphoneButton").textContent = "🎤 Mikrofon";
  mediaRecorder.stop();
}

async function processAudio() {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  
    // Ses dosyasını Base64 formatına dönüştür
    const audioBase64 = await audioBlobToBase64(audioBlob);
  
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config: {
            encoding: "WEBM_OPUS",
            sampleRateHertz: 48000,
            languageCode: "tr-TR", // Türkçe için
            alternativeLanguageCodes: ["en-US", "de-DE", "fr-FR"],
          },
          audio: {
            content: audioBase64,
          },
        }),
      }
    );
  
    const result = await response.json();
    console.log("Google API Yanıtı:", result); // for debugging
  
    // Yanıta göre transkripti çıkar
    if (result.results && result.results.length > 0) {
      const transcriptText = result.results[0].alternatives[0].transcript;
      document.getElementById("transcriptText").textContent = transcriptText;
    } else {
      console.error("Google API'den transkript alınamadı:", result);
      document.getElementById("transcriptText").textContent = "Transkript alınamadı.";
    }
  }

function audioBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}