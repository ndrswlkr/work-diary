import { For, createEffect, on, onCleanup, onMount, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import {
  gardenPlan,
  gatherCultureHistory,
  cultures,
  loadCultures,
  loadGardenPlan,
  cultureFromId
} from './lib/stores'
import GardenMapEditor from './GardenMapEditor'
import { pretty_date } from './lib/diary_functions'
import GardenSection from './components/GardenSection'
import GardenBed from './components/GardenBed'
import './GardenMap.css'

function GardenMap () {
  let gardenCanvas
  let map
  const {
    showGardenMap,
    setShowGardenMap,
    showGardenMapEditor,
    setShowGardenMapEditor,
    bedCommunication,
    setBedCommunication
  } = useContext(DiaryContext)
  const bedRef = {}

  onMount(() => {
    loadGardenPlan()
    loadCultures()
    gardenCanvas.width = map.clientWidth
    gardenCanvas.height = map.clientHeight
    
    let ctx = gardenCanvas.getContext("2d")
    ctx.fillStyle = "#000a"

    ctx.fillRect(0,0, gardenCanvas.width, gardenCanvas.height)
    ctx.fill()
  })

  //history
  const allBedObjects = () => {
    let bedObjects = []
    for (let secObj of gardenMapWriter.sectionObjects) {
      for (let bedObj of secObj.bedObjects) {
        bedObjects.push(bedObj)
      }
    }
    return bedObjects
  }

  return (
    <dialog attr:open={showGardenMap()}>
      <GardenMapEditor />
      <article
        style={{
          'min-height': '100vh',
          'min-width': '100vw',
          'background-color': 'rgb(239, 215, 178)'
        }}
      >
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
        <div id='pile'>
          <div ref={map} id="map">

          <For each={gardenPlan().sections}>
            {(section, index) => (
              <GardenSection section={section}>
                <For each={gardenPlan().sections[index()].beds}>
                  {bed => <GardenBed bed={bed} />}
                </For>
              </GardenSection>
            )}
          </For>
            </div>
            <canvas ref={gardenCanvas} id="garden-canvas" />
        </div>
      </article>
    </dialog>
  )
}
export default GardenMap
