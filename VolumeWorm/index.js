import { connectVolumeController, restartGame } from './snake.js';
import { loadVideo, setVolume, videoPlayer } from './video.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const videoSelect = document.getElementById('videoSelect');
const restartBtn = document.getElementById('restartBtn');
const trackTitle = document.getElementById('trackTitle');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Controla volume via cobrinha
connectVolumeController(setVolume);

// Inicialização
function init() {
  loadVideo(videoSelect.value);
  restartGame(ctx);
  updateTrackTitle();
  setupEventListeners();
}

function updateTrackTitle() {
  const selectedOption = videoSelect.options[videoSelect.selectedIndex];
  trackTitle.textContent = selectedOption.text;
}

// Troca de música
videoSelect.addEventListener('change', () => {
  loadVideo(videoSelect.value);
  restartGame(ctx);
  updateTrackTitle();
  scrollToGame();
});

// Reiniciar o jogo
restartBtn.addEventListener('click', () => {
  restartGame(ctx);
});

// Barra de progresso - seek
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  if (videoPlayer.duration) {
    videoPlayer.currentTime = percent * videoPlayer.duration;
  }
});

// Atualiza a barra e o tempo conforme o vídeo toca
videoPlayer.addEventListener('timeupdate', () => {
  if (videoPlayer.duration) {
    const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressFill.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
    durationEl.textContent = formatTime(videoPlayer.duration);
  }
});

// Scroll suave até o jogo
function scrollToGame() {
  canvas.scrollIntoView({ behavior: 'smooth' });
}

// Formatação tempo mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Permitir play após interação para evitar bloqueio autoplay
document.body.addEventListener('click', () => {
  if (videoPlayer.paused) {
    videoPlayer.play().catch(() => {});
  }
}, { once: true });

init();
