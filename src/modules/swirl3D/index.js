import SimplexNoise from 'simplex-noise'

import Vec3 from '../vector/Vec3'

import Strip from '../mesh/Strip'

function hslaToRgba(h, s, l, a){
  let r, g, b;

  if(s == 0){
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b, a];
}

class SwirlyStrip {
  constructor({
    startX,
    startY,
    startZ,
    color,
    colorRange,
    colorDelta,
  }) {
    this.color = color
    this.colorRange = colorRange
    this.colorDelta = colorDelta
    this.alpha = 0.5
    this.noise = new SimplexNoise()
    this.velocity = new Vec3(0, 0, 0)
    this.currentPosition = new Vec3(startX, startY, startZ)
    this.layer = 0
    this.layerDelta = 0.001
    this.noiseMultiplier = 0.01
    this.maxVelocity = 0.05
    this.maxAcceleration = 0.3

    const acceleration = this.getAcceleration()
    const secondPosition = this.getSecondPosition(acceleration)
    this.strip = new Strip([
      ...this.currentPosition.array,
      ...secondPosition.array,
    ], [
      ...this.getRgba(1),
      ...this.getRgba(this.alpha),
    ])
  }

  get mesh() {
    return this.strip
  }

  getRgba(alpha) {
    const rgb = hslaToRgba(this.color / 255, 240 / 255, 190 / 255, alpha)
    return rgb
  }

  getAcceleration() {
    const x = this.currentPosition.x * this.noiseMultiplier
    const y = this.currentPosition.y * this.noiseMultiplier
    const z = this.currentPosition.z * this.noiseMultiplier
    // console.log(this.currentPosition)
    // console.log(x, y, z)
    const alpha = this.noise.noise4D(x, y, z, this.layer) * Math.PI * 2
    const beta = this.noise.noise4D(x, y, z, this.layer + 40000) * Math.PI * 2
    // const length = this.noise.noise4D(x, y, z, this.layer + 483234) * 2

    return Vec3.createFromAngles(alpha, beta).clampMagnitude(this.maxAcceleration)
  }

  getSecondPosition(acceleration) {
    return new Vec3(
      this.currentPosition.x + acceleration.x * 14,
      this.currentPosition.y + acceleration.y * 14,
      this.currentPosition.z + acceleration.z * 14,
    )
  }

  update() {
    // console.log(alpha, beta)
    const acceleration = this.getAcceleration()
    // console.log(acceleration)
    this.velocity.add(acceleration)
    if (this.velocity.magnitude > this.maxVelocity) {
      this.velocity.clampMagnitude(this.maxVelocity)
    }
    this.currentPosition = new Vec3(
      this.currentPosition.x + this.velocity.x,
      this.currentPosition.y + this.velocity.y,
      this.currentPosition.z + this.velocity.z,
    )
    // console.log(this.currentPosition.array)
    this.strip.add([
      ...this.currentPosition.array,
      ...this.getSecondPosition(acceleration).array,
    ], [
      ...this.getRgba(1),
      ...this.getRgba(this.alpha),
    ])
    // ], [
    //   this.currentIndicy, this.currentIndicy + 3, this.currentIndicy + 1,
    //   this.currentIndicy, this.currentIndicy + 2, this.currentIndicy + 3,
    // ])
    this.layer += this.layerDelta

    this.color += this.colorDelta
    if (this.color > this.colorRange.max || this.color < this.colorRange.min) {
      this.colorDelta *= -1
    }
  }
}

export default SwirlyStrip
