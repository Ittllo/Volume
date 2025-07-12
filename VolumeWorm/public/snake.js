const gridSize = 10;
const cellSize = 30;

let snake = [{ x: 5, y: 5 }];
let direction = { x: 0, y: 0 };
let apple = null;
let gameInterval = null;
let volume = 0;
let setExternalVolume = null;
let countdownTimeout = null;

function spawnApple() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

export function startGame(ctx) {
  let countdown = 3;
  drawCountdown(ctx, countdown);

  clearInterval(gameInterval);
  if (countdownTimeout) clearTimeout(countdownTimeout);

  countdownTimeout = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(countdownTimeout);
      beginGame(ctx);
    } else {
      drawCountdown(ctx, countdown);
    }
  }, 1000);
}

function beginGame(ctx) {
  snake = [{ x: 5, y: 5 }];
  direction = { x: 1, y: 0 };
  apple = spawnApple();
  volume = 0;
  if (setExternalVolume) setExternalVolume(volume);

  gameInterval = setInterval(() => updateGame(ctx), 300);
}

function updateGame(ctx) {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
    endGame();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    apple = spawnApple();
    volume = Math.min(volume + 1, 100);
    if (setExternalVolume) setExternalVolume(volume);
  } else {
    snake.pop();
  }

  drawGame(ctx);
}

function drawCountdown(ctx, number) {
  ctx.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize);
  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(number, ctx.canvas.width / 2, ctx.canvas.height / 2);
}

function drawGame(ctx) {
  ctx.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize);

  for (let i = 0; i <= gridSize; i++) {
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, gridSize * cellSize);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(gridSize * cellSize, i * cellSize);
    ctx.stroke();
  }

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);

  ctx.fillStyle = "lime";
  for (const segment of snake) {
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Volume: " + volume, 10, 20);
}

function endGame() {
  clearInterval(gameInterval);
  alert("Fim de jogo! Volume final: " + volume);
}

document.addEventListener("keydown", (e) => {
  if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }

  switch (e.key.toLowerCase()) {
    case "w":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "s":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "a":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "d":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}, { passive: false });

export function connectVolumeController(fn) {
  setExternalVolume = fn;
}

export function restartGame(ctx) {
  startGame(ctx);
}
