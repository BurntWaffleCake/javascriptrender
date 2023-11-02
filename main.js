import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";
import { Cube } from "./Model.js";
import { Camera } from "./Camera.js";

const source = document.getElementById("source");
const ctx = source.getContext("2d");

let resolution = 1;
let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;

  if (autoRotate) {
    mainModel.rot.x += dt * rotSpeed;
    mainModel.rot.y += dt * rotSpeed;
    mainModel.rot.z += dt * rotSpeed;
  }

  lookVector = camera.toCameraSpace(camera.pos.add(new Vector3(0, 0, 1)));
  rightVector = lookVector.rotateEuler(0, -90, 0);
  upVector = lookVector.rotateEuler(0, 0, 90);

  handleKeyboardInput(dt);

  // camera.pos.x = Math.sin(t) * 100;
  // camera.rot.y = Math.sin(t) * 10;

  updateCanvasSize(ctx);
  render(ctx, dt);
  window.requestAnimationFrame(loop);
}

let lookVector;
let rightVector;
let upVector;

function handleKeyboardInput(dt) {
  if (wKeyDown) {
    camera.pos = camera.pos.add(
      lookVector.scale(100 * dt).mul(new Vector3(-1, 1, 1))
    );
  }
  if (aKeyDown) {
    camera.pos = camera.pos.sub(
      rightVector.scale(100 * dt).mul(new Vector3(-1, 1, 1))
    );
  }
  if (sKeyDown) {
    camera.pos = camera.pos.sub(
      lookVector.scale(100 * dt).mul(new Vector3(-1, 1, 1))
    );
  }
  if (dKeyDown) {
    camera.pos = camera.pos.add(
      rightVector.scale(100 * dt).mul(new Vector3(-1, 1, 1))
    );
  }
  if (qKeyDown) {
    camera.pos.y -= 100 * dt;
  }
  if (eKeyDown) {
    camera.pos.y += 100 * dt;
  }
}

function init() {
  ctx.canvas.width = source.clientWidth;
  ctx.canvas.height = source.clientHeight;
  window.requestAnimationFrame(loop);
}

init();

let mainModel = new Cube(new Vector3(0, 0, 0));
let models = [mainModel];

let camera = new Camera(ctx, new Vector3(0, 0, -500), undefined, 70, models);

function clearBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.clientWidth / resolution;
  ctx.canvas.height = source.clientHeight / resolution;
}

function render(ctx, dt) {
  clearBackground(ctx);
  camera.render(orthView);
}

// function renderWorldAxis(ctx, mag) {
//   let origin = toScreenSpace(new Vector3(0, 0, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
//   let x = toScreenSpace(new Vector3(mag, 0, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
//   let y = toScreenSpace(new Vector3(0, mag, 0).rotateEuler(rot.x, rot.y, rot.z).add(pos));
//   let z = toScreenSpace(new Vector3(0, 0, mag).rotateEuler(rot.x, rot.y, rot.z).add(pos));

//   ctx.beginPath();
//   ctx.strokeStyle = "rgb(255,0,0)";
//   ctx.moveTo(origin.x, origin.y);
//   ctx.lineTo(x.x, x.y);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.strokeStyle = "rgb(0,255,0)";
//   ctx.moveTo(origin.x, origin.y);
//   ctx.lineTo(y.x, y.y);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.strokeStyle = "rgb(0,0,255)";
//   ctx.moveTo(origin.x, origin.y);
//   ctx.lineTo(z.x, z.y);
//   ctx.stroke();
// }

const fovSlider = document.getElementById("fovSlider");
const fovInput = document.getElementById("fovInput");
var fov = 70;
fovSlider.oninput = function () {
  fovInput.value = fovSlider.value;
  camera.setFov(fovSlider.value);
};
fovInput.oninput = function () {
  fovSlider.value = fovInput.value;
  camera.setFov(fovInput.value);
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
  camera.rot.x = Number(rotXSlider.value);
  disableAutoRotate();
};
rotYSlider.oninput = function () {
  rotYInput.value = rotYSlider.value;
  camera.rot.y = Number(rotYSlider.value);
  disableAutoRotate();
};
rotZSlider.oninput = function () {
  rotZInput.value = rotZSlider.value;
  camera.rot.z = Number(rotZSlider.value);
  disableAutoRotate();
};

rotXInput.oninput = function () {
  rotXSlider.value = rotXInput.value;
  camera.rot.x = Number(rotXInput.value);
  disableAutoRotate();
};
rotYInput.oninput = function () {
  rotYSlider.value = rotYInput.value;
  camera.rot.y = Number(rotYSlider.value);
  disableAutoRotate();
};
rotZInput.oninput = function () {
  rotZSlider.value = rotZInput.value;
  camera.rot.z = Number(rotZInput.value);
  disableAutoRotate();
};

rotReset.onclick = function () {
  rotXInput.value = 0;
  rotYInput.value = 0;
  rotZInput.value = 0;
  rotXSlider.value = 0;
  rotYSlider.value = 0;
  rotZSlider.value = 0;
  camera.rot.set(0, 0, 0);
};

var wKeyDown = false;
var aKeyDown = false;
var sKeyDown = false;
var dKeyDown = false;
var qKeyDown = false;
var eKeyDown = false;
document.onkeydown = function (event) {
  if (event.key == "w") {
    wKeyDown = true;
  } else if (event.key == "a") {
    aKeyDown = true;
  } else if (event.key == "s") {
    sKeyDown = true;
  } else if (event.key == "d") {
    dKeyDown = true;
  } else if (event.key == "q") {
    qKeyDown = true;
  } else if (event.key == "e") {
    eKeyDown = true;
  }
};

document.onkeyup = function (event) {
  if (event.key == "w") {
    wKeyDown = false;
  } else if (event.key == "a") {
    aKeyDown = false;
  } else if (event.key == "s") {
    sKeyDown = false;
  } else if (event.key == "d") {
    dKeyDown = false;
  } else if (event.key == "q") {
    qKeyDown = false;
  } else if (event.key == "e") {
    eKeyDown = false;
  }
};

const inputRender = document.getElementById("inputRender");
const inputObject = document.getElementById("inputObject");

inputRender.onclick = function () {
  let rawText = inputObject.value;
  camera.clearModels();
  mainModel = camera.readOBJ(rawText);
};
