import { GardenSection } from './gardenSection'

export class GardenMapWriter {
  constructor (canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.sectionObjects = []
    this.sectionX = 10
    this.sectionY = 10
    this.sectionWidth = this.canvas.width - 20
    this.sectionMinHeight = 40
    this.yPos = 10
  }

  clear () {
    this.context.fillStyle = 'rgb(214, 244, 168)'
    this.context.roundRect(0, 0, this.canvas.width, this.canvas.height, 5)
    this.context.fill()
  }

  setUp (gardenPlan) {
    gardenPlan.sections.forEach(section => {
      let sectionObject = new GardenSection(section, this.canvas)
      this.sectionObjects.push(sectionObject)
    })
  }

  draw () {
    this.sectionObjects.forEach(sectionObject => {
      this.yPos += sectionObject.draw(this.yPos)
    })
  }
  finalHeight () {
    let h = this.yPos + 25
    this.sectionObjects.forEach(sectionObject => {
      h += sectionObject.calcHeight()
      console.log('height', h)
    })
    return h
  }
  getClickedBed (x, y) {
    for (let section of this.sectionObjects) {
      for (let bed of section.bedObjects) {
        if (
          x > bed.x &&
          x < bed.x + bed.bedLength &&
          y > bed.y &&
          y < bed.y + bed.bedWidth
        ) {
          return bed
        }
      }
    }
    return null
  }
}
