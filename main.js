import { Vector3 } from "./Vector3.js";
import { Quaternion } from "./Quaternion.js";
import { Cube } from "./Model.js";
import { Camera } from "./Camera.js";

const source = document.getElementById("source");
const ctx = source.getContext("2d");

let t = 0;
function loop(time) {
  let dt = time / 1000 - t;
  t = time / 1000;

  if (autoRotate) {
    modelCube.rot.x += dt * rotSpeed;
    modelCube.rot.y += dt * rotSpeed;
    modelCube.rot.z += dt * rotSpeed;
  }

  handleKeyboardInput(dt);

  // camera.pos.x = Math.sin(t) * 100;
  // camera.rot.y = Math.sin(t) * 10;

  updateCanvasSize(ctx);
  render(ctx, dt);
  window.requestAnimationFrame(loop);
}

function handleKeyboardInput(dt) {
  if (wKeyDown) {
    camera.pos.z += 100 * dt;
  }
  if (aKeyDown) {
    camera.pos.x -= 100 * dt;
  }
  if (sKeyDown) {
    camera.pos.z -= 100 * dt;
  }
  if (dKeyDown) {
    camera.pos.x += 100 * dt;
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

let modelCube = new Cube(new Vector3(0, 0, 0));
let models = [];

let camera = new Camera(ctx, new Vector3(0, 0, -500), undefined, 70, models);
console.log(modelCube);
camera.readOBJ(
  `# Blender 3.3.1
  # www.blender.org
  mtllib cube.mtl
  o Cube
  v -1.000000 -1.000000 1.000000
  v -1.000000 1.000000 1.000000
  v -1.000000 -1.000000 -1.000000
  v -1.000000 1.000000 -1.000000
  v 1.000000 -1.000000 1.000000
  v 1.000000 1.000000 1.000000
  v 1.000000 -1.000000 -1.000000
  v 1.000000 1.000000 -1.000000
  vn -1.0000 -0.0000 -0.0000
  vn -0.0000 -0.0000 -1.0000
  vn 1.0000 -0.0000 -0.0000
  vn -0.0000 -0.0000 1.0000
  vn -0.0000 -1.0000 -0.0000
  vn -0.0000 1.0000 -0.0000
  vt 0.375000 0.000000
  vt 0.375000 1.000000
  vt 0.125000 0.750000
  vt 0.625000 0.000000
  vt 0.625000 1.000000
  vt 0.875000 0.750000
  vt 0.125000 0.500000
  vt 0.375000 0.250000
  vt 0.625000 0.250000
  vt 0.875000 0.500000
  vt 0.375000 0.750000
  vt 0.625000 0.750000
  vt 0.375000 0.500000
  vt 0.625000 0.500000
  s 0
  f 2/4/1 3/8/1 1/1/1
  f 4/9/2 7/13/2 3/8/2
  f 8/14/3 5/11/3 7/13/3
  f 6/12/4 1/2/4 5/11/4
  f 7/13/5 1/3/5 3/7/5
  f 4/10/6 6/12/6 8/14/6
  f 2/4/1 4/9/1 3/8/1
  f 4/9/2 8/14/2 7/13/2
  f 8/14/3 6/12/3 5/11/3
  f 6/12/4 2/5/4 1/2/4
  f 7/13/5 5/11/5 1/3/5
  f 4/10/6 2/6/6 6/12/6
  `
);

function clearBackground(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function updateCanvasSize(ctx) {
  ctx.canvas.width = source.clientWidth;
  ctx.canvas.height = source.clientHeight;
}

function render(ctx, dt) {
  clearBackground(ctx);
  camera.render();
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
