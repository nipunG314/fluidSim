// DOM Refs
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let pointer = document.querySelector(".pointer");

canvas.width = 800;
canvas.height = 800;

// Timing Code
const fps = 60.0;
const requiredLag = 1000 / fps;
let lastFrame;

// Constants
const tileSize = 5;
const tileCountX = parseInt(canvas.width / tileSize);
const tileCountY = parseInt(canvas.height / tileSize);
const canvasWidth = tileCountX * tileSize;
const canvasHeight = tileCountY * tileSize;
const lineWidth = tileSize / 15;

// Fluid Controls
// Idealy, don't put the inflow and outflow rate
// more than 0.01
let inflowRate = 0.01
let outflowRate = 0.01

// Fluid State
let densityField = new Float64Array(tileCountX * tileCountY);
let sources = [];
let sinks = [];

// Event Code
resizeHandler();

function loop(curentFrame) {
    if (!lastFrame) { lastFrame = curentFrame; }
    let lag = curentFrame - lastFrame;

    if (lag > requiredLag) {
        resetCanvas();
        drawGrid();
        lastFrame = curentFrame;
    }

    requestAnimationFrame();
}

// Helpers functions
function resizeHandler() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    requestAnimationFrame(loop);
}

function resetCanvas() {
    ctx.fillStyle = "#000000";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
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

const getIndex = (mouseX, mouseY) => {
    let canvasRect = canvas.getBoundingClientRect();
    let regionX = mouseX - canvasRect.x;
    let regionY = mouseY - canvasRect.y;
    let posX = Math.floor(regionX / tileSize);
    let posY = Math.floor(regionY / tileSize);

    return {posX, posY};
};

// Event Listeners
window.onresize = resizeHandler;

// Update Pointer position
canvas.addEventListener("mousemove", event => {
    let {posX, posY} = getIndex(event.clientX, event.clientY);
    pointer.innerHTML = `(${posX}, ${posY})`;
});

// Add Sources and Sinks
canvas.addEventListener("click", event => {
    sources.push(getIndex(event.clientX, event.clientY));
});
canvas.addEventListener("contextmenu", event => {
    event.preventDefault();
    sinks.push(getIndex(event.clientX, event.clientY));
});
