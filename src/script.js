// Canvas
var body = document.body;
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
var width = 500;
var height = 700;
var screenWidth = window.screen.width;
var canvasPosition = screenWidth / 2 - width / 2;
var isMobile = window.matchMedia("(max-width: 600px)");
var gameOverEl = document.createElement("div");
// Paddle
var paddleHeight = 10;
var paddleWidth = 50;
var paddleDiff = 25;
var paddleBottomX = 225;
var paddleTopX = 225;
var playerMoved = false;
var paddleContact = false;
// Ball
var ballX = 250;
var ballY = 350;
var ballRadius = 5;
// Speed
var speedY;
var speedX;
var trajectoryX;
var computerSpeed;
// Change Mobile Settings
if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
}
else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
}
// Score
var playerScore = 0;
var computerScore = 0;
var winningScore = 7;
var isGameOver = true;
var isNewGame = true;
// Render Everything on Canvas
function renderCanvas() {
    // Canvas Background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    // Paddle Color
    context.fillStyle = "white";
    // Player Paddle (Bottom)
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);
    // Computer Paddle (Top)
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);
    // Dashed Center Line
    context.beginPath();
    context.setLineDash([4]);
    context.moveTo(0, 350);
    context.lineTo(500, 350);
    context.strokeStyle = "grey";
    context.stroke();
    // Ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
    context.fillStyle = "white";
    context.fill();
    // Score
    context.font = "32px Courier New";
    context.fillText(playerScore, 20, canvas.height / 2 + 50);
    context.fillText(computerScore, 20, canvas.height / 2 - 30);
}
// Create Canvas Element
function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}
// Reset Ball to Center
function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    paddleContact = false;
}
// Adjust Ball Movement
function ballMove() {
    // Vertical Speed
    ballY += -speedY;
    // Horizontal Speed
    if (playerMoved && paddleContact) {
        ballX += speedX;
    }
}
// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
    // Bounce off Left Wall
    if (ballX < 0 && speedX < 0) {
        speedX = -speedX;
    }
    // Bounce off Right Wall
    if (ballX > width && speedX > 0) {
        speedX = -speedX;
    }
    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
        if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
            paddleContact = true;
            // Add Speed on Hit
            if (playerMoved) {
                speedY -= 1;
                // Max Speed
                if (speedY < -5) {
                    speedY = -5;
                    computerSpeed = 6;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (paddleBottomX + paddleDiff);
            speedX = trajectoryX * 0.3;
        }
        else if (ballY > height) {
            // Reset Ball, add to Computer Score
            ballReset();
            computerScore++;
        }
    }
    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
        if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
            // Add Speed on Hit
            if (playerMoved) {
                speedY += 1;
                // Max Speed
                if (speedY > 5) {
                    speedY = 5;
                }
            }
            speedY = -speedY;
        }
        else if (ballY < 0) {
            // Reset Ball, add to Player Score
            ballReset();
            playerScore++;
        }
    }
}
// Computer Movement
function computerAI() {
    if (playerMoved) {
        if (paddleTopX + paddleDiff < ballX) {
            paddleTopX += computerSpeed;
        }
        else {
            paddleTopX -= computerSpeed;
        }
    }
}
function showGameOverEl(winner) {
    // Hide Canvas
    canvas.hidden = true;
    // Container
    gameOverEl.textContent = "";
    gameOverEl.classList.add("game-over-container");
    // Title
    var title = document.createElement("h1");
    title.textContent = "".concat(winner, " Wins!");
    // Button
    var playAgainBtn = document.createElement("button");
    playAgainBtn.setAttribute("onclick", "startGame()");
    playAgainBtn.textContent = "Play Again";
    // Append
    gameOverEl.append(title, playAgainBtn);
    body.appendChild(gameOverEl);
}
// Check If One Player Has Winning Score, If They Do, End Game
function gameOver() {
    if (playerScore === winningScore || computerScore === winningScore) {
        isGameOver = true;
        // Set Winner
        var winner = playerScore === winningScore ? "Player 1" : "Computer";
        showGameOverEl(winner);
    }
}
// Called Every Frame
function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    if (!isGameOver) {
        window.requestAnimationFrame(animate);
    }
}
// Start Game, Reset Everything
function startGame() {
    if (isGameOver && !isNewGame) {
        body.removeChild(gameOverEl);
        canvas.hidden = false;
    }
    isGameOver = false;
    isNewGame = false;
    playerScore = 0;
    computerScore = 0;
    ballReset();
    createCanvas();
    animate();
    canvas.addEventListener("mousemove", function (e) {
        playerMoved = true;
        // Compensate for canvas being centered
        paddleBottomX = e.clientX - canvasPosition - paddleDiff;
        if (paddleBottomX < paddleDiff) {
            paddleBottomX = 0;
        }
        if (paddleBottomX > width - paddleWidth) {
            paddleBottomX = width - paddleWidth;
        }
        // Hide Cursor
        canvas.style.cursor = "none";
    });
}
// On Load
startGame();
