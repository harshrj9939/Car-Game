const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

startScreen.addEventListener('click', initializeGame);

let player = { speed: 5, score: 0, start: false };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let speedInterval;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(function(item) {
        if (item.y >= 700) {
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game over <br> Your final score is " + player.score + " <br> Press here to restart the game.";
    clearInterval(speedInterval);
}

function moveEnemy(myCar) {
    let enemyCarList = document.querySelectorAll('.enemyCar');
    enemyCarList.forEach(function(enemyCar) {
        if (isCollide(myCar, enemyCar)) {
            endGame();
        }

        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
            enemyCar.passed = false;
        }

        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";

        // Increment score when myCar's rear end passes the rear end of enemyCar
        let myCarRect = myCar.getBoundingClientRect();
        let enemyCarRect = enemyCar.getBoundingClientRect();

        if (!enemyCar.passed && myCarRect.top < enemyCarRect.bottom) {
            player.score += 10;
            enemyCar.passed = true;
            score.innerText = "Score: " + player.score + " | Speed: " + player.speed;
        }
    });
}

function runGame() {
    let car = document.querySelector('.myCar');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemy(car);

        if (keys.ArrowUp && player.y > (road.top + 150)) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < (road.bottom - 85)) { player.y += player.speed; }
        if (keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }
        if (keys.ArrowRight && player.x < (road.width - 50)) { player.x += player.speed; }

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        window.requestAnimationFrame(runGame);
    }
}

function initializeGame() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    player.speed = 5;
    score.innerText = "Score: " + player.score + " | Speed: " + player.speed;
    window.requestAnimationFrame(runGame);

    speedInterval = setInterval(() => {
        player.speed += 1;
        console.log('Speed increased to:', player.speed); // Debugging log
    }, 5000);

    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement('div');
    car.setAttribute('class', 'myCar');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemyCar');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        enemyCar.passed = false;
        gameArea.appendChild(enemyCar);
    }
}
