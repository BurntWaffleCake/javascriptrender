import { Vector3 } from "./Vector3.js";

export class Camera {
  constructor(
    ctx,
    pos = new Vector3(0, 0, 0),
    rot = new Vector3(0, 0, 0),
    fov = 70,
    models
  ) {
    console.log(models);
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
    console.log(vector.sub(this.pos));
    console.log(this.rot);
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

    return {
      x: (x / vector.z) * this.ctx.canvas.width + this.ctx.canvas.width / 2,
      y: -(y / vector.z) * this.ctx.canvas.height + this.ctx.canvas.height / 2, //-y as coordinate system is negative
    };
  }

  renderTriangle(a, b, c) {
    let surfaceNorm = b.sub(a).unit().cross(c.sub(a).unit());
    let dot = a.sub(this.pos).unit().dot(surfaceNorm);
    if (dot < 0) {
      //   console.log("hidden");
      return;
    } // triangle if facing away from camera

    let camA = this.toCameraSpace(a);
    let camB = this.toCameraSpace(b);
    let camC = this.toCameraSpace(c);

    console.log(camA, camB, camC);

    let screenA = this.toScreenSpace(camA);
    let screenB = this.toScreenSpace(camA);
    let screenC = this.toScreenSpace(camA);

    console.log(screenA, screenB, screenC);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgb(255,0,0)";
    console.log(this.ctx.strokeStyle);
    this.ctx.moveTo(screenA.x, screenA.y);
    this.ctx.lineTo(screenB.x, screenB.y);
    this.ctx.lineTo(screenC.x, screenC.y);
    this.ctx.lineTo(screenA.x, screenA.y);
    console.log(this.ctx);
    this.ctx.stroke();
    d;
  }

  render() {
    this.models.forEach((model, index) => {
      model.triangles.forEach((triangle) => {
        let a = model.vertices[triangle.x];
        let b = model.vertices[triangle.y];
        let c = model.vertices[triangle.z];
        this.renderTriangle(a, b, c);
      });
    });
  }
}
