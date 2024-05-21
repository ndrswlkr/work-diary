import { gardenGlobals } from "./gardenCanvas";

class GBase{
    constructor(){
        this.context = gardenGlobals().context
        this.width = gardenGlobals().width
        this.height = gardenGlobals().height

    }
}

export class Gardener extends GBase{
    constructor(){
        super()
        this.hat = new Hat()
    }

    draw(){
        console.log("drawing")
        console.log(this.context)
        this.context.beginPath()
        this.context.fillStyle = "red"
        this.context.fillRect(this.width/2 -10, this.height/2 -10, 20,20)
        this.context.fill()
        this.hat.draw(this.width / 2, this.height/2)
    }

}

class Hat extends GBase{
    constructor(){
        super()
    }

    draw(x,y){

        this.context.beginPath()
        this.context.fillStyle = 'rgb(203, 179, 26)'
        this.context.ellipse(x,y,22,25,0, 0, 2*Math.PI)
        this.context.fill()
        this.context.beginPath()
        this.context.fillStyle = 'rgb(143, 124, 2)'
        this.context.ellipse(x,y,12,15,0, 0, 2*Math.PI)
        this.context.fill()

    }
}
