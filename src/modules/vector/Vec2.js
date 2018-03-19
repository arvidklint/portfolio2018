class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(other) {
    this.x += other.x
    this.y += other.y
    return this
  }

  multiply(value) {
    this.x *= value
    this.y *= value
    return this
  }

  get copy() {
    return new Vec2(this.x, this.y)
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  setMagnitude(value) {
    const currentMagnitude = Math.sqrt(this.x * this.x + this.y * this.y)
    const ratio = value / currentMagnitude
    this.x *= ratio
    this.y *= ratio
    return this
  }

  static createFromAngle(angle) {
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    return new Vec2(x, y)
  }
}

export default Vec2
