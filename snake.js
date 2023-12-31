const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
let box = 20;
let canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;
let snake = [{ x: 9 * box, y: 10 * box }];

let food = {
    x: Math.floor(Math.random() * (canvasSize / box - 1) + 1) * box,
    y: Math.floor(Math.random() * (canvasSize / box - 3) + 3) * box,
    dx: (Math.random() < 0.5 ? -1 : 1) * 2, // Randomized initial horizontal velocity
    dy: (Math.random() < 0.5 ? -1 : 1) * 2  // Randomized initial vertical velocity
};

let score = 0;
let d;
let gameInterval;
let foodSpeedIncrement = 0.5; // Increment speed by this amount

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function moveFood() {
    food.x += food.dx;
    food.y += food.dy;

    // Bounce off the walls
    if (food.x <= 0 || food.x >= canvasSize - box) {
        food.dx *= -1;
    }
    if (food.y <= 0 || food.y >= canvasSize - box) {
        food.dy *= -1;
    }
}

function increaseFoodSpeed() {
    // Increase the speed in the direction it is moving
    food.dx += food.dx > 0 ? foodSpeedIncrement : -foodSpeedIncrement;
    food.dy += food.dy > 0 ? foodSpeedIncrement : -foodSpeedIncrement;
}

function randomizeFoodDirection() {
    // Randomize direction for new food
    food.dx = (Math.random() < 0.5 ? -1 : 1) * (Math.abs(food.dx) + foodSpeedIncrement);
    food.dy = (Math.random() < 0.5 ? -1 : 1) * (Math.abs(food.dy) + foodSpeedIncrement);
}

function eatFood(snakeX, snakeY, foodX, foodY) {
    const distance = Math.sqrt(Math.pow(snakeX - foodX, 2) + Math.pow(snakeY - foodY, 2));
    return distance < box;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    moveFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    if (eatFood(snakeX, snakeY, food.x, food.y)) {
        score++;
        randomizeFoodDirection(); // Randomize direction and speed for new food
        food.x = Math.floor(Math.random() * (canvasSize / box - 1)) * box;
        food.y = Math.floor(Math.random() * (canvasSize / box - 1)) * box;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(gameInterval);
        alert(`Game over. Your score: ${score}`);
    }

    snake.unshift(newHead);
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

gameInterval = setInterval(draw, 100);

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}
