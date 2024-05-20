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

function GardenMap () {
  const {
    showGardenMap,
    setShowGardenMap,
    showGardenMapEditor,
    setShowGardenMapEditor,
    bedCommunication,
    setBedCommunication
  } = useContext(DiaryContext)
  let garden
  const bedRef = {}

  onMount(() => {
    loadGardenPlan()
    loadCultures()
    //pointer event
    /* bed.drawHighlighted()
    setBedCommunication('return', bed) */
  })

  //history
  const allBedObjects = () => {
    let bedObjects = []
    for (let secObj of gardenMapWriter.sectionObjects) {
      for (let bedObj of secObj.bedObjects) {
        console.log(bedObj)
        bedObjects.push(bedObj)
      }
    }
    return bedObjects
  }

  const showHistory = history => {
    let bedObjects = allBedObjects()
    bedObjects.map(bedObj => {
      let bedHistory = history[bedObj.id]
      if (bedHistory.length) {
        bedObj.draw()
        // bedObj.drawInfo(pretty_date(bedHistory[0].date))
        bedObj.drawInfo(cultureFromId(bedHistory[0].culture))
      }
      console.log(bedHistory)
    })
    console.log('done')
  }

  createEffect(
    on(
      () => showGardenMap(),
      () => {
        if (showGardenMap()) gatherCultureHistory().then(history => null) //showHistory(history))
      }
    )
  )
  //highlight bed
  createEffect(() => {
    if (showGardenMap() && bedCommunication.highlight) {
      // let bed = gardenMapWriter.getBedById(bedCommunication.highlight)
      // bed.drawHighlighted()
    }
  })

  createEffect(() => console.log('Garden Map: ', gardenPlan(), 'was updated'))

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

        <For each={gardenPlan().sections}>
          {(section, index) => (
            <GardenSection section={section}>
              <For each={gardenPlan().sections[index()].beds}>
                {bed => <GardenBed highlight={bedCommunication.highlight} ref={bedRef[bed.id]} bed={bed} />}
              </For>
            </GardenSection>
          )}
        </For>
      </article>
    </dialog>
  )
}
export default GardenMap
