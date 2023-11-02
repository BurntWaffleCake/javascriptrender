import { Vector3 } from "./Vector3.js";
import { OBJFile } from "./OBJFile.js";
import { Model } from "./Model.js";

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
    let x =
      (2 * vector.x) / (this.right - this.left) -
      (this.right + this.left) / (this.right - this.left);
    let y =
      (2 * vector.y) / (this.top - this.bottom) -
      (this.top + this.bottom) / (this.top - this.aspect);

    return {
      x: x * this.ctx.canvas.width + this.ctx.canvas.width / 2,
      y: -y * this.ctx.canvas.height + this.ctx.canvas.height / 2, //-y as coordinate system is negative
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

  renderTriangle(a, b, c, orth) {
    // vertices in camera space
    let screenA;
    let screenB;
    let screenC;

    if (orth) {
      screenA = this.toOrthScreenSpace(a);
      screenB = this.toOrthScreenSpace(b);
      screenC = this.toOrthScreenSpace(c);
    } else {
      screenA = this.toScreenSpace(a);
      screenB = this.toScreenSpace(b);
      screenC = this.toScreenSpace(c);
    }

    let cross = new Vector3(
      screenB.x - screenA.x,
      screenB.y - screenA.y,
      0
    ).cross(new Vector3(screenC.x - screenB.x, screenC.y - screenB.y, 0));

    if (cross.z < 0) {
      return;
    }

    let mean = a
      .add(b)
      .add(c)
      .scale(1 / 3);

    let surfaceNorm = b.sub(a).unit().cross(c.sub(a).unit());

    let screenMean = this.toScreenSpace(mean);
    let screenNormal = this.toScreenSpace(mean.add(surfaceNorm.scale(50)));

    let dot = surfaceNorm.dot(new Vector3(1, 1, -1).unit()) / 2 + 0.5;

    let style =
      "rgb(" +
      String(255 * dot) +
      "," +
      String(255 * dot) +
      "," +
      String(255 * dot) +
      ")";
    this.ctx.strokeStyle = style;
    this.ctx.fillStyle = style;
    this.ctx.beginPath();
    this.ctx.moveTo(screenA.x, screenA.y);
    this.ctx.lineTo(screenB.x, screenB.y);
    this.ctx.lineTo(screenC.x, screenC.y);
    this.ctx.lineTo(screenA.x, screenA.y);
    this.ctx.fill();
    this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.strokeStyle = "rgb(255,0,0)";
    // this.ctx.moveTo(screenMean.x, screenMean.y);
    // this.ctx.lineTo(screenNormal.x, screenNormal.y);
    // this.ctx.stroke();
  }

  render(orth) {
    this.aspect = this.ctx.canvas.width / this.ctx.canvas.height;

    this.models.forEach((model, index) => {
      let worldTriangles = [];
      let cameraTriangles = [];

      model.triangles.forEach((triangle) => {
        let a = model.toWorldSpace(model.vertices[triangle.x]);
        let b = model.toWorldSpace(model.vertices[triangle.y]);
        let c = model.toWorldSpace(model.vertices[triangle.z]);
        worldTriangles.push([a, b, c]);
      });

      worldTriangles.forEach((triangle) => {
        let camA = this.toCameraSpace(triangle[0]);
        let camB = this.toCameraSpace(triangle[1]);
        let camC = this.toCameraSpace(triangle[2]);
        let minZ = Math.min(camA.z, camB.z, camC.z);
        cameraTriangles.push([camA, camB, camC, minZ]);
      });

      cameraTriangles.sort((a, b) => {
        return -(a[3] - b[3]);
      });

      // console.log(cameraTriangles);

      cameraTriangles.forEach((triangle) => {
        this.renderTriangle(triangle[0], triangle[1], triangle[2], orth);
      });
    });
  }

  clearModels() {
    this.models = [];
  }

  readOBJ(file) {
    let object = new OBJFile(file);
    let model = object.parse();

    let vertices = [];
    let faces = [];

    model.models.forEach((model) => {
      model.vertices.forEach((vertex) => {
        vertices.push(new Vector3(vertex.x, vertex.y, vertex.z));
      });

      model.faces.forEach((face) => {
        let a = face.vertices[0];
        let b = face.vertices[1];
        let c = face.vertices[2];
        faces.push(
          new Vector3(a.vertexIndex - 1, b.vertexIndex - 1, c.vertexIndex - 1)
        );
      });
    });

    let newModel = new Model(
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      vertices,
      faces,
      50
    );

    this.models.push(newModel);
    return newModel;
  }
}
