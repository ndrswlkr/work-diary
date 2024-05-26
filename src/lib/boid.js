import { map, random } from './mathlib'
import { Vector } from './vector'
import { Vehicle } from './vehicle'

 function findProjection(pos,a,b){
    let v1 = Vector.sub(a, pos)
    let v2 = Vector.sub(b, pos)
    v2.normalize()
    let sp =  v1.dot(v2)
    v2.mult(sp)
    v2.add(pos)
    return v2
  }

export class Boid extends Vehicle {
  constructor (x, y) {
    super(x, y, 4)
    this.vel = Vector.random2D()
    this.acc = new Vector(0, 0)
    this.vel.setMag(4)
    this.size = 16
    this.maxSpeed = 2
    this.maxForce = 0.55
    this.points = []
    this.color = 'yellow'
    this.wanderTheta = 0
    this.wanderPoint = new Vector(0, 0)
    this.path = []
    this.count = 0
    this.showPath = false
    
  }
  follow(path){
    let future = this.vel.clone()
    future.mult(20)
    let target = findProjection(path.start, future, path.end)
    let d = future.dist(target)
    if(d > path.r){
        return this.seek(target)
    }
    else {
        return new Vector(0,0)
    }
}
  getShape () {
    let points = [
      new Vector(-this.size, -this.size),
      new Vector(this.size, -this.size),
      new Vector(-0, this.size)
    ]
    return points
  }
  wander () {
    this.wanderPoint = this.vel.clone()
    this.wanderPoint.setMag(100)
    this.wanderPoint.add(this.pos)

    let wanderRadius = 50

    let theta = this.wanderTheta + this.vel.heading()

    let x = wanderRadius * Math.cos(theta)
    let y = wanderRadius * Math.sin(theta)
    this.wanderPoint.add(new Vector(x, y))

    let steer = Vector.sub(this.wanderPoint, this.pos)
    steer.setMag(this.maxForce)
    this.applyForce(steer)

    let displaceRange = 0.3
    this.wanderTheta += random(-displaceRange, displaceRange)
  }

  flee (target) {
    let force = this.seek(target)
    force.mult(-1)
    return force
  }
  seek (target) {
    let force = Vector.sub(target, this.pos)
    force.setMag(this.maxSpeed)
    force.sub(this.vel)
    force.limit(this.maxForce)
    return force
  }
  arrive (target) {
    let tresh = 100
    let force = Vector.sub(target, this.pos)
    let distance = force.mag()
    if (distance < tresh) {
      let desiredSpeed = map(distance, 0, tresh, 0, this.maxSpeed)
      force.setMag(desiredSpeed)
    } else {
      force.setMag(this.maxSpeed)
    }
    force.sub(this.vel)
    force.limit(this.maxForce)
    return force
  }
  pursue (vehicle) {
    let target = vehicle.pos.clone()
    let targetVel = vehicle.vel.clone()
    targetVel.mult(10)
    target.add(targetVel)
    return this.seek(target)
  }
  evade (vehicle) {
    let pursuit = this.pursue(vehilce)
    pursuit.mult(-1)
    return pursuit
  }

 
  update () {
    this.count++
    this.vel.add(this.acc)
    this.vel.limit(this.maxSpeed)
    this.acc.set(0, 0)
    this.pos.add(this.vel)
    let angle = this.vel.heading()
    let points = this.getShape()
    this.points = points.map(v => {
      v.rotate(angle)
      return v
    })
    if (this.showPath) {
      if (this.count > 3) {
        this.path.push({ x: this.pos.x, y: this.pos.y })
        this.count = 0
      }
      if (this.path.length > 30) {
        this.path.shift()
      }
    }
  }

  draw () {
    this.context.beginPath()
    this.context.fillStyle = this.color
    this.context.moveTo(this.pos.x + this.points[0].x, this.pos.y + this.points[0].y)
    this.context.lineTo(this.pos.x + this.points[1].x, this.pos.y + this.points[1].y)
    this.context.lineTo(this.pos.x + this.points[2].x, this.pos.y + this.points[2].y)
    this.context.closePath()
    this.context.fill()
    point(this.wanderPoint.x, this.wanderPoint.y, 5, 'yellow')
    if (this.showPath && this.path.length > 3) {
      this.drawPath()
    }
  }
  drawPath () {
    this.context.beginPath()
    this.context.moveTo(this.path[0].x, this.path[0].y)
    this.context.strokeStyle = 'white'
    this.context.lineWidth = 2
    for (let i = 1; i < this.path.length - 2; i += 2) {
      let a = this.path[i]
      let b = this.path[i + 1]
      //this.context.quadraticCurveTo(a.x, a.y, b.x, b.y)
      this.context.lineTo(a.x, a.y)
      this.context.lineTo(b.x, b.y)
    }
    this.context.stroke()
  }
}
