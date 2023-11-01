const source = document.getElementById("source");
const ctx = source.getContext("2d");

function render(ctx, dt) {
  for (let x = 0; x < ctx.canvas.width; x++) {
    for (let y = 0; y < ctx.canvas.height; y++) {
      ctx.fillStyle =
        "rgba(" + 255 * Math.sin(x / 50) + "," + 0 + "," + 255 * Math.sin(y / 50) + ")";
      ctx.fillRect(x, y, 1, 1);
    }
  }

  console.log(ctx.data);
}

let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;

  updateCanvasSize(ctx);
  render(ctx, dt);
  //   window.requestAnimationFrame(loop);
}

function init() {
  window.requestAnimationFrame(loop);
}

init();

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.clientWidth;
  ctx.canvas.height = source.clientHeight;
}
