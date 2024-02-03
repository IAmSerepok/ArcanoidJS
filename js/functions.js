function drawBall() {
    ctx.beginPath();

    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ff00";
    ctx.fill();

    ctx.closePath();
}

function ricochet(){
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y < ballRadius) {
        dy = -dy;
    } else if (y > canvas.height - ballRadius) {
        if (x + dx > paddleX && x + dx < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert("OTCHISLEN");
            document.location.reload();
            return true;
        }
    }
    return false;
}

function drawPaddle() {
    ctx.beginPath();

    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();

    ctx.closePath();
}

function paddleMovement(){
    if (rightPressed) {
        paddleX = Math.min(paddleX + 10, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 10, 0);
    }
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}
  
  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = Math.min(
                        Math.max(0, relativeX - paddleWidth / 2), 
                        canvas.width - paddleWidth
                        )
    }
  }

// function drawScore() {
//     ctx.font = "16px Arial";
//     ctx.fillStyle = "#0095DD";
//     ctx.fillText(`Score: ${score}`, 8, 20);
// }

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#DD00DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x + dx + ballRadius > b.x &&
                    x + dx - ballRadius < b.x + brickWidth &&
                    y + dy + ballRadius > b.y &&
                    y + dy - ballRadius < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

function generateField(){
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function checkWin(){
    if (score === brickRowCount * brickColumnCount) {
        alert("MISSION PASSED! +REP");
        document.location.reload();
        return true;
    }
    else{
        return false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    collisionDetection();
    paddleMovement();

    drawBall();
    drawPaddle();
    drawBricks();
    // drawScore();

    x += dx;
    y += dy;

    if (!(checkWin() || ricochet())){
        requestAnimationFrame(draw);
    }
}

window.addEventListener('resize', function(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    menu.style.left = canvas.width / 8 + 'px';
    menu.style.top = canvas.height / 4 + 'px';

    document.getElementById("menu-container").style.margin = menu.clientHeight / 8 + 'px 0 0 0';
    document.getElementById("item1").style.width = document.getElementById("item2").style.width = menu.clientWidth * 2 / 5 + 'px';

    for(let i = 1; i < 3; i++){
        document.getElementById("p"+i.toString()).style["font-size"] = menu.clientHeight / 5 + 'px';
    }
});
