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

// Pointer variables
let pointerX = 0;
let pointerY = 0;

// Fluid Controls
// Idealy, don't put the inflow and outflow rate
// more than 0.01
let inflowRate = 0.01
let outflowRate = 0.01

// Fluid State
let densityField = new Float64Array(tileCountX * tileCountY);
let sources = new Set();
let sinks = new Set();

// Event Code
resizeHandler();

function loop(curentFrame) {
    if (!lastFrame) { lastFrame = curentFrame; }
    let lag = curentFrame - lastFrame;

    if (lag > requiredLag) {
        update(lag);
        draw();
        lastFrame = curentFrame;
    }

    requestAnimationFrame(loop);
}

function update(lag) {
    addDensityFromSources(lag);
    removeDensityFromSinks(lag);
}

function draw() {
    pointer.innerHTML = `(${pointerX}, ${pointerY}): ${densityField[pointerX * tileCountY + pointerY]}`;
    resetCanvas();
    drawGrid();
    drawDensityField();
}

// Helpers functions
function resizeHandler() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    requestAnimationFrame(loop);
}

function resetCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

function drawDensityField() {
    ctx.fillStyle = "#FFFFFF";
    for(let i = 0; i < tileCountX; i++) {
        for(let j = 0; j < tileCountY; j++) {
            ctx.globalAlpha = densityField[i * tileCountY + j];
            ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
        }
    }
}

function addDensityFromSources(lag) {
    sources.forEach(sourcePos => {
        let additionalDensity = (1 - densityField[sourcePos]) * inflowRate * lag / requiredLag;
        densityField[sourcePos] = Math.min(1.0, densityField[sourcePos] + additionalDensity);
    });
}

function removeDensityFromSinks(lag) {
    sinks.forEach(sinkPos => {
        let removedDensity = densityField[sinkPos] * outflowRate * lag / requiredLag;
        densityField[sinkPos] = Math.max(0.0, densityField[sinkPos] - removedDensity);
    });
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
    pointerX = posX;
    pointerY = posY;
});

// Add Sources and Sinks
canvas.addEventListener("click", event => {
    let {posX, posY} = getIndex(event.clientX, event.clientY);
    let sourcePos = posX * tileCountY + posY;
    if (sinks.has(sourcePos)) {
        sinks.delete(sourcePos);
    }
    sources.add(sourcePos);
});
canvas.addEventListener("contextmenu", event => {
    event.preventDefault();
    let {posX, posY} = getIndex(event.clientX, event.clientY);
    let sinkPos = posX * tileCountY + posY;
    if (sources.has(sinkPos)) {
        sources.delete(sinkPos);
    }
    sinks.add(sinkPos);
});
