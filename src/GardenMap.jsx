import {
  For,
  Show,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  useContext
} from 'solid-js'
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
import { gardenGlobals, setUpGardenCanvas } from './lib/gardenCanvas'
import { Gardener } from './lib/gardener'

function GardenMap () {
  let canvas
  let map
  const {
    showGardenMap,
    setShowGardenMap,
    showGardenMapEditor,
    setShowGardenMapEditor,
    bedCommunication,
    setBedCommunication
  } = useContext(DiaryContext)
  const [ready, setReady] = createSignal(false)
  onMount(() => {
    loadGardenPlan()
    loadCultures()
  })
  createEffect(
    on(
      () => showGardenMap(),
      () => {
        if (showGardenMap() === false) return
        setUpGardenCanvas(canvas, map.clientWidth, map.clientHeight)
        let gardener = new Gardener()
        gardener.run = true
        gardener.animate()
      }
    )
  )

  return (
    <Show when={showGardenMap()}>
      <dialog attr:open={showGardenMap()}>
        <GardenMapEditor />
        <article
          id='garden-map'
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
            <div ref={map} id='map'>
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
            <div
              id="canvas-div"
               style={{ 'pointer-events': 'none' }} 
              onclick={e => {
                console.log('click!!!')
                e.preventDefault()
              
              }}
            >
              <canvas ref={canvas} id='garden-canvas' onclick={e=>{console.log("canvas click"); e.preventDefault()}} />
            </div>
          </div>
        </article>
      </dialog>
    </Show>
  )
}
export default GardenMap
