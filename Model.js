import { Vector3 } from "./Vector3.js";

export class Model {
  constructor(
    pos = new Vector3(0, 0, 0),
    rot = new Vector3(0, 0, 0),
    vertices,
    triangles,
    scale = 1
  ) {
    this.pos = pos;
    this.rot = rot;
    this.scale = scale;
    this.vertices = vertices;
    this.triangles = triangles;
  }

  toWorldSpace(vector) {
    // console.log(vector.rotateEuler(this.rot), this.pos);
    return vector
      .scale(this.scale)
      .rotateEuler(this.rot.x, this.rot.y, this.rot.z)
      .add(this.pos);
  }
}

export class Cube extends Model {
  constructor(pos = new Vector3(0, 0, 0), rot = new Vector3(0, 0, 0), s = 50) {
    let vertices = [
      new Vector3(-s, s, s), //ftl
      new Vector3(s, s, s), //ftr
      new Vector3(s, -s, s), //fbr
      new Vector3(-s, -s, s), //fbl

      new Vector3(-s, s, -s), //btl
      new Vector3(s, s, -s), //btr
      new Vector3(s, -s, -s), //bbr
      new Vector3(-s, -s, -s), //bbl
    ];
    let triangles = [
      //front
      new Vector3(2, 1, 0),
      new Vector3(0, 3, 2),

      //top
      new Vector3(0, 1, 5),
      new Vector3(5, 4, 0),

      new Vector3(6, 5, 1),
      new Vector3(1, 2, 6),

      new Vector3(6, 2, 3),
      new Vector3(3, 7, 6),

      new Vector3(0, 4, 7),
      new Vector3(7, 3, 0),

      //back
      new Vector3(4, 5, 6),
      new Vector3(6, 7, 4),
    ];
    super(pos, rot, vertices, triangles);
  }
}
