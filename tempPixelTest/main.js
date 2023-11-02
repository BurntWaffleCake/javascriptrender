const source = document.getElementById("source");
const ctx = source.getContext("2d");

const OBJFile = require("obj-file-parser");
const cubeFile = `# cube.obj
#

g cube
 
v  0.0  0.0  0.0
v  0.0  0.0  1.0
v  0.0  1.0  0.0
v  0.0  1.0  1.0
v  1.0  0.0  0.0
v  1.0  0.0  1.0
v  1.0  1.0  0.0
v  1.0  1.0  1.0

vn  0.0  0.0  1.0
vn  0.0  0.0 -1.0
vn  0.0  1.0  0.0
vn  0.0 -1.0  0.0
vn  1.0  0.0  0.0
vn -1.0  0.0  0.0
 
f  1//2  7//2  5//2
f  1//2  3//2  7//2 
f  1//6  4//6  3//6 
f  1//6  2//6  4//6 
f  3//3  8//3  7//3 
f  3//3  4//3  8//3 
f  5//5  7//5  8//5 
f  5//5  8//5  6//5 
f  1//4  5//4  6//4 
f  1//4  6//4  2//4 
f  2//1  6//1  8//1 
f  2//1  8//1  4//1 `;
console.log(cubeFile);
console.log("starting");

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
