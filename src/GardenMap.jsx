import { createEffect, on, onCleanup, onMount, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { GardenMapWriter } from './lib/gardenMapWriter'
import { gardenPlan, gatherCultureHistory, cultures, loadCultures, loadGardenPlan, cultureFromId } from './lib/stores'
import GardenMapEditor from './GardenMapEditor'
import { pretty_date } from './lib/diary_functions'
let canvas

function getMousePos (canvas, e) {
  let rect = canvas.getBoundingClientRect()
  return { x: e.clientX - rect.x, y: e.clientY - rect.y }
}

function GardenMap () {
  const {
    showGardenMap,
    setShowGardenMap,
    showGardenMapEditor,
    setShowGardenMapEditor,
    bedCommunication,
    setBedCommunication
  } = useContext(DiaryContext)

  let gardenMapWriter
  onMount(() => {
    loadGardenPlan()
    loadCultures()
    canvas.width = window.innerWidth * 0.85
    canvas.height = window.innerHeight * 0.75
    gardenMapWriter = new GardenMapWriter(canvas)

    //pointer event
    canvas.onpointerup = e => {
      const { x, y } = getMousePos(canvas, e)
      let bed = gardenMapWriter.getClickedBed(x, y)
      if (bed) {
        bed.drawHighlighted()
        setBedCommunication('return', bed)
      }
    }
  })

  createEffect(() => {
    gardenMapWriter.setUp(gardenPlan())
    canvas.height = gardenMapWriter.finalHeight()
    gardenMapWriter.clear()
    gardenMapWriter.draw()
  })

  //history
  const allBedObjects = () =>{
    let bedObjects = []
    for (let secObj of gardenMapWriter.sectionObjects){
        for (let bedObj of secObj.bedObjects){
            console.log(bedObj)
            bedObjects.push(bedObj)
        }
    }
    return bedObjects
  }

  const showHistory = (history)=>{
    let bedObjects = allBedObjects()
    bedObjects.map(bedObj => {
        let bedHistory = history[bedObj.id]
        if(bedHistory.length){
            bedObj.draw()
           // bedObj.drawInfo(pretty_date(bedHistory[0].date))
            bedObj.drawInfo(cultureFromId(bedHistory[0].culture))
        }
        console.log(bedHistory)
    })
    console.log("done")
  }
  createEffect(
    on(
      () => showGardenMap(),
       () => {
        if (showGardenMap()) gatherCultureHistory().then(history=> showHistory(history))
      }
    )
  )

  createEffect(() => {
    if (showGardenMap() && bedCommunication.highlight) {
      let bed = gardenMapWriter.getBedById(bedCommunication.highlight)
      bed.drawHighlighted()
    }
  })

  return (
    <dialog attr:open={showGardenMap()}>
      <GardenMapEditor />
      <article style={{ 'min-height': '100vh' }}>
        <header>
          <button
            class='icon-button outline'
            onclick={() => setShowGardenMap(false)}
          >
            <i class='fa-solid fa-circle-xmark'></i>
          </button>
          <button
            class='icon-button outline'
            onClick={() => setShowGardenMapEditor(!showGardenMapEditor())}
          >
            <i class='fa-solid fa-pencil'></i>
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
