export const videoPlayer = document.getElementById('videoPlayer');

window.currentVolume = 0;
videoPlayer.volume = 0;

videoPlayer.addEventListener('volumechange', () => {
  const expected = window.currentVolume / 100;
  if (Math.abs(videoPlayer.volume - expected) > 0.01) {
    videoPlayer.volume = expected;
  }
});

export function setVolume(newVolume) {
  window.currentVolume = Math.min(100, Math.max(0, newVolume));
  videoPlayer.volume = window.currentVolume / 100;
}

export function loadVideo(src) {
  videoPlayer.src = src;

  setTimeout(() => {
    videoPlayer.play().catch(() => {
      console.warn('Autoplay bloqueado, aguardando interação do usuário...');
    });
  }, 100);
}
