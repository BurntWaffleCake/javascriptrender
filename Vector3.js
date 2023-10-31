export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  unit() {
    let mag = this.mag();
    return new Vector3(this.x / mag, this.y / mag, this.z / mag);
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  mag2() {
    // returns magnitude of vector squared (no sqrt operation)
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }
  add(vector) {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }
  sub(vector) {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }
  mul(vector) {
    return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
  }
  div(vector) {
    return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
  }
  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  cross(vector) {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  rotateEuler(xd, yd = 0, zd = 0) {
    let x = (xd * Math.PI) / 180;
    let y = (yd * Math.PI) / 180;
    let z = (zd * Math.PI) / 180;

    let xR = {
      x: this.x * Math.cos(x) - this.y * Math.sin(x),
      y: this.x * Math.sin(x) + this.y * Math.cos(x),
      z: this.z,
    };
    let yR = {
      x: xR.x * Math.cos(y) + xR.z * Math.sin(y),
      y: xR.y,
      z: -xR.x * Math.sin(y) + xR.z * Math.cos(y),
    };
    let zR = new Vector3(
      yR.x,
      yR.y * Math.cos(z) - yR.z * Math.sin(z),
      yR.y * Math.sin(z) + yR.z * Math.cos(z)
    );
    return zR;
  }
}
