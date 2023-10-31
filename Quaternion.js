import { Vector3 } from "./Vector3.js";

export class Quaternion {
  constructor(q0, q1, q2, q3) {
    this.q0 = q0;
    this.q1 = q1;
    this.q2 = q2;
    this.q3 = q3;
  }

  static fromVector3(vector) {
    return new Quaternion(0, vector.x, vector.y, vector.z);
  }

  static fromRotationMatrix(matrix) {
    let q0Mag = Math.sqrt((1 + matrix[0][0] + matrix[1][1] + matrix[2][2]) / 4);
    let q1Mag = Math.sqrt((1 + matrix[0][0] - matrix[1][1] - matrix[2][2]) / 4);
    let q2Mag = Math.sqrt((1 - matrix[0][0] + matrix[1][1] - matrix[2][2]) / 4);
    let q3Mag = Math.sqrt((1 - matrix[0][0] - matrix[1][1] + matrix[2][2]) / 4);

    console.log(q0Mag, q1Mag, q2Mag, q3Mag);

    let index = 0;
    let largest = q0Mag;

    if (q1Mag > largest) {
      index = 1;
      largest = q1Mag;
    }

    if (q2Mag > largest) {
      index = 2;
      largest = q2Mag;
    }

    if (q3Mag > largest) {
      index = 3;
      largest = q3Mag;
    }

    console.log(index);
    if (index == 0) {
      return new Quaternion(
        q0Mag,
        (matrix[2][1] - matrix[1][2]) / (4 * q0Mag),
        (matrix[0][2] - matrix[2][0]) / (4 * q0Mag),
        (matrix[1][0] - matrix[0][1]) / (4 * q0Mag)
      );
    } else if (index == 1) {
      return new Quaternion(
        (matrix[2][1] - matrix[1][2]) / (4 * q1Mag),
        q1Mag,
        (matrix[0][1] + matrix[1][0]) / (4 * q1Mag),
        (matrix[0][2] + matrix[2][0]) / (4 * q1Mag)
      );
    } else if (index == 2) {
      return new Quaternion(
        (matrix[0][2] - matrix[2][0]) / (4 * q2Mag),
        (matrix[0][1] + matrix[1][0]) / (4 * q2Mag),
        q2Mag,
        (matrix[1][2] + matrix[2][1]) / (4 * q2Mag)
      );
    } else if (index == 3) {
      return new Quaternion(
        (matrix[1][0] - matrix[0][1]) / (4 * q3Mag),
        (matrix[0][2] + matrix[2][0]) / (4 * q3Mag),
        (matrix[1][2] + matrix[2][1]) / (4 * q3Mag),
        q3Mag
      );
    }
  }

  mul(to) {
    return new Quaternion(
      this.q0 * to.q0 - this.q1 * to.q1 - this.q2 * to.q2 - this.q3 * to.q3,
      this.q0 * to.q1 + this.q1 * to.q0 - this.q2 * to.q3 + this.q3 * to.q2,
      this.q0 * to.q2 + this.q1 * to.q3 + this.q2 * to.q0 - this.q3 * to.q1,
      this.q0 * to.q3 - this.q1 * to.q2 + this.q2 * to.q1 + this.q3 * to.q0
    );
  }

  inverse() {
    return new Quaternion(this.q0, -this.q1, -this.q2, -this.q3);
  }

  toVector3() {
    return new Vector3(this.q1, this.q2, this.q3);
  }

  applyActive(vector) {
    let vecQ = Quaternion.fromVector3(vector);
    let invQ = this.inverse();
    return this.mul(invQ.mul(vecQ)).toVector3();
  }

  applyPassive(vector) {
    let vecQ = Quaternion.fromVector3(vector);
    let invQ = this.inverse();
    return invQ.mul(this.mul(vecQ)).toVector3();
  }

  toRotationMatrix() {
    return [
      [
        this.q0 ** 2 + this.q1 ** 2 - this.q2 ** 2 - this.q3 ** 2,
        2 * this.q1 * this.q2 - 2 * this.q0 * this.q3,
        2 * this.q1 * this.q2 - 2 * this.q0 * this.q3,
      ],
      [
        2 * this.q1 * this.q2 + 2 * this.q0 * this.q3,
        this.q0 ** 2 - this.q1 ** 2 + this.q2 ** 2 - this.q3 ** 2,
        2 * this.q2 * this.q3 - 2 * this.q0 * this.q1,
      ],
      [
        2 * this.q1 * this.q3 - 2 * this.q0 * this.q2,
        2 * this.q2 * this.q3 + 2 * this.q0 * this.q1,
        this.q0 ** 2 - this.q1 ** 2 - this.q2 ** 2 + this.q3 ** 2,
      ],
    ];
  }
}
