import { gardenGlobals } from './gardenCanvas'
import { Vector } from './vector'
import { Boid } from './boid'

class GBase extends Boid {
  constructor () {
    super()
    this.context = gardenGlobals().context
    this.width = gardenGlobals().width
    this.height = gardenGlobals().height
    this.center = new Vector(this.width / 2, this.height / 2)
  }
  clear () {
    this.context.reset()
  }
  animate () {
    this.clear()
    this.wander()
    this.update()
    this.draw()
    this.edges()
    requestAnimationFrame(() => this.animate())
  }
}

export class Gardener extends GBase {
  constructor () {
    super()
    this.hat = new Hat()
    this.shoulderLeft = new ShoulderLeft()
    this.shoulderRight = new ShoulderRight()
    this.footRight = new FootRight()
    this.footLeft = new FootLeft()
    this.pos = new Vector(this.center.x, this.center.y)
    this.vel = Vector.random2D()
    this.vel.mult(2)
  }

  update(){
    super.update()
    this.footLeft.advanceFoot(this.vel)
    this.footRight.advanceFoot(this.vel)
  }

  draw () {
    this.context.translate(this.pos.x, this.pos.y)
    //this.context.rotate(0)
    this.context.rotate( Math.PI - this.vel.heading() )
    this.shoulderLeft.draw()
    this.shoulderRight.draw()
    this.footRight.draw()
    this.footLeft.draw()
    this.hat.draw()
    this.context.resetTransform()
  }
}

class Hat extends GBase {
  constructor () {
    super()
  }

  draw (x = 0, y = 0) {
    this.context.beginPath()
    this.context.fillStyle = 'rgb(203, 179, 26)'
    this.context.ellipse(x, y, 22, 25, 0, 0, 2 * Math.PI)
    this.context.fill()
    this.context.beginPath()
    this.context.fillStyle = 'rgb(143, 124, 2)'
    this.context.ellipse(x, y, 12, 15, 0, 0, 2 * Math.PI)
    this.context.fill()
  }
}

class ShoulderLeft extends GBase {
  constructor () {
    super()
    this.pos = new Vector(-22, 0)
  }

  draw () {
    this.context.beginPath()
    this.context.fillStyle = 'blue'
    this.context.ellipse(this.pos.x, this.pos.y, 12, 8, 0, 0, 2 * Math.PI)
    this.context.fill()
  }
}
class ShoulderRight extends GBase {
  constructor () {
    super()
    this.pos = new Vector(22, 0)
  }

  draw () {
    this.context.beginPath()
    this.context.fillStyle = 'blue'
    this.context.ellipse(this.pos.x, this.pos.y, 12, 8, 0, 0, 2 * Math.PI)
    this.context.fill()
  }
}

class FootLeft extends GBase {
  constructor () {
    super()
    this.pos = new Vector(-11, -20)
    this.movingAngle = 0
  }

  advanceFoot(vel){
    this.movingAngle += .2
    if (this.movingAngle >= 2*Math.PI) this.movingAngle = 0
    let speed = vel.mag()
    this.pos.y += Math.sin(this.movingAngle) * .6
  }


  draw () {
    this.context.beginPath()
    this.context.fillStyle = 'black'
    this.context.ellipse(this.pos.x, this.pos.y, 6, 12, 0, 0, 2 * Math.PI)
    this.context.fill()
  }
}

class FootRight extends FootLeft {
  constructor () {
    super()
    this.pos = new Vector(11, -20)
    this.movingAngle = Math.PI
    
  }
}
