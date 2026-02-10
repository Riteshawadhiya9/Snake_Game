const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");


const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;


const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timeIntervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

const blocks = [];
let snake = [
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 }
];

let direction = "down";

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        block.innerText = `${row}-${col}`; //this is for indexing the blocks in the grid
        blocks[`${row}-${col}`] = block;
    }
}

function renderSnake() {

    blocks[`${food.x}-${food.y}`].classList.add("food");

    let head = snake[0];
    if (direction === "right") {
        head = { x: head.x, y: head.y + 1 };
    } else if (direction === "left") {
        head = { x: head.x, y: head.y - 1 };
    } else if (direction === "up") {
        head = { x: head.x - 1, y: head.y };
    } else if (direction === "down") {
        head = { x: head.x + 1, y: head.y };
    }


    // Game Over conditions - Snake collides on wall
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        endGame();
        return;
    }

    // Game Over conditions - Snake bites itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Food Consumption logic
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x}-${food.y}`].classList.add("food");

        snake.unshift(head);

        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            highScoreElement.innerText = highScore;
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    snake.unshift(head);
    snake.pop();


    snake.forEach(segment => {
        // console.log(segment);
        // console.log(blocks[`${segment.x}-${segment.y}`]);
        const block = blocks[`${segment.x}-${segment.y}`];
        block.classList.add("fill");
    });
}

startBtn.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        renderSnake();
    }, 400)
    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number)
        if (sec === 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }
        time = `${min}:${sec}`
        timeElement.innerText = time;
    }, 1000)
})

function endGame() {
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}

restartBtn.addEventListener("click", restartGme);

function restartGme() {
    // Clear all intervals
    clearInterval(intervalId);
    clearInterval(timeIntervalId);

    // Remove old snake and food from board
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    // Reset game variables
    score = 0;
    time = `00:00`;
    direction = "down";
    snake = [{ x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    // Update UI
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    // Start new game
    modal.style.display = "none";
    intervalId = setInterval(() => { renderSnake(); }, 400);
    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number)
        if (sec === 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }
        time = `${min}:${sec}`
        timeElement.innerText = time;
    }, 1000);
}


addEventListener("keydown", (evt) => {
    // console.log(evt.key);
    if (evt.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (evt.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (evt.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (evt.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }
})