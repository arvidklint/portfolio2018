import React, { Component } from 'react'
import PicoGL from 'picogl'

import arvid from '../../obj/arvid.obj'
import cube from '../../obj/cube.obj'
import Camera from '../../modules/camera'

import { planeVertices } from '../../modules/vertexBuffers/plane'

import vertexShaderSource from '../../shaders/vertexShaderSource'
import fragmentShaderSource from '../../shaders/fragmentShaderSource'

class Header extends Component {
  componentDidMount() {
    this.camera = new Camera({
      fov: 60,
      zNear: 1,
      zFar: 1000,
      aspect: this.canvas.clientWidth / this.canvas.clientHeight,
    })
    this.camera.translate(0, 0, 4)

    this.app = PicoGL.createApp(this.canvas).clearColor(0.0, 0.0, 0.0, 0.0).defaultViewport().depthTest()

    this.program = this.app.createProgram(vertexShaderSource, fragmentShaderSource)

    const plane = planeVertices({
      width: 1,
      height: 1,
      dWidth: 10,
      dHeight: 10,
      pivot: {
        x: 0.5,
        y: 0.5,
      },
    })

    console.log(cube)

    const positions = this.app.createVertexBuffer(PicoGL.FLOAT, 3, new Float32Array(arvid.vertices))
    const normals = this.app.createVertexBuffer(PicoGL.FLOAT, 3, new Float32Array(arvid.vertexNormals))
    const indices = this.app.createIndexBuffer(PicoGL.UNSIGNED_SHORT, 3, new Uint16Array(arvid.indices))
    console.log(indices)

    const vertexArray = this.app.createVertexArray()
    .vertexAttributeBuffer(0, positions)
    .vertexAttributeBuffer(1, normals)
    .indexBuffer(indices)

    this.uniformBuffer = this.app.createUniformBuffer([
      PicoGL.FLOAT_MAT4,
      PicoGL.FLOAT_MAT4,
    ])

    const lightBuffer = this.app.createUniformBuffer([
      PicoGL.FLOAT_VEC3,
    ]).set(0, new Float32Array([
      1, 1, 1,
    ])).update()

    this.drawCall = this.app.createDrawCall(this.program, vertexArray)
      .uniformBlock('CameraUniforms', this.uniformBuffer)
      .uniformBlock('LightUniforms', lightBuffer)

    this.draw()
  }

  draw = () => {
    this.camera.update()
    this.app.clear()

    this.uniformBuffer
      .set(0, this.camera.viewMatrix)
      .set(1, this.camera.projectionMatrix)
      .update()

    this.drawCall.draw()
    window.requestAnimationFrame(this.draw)
  }

  render() {
    return (
      <canvas
        ref={(c) => { this.canvas = c }}
        width={window.innerWidth}
        height={window.innerHeight}
      >
      </canvas>
    )
  }
}

export default Header
