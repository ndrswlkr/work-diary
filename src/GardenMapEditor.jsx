import {
  For,
  createEffect,
  createSignal,
  onMount,
  useContext
} from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { gardenPlan, saveGardenPlan, setGardenPlan } from './lib/stores'
import { v1 as uuid} from 'uuid'

function GardenMapEditor () {
  let sectionNameField
  let bedNameField
  let sectionSelector
  const { showGardenMapEditor, setShowGardenMapEditor } =
    useContext(DiaryContext)
  const [sectionName, setSectionName] = createSignal('')
  const [sectionNameInvalid, setSectionNameInvalid] = createSignal(false)
  const [bedName, setBedName] = createSignal('')
  const [sectionSelectInvalid, setSectionSelectInvalid] = createSignal(false)
  let selectedSection = null
  createEffect(() => {
    if (sectionName().length > 2) setSectionNameInvalid(false)
  })

  const addSection = () => {
    if (sectionName().length < 3) {
      setSectionNameInvalid(true)
      return
    }
    if (gardenPlan().sections.find(s => s.name === sectionName())) {
      setSectionNameInvalid(true)
      return
    }
    let sectionId = uuid()
    

    gardenPlan().sections.push({ name: sectionName(), id: sectionId, beds: [] })
    setGardenPlan({ ...gardenPlan() })
    saveGardenPlan()
    setSectionName('')
    setSectionNameInvalid(false)
  }

  const selectSection = sectionId => {
    if (sectionId === 'null') {
      setSectionSelectInvalid(true)
      return
    } else {
      setSectionSelectInvalid(false)
    }
    console.log(sectionId)
    let section = gardenPlan().sections.find(
        s => String(s.id) === String(sectionId)
    )
    selectedSection = section
    gardenPlan().sections.map(s => console.log(s.id))
    let newBedNum = section.beds.length + 1
    setBedName(`${section.name} ${newBedNum}`)
  }

  const addBed = () =>{
    selectedSection.beds.push({name: bedName(), id: uuid()})
    setGardenPlan({...gardenPlan()})
    saveGardenPlan()
    sectionSelector.value = "null"
    setBedName('')

  }

  onMount(() => console.log('gardenmapeditor is mounted'))

  return (
    <dialog attr:open={showGardenMapEditor()}>
      <article style={{ 'min-height': '100vh' }}>
        <header>
          <button
            class='icon-button outline'
            onclick={() => setShowGardenMapEditor(false)}
          >
            <i class='fa-solid fa-circle-xmark'></i>
          </button>
          <span style={{ 'font-size': '1.5rem' }}>
            <strong>Garden Map Editor </strong>
          </span>
          <div class='card'>
            <h4>Add new Section</h4>
            <label>
              section Name
              <input
                ref={sectionNameField}
                name='sectionNameField'
                placeholder='Name of new Section'
                value={sectionName()}
                aria-invalid={sectionNameInvalid()}
                onInput={() => setSectionName(sectionNameField.value)}
              />
            </label>
            <button onClick={() => addSection(sectionName())}>
              add Section
            </button>
          </div>
          <div class='card'>
            <h4>Add new Bed</h4>
            <label>
              select Section
              <select
                aria-invalid={sectionSelectInvalid()}
                ref={sectionSelector}
                onChange={() => selectSection(sectionSelector.value)}
              >
                <option value={null}>please choose section</option>
                <For each={gardenPlan().sections}>
                  {section => (
                    <option value={section.id}>{section.name}</option>
                  )}
                </For>
              </select>
            </label>
            <label>
              bed Name
              <input
                ref={bedNameField}
                name='bedNameField'
                placeholder='Name of new bed'
                value={bedName()}
                readOnly='true'
              />
            </label>
            <button disabled={!bedName()} onClick={() => addBed(bedName())}>
              add Section
            </button>
          </div>
        </header>
      </article>
    </dialog>
  )
}
export default GardenMapEditor
