import {
  vec3,
  mat4,
} from 'gl-matrix'

import Transform from '../transform'

function degToRad(d) {
  return d * Math.PI / 180
}

class Camera {
  constructor({
    fov,
    zNear,
    zFar,
    aspect,
  }) {
    this.projectionMatrix = mat4.create()
    mat4.perspective(this.projectionMatrix, degToRad(fov), aspect, zNear, zFar)

    this.cameraMatrix = new Transform()

    this.pressedKeys = {
      left: false,
      right: false,
      up: false,
      down: false,
      shift: false,
    }

    const setKeys = (key, value) => {
      if(key === 37) {
        this.pressedKeys.left = value
      } else if(key === 39) {
        this.pressedKeys.right = value
      } else if(key === 38) {
        this.pressedKeys.up = value
      } else if(key === 40) {
        this.pressedKeys.down = value
      } else if(key === 16) {
        this.pressedKeys.shift = value
      }
    }
    document.addEventListener('keydown', (event) => {
      setKeys(event.keyCode, true)
    })
    document.addEventListener('keyup', (event) => {
      setKeys(event.keyCode, false)
    })
  }

  get viewMatrix() {
    return this.cameraMatrix.invert
  }

  translate(x, y, z) {
    this.cameraMatrix.translate(x, y, z)
  }

  update() {
    // UPDATE CAMERA
    const speed = 0.1
    if(this.pressedKeys.left) {
      if (this.pressedKeys.shift) {
        this.cameraMatrix.translate(speed, 0, 0)
      } else {
        this.cameraMatrix.rotateY(0.04)
      }
    }
    if(this.pressedKeys.right) {
      if (this.pressedKeys.shift) {
        this.cameraMatrix.translate(-speed, 0, 0)
      } else {
        this.cameraMatrix.rotateY(-0.04)
      }
    }
    if(this.pressedKeys.up) {
      this.cameraMatrix.translate(0, 0, -speed)
    }
    if(this.pressedKeys.down) {
      this.cameraMatrix.translate(0, 0, speed)
    }
    const translation = vec3.create()
    mat4.getTranslation(translation, this.cameraMatrix.matrix)
    // console.log(translation)
  }
}

export default Camera
