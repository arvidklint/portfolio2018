import React, { Component } from 'react'
import PicoGL from 'picogl'

import SwirlyStrip from '../../modules/swirl3D'
import Camera from '../../modules/camera'
import Transform from '../../modules/transform'

import vertexShaderSource from '../../shaders/swirl/vertex'
import fragmentShaderSource from '../../shaders/swirl/fragment'

class Swirl3D extends Component {
  componentDidMount() {
    this.size = 20
    this.width = this.canvas.innerWidth
    this.height = this.canvas.innerHeight

    this.camera = new Camera({
      fov: 30,
      zNear: 1,
      zFar: 1000,
      aspect: this.canvas.clientWidth / this.canvas.clientHeight,
    })
    this.camera.translate(0, 0, 35)

    this.modelTransform = new Transform()

    this.app = PicoGL.createApp(this.canvas)
      .clearColor(1.0, 1.0, 1.0, 1.0)
      .defaultViewport()
      .depthTest()
      .blend()
      .blendFunc(PicoGL.ONE, PicoGL.ONE_MINUS_SRC_ALPHA)

    this.program = this.app.createProgram(vertexShaderSource, fragmentShaderSource)

    this.swirls = []
    const colorRange = {
      max: 40,
      min: 0,
    }
    const colorDelta = 0.5
    for(let i = 0; i < 30; i++) {
      this.swirls.push(new SwirlyStrip({
        startX: 0.1 * i,
        startY: 0,
        startZ: 0,
        color: Math.random() * (colorRange.max - colorRange.min) + colorRange.min,
        colorRange,
        colorDelta,
      }))
    }

    // for(let i = 0; i < 100; i++) {
    //   this.swirlyStrip.update()
    // }

    this.draw()
  }

  setBuffers = (mesh) => {
    const positions = this.app.createVertexBuffer(PicoGL.FLOAT, 3, mesh.verticesFloat32())
    const colors = this.app.createVertexBuffer(PicoGL.FLOAT, 4, mesh.colorsFloat32())
    // const indices = this.app.createIndexBuffer(PicoGL.UNSIGNED_SHORT, 3, new Uint16Array(mesh.indices))

    const vertexArray = this.app.createVertexArray()
      .vertexAttributeBuffer(0, positions)
      .vertexAttributeBuffer(1, colors)
      // .indexBuffer(indices)

    const cameraBuffer = this.app.createUniformBuffer([
      PicoGL.FLOAT_MAT4,
      PicoGL.FLOAT_MAT4,
    ])

    cameraBuffer
      .set(0, this.camera.viewMatrix)
      .set(1, this.camera.projectionMatrix)
      .update()

    const modelBuffer = this.app.createUniformBuffer([
      PicoGL.FLOAT_MAT4,
    ])

    modelBuffer
      .set(0, this.modelTransform.matrix)
      .update()

    this.drawCall = this.app.createDrawCall(this.program, vertexArray, PicoGL.TRIANGLE_STRIP)
      .uniformBlock('CameraUniforms', cameraBuffer)
      .uniformBlock('ModelUniforms', modelBuffer)
  }

  draw = () => {
    this.camera.update()
    this.app.clear()
    this.modelTransform.rotateY(0.002)

    this.swirls.forEach((swirl) => {
      swirl.update()
      this.setBuffers(swirl.mesh)
      this.drawCall.draw()
    })

    // this.drawCall.draw()
    window.requestAnimationFrame(this.draw)
  }

  render() {
    return (
      <canvas
        ref={(c) => { this.canvas = c }}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: 'fixed',
          top: '0'
        }}
      >
      </canvas>
    )
  }
}

export default Swirl3D
