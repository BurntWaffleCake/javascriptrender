const source = document.getElementById("source");
const ctx = source.getContext("2d");

let resolution = 20;

function render(ctx, dt, t) {
  for (let x = 0; x < ctx.canvas.width; x++) {
    for (let y = 0; y < ctx.canvas.height; y++) {
      ctx.fillStyle =
        "rgba(" +
        255 * Math.sin((x * resolution) / 50 + t) +
        "," +
        String(0) + // * Math.sin((x * resolution) / 50 + t) +
        "," +
        String(0) + // * Math.sin((y * resolution) / 50 + t) +
        ")";
      ctx.fillRect(x, y, 1, 1);
    }
  }

  console.log(ctx.data);
}

let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;

  console.log(dt);

  updateCanvasSize(ctx);
  render(ctx, dt, t);
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(ctx.canvas.width / 2, ctx.canvas.height / 2, 5, 5);
  console.log(ctx.canvas.width * ctx.canvas.height);
  window.requestAnimationFrame(loop);
}

function init() {
  window.requestAnimationFrame(loop);
}

ctx.imageSmoothingEnabled = false;
init();

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.clientWidth / resolution;
  ctx.canvas.height = source.clientHeight / resolution;
}
