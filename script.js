const  rules = document.querySelector('.rules');
const rulesBtn = document.querySelector('.rules-btn');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const score = document.querySelector('.score');

const brickRowCount = 6;
const brickColumnCount = 6;

let scoreCounter = 0;


const brickInfo = {
  width: 100,
  height: 30,
  padding: 15,
  offsetX: 62.5,
  offsetY: 60,
  visible: true
};

const bricks = [];
for(let i = 0; i < brickColumnCount; i++){
  bricks[i] = [];
  for(let j = 0; j < brickRowCount; j++){
    const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = {x, y, ...brickInfo};
  }
}

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 200,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 10,
  speed: 8,
  dx: 0,
};


function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0 ,Math.PI * 2);
  ctx.fillStyle = "#6A5ACD";
  ctx.fill();
  ctx.closePath();
}


function drawPaddle() {
  ctx.beginPath();
  roundedRect(ctx,paddle.x,paddle.y,paddle.width,paddle.height,5);
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
  bricks.forEach( column => {
    column.forEach ( brick =>{
      ctx.beginPath();
      roundedRect(ctx, brick.x, brick.y, brick.width, brick.height,5);
      ctx.fillStyle = brick.visible ? "#4B0082" : "transparent";
      ctx.fill();
      ctx.closePath();
    })
  })
}

function draw() {
  drawBall();
  drawPaddle();
  drawBricks();
}

function scoreShow() {
  score.innerHTML = `Score: ${scoreCounter}`;
}

scoreShow();
draw();

function  toggleRules() {
  if(!rules.classList.contains('show')) {
    rules.classList.add('show');
    rulesBtn.classList.add("show");
  } else {
    rules.classList.remove('show');
    rulesBtn.classList.remove("show");
  }
}

rulesBtn.addEventListener('click', toggleRules);