
const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreObj = document.getElementById("score");
const historyList = document.getElementById("history");
const restartBtn = document.getElementById("restartBtn");
const jumpBtn = document.getElementById("jumpBtn");

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const colorPicker = document.getElementById("dinoColor");
const highScoreSpan = document.getElementById("highScore");

const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");

let score = 0;
let speed = 5;
let gameOver = false;
let scoreHistory = [];

let jumping = false;
let velocity = 0;
const gravity = 0.6;     
const jumpPower = 12;   

let highScore = localStorage.getItem("highScore") || 0;
highScoreSpan.innerText = highScore;

startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    game.style.display = "block";
    jumpBtn.style.display = "block";

    dino.style.backgroundColor = colorPicker.value;
});

function jump() {
    if (jumping || gameOver) return;

    velocity = jumpPower;
    jumping = true;

    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});
}

document.addEventListener("keydown", jump);
jumpBtn.addEventListener("click", jump);

setInterval(() => {
    if (gameOver) return;

    velocity -= gravity;
    let bottom = parseFloat(getComputedStyle(dino).bottom);
    bottom += velocity;

    if (bottom <= 0) {
        bottom = 0;
        velocity = 0;
        jumping = false;
    }

    dino.style.bottom = bottom + "px";
}, 20);

setInterval(() => {
    if (gameOver) return;

    let cactusRight = parseInt(getComputedStyle(cactus).right);
    cactus.style.right = cactusRight + speed + "px";

    if (cactusRight > window.innerWidth) {
        cactus.style.right = "-30px";
        score++;
        scoreObj.innerText = score;
        speed += 0.25;
    }

    let dinoBottom = parseInt(getComputedStyle(dino).bottom);

    if (
        cactusRight > window.innerWidth - 120 &&
        cactusRight < window.innerWidth - 70 &&
        dinoBottom < 45
    ) {
        gameOver = true;
        hitSound.currentTime = 0;
        hitSound.play();

        restartBtn.style.display = "block";
        updateHistory(score);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }
}, 20);

function updateHistory(newScore) {
    scoreHistory.unshift(newScore);
    if (scoreHistory.length > 5) scoreHistory.pop();

    historyList.innerHTML = "";
    scoreHistory.forEach(s => {
        const li = document.createElement("li");
        li.textContent = "Score: " + s;
        historyList.appendChild(li);
    }); 
}

restartBtn.addEventListener("click", () => {
    restartBtn.style.display = "none";
    cactus.style.right = "-30px";
    score = 0;
    speed = 5;
    scoreObj.innerText = 0;
    gameOver = false;
});
