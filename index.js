let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

resizeHandler();

function loop() {
    ctx.fillStyle = "#000000";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function resizeHandler() {
    canvas.width = 800;
    canvas.height = 800;
    requestAnimationFrame(loop);
}

window.onresize = resizeHandler;
