import { createEffect, onCleanup, onMount, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { GardenMapWriter } from './lib/gardenMapWriter'
import { gardenPlan } from './lib/stores'
let canvas

function getMousePos(canvas, e){
    let rect = canvas.getBoundingClientRect()
    return {x: e.clientX - rect.x, y: e.clientY - rect.y}
}

function GardenMap () {
  const { showGardenMap, setShowGardenMap } = useContext(DiaryContext)
  let gardenMapWriter
  onMount(() => {
    canvas.width = window.innerWidth * 0.85
    canvas.height = window.innerHeight * 0.75
    gardenMapWriter = new GardenMapWriter(canvas)
    //pointer event
    canvas.onpointerup = e => {
        const {x, y} = getMousePos(canvas, e)
        let bed = gardenMapWriter.getClickedBed(x,y)
        if (bed) bed.drawHighlighted()
    }
  

  })

  createEffect(() => {
    gardenMapWriter.setUp(gardenPlan())
    canvas.height = gardenMapWriter.finalHeight()
    gardenMapWriter.clear()
    gardenMapWriter.draw()
  })
  return (
    <dialog  attr:open={showGardenMap()}>

    <article style={{"min-height": "100vh"}}>
      <header>
        <button
          class='icon-button outline'
          onclick={() => setShowGardenMap(false)}
          >
          <i class='fa-solid fa-circle-xmark'></i>
        </button>
        <span style={{ 'font-size': '1.5rem' }}>
          <strong>Garden Map</strong>
        </span>
      </header>
      <canvas ref={canvas} />
    </article>
    </dialog>
  )
}
export default GardenMap
