const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 40;
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;
const mineCount = 10;

let grid = [];
let revealed = [];
let gameOver = false;

function init() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);
        if (grid[y][x] !== -1) {
            grid[y][x] = -1;
            minesPlaced++;
        }
    }

    // Calculate numbers
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] === -1) continue;
            let count = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy;
                    const nx = x + dx;
                    if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx] === -1) {
                        count++;
                    }
                }
            }
            grid[y][x] = count;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (revealed[y][x]) {
                ctx.fillStyle = "#aaa";
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                if (grid[y][x] === -1) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                } else if (grid[y][x] > 0) {
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.fillText(grid[y][x], x * gridSize + 15, y * gridSize + 25);
                }
            } else {
                ctx.fillStyle = "#555";
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }
}

function reveal(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows || revealed[y][x]) return;
    revealed[y][x] = true;
    if (grid[y][x] === -1) {
        gameOver = true;
        alert("Game Over!");
        init();
    } else if (grid[y][x] === 0) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                reveal(x + dx, y + dy);
            }
        }
    }
}

canvas.addEventListener("click", e => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    reveal(x, y);
    draw();
});

init();
draw();