export class GardenBed extends Object{
    constructor(bed, canvas){
        super()
        Object.assign(this, bed)
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.x = 0
        this.y = 0
        this.bedLength = 0
        this.bedWidth = 0
    }
    setUp(x,y,bedLength, bedWidth){
        this.x = x
        this.y = y
        this.bedLength = bedLength
        this.bedWidth = bedWidth
    }
    draw() {
        this.context.beginPath()
        this.context.fillStyle =  'rgb(181, 112, 9)'
        this.context.roundRect(this.x, this.y, this.bedLength, this.bedWidth, 5)
        this.context.fill()
        this.drawBedName()
    }
    drawHighlighted() {
        this.context.beginPath()
        this.context.fillStyle =  'rgb(163, 15, 193)'
        this.context.roundRect(this.x, this.y, this.bedLength, this.bedWidth, 5)
        this.context.fill()
        this.drawBedName()
        setTimeout(()=>this.draw(), 1000)
    }
    drawBedName(){
        this.context.beginPath()
        this.context.fillStyle = "white"
        this.context.font = "20px system-ui"
        this.context.fillText(this.name, this.x + 10, this.y + this.bedWidth / 2 + 5)
        this.context.fill()
    }
    drawInfo(info){
        this.context.beginPath()
        this.context.fillStyle = "white"
        this.context.font = "20px system-ui"
        this.context.fillText(`${this.name} ${info}`, this.x + 10, this.y + this.bedWidth / 2 + 5)
        this.context.fill()
    }
}