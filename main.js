import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";

const source = document.getElementById("source");
const ctx = source.getContext("2d");

let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;
  camRot.x += dt * 10;
  camRot.y += dt * 10;
  camRot.z += dt * 10;

  updateCanvasSize(ctx);
  render(ctx, dt);
  window.requestAnimationFrame(loop);
}

function init() {
  ctx.canvas.width = source.clientWidth;
  ctx.canvas.height = source.clientHeight;
  window.requestAnimationFrame(loop);
}

init();

function clearBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.width;
  ctx.canvas.height = source.clientHeight;
}

function render(ctx, dt) {
  clearBackground(ctx);
  renderCube(ctx);
}

let pos = new Vector3(0, 0, 0);

let camPos = new Vector3(0, 0, 0);
let camRot = new Vector3(0, 0, 0);

let s = 50;
let cube = [
  new Vector3(-s, s, s),
  new Vector3(s, s, s),
  new Vector3(s, -s, s),
  new Vector3(-s, -s, s),

  new Vector3(-s, s, -s),
  new Vector3(s, s, -s),
  new Vector3(s, -s, -s),
  new Vector3(-s, -s, -s),
];

function renderCube(ctx) {
  let l = -ctx.canvas.width / 2;
  let r = ctx.canvas.width / 2;
  let t = ctx.canvas.height / 2;
  let b = -ctx.canvas.height / 2;
  let n = 100
  let f = 1000

  let worldCube = [];
  for (let vertex of cube) {
    worldCube.push(vertex.rotateEuler(camRot.x, camRot.y, camRot.z).add(pos));
  }

  let screenCube = [];
  for (let vertex of worldCube) {
    // let x = (2 * vertex.x + pos.x) / (r - l) - (r + l) / (r - l);
    // let y = (2 * vertex.y + pos.y) / (t - b) - (t + b) / (t - b);

    let x = (2 * ) / (r - l) * (vertex.x + pos.x) - (r + l) / (r - l) * vertex.z;
    let y = (2 * ) / (t - b) * (vertex.y + pos.y) - (t + b) / (t - b) * vertex.z;
    screenCube.push({
      x: x * ctx.canvas.width + ctx.canvas.width / 2,
      y: y * ctx.canvas.height + ctx.canvas.height / 2,
    });
  }

  ctx.beginPath();
  ctx.strokeStyle = "rgb(255, 0, 0)";
  ctx.moveTo(screenCube[0].x, screenCube[0].y);
  ctx.lineTo(screenCube[1].x, screenCube[1].y);
  ctx.lineTo(screenCube[2].x, screenCube[2].y);
  ctx.lineTo(screenCube[3].x, screenCube[3].y);
  ctx.lineTo(screenCube[0].x, screenCube[0].y);

  ctx.moveTo(screenCube[4].x, screenCube[4].y);
  ctx.lineTo(screenCube[5].x, screenCube[5].y);
  ctx.lineTo(screenCube[6].x, screenCube[6].y);
  ctx.lineTo(screenCube[7].x, screenCube[7].y);
  ctx.lineTo(screenCube[4].x, screenCube[4].y);

  ctx.moveTo(screenCube[0].x, screenCube[0].y);
  ctx.lineTo(screenCube[4].x, screenCube[4].y);
  ctx.moveTo(screenCube[1].x, screenCube[1].y);
  ctx.lineTo(screenCube[5].x, screenCube[5].y);
  ctx.moveTo(screenCube[2].x, screenCube[2].y);
  ctx.lineTo(screenCube[6].x, screenCube[6].y);
  ctx.moveTo(screenCube[3].x, screenCube[3].y);
  ctx.lineTo(screenCube[7].x, screenCube[7].y);

  ctx.stroke();
}
