class Strip {
  constructor(vertices, colors, indices, indicesOffset) {
    this.vertices = []
    this.colors = []
    this.indices = []
    this.indicesOffset = indicesOffset || 0
    this.max = 10000
  }

  verticesFloat32() {
    return new Float32Array(this.vertices)
  }

  colorsFloat32() {
    return new Float32Array(this.colors)
  }

  indicesUint16() {
    return new Uint16Array(this.indices)
  }

  add(vertices, colors, indices) {
    if (this.vertices.length > this.max) {
      return
    }
    this.vertices = this.vertices.concat(vertices)
    if (colors) {
      this.colors = this.colors.concat(colors)
    }
    if (indices) {
      this.indices = this.indices.concat(indices)
    }
  }
}

export default Strip
