export function planeVertices({
  width,
  height,
  dWidth = 1,
  dHeight = 1,
  pivot = {
    x: 0,
    y: 0,
  },
}) {
  const pivotX = -pivot.x * width
  const pivotY = -pivot.y * height

  const dx = width / dWidth
  const dy = height / dHeight

  const vertices = []
  for(let j = 0; j < dHeight; j++) {
    const y = (j / dHeight) * height + pivotY
    for(let i = 0; i < dWidth; i++) {
      const x = (i / dWidth) * width + pivotX
      vertices.push(...[
        x, y, 0,
        x, y + dy, 0,
        x + dx, y, 0,
        x + dx, y, 0,
        x, y + dy, 0,
        x + dx, y + dy, 0,
      ])
    }
  }

  return new Float32Array(vertices)
}

export function planeUVs({
  dWidth = 1,
  dHeight = 1,
}) {
  const dx = 1 / dWidth
  const dy = 1 / dHeight

  const uvs = []
  for(let j = 0; j < dHeight; j++) {
    const y = (j / dHeight)
    for(let i = 0; i < dWidth; i++) {
      const x = (i / dWidth)
      uvs.push(...[
        x, y,
        x, y + dy,
        x + dx, y,
        x + dx, y,
        x, y + dy,
        x + dx, y + dy,
      ])
    }
  }

  return new Float32Array(uvs)
}
