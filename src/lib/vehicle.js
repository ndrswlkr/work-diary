import { Vector } from './vector'
import { constrain } from './mathlib'

export class Vehicle {
  constructor (x, y, mass) {
    this.pos = new Vector(x, y)

    this.r = Math.sqrt(mass) * 4
    this.mass = mass
    this.vel = Vector.random2D()
    this.vel.setMag(Math.random() * 0.01 + 0.01)
    this.acc = new Vector(0, 0)
  }

  edges () {
    if (this.pos.y >= this.height - this.r) {
      this.pos.y = this.height - this.r
      this.vel.y *= -1
    }

    if (this.pos.x <= 0 + this.r) {
      this.pos.x = this.r
      this.vel.x *= -1

    }
    if (this.pos.x >= this.width - this.r) {
      this.pos.x = this.width - this.r
      this.vel.x *= -1

    }
    if(this.pos.y <= 0 + this.r){

      this.pos.y = 0 + this.r
      this.vel.y *= -1

    }

  }
  contact () {
    let diff = this.height - (this.pos.y + this.r)
    if (diff < 1) {
      return true
    }
    return false
  }
  friction () {
    if (this.contact()) {
      let friction = Vector.normalize(this.vel)
      friction.mult(-1)
      let mu = 0.01
      let normal = this.mass
      friction.setMag(mu * normal)
      this.applyForce(friction)
    }
  }

  drag () {
    let drag = Vector.normalize(this.vel)
    drag.mult(-1)
    let c = 2
    let speed = this.vel.mag()
    drag.setMag(c * speed * speed)
    this.applyForce(drag)
  }
  detract (actor) {
    let force = Vector.sub(this.pos, actor.pos)
    if(force.mag() > 40) return
    force.mult(-1)
    let distance = force.mag()
    let distanceSqr = distance * distance
    //distanceSqr = constrain(distanceSqr, 100, 400)
    let G = .7
    let strength = (G * (this.mass * actor.mass)) / distanceSqr
    force.setMag(strength)
    actor.applyForce(force)
  }
  attract (actor) {
    let force = Vector.sub(this.pos, actor.pos)
    
    let distance = force.mag()
    let distanceSqr = distance * distance
    //distanceSqr = constrain(distanceSqr, 100, 400)
    let G = .1
    let strength = (G * (this.mass * actor.mass)) / distanceSqr
    force.setMag(strength)
    actor.applyForce(force)
  }
  applyForce (force) {
    let f = Vector.div(force, this.mass)
    this.acc.add(f)
    this.dir = this.vel.heading()
  }
  update () {
    this.vel.add(this.acc)
    // this.vel.limit(25)
    this.pos.add(this.vel)
    this.acc.set(0, 0)
  }

  draw () {
    this.context.translate(this.pos.x, this.pos.y)
    let pointA = new Vector( -this.r, -this.r)
    let pointB = new Vector( this.r,  -this.r)
    let pointC = new Vector(0, this.r * 2)
    let angle = this.vel.heading()
    //context.rotate(angle)
    pointA.rotate(angle)
    pointB.rotate(angle)
    pointC.rotate(angle)
    context.beginPath()
    //context.moveTo(this.pos.x + pointA.x, this.pos.y + pointA.y)
    context.moveTo(pointA.x, pointA.y)
    context.lineTo(pointB.x, pointB.y)
    context.lineTo(pointC.x, pointC.y)
    context.lineTo(pointA.x, pointA.y)
    
    //context.arc(0,0, this.r, 0, 2 * Math.PI, true)
    if (this.contact()) {
      context.fillStyle = '#f005'
    } else {
      context.fillStyle = '#000'
    }
    context.fill()
    context.closePath()
    //context.rotate(-angle)
    context.translate(-this.pos.x, -this.pos.y)
  }
}
