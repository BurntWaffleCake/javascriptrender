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
  scale(num) {
    return new Vector3(this.x * num, this.y * num, this.z * num);
  }
  cross(vector) {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  inverseRotateEuler(xd, yd = 0, zd = 0) {
    let x = -(xd * Math.PI) / 180;
    let y = -(yd * Math.PI) / 180;
    let z = -(zd * Math.PI) / 180;

    let zR = new Vector3(
      this.x,
      this.y * Math.cos(z) - this.z * Math.sin(z),
      this.y * Math.sin(z) + this.z * Math.cos(z)
    );
    let yR = {
      x: zR.x * Math.cos(y) + zR.z * Math.sin(y),
      y: zR.y,
      z: -zR.x * Math.sin(y) + zR.z * Math.cos(y),
    };
    return new Vector3(
      yR.x * Math.cos(x) - yR.y * Math.sin(x),
      yR.x * Math.sin(x) + yR.y * Math.cos(x),
      yR.z
    );
  }

  rotateEuler(xd, yd = 0, zd = 0) {
    let x = (xd * Math.PI) / 180;
    let y = (yd * Math.PI) / 180;
    let z = (zd * Math.PI) / 180;

    //column major zyx
    // let xR = {
    //   x: this.x * Math.cos(x) - this.y * Math.sin(x),
    //   y: this.x * Math.sin(x) + this.y * Math.cos(x),
    //   z: this.z,
    // };
    // let yR = {
    //   x: xR.x * Math.cos(y) + xR.z * Math.sin(y),
    //   y: xR.y,
    //   z: -xR.x * Math.sin(y) + xR.z * Math.cos(y),
    // };
    // let zR = new Vector3(
    //   yR.x,
    //   yR.y * Math.cos(z) - yR.z * Math.sin(z),
    //   yR.y * Math.sin(z) + yR.z * Math.cos(z)
    // );

    // let xR = { //row major
    //   x: this.x * Math.cos(x) + this.y * Math.sin(x),
    //   y: this.x * -1 * Math.sin(x) + this.y * Math.cos(x),
    //   z: this.z,
    // };
    // let yR = {
    //   x: xR.x * Math.cos(y) + xR.z * -1 * Math.sin(y),
    //   y: xR.y,
    //   z: xR.x * Math.sin(y) + xR.z * Math.cos(y),
    // };
    // let zR = new Vector3(
    //   yR.x,
    //   yR.y * Math.cos(z) + yR.z * Math.sin(z),
    //   yR.y * -1 * Math.sin(z) + yR.z * Math.cos(z)
    // );

    //xyz euler rotation
    let xR = {
      x: this.x,
      y: this.y * Math.cos(z) - this.z * Math.sin(z),
      z: this.y * Math.sin(z) + this.z * Math.cos(z),
    };
    let yR = {
      x: xR.x * Math.cos(y) + xR.z * Math.sin(y),
      y: xR.y,
      z: -xR.x * Math.sin(y) + xR.z * Math.cos(y),
    };
    let zR = new Vector3(
      yR.x * Math.cos(x) - yR.y * Math.sin(x),
      yR.x * Math.sin(x) + yR.y * Math.cos(x),
      yR.z
    );
    return zR;
  }
}
