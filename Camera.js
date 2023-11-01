import { Vector3 } from "./Vector3.js";

export class Camera {
  constructor(
    ctx,
    pos = new Vector3(0, 0, 0),
    rot = new Vector3(0, 0, 0),
    fov = 70,
    models
  ) {
    this.ctx = ctx;
    this.pos = pos;
    this.rot = rot;
    this.fov = fov;
    this.models = models;

    this.left = -ctx.canvas.width / 2;
    this.right = ctx.canvas.width / 2;
    this.top = ctx.canvas.height / 2;
    this.bottom = -ctx.canvas.height / 2;
    this.aspect = ctx.canvas.width / ctx.canvas.height;
    this.near = 100;
    this.far = 1000;
    this.aF = 1 / Math.tan((fov * Math.PI) / 180 / 2);
  }

  setFov(fov) {
    this.fov = fov;
    this.aF = 1 / Math.tan((fov * Math.PI) / 180 / 2);
  }

  toCameraSpace(vector) {
    return vector
      .sub(this.pos)
      .inverseRotateEuler(this.rot.x, this.rot.y, this.rot.z);
  }

  toOrthScreenSpace(vector) {
    let x = (2 * vector.x) / (right - left) - (right + left) / (right - left);
    let y = (2 * vector.y) / (top - bottom) - (top + bottom) / (top - aspect);

    return {
      x: x * ctx.canvas.width + ctx.canvas.width / 2,
      y: -y * ctx.canvas.height + ctx.canvas.height / 2, //-y as coordinate system is negative
    };
  }

  toScreenSpace(vector) {
    let x = ((vector.x * 1) / this.aspect) * this.aF;
    let y = vector.y * this.aF;
    (vector.z * (this.far + this.near)) / (this.near - this.far) +
      (2 * this.far * this.near) / (this.near - this.far);

    return {
      x: (x / vector.z) * this.ctx.canvas.width + this.ctx.canvas.width / 2,
      y: -(y / vector.z) * this.ctx.canvas.height + this.ctx.canvas.height / 2, //-y as coordinate system is negative
    };
  }

  renderTriangle(a, b, c) {
    let camA = this.toCameraSpace(a);
    let camB = this.toCameraSpace(b);
    let camC = this.toCameraSpace(c);

    let screenA = this.toScreenSpace(camA);
    let screenB = this.toScreenSpace(camB);
    let screenC = this.toScreenSpace(camC);

    let cross = new Vector3(
      screenB.x - screenA.x,
      screenB.y - screenA.y,
      0
    ).cross(new Vector3(screenC.x - screenB.x, screenC.y - screenB.y, 0));

    if (cross.z < 0) {
      return;
    }

    let mean = camA
      .add(camB)
      .add(camC)
      .scale(1 / 3);

    let surfaceNorm = b.sub(a).unit().cross(c.sub(a).unit());
    // let surfaceNorm = camB.sub(camA).unit().cross(camC.sub(camA).unit());

    // console.log(cross.z);
    let screenMean = this.toScreenSpace(mean);
    let screenNormal = this.toScreenSpace(mean.add(surfaceNorm.scale(50)));

    let dot = surfaceNorm.dot(new Vector3(1, 1, -1).unit()) / 2 + 0.5;

    this.ctx.strokeStyle = "rgb(0,0,0)";
    this.ctx.fillStyle =
      "rgb(" +
      String(255 * dot) +
      "," +
      String(255 * dot) +
      "," +
      String(255 * dot) +
      ")";
    this.ctx.beginPath();
    this.ctx.moveTo(screenA.x, screenA.y);
    this.ctx.lineTo(screenB.x, screenB.y);
    this.ctx.lineTo(screenC.x, screenC.y);
    this.ctx.lineTo(screenA.x, screenA.y);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgb(255,0,0)";
    this.ctx.moveTo(screenMean.x, screenMean.y);
    this.ctx.lineTo(screenNormal.x, screenNormal.y);
    this.ctx.stroke();
  }

  render() {
    this.models.forEach((model, index) => {
      model.triangles.forEach((triangle) => {
        let a = model.toWorldSpace(model.vertices[triangle.x]);
        let b = model.toWorldSpace(model.vertices[triangle.y]);
        let c = model.toWorldSpace(model.vertices[triangle.z]);
        // console.log(a, b, c);
        this.renderTriangle(a, b, c);
      });
    });
  }
}
