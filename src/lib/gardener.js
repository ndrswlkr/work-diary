import { gardenGlobals } from './gardenCanvas'
import { Vector } from './vector'
import { Boid } from './boid'
import { allBedIds, allBeds } from './stores'
import { random } from './mathlib'
class GBase extends Boid {
  constructor () {
    super()
    this.context = gardenGlobals().context
    this.width = gardenGlobals().width
    this.height = gardenGlobals().height
    this.center = new Vector(this.width / 2, this.height / 2)
    this.target = null
    this.wait = 0
    this.gardenMap = document.getElementById('garden-map')
    this.run = false
  }
  clear () {
    this.context.reset()
  }
  animate () {
    this.clear()
    //this.wander()
    if (this.wait > 0) {
      this.wait -= 1
    } else {
      if (!this.target) {
        let beds = allBeds()
        let choice = beds[Math.floor(random(0, beds.length - 1))]
        console.log(choice)
        let canvasDiv = document.getElementById('canvas-div')
        let bedRect = document.getElementById(choice.id)//.getBoundingClientRect()
        let bedVec = new Vector(bedRect.offsetLeft + 50, (bedRect.offsetTop - canvasDiv.offsetTop) + (bedRect.clientHeight / 2))
        this.target = bedVec
      }
      let force = this.seek(this.target)
      this.applyForce(force)
      if (
        Math.abs(this.target.x - this.pos.x) < 2 &&
        Math.abs(this.target.y - this.pos.y) < 2
      ) {
        this.target = null
        this.vel.x = 0
        this.vel.y = 0
        this.wait = 300
      }
      //console.log("target", this.target)
      //console.log("pos",this.pos)
      this.gardenMap.scrollTo(this.pos.x, this.pos.y)
    }
    this.update()
    this.draw()
    this.edges()
    requestAnimationFrame(() => this.animate())
  }
  beginDraw () {
    this.context.beginPath()
    this.context.shadowColor = 'black'
    this.context.shadowBlur = 6
    this.context.shadowOffsetX = 6
    this.context.shadowOffsetY = 6
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

  update () {
    super.update()
    if (this.wait > 0) return
    this.footLeft.advanceFoot(this.vel)
    this.footRight.advanceFoot(this.vel)
    this.shoulderLeft.advanceArm()
    this.shoulderRight.advanceArm()
  }

  draw () {
    this.context.translate(this.pos.x, this.pos.y)
    //this.context.rotate(0)
    this.context.rotate(Math.PI - this.vel.heading())
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
    this.armPos = new Vector(-28, -14)
    this.armLength = 0
    this.armDir = 1
    this.armAngle = 0
  }

  advanceArm () {
    this.armAngle += 0.2
    if (this.armAngle >= 2 * Math.PI) this.armAngle = 0
    this.armLength = this.armDir * Math.sin(this.armAngle) * 8
  }
  draw () {
    this.drawArm()
    this.beginDraw()
    this.context.fillStyle = 'blue'
    this.context.ellipse(this.pos.x, this.pos.y, 12, 8, 0, 0, 2 * Math.PI)
    this.context.fill()
  }
  drawArm () {
    this.beginDraw()
    this.context.fillStyle = 'rgb(249, 171, 171)'
    this.context.ellipse(
      this.armPos.x,
      this.armPos.y,
      4,
      10 + this.armLength,
      0,
      0,
      2 * Math.PI
    )
    this.context.fill()
  }
}

class ShoulderRight extends ShoulderLeft {
  constructor () {
    super()
    this.pos = new Vector(22, 0)
    this.armPos = new Vector(28, -14)
    this.armDir = -1
  }
}

class FootLeft extends GBase {
  constructor () {
    super()
    this.pos = new Vector(-11, -20)
    this.movingAngle = 0
    this.footOffset = 0
    this.footDir = 1
  }

  advanceFoot (vel) {
    this.movingAngle += 0.2
    if (this.movingAngle >= 2 * Math.PI) this.movingAngle = 0
    let speed = vel.mag()
    this.footOffset = this.footDir * Math.sin(this.movingAngle) * 5
  }

  draw () {
    this.beginDraw()
    this.context.fillStyle = 'black'
    this.context.ellipse(
      this.pos.x,
      this.pos.y + this.footOffset,
      6,
      12,
      0,
      0,
      2 * Math.PI
    )
    this.context.fill()
  }
}

class FootRight extends FootLeft {
  constructor () {
    super()
    this.pos = new Vector(11, -20)
    this.footOffset = 0
    this.footDir = -1
  }
}
