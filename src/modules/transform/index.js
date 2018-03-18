import {
  vec3,
  mat4,
} from 'gl-matrix'

const defaultParams = {
  x: 0,
  y: 0,
  z: 0,
}

class Transform {
  constructor(inputParams) {
    const finalParams = {
      ...defaultParams,
      ...inputParams,
    }

    const {
      x,
      y,
      z,
    } = finalParams

    const position = vec3.fromValues(x, y, z)
    this.matrix = mat4.create()
    mat4.fromTranslation(this.matrix, position)
  }

  translate(x, y, z) {
    const delta = vec3.fromValues(x, y, z)
    mat4.translate(this.matrix, this.matrix, delta)
  }

  rotateY(value) {
    mat4.rotateY(this.matrix, this.matrix, value)
  }

  get invert() {
    const inverted = mat4.create()
    mat4.invert(inverted, this.matrix)
    return inverted
  }
}

export default Transform
