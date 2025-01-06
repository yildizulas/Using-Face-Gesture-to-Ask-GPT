// eyeTracking.js

const video = document.getElementById('video');
const cursor = document.getElementById('cursor');

// Hareket hassasiyeti
const sensitivity_x = 4; // İmlecin hareket hızını artırmak için çarpan
const sensitivity_y = 5;

// Kamerayı başlat
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();
}

// MediaPipe Face Mesh'i başlat
async function startFaceMesh() {
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1, // Tek bir yüzü algılamak için
    refineLandmarks: true, // Hassas yüz noktaları
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

// Sonuçları işleyin
function onResults(results) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const noseTip = results.multiFaceLandmarks[0][1]; // Burnun ucu (landmark ID 1)
    moveCursor(noseTip.x, noseTip.y);
  }
}

// İmleci hareket ettir
// İmlecin başlangıç pozisyonu
let initialX = null;
let initialY = null;

let hoverTimer = null; // İmlecin üzerinde durma süresi için
let currentHoverElement = null; // Şu anda imlecin üzerinde olduğu buton

function moveCursor(x, y) {
    // İlk konumları kaydet
    if (initialX === null) initialX = (1 - x) * video.videoWidth;
    if (initialY === null) initialY = y * video.videoHeight;

    const deltaX = ((1 - x) * video.videoWidth - initialX) * sensitivity_x;
    const deltaY = (y * video.videoHeight - initialY) * sensitivity_y;

    const screenX = (window.innerWidth / video.videoWidth) * deltaX + window.innerWidth / 2;
    const screenY = (window.innerHeight / video.videoHeight) * deltaY + window.innerHeight / 2;

    const boundedX = Math.min(Math.max(screenX, 0), window.innerWidth - cursor.offsetWidth);
    const boundedY = Math.min(Math.max(screenY, 0), window.innerHeight - cursor.offsetHeight);

    cursor.style.left = `${boundedX}px`;
    cursor.style.top = `${boundedY}px`;

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
                button.classList.add('hovering'); // Animasyonu başlat

                // 2 saniye sonra tıklama işlemi
                hoverTimer = setTimeout(() => {
                    button.click(); // Butona tıklama simülasyonu
                    button.classList.remove('hovering');
                    hoverTimer = null;
                    currentHoverElement = null;
                }, 2000);
            }
        } else {
            if (currentHoverElement === button) {
                clearTimeout(hoverTimer); // Timer'ı temizle
                button.classList.remove('hovering');
                currentHoverElement = null;
                hoverTimer = null;
            }
        }
    });
}

// Kamerayı başlat ve FaceMesh'i çalıştır
startCamera();
startFaceMesh();