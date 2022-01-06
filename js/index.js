/* TODO:
    - [ ] save best result to local storage;
    - [ ] make smooth animation when game is over and smooth snake moving;
    - [ ] game menu.
*/

const canvas = document.querySelector('#canvas');
const gameOverMessage = document.querySelector('.game-over-message');
const scoreView = document.querySelector('.score__count');
const startGamePanel = document.querySelector('.start-game');
const playButton = document.querySelector('.start-game__button');


const ctx = canvas.getContext('2d');

const ROWS = canvas.clientWidth;
const COLUMNS = canvas.clientHeight;
const CELL = 30;

let score;
let fruit;
let snake;

const moveTop    = (x, y) => [x, y - 1];
const moveBottom = (x, y) => [x, y + 1];
const moveLeft   = (x, y) => [x - 1, y];
const moveRight  = (x, y) => [x + 1, y];

const directionsQueue = [];
let lastDirection;
let gameLoopId;

playButton.addEventListener('click', () => {
    startGamePanel.style.display = 'none';
    setup();
    gameLoopId = setInterval(game, 100);
});

function game() {    
    const tailEnd = snake[0];

    drawSnake(snake);
    drawFruit(...fruit);
    
    moveSnake(snake);
    
    const head = snake[snake.length - 1];
    
    ctx.clearRect(tailEnd[0] * CELL, tailEnd[1] * CELL, CELL, CELL);

    if (head[0] === fruit[0] && head[1] === fruit[1]) {
        updateScore();
        snake.unshift(lastDirection(...head));
        fruit = spawnFruitRandomly();
    }

    if (head[0] * CELL >= ROWS || head[0] + 1 <= 0 ||
        head[1] * CELL >= COLUMNS || head[1] + 1 <= 0) {        
        gameOver();
    }

    // Is snake hits itself
    for (let i = 0; i < snake.length - 1; i++) {
        if (isEqual(head, snake[i])) {
            gameOver();
        }
    }
}

function setup() {
    score = 0;
    fruit = spawnFruitRandomly();
    snake = [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1]
    ];

    lastDirection = moveRight;
    document.addEventListener('keydown', handleInput);
    drawFruit(...fruit);
}

function drawSnake(snake) {
    ctx.fillStyle = '#1e8ef9';
    
    for (const [x, y] of snake) {
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
}

function moveSnake(snake) {
    const head = snake[snake.length - 1];
    snake.shift();
    let currentDirection = directionsQueue.shift() || lastDirection;
    snake.push(currentDirection(...head));
}

function drawFruit(x, y) {
    ctx.fillStyle = '#ff9e11';
    ctx.beginPath();
    ctx.arc(x * CELL + CELL / 2,
            y * CELL + CELL / 2,
            CELL / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            ctx.strokeRect(i * CELL, j * CELL, CELL, CELL);
        }        
    }
}

function spawnFruitRandomly() {
    return [
        randint(0, ROWS / CELL),
        randint(0, COLUMNS / CELL)
    ];
}

function gameOver() {
    clearInterval(gameLoopId);
    gameOverMessage.style.display = 'flex';
    canvas.style.boxShadow = '0 0 40px 0 rgba(231, 76, 60, 0.6)';
    canvas.style.border = '2px solid #e74c3c';
}

function updateScore() {  
    score++;
    scoreView.innerHTML = score;
}

function handleInput(e) {
    switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            if (lastDirection !== moveBottom) {
                directionsQueue.push(moveTop);
                lastDirection = moveTop;
            }
            break;
        case 's':
        case 'arrowdown':
            if (lastDirection !== moveTop) {
                directionsQueue.push(moveBottom);
                lastDirection = moveBottom;
            }
            break;
        case 'a':
        case 'arrowleft':
            if (lastDirection !== moveRight) {
                directionsQueue.push(moveLeft);
                lastDirection = moveLeft;
            }
            break;
        case 'd':
        case 'arrowright':
            if (lastDirection !== moveLeft) {
                directionsQueue.push(moveRight);
                lastDirection = moveRight;
            }
            break;
    }
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}