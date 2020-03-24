let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let positionHandle = document.querySelector(".position");

canvas.width = 800;
canvas.height = 800;

const tileSize = 5;
const tileCountX = parseInt(canvas.width / tileSize);
const tileCountY = parseInt(canvas.height / tileSize);
const canvasWidth = tileCountX * tileSize;
const canvasHeight = tileCountY * tileSize;
const lineWidth = tileSize / 15;
const getIndex = (mouseX, mouseY) => {
    let canvasRect = canvas.getBoundingClientRect();
    let regionX = mouseX - canvasRect.x;
    let regionY = mouseY - canvasRect.y;
    let posX = Math.floor(regionX / tileSize);
    let posY = Math.floor(regionY / tileSize);

    return {posX, posY};
};

resizeHandler();

function loop() {
    ctx.fillStyle = "#000000";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    drawGrid();
    requestAnimationFrame(loop);
}

function resizeHandler() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    requestAnimationFrame(loop);
}

function drawGrid() {
    ctx.beginPath();
    for(let i=0; i < tileCountX; i++) {
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, tileCountY * tileSize);
    }
    for(let i=0; i < tileCountY; i++) {
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(tileCountX * tileSize, i * tileSize);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
}

window.onresize = resizeHandler;
canvas.addEventListener("mousemove", event => {
    let {posX, posY} = getIndex(event.clientX, event.clientY);
    positionHandle.innerHTML = `(${posX}, ${posY})`;
});
