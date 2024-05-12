import { GardenBed } from "./gardenBed"

export class GardenSection extends  Object{
    
    constructor(section, canvas){
        super()
        Object.assign(this, section)
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.borderWidth = 10
        this.bedWidth = 40
        this.sectionStartX = 10
        this.sectionWidth = this.canvas.width - 20
        this.bedStartX = this.sectionStartX + 5
        this.bedLength = this.sectionWidth - 10
        this.pathWidth = 5
        this.bedObjects = []
    }
  
    calcHeight(){
        let sum = this.beds.reduce( (sum, bed) => sum += this.pathWidth + this.bedWidth, 0)
        return sum +this.pathWidth
    }
    draw(yPos){
        let totalHeight = this.calcHeight()
        if (!totalHeight) return
        this.context.beginPath()
        this.context.fillStyle = 'rgb(59, 161, 8)'
      this.context.roundRect(
        this.sectionStartX,
        yPos,
        this.sectionWidth,
        totalHeight - this.pathWidth,
        5
    )
      this.context.fill() 
      this.drawBeds(yPos)
      return totalHeight + this.borderWidth - this.pathWidth
    }
    drawBeds(yPos){
        let bedY = yPos + this.pathWidth
        for (let bed of this.beds){
            let bedObject = new GardenBed(bed, this.canvas)
            this.bedObjects.push(bedObject )
            bedObject.setUp(this.bedStartX, bedY, this.bedLength, this.bedWidth - this.pathWidth)
            bedObject.draw()
            bedY += this.bedWidth + this.pathWidth
        }
    }

  
}