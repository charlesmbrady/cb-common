import p5 from 'p5';

var paddleLeftX = 20;
var paddleLeftY = 200;

var paddleRightX = 380;
var paddleRightY = 200;

var paddleSpeed = 2;
var paddleHeight = 80;
var paddleWidth = 10;

var leftScore = 0;
var rightScore = 0;

var ballPosX = 200;
var ballPosY = 200;
var ballSpeedX = 0;
var ballSpeedY = 0;
var ballSize = 10;

export function setup(p: p5) {
  // Setup your sketch here
  p.background(240);

  // p.createCanvas(400, 400);

  // Draw rectangles from their center
  // This makes it easier to check whether the ball is above or below the
  // center of a paddle
  p.rectMode(p5.CENTER);
  p.fill(255);
  p.noStroke();
  p.textSize(40);
  p.textAlign(p5.CENTER, p5.CENTER);

  // Start paused
  p.noLoop();
  p.describe(
    'Two narrow white rectangles and a white square representing the paddles and ball in a game of ping pong. The player scores are displayed in the upper corners, and initially text reads "Click to start"',
    p5.FALLBACK
  );
}

export function draw(p: p5) {
  // Draw your sketch here
  // p.background(240);
  // p.fill('#3498db');
  // p.ellipse((p as any).width / 2, (p as any).height / 2, 80, 80);

  const width = (p as any).width;
  const height = (p as any).height;

  // Draw the paddles
  p.rect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight, 1, 1);
  p.rect(paddleRightX, paddleRightY, paddleWidth, paddleHeight, 1, 1);

  // Draw the ball
  p.square(ballPosX, ballPosY, ballSize, 1, 1, 1, 1);

  // Draw the score
  p.text(leftScore, width * 0.25, height * 0.1, 20, 20);
  p.text(rightScore, width * 0.75, height * 0.1, 20, 20);

  // Move the ball using its current speed
  ballPosX += ballSpeedX;
  ballPosY += ballSpeedY;

  // Store coordinates of the left paddle's collision area edges
  let leftCollisionLeft = paddleLeftX - paddleWidth / 2 - ballSize / 2;
  let leftCollisionRight = paddleLeftX + paddleWidth / 2 + ballSize / 2;
  let leftCollisionTop = paddleLeftY - paddleHeight / 2 - ballSize / 2;
  let leftCollisionBottom = paddleLeftY + paddleHeight / 2 + ballSize / 2;

  // If the ball is colliding with the left paddle
  if (
    ballPosX >= leftCollisionLeft &&
    ballPosX <= leftCollisionRight &&
    ballPosY >= leftCollisionTop &&
    ballPosY <= leftCollisionBottom
  ) {
    // Reverse the ball's horizontal speed
    ballSpeedX = -ballSpeedX;

    // Change the ball's vertical speed so it appears to bounce off the paddle
    ballSpeedY = (ballPosY - paddleLeftY) / 20;
  }

  // Store coordinates of the right paddle's collision area edges
  let rightCollisionLeft = paddleRightX - paddleWidth / 2 - ballSize / 2;
  let rightCollisionRight = paddleRightX + paddleWidth / 2 + ballSize / 2;
  let rightCollisionTop = paddleRightY - paddleHeight / 2 - ballSize / 2;
  let rightCollisionBottom = paddleRightY + paddleHeight / 2 + ballSize / 2;

  // If the ball is colliding with the right paddle
  if (
    ballPosX >= rightCollisionLeft &&
    ballPosX <= rightCollisionRight &&
    ballPosY >= rightCollisionTop &&
    ballPosY <= rightCollisionBottom
  ) {
    // Reverse the ball's horizontal speed
    ballSpeedX = -ballSpeedX;

    // Change the ball's vertical speed so it appears to bounce off the paddle
    ballSpeedY = (ballPosY - paddleRightY) / 20;
  }

  // If the ball is beyond the left edge
  if (ballPosX < 0) {
    // Give the right player a point
    rightScore += 1;
    resetBall(p);

    // Otherwise if the ball is beyond the right edge
  } else if (ballPosX > width) {
    // Give the left player a point
    leftScore += 1;
    resetBall(p);

    // Otherwise if the ball is hitting the top or bottom edge
  } else if (ballPosY < 0 || ballPosY > height) {
    // Reverse its vertical speed
    ballSpeedY = -ballSpeedY;
  }

  // Store whether W and S keys are pressed
  let leftDownPressed = p.keyIsDown(83);
  let leftUpPressed = p.keyIsDown(87);

  // Store how much the left paddle will move
  let leftMove = 0;

  if (leftDownPressed === true) {
    leftMove += paddleSpeed;
  }
  if (leftUpPressed === true) {
    leftMove -= paddleSpeed;
  }

  // Prevent the paddle from moving off screen
  paddleLeftY = p.constrain(
    paddleLeftY + leftMove,
    paddleHeight / 2,
    height - paddleHeight / 2
  );

  // Store whether up and down arrow keys are pressed
  let rightDownPressed = p.keyIsDown(p5.DOWN_ARROW);
  let rightUpPressed = p.keyIsDown(p5.UP_ARROW);

  // Store how much the right paddle will move
  let rightMove = 0;

  if (rightDownPressed === true) {
    rightMove += paddleSpeed;
  }
  if (rightUpPressed === true) {
    rightMove -= paddleSpeed;
  }

  // Prevent the paddle from moving off screen
  paddleRightY = p.constrain(
    paddleRightY + rightMove,
    paddleHeight / 2,
    height - paddleHeight / 2
  );

  // Show 'Click to start' if game is paused
  if (p.isLooping() === false) {
    p.text('Click to start', width / 2, height / 2 - 20, 20, 20);
  }
}

// Reset ball to center of canvas with random speed
function resetBall(p: p5) {
  const width = 10;
  const height = 10;
  ballPosX = width / 2;
  ballPosY = height / 2;
  ballSpeedX = p.random([-3, 3]);
  ballSpeedY = p.random([-1, 1]);
}

// function mousePressed() {
//   if (isLooping() === false) {
//     resetBall();
//     loop();
//   }
// }
