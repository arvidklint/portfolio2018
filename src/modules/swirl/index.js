import SimplexNoise from 'simplex-noise'

import Vec2 from '../vector/Vec2'

class SwirlyLine {
  constructor({
    canvas,
    startX,
    startY,
    color,
  }) {
    this.noise = new SimplexNoise()
    this.velocity = new Vec2(1, 1)
    this.points = []
    this.currentPosition = new Vec2(startX, startY)
    this.points.push(this.currentPosition.copy)
    this.color = 200
    this.colorDelta = 0.2
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.accelerationMultiplier = 1
    this.noiseMultiplier = 1 / 20
    this.maxAcceleration = 1
    this.maxVelocity = 1
    this.size = 20
    this.cols = Math.floor(this.canvas.width / this.size) + 1
    this.rows = Math.floor(this.canvas.height / this.size) + 1
    this.layer = 0
    this.layerDelta = 0.001
    this.alpha = 0
    this.alphaDelta = 0.001
    this.alphaMax = 0.2
    this.edgeForceMultiplier = 0.02
  }

  drawNoise() {
    const dX = this.canvas.width / this.cols
    const dY = this.canvas.height / this.rows
    for(let y = 0; y < this.rows; y++) {
      for(let x = 0; x < this.cols; x++) {
        const posX = x * dX
        const posY = y * dY
        const v = this.noise.noise3D(x * this.noiseMultiplier, y * this.noiseMultiplier, this.layer) * 255
        this.context.fillStyle=`rgb(${v}, ${v}, ${v})`
        this.context.fillRect(posX, posY, posX + dX, posY + dY)
      }
    }
  }

  clear() {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawField() {
    for(let x = 0; x < this.cols; x++) {
      for(let y = 0; y < this.rows; y++) {
        const angle = this.noise.noise3D(x * this.noiseMultiplier, y * this.noiseMultiplier, this.layer) * Math.PI * 2
        this.context.save();
        this.context.translate(x * this.size, y * this.size);
        this.context.rotate(angle);
        this.context.strokeStyle = "white";
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.size);
        this.context.stroke();
        this.context.restore();
      }
    }
  }

  getEdgeForce(x, y) {
    const center = new Vec2(this.cols / 2, this.rows / 2)
    const force = new Vec2(center.x - x, center.y - y).multiply(this.edgeForceMultiplier)
    return force
  }

  update() {
    // this.clear()
    // this.drawField()
    const x = this.currentPosition.x / this.size
    const y = this.currentPosition.y / this.size
    const angle = this.noise.noise3D(x * this.noiseMultiplier, y * this.noiseMultiplier, this.layer) * Math.PI * 2
    const acceleration = Vec2.createFromAngle(angle).setMagnitude(this.maxAcceleration)
    const edgeForce = this.getEdgeForce(x, y)
    // console.log(edgeForce)
    this.velocity.add(acceleration)
    this.context.beginPath()
    this.context.strokeStyle=`hsla(${this.color}, 100%, 50%, ${this.alpha})`
    this.context.moveTo(this.currentPosition.x, this.currentPosition.y)
    this.context.lineTo(this.currentPosition.x + acceleration.x * 100, this.currentPosition.y + acceleration.y * 100)
    this.context.stroke()
    this.context.closePath()

    // this.context.beginPath()
    // this.context.strokeStyle=`hsla(100, 100%, 50%, ${this.alpha})`
    // this.context.moveTo(this.currentPosition.x, this.currentPosition.y)
    // this.context.lineTo(this.currentPosition.x + edgeForce.x * 100, this.currentPosition.y + edgeForce.y * 100)
    // this.context.stroke()
    // this.context.closePath()

    if (this.velocity.magnitude > this.maxVelocity) {
      this.velocity.setMagnitude(this.maxVelocity)
    }

    this.nextPosition = new Vec2(this.currentPosition.x + this.velocity.x, this.currentPosition.y + this.velocity.y)

    // this.context.beginPath()
    // this.context.strokeStyle=`hsla(${this.color}, 100%, 50%, 0.3)`
    // this.context.moveTo(this.currentPosition.x, this.currentPosition.y)
    // this.context.lineTo(this.nextPosition.x, this.nextPosition.y)
    // this.context.stroke()
    // this.context.closePath()
    // this.context.fillStyle=`hsla(${this.color}, 100%, 50%, 0.3)`
    // this.context.fillRect(this.currentPosition.x, this.currentPosition.y, 10, 10)

    this.points.push(this.nextPosition.copy)
    this.layer += this.layerDelta
    this.color += this.colorDelta
    if (this.color >= 255 || this.color <= 180) {
      this.colorDelta *= -1
    }

    this.alpha += this.alphaDelta
    if (this.alpha > this.alphaMax) {
      this.alpha = this.alphaMax
    }

    this.currentPosition = this.nextPosition.copy
  }
}

export default SwirlyLine
