class Vec3 {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(other) {
    this.x += other.x
    this.y += other.y
    this.z += other.z
    return this
  }

  multiply(value) {
    this.x *= value
    this.y *= value
    this.z *= value
    return this
  }

  get copy() {
    return new Vec3(this.x, this.y, this.z)
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  get array() {
    return [
      this.x,
      this.y,
      this.z,
    ]
  }

  setMagnitude(value) {
    const currentMagnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    const ratio = value / currentMagnitude
    this.x *= ratio
    this.y *= ratio
    this.z *= ratio
    return this
  }

  clampMagnitude(value) {
    const currentMagnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    if (currentMagnitude > value) {
      const ratio = value / currentMagnitude
      this.x *= ratio
      this.y *= ratio
      this.z *= ratio
    }
    return this
  }

  static createFromAngles(alpha, beta) {
    const x = Math.cos(alpha) * Math.sin(beta)
    const y = Math.cos(alpha) * Math.cos(beta)
    const z = Math.sin(beta)
    // console.log(x, y, z)
    return new Vec3(x, y, z)
  }
}

export default Vec3
