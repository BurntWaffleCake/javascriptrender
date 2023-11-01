import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";
import { Cube } from "./Model.js";

const source = document.getElementById("source");
const ctx = source.getContext("2d");

let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;

  if (autoRotate) {
    rot.x += dt * rotSpeed;
    rot.y += dt * rotSpeed;
    rot.z += dt * rotSpeed;
  }

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

let modelCube = new Cube(new Vector3(0, 0, 500));
console.log(modelCube);

function clearBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.clientWidth;
  ctx.canvas.height = source.clientHeight;

  left = -ctx.canvas.width / 2;
  right = ctx.canvas.width / 2;
  top = ctx.canvas.height / 2;
  bottom = -ctx.canvas.height / 2;
  aspect = ctx.canvas.width / ctx.canvas.height;
  near = 100;
  far = 1000;
  aF = 1 / Math.tan((fov * Math.PI) / 180 / 2);
}

let left = -ctx.canvas.width / 2;
let right = ctx.canvas.width / 2;
let top = ctx.canvas.height / 2;
let bottom = -ctx.canvas.height / 2;
let aspect = ctx.canvas.width / ctx.canvas.height;
let near = 100;
let far = 1000;
let aF = 1 / Math.tan((fov * Math.PI) / 180 / 2);

function render(ctx, dt) {
  clearBackground(ctx);
  renderWorldAxis(ctx, 100);
  renderCube(ctx);
}

function renderWorldAxis(ctx, mag) {
  let origin = toScreenSpace(new Vector3(0, 0, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
  let x = toScreenSpace(new Vector3(mag, 0, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
  let y = toScreenSpace(new Vector3(0, mag, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
  let z = toScreenSpace(new Vector3(0, 0, mag).rotateEuler(rot.x, rot.y, rot.z).add(pos));

  ctx.beginPath();
  ctx.strokeStyle = "rgb(255,0,0)";
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(x.x, x.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0,255,0)";
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(y.x, y.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0,0,255)";
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(z.x, z.y);
  ctx.stroke();
}

let pos = new Vector3(0, 0, 500);

let rot = new Vector3(0, 0, 0);

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

function toOrthScreenSpace(vector) {
  let x = (2 * vector.x + pos.x) / (right - left) - (right + left) / (right - left);
  let y = (2 * vector.y + pos.y) / (top - bottom) - (top + bottom) / (top - aspect);

  return {
    x: x * ctx.canvas.width + ctx.canvas.width / 2,
    y: -y * ctx.canvas.height + ctx.canvas.height / 2, //-y as coordinate system is negative
  };
}

function toScreenSpace(vector) {
  let x = ((vector.x * 1) / aspect) * aF;
  let y = vector.y * aF;

  return {
    x: (x / vector.z) * ctx.canvas.width + ctx.canvas.width / 2,
    y: -(y / vector.z) * ctx.canvas.height + ctx.canvas.height / 2, //-y as coordinate system is negative
  };
}

function renderCube(ctx) {
  let worldCube = [];
  for (let vertex of cube) {
    worldCube.push(vertex.rotateEuler(rot.x, rot.y, rot.z).add(pos));
  }

  let screenCube = [];

  for (let vertex of worldCube) {
    if (orthView) {
      screenCube.push(toOrthScreenSpace(vertex));
    } else {
      screenCube.push(toScreenSpace(vertex));
    }
  }

  screenCube.forEach((element, index) => {
    ctx.font = "16px Arial";
    ctx.fillText(String(index), element.x, element.y);
  });

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

const fovSlider = document.getElementById("fovSlider");
const fovInput = document.getElementById("fovInput");
var fov = 70;
fovSlider.oninput = function () {
  fovInput.value = fovSlider.value;
  fov = fovSlider.value;
};
fovInput.oninput = function () {
  fovSlider.value = fovInput.value;
  fov = fovInput.value;
};

const orthInput = document.getElementById("orthBox");
var orthView = false;
orthInput.oninput = function () {
  orthView = orthInput.checked;
};

const rotReset = document.getElementById("angleReset");
const rotAuto = document.getElementById("angleAuto");
const rotSpeedInput = document.getElementById("angleSpeed");

const rotXSlider = document.getElementById("angleXSlider");
const rotYSlider = document.getElementById("angleYSlider");
const rotZSlider = document.getElementById("angleZSlider");

const rotXInput = document.getElementById("angleXInput");
const rotYInput = document.getElementById("angleYInput");
const rotZInput = document.getElementById("angleZInput");

var autoRotate = false;
var rotSpeed = 10;

rotAuto.oninput = function () {
  autoRotate = rotAuto.checked;
};
rotSpeedInput.oninput = function () {
  rotSpeed = Number(rotSpeedInput.value);
};

function disableAutoRotate() {
  autoRotate = false;
  rotAuto.checked = false;
}

rotXSlider.oninput = function () {
  rotXInput.value = rotXSlider.value;
  rot.x = Number(rotXSlider.value);
  disableAutoRotate();
};
rotYSlider.oninput = function () {
  rotYInput.value = rotYSlider.value;
  rot.y = Number(rotYSlider.value);
  disableAutoRotate();
};
rotZSlider.oninput = function () {
  rotZInput.value = rotZSlider.value;
  rot.z = Number(rotZSlider.value);
  disableAutoRotate();
};

rotXInput.oninput = function () {
  rotXSlider.value = rotXInput.value;
  rot.x = Number(rotXInput.value);
  disableAutoRotate();
};
rotYInput.oninput = function () {
  rotYSlider.value = rotYInput.value;
  rot.y = Number(rotYSlider.value);
  disableAutoRotate();
};
rotZInput.oninput = function () {
  rotZSlider.value = rotZInput.value;
  rot.z = Number(rotZInput.value);
  disableAutoRotate();
};

rotReset.onclick = function () {
  rotXInput.value = 0;
  rotYInput.value = 0;
  rotZInput.value = 0;
  rotXSlider.value = 0;
  rotYSlider.value = 0;
  rotZSlider.value = 0;
  rot.set(0, 0, 0);
};
