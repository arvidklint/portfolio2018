import React, { Component } from 'react'

import SwirlyLine from '../../modules/swirl'


class Swirl extends Component {
  componentDidMount() {
    this.lines = []
    for(let i = 0; i < 30; i++) {
      this.lines.push(new SwirlyLine({
        canvas: this.canvas,
        startX: this.canvas.width / 2 + i,
        startY: this.canvas.height / 2,
        color: 0,
      }))
    }
    this.context = this.canvas.getContext('2d')
    // this.line.drawNoise()
    // this.clear()
    this.draw()
  }

  clear = () => {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw = () => {
    this.lines.forEach((line) => {
      line.update()
    })
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

export default Swirl
