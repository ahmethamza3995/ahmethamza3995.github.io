const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = { x: 50, y: 150, width: 40, height: 30, dy: 0 };
const gravity = 0.4;
const lift = -8;
const pipes = [];
const pipeWidth = 50;
const pipeGap = 140;
let frame = 0;
let score = 0;

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.dy += gravity;
    bird.y += bird.dy;

    if (bird.y < 0) {
        bird.y = 0;
        bird.dy = 0;
    }
    
    if (bird.y + bird.height > canvas.height) {
        resetGame();
    }
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - topHeight - pipeGap,
            passed: false
        });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }

        const birdRight = bird.x + bird.width;
        const birdBottom = bird.y + bird.height;
        const pipeRight = pipe.x + pipeWidth;
        
        if (bird.x < pipeRight && birdRight > pipe.x) {
            if (bird.y < pipe.top || birdBottom > canvas.height - pipe.bottom) {
                resetGame();
                return;
            }
        }

        if (!pipe.passed && pipe.x < bird.x) {
            score++;
            pipe.passed = true;
        }
    }
}

function resetGame() {
    bird.y = 150;
    bird.dy = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    drawPipes();
    updatePipes();

    drawScore();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        bird.dy = lift;
    }
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    bird.dy = lift;
});

gameLoop();