const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreElement");

const gridSize = 30;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameStarted = false; // Oyunun başlayıp başlamadığını kontrol etmek için

// Yön değişimlerini tutacak kuyruk
let directionQueue = [];
const maxQueueSize = 3; // Kuyrukta tutulacak maksimum yön sayısı

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

function update() {
    // Kuyruktan bir sonraki yönü al
    if (directionQueue.length > 0) {
        direction = directionQueue.shift();
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));

    // Sadece oyun başladıysa yemi çiz
    if (gameStarted) {
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function placeFood() {
    // Yeni yem pozisyonu için geçici değişkenler
    let newX, newY;
    let validPosition = false;
    
    // Geçerli bir pozisyon bulana kadar döngüyü sürdür
    while (!validPosition) {
        newX = Math.floor(Math.random() * tileCount);
        newY = Math.floor(Math.random() * tileCount);
        
        // Yeni pozisyonun yılanın herhangi bir parçasıyla çakışıp çakışmadığını kontrol et
        validPosition = !snake.some(segment => segment.x === newX && segment.y === newY);
    }
    
    // Geçerli pozisyon bulunduktan sonra yemi yerleştir
    food.x = newX;
    food.y = newY;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    directionQueue = [];
    score = 0;
    gameStarted = false; // Oyun sıfırlandığında başlangıç durumuna dön
    scoreElement.textContent = score;
}

document.addEventListener("keydown", e => {
    e.preventDefault();
    
    let newDirection;
    switch (e.key) {
        case "ArrowUp": newDirection = { x: 0, y: -1 }; break;
        case "ArrowDown": newDirection = { x: 0, y: 1 }; break;
        case "ArrowLeft": newDirection = { x: -1, y: 0 }; break;
        case "ArrowRight": newDirection = { x: 1, y: 0 }; break;
        default: return;
    }

    // İlk hareket yapıldığında oyunu başlat
    if (!gameStarted) {
        gameStarted = true;
        placeFood(); // İlk yemi yerleştir
    }

    // Eğer kuyruk boşsa ve yeni yön geçerliyse ekle
    if (directionQueue.length === 0) {
        // Mevcut yöne zıt yönde hareket edilemez
        if ((newDirection.x !== -direction.x || newDirection.x === 0) && 
            (newDirection.y !== -direction.y || newDirection.y === 0)) {
            directionQueue.push(newDirection);
        }
    } 
    // Kuyruk doluysa ve son eklenen yönden farklıysa ekle
    else if (directionQueue.length < maxQueueSize) {
        const lastDirection = directionQueue[directionQueue.length - 1];
        if ((newDirection.x !== -lastDirection.x || newDirection.x === 0) && 
            (newDirection.y !== -lastDirection.y || newDirection.y === 0) &&
            (newDirection.x !== lastDirection.x || newDirection.y !== lastDirection.y)) {
            directionQueue.push(newDirection);
        }
    }
});

// Başlangıçta placeFood() çağrısını kaldır
gameLoop();