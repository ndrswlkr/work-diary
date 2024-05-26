export function scalarProjection(a,b){
  let bCopy = b.clone()
  bCopy.normalize()
  return a.dot(bCopy)
}

export class Vector {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  static random2D () {
    const v = new Vector(Math.random() * 200 - 100, Math.random() * 200 - 100)
    v.normalize()
    return v
  }
  static add (a, b) {
    const newVector = new Vector(a.x, a.y)
    newVector.add(b)
    return newVector
  }
  static sub (a, b) {
    const newVector = new Vector(a.x, a.y)
    newVector.sub(b)
    return newVector
  }
  static mult (a, sc) {
    const newVector = new Vector(a.x, a.y)
    newVector.mult(sc)
    return newVector
  }
  static div (a, sc) {
    let newVector = new Vector(a.x, a.y)
    newVector.div(sc)
    return newVector
  }
  static normalize (a) {
    let newVector = new Vector(a.x, a.y)
    newVector.normalize()
    return newVector
  }
  set(x, y){
    this.x = x
    this.y = y
  }
  clone () {
    const newVector = new Vector(this.x, this.y)
    return newVector
  }
  add (v) {
    this.x += v.x
    this.y += v.y
  }
  sub (v) {
    this.x -= v.x
    this.y -= v.y
  }
  mult (sc) {
    //scalar mult
    this.x *= sc
    this.y *= sc
  }
  div (sc) {
    this.x /= sc
    this.y /= sc
  }
  dist(v){
    let c = v.clone()
    c.sub(this)
    return c.mag()
  }
  mag () {
    const magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    return magnitude
  }
  setMag (mag) {
    this.normalize()
    this.mult(mag)
  }
  limit (limit) {
    let origMag = this.mag()
    if (origMag > limit) {
      this.setMag(limit)
    }
  }
  normalize () {
    let mag = this.mag()
    if (mag !== 0){

      this.mult( 1/mag )
    }
    
  }

  setHeading(angle){
    let mag = this.mag()
    this.x = Math.sin(angle) * mag
    this.y = Math.cos(angle) * mag
  }
  heading(){
    return Math.atan2(this.x, this.y)
  }
  rotate(angle){
    let final = this.heading() + angle
    this.setHeading(final)
  }
  dot(v) {
    let x = v.x
    let y = v.y
    let z = v.z || 0
    return this.x * (x || 0) + this.y * (y || 0) ;
  }
}
