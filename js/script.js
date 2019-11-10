const gameBox = document.querySelector('.game'),
    canvas = gameBox.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    mobileCotrols = gameBox.querySelector('.mobile-controls'),
    mobUp = mobileCotrols.querySelector('#up'),
    mobLeft = mobileCotrols.querySelector('#left'),
    mobDown = mobileCotrols.querySelector('#down'),
    mobRight = mobileCotrols.querySelector('#right'),
    scoreSpan = gameBox.querySelector('#score-num'),
    pauseButton = gameBox.querySelector('#pause');

let box; // размер ячейки
let startPos;
window.onresize = checkSize;
window.onload = checkSize;
// Подогнать канвас под размер экрана
function resizeGame(w, box, showMobControls) {
    canvas.width = w;
    canvas.height = w;
    box = box;
    gameBox.style = `width: ${w}px`;
    showMobControls ? mobileCotrols.classList.remove('hide') :
        mobileCotrols.classList.add('hide');
    showMobControls ? pauseButton.classList.remove('hide') :
        pauseButton.classList.add('hide');
    startPos = Math.floor(w / box / 2); //Позиция змейки откуда начнется игра
    return box;
}

// Проверяем размер экрана и подгоняем игру под него
function checkSize() {
    let screenWidth = document.documentElement.clientWidth,
        startPos;
    if (screenWidth >= 320 && screenWidth < 375) box = resizeGame(308, 28, true); //11 блоков
    if (screenWidth >= 375 && screenWidth < 425) box = resizeGame(352, 32, true); //11 блоков
    if (screenWidth >= 425 && screenWidth < 768) box = resizeGame(330, 22, true); //15 блоков
    if (screenWidth >= 768 && screenWidth <= 2560) box = resizeGame(555, 37); //15 блоков

    return {
        box: box,
        cW: canvas.width,
        cH: canvas.height
    };
}

// Размеры канваса и ячейки после рассчета размера экрана
let canvasW = checkSize().cW,
    canvasH = checkSize().cH,
    resizedBox = checkSize().box;

// Направление
let dir;

// Управление
document.onkeydown = direction;
document.onclick = direction;

function direction(e) {
    if (e.code === "ArrowUp" && dir !== 'DOWN' || e.code === 'KeyW' && dir !== 'DOWN' ||
        e.target === mobUp && dir !== 'DOWN') dir = 'UP';
    if (e.code === "ArrowLeft" && dir !== 'RIGHT' || e.code === 'KeyA' && dir !== 'RIGHT' ||
        e.target === mobLeft && dir !== 'RIGHT') dir = 'LEFT';
    if (e.code === "ArrowDown" && dir !== 'UP' || e.code === 'KeyS' && dir !== 'UP' ||
        e.target === mobDown && dir !== 'UP') dir = 'DOWN';
    if (e.code === "ArrowRight" && dir !== 'LEFT' || e.code === 'KeyD' && dir !== 'LEFT' ||
        e.target === mobRight && dir !== 'LEFT') dir = 'RIGHT';
    if (e.code === 'Space' || e.target === pauseButton) playOrPauseGame();
}

// Поставить на паузу
let pause = false;

function playOrPauseGame() {
    if (pause) {
        game = setInterval(() => drawGame(), 100);
        pauseButton.textContent = `PAUSE`;
        pause = false;
    } else {
        clearInterval(game);
        scoreElem.textContent = 'PAUSE';
        pauseButton.textContent = `PLAY`;
        pause = true;
    }
}


console.log(startPos);
// Змейка
const snake = [{
    x: startPos * box,
    y: startPos * box
}];

// Еда
const foodImage = new Image();
const foodArr = ['../images/burger.png', '../images/grapes.png', '../images/japan_food.png',
    '../images/sandwich.png', '../images/strawberry.png', '../images/watermellon.png'
];

// Координаты отрисовки еды
let food = {
    x: Math.floor(Math.random() * 10) * box,
    y: Math.floor(Math.random() * 10) * box
};

const randomNum = () => { return Math.floor(Math.random() * foodArr.length) };

// Счёт
let score = 0,
    scoreElem = document.querySelector('#score');
scoreElem.textContent = `Score: ${score}`;

foodImage.src = foodArr[randomNum()];

// Отрисовываем бэкграунд и саму змейку
function drawGame() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    // Рисуем поле
    for (let i = box; i < canvasW; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasH);
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }

    for (let j = box; j < canvasH; j += box) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvasW, j);
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
    //Отрисовать еду
    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Сохраняем координаты головы
    let headX = snake[0].x,
        headY = snake[0].y;

    // Рисуем змейку
    snake.forEach((item, i) => {
        ctx.beginPath();
        ctx.fillStyle = i === 0 ? 'red' : 'green';
        ctx.fillRect(item.x, item.y, box, box);
        ctx.strokeStyle = 'gold';
        ctx.strokeRect(item.x, item.y, box, box);
    });

    //Проверяем если голова столкнулась с телом
    for (let i = 1; i < snake.length; i++) {
        if (headX === snake[i].x && headY === snake[i].y) {
            snake.length = 1;
            score = 0;
            scoreElem.textContent = `Score: ${score}`;
        };
        // Не даем еде появиться на теле змейки
        if (snake.length > 1 && food.x === snake[i].x && food.y === snake[i].y) {
            food = {
                x: Math.floor(Math.random() * 10 + 1) * box,
                y: Math.floor(Math.random() * 10 + 1) * box
            };
            foodImage.src = foodArr[randomNum()];
        }
    }

    // Если змейка съела еду
    if (headX === food.x && headY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 10 + 1) * box,
            y: Math.floor(Math.random() * 10 + 1) * box
        };
        foodImage.src = foodArr[randomNum()];
    } else snake.pop();

    if (dir === 'UP') headY -= box;
    if (dir === 'LEFT') headX -= box;
    if (dir === 'DOWN') headY += box;
    if (dir === 'RIGHT') headX += box;

    headX = headX > canvasW - box ? 0 : headX < 0 ? canvasW - box : headX;
    headY = headY > canvasH - box ? 0 : headY < 0 ? canvasH - box : headY;
    console.log(headX);
    snake.unshift({
        x: headX,
        y: headY
    });
    scoreElem.textContent = `Score: ${score}`;
}
let game = setInterval(() => drawGame(), 100);