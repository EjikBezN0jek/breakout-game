const rules = document.querySelector('.rules');
const rulesBtn = document.querySelector('.rules-btn');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const score = document.querySelector('.score');
const startBtn = document.querySelectorAll('.start-btn');
const gameBoard = document.querySelector('.board');
const finalScore = document.querySelectorAll('.final-score');

const brickRowCount = 6;
const brickColumnCount = 6;

let scoreCounter = 0;

let reqId = 0;

const brickInfo = createBrick(100, 10);

function createBrick(width, padding) {
  return {
    width: width,
    height: 30,
    padding: padding,
    offsetX: (canvas.width - ((brickColumnCount * width) + ((brickColumnCount - 1) * padding))) / 2,
    offsetY: 60,
    visible: true
  }
}


const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = {x, y, ...brickInfo};
  }
}

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 70,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 60,
  width: 80,
  height: 10,
  speed: 8,
  dx: 0,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#6A5ACD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  roundedRect(ctx, paddle.x, paddle.y, paddle.width, paddle.height, 5);
  ctx.fillStyle = "#6A5ACD";
  ctx.fill();
  ctx.closePath();
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      roundedRect(ctx, brick.x, brick.y, brick.width, brick.height, 5);
      ctx.fillStyle = brick.visible ? "#4B0082" : "transparent";
      ctx.fill();
      ctx.closePath();
    })
  })
}

function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
  if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) ball.dx *= -1;
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) ball.dy *= -1;

  let isPaddleContact = ball.x - ball.size > paddle.x &&
                        ball.x - ball.size < paddle.x + paddle.width &&
                        ball.y + ball.size > paddle.y;

  if (isPaddleContact) ball.dy = -ball.speed;
}

function checkHit() {
  bricks.forEach(column => {
    column.forEach(brick => {
      let isHitX = ball.x - ball.size > brick.x && ball.x - ball.size < brick.x + brick.width;
      let isHitY = ball.y + ball.size > brick.y && ball.y - ball.size < brick.y + brick.height;
      if (brick.visible && isHitX && isHitY) {
        ball.dy *= -1;
        brick.visible = false;
        increaseScore();
      }
    })
  });
}

function increaseScore() {
  scoreCounter++;
  updateScore();
}

function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true))
  })
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawBricks();
}

function updateScore() {
  score.innerHTML = `Score: ${scoreCounter}`;
}

function update() {
  draw();
  movePaddle();
  moveBall();
  checkHit();

  if (ball.y + ball.size > canvas.height) {
    resultGame('lose')
  } else if (scoreCounter === brickRowCount * brickColumnCount) {
    resultGame('win');
  } else {
    reqId = window.requestAnimationFrame(update);
  }
}

function resetState() {
  showAllBricks();
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 70;
  paddle.x = canvas.width / 2 - 40;
  paddle.y = canvas.height - 60;
  scoreCounter = 0;
  updateScore();
}

function startGame() {
  resetState();
  gameBoard.dataset.stage = 'active';
  reqId = window.requestAnimationFrame(update);
}

function resultGame(result) {
  finalScore.forEach( elem => elem.innerHTML = `Your score: ${scoreCounter}`);
  gameBoard.dataset.stage = result;
  window.cancelAnimationFrame(reqId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const buttonsLeft = ['ArrowLeft', 'a', 'ф'];
const buttonsRight = ['ArrowRight', 'd', 'в'];

function keyDown(e) {
  if (buttonsRight.includes(e.key)) paddle.dx = paddle.speed;
  if (buttonsLeft.includes(e.key)) paddle.dx = -paddle.speed;
}

function keyUp(e) {
  if ([...buttonsRight, ...buttonsLeft].includes(e.key)) paddle.dx = 0;
}

rulesBtn.addEventListener('click', () => rules.classList.toggle('show'));

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startBtn.forEach(btn => btn.addEventListener('click', startGame));


