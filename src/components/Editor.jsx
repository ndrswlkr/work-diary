import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  For,
  useContext,
  on,
  createRenderEffect,
  Show
} from 'solid-js'
import { epoc_date, neutralNow, standard_date } from '../lib/diary_functions'
import { diary, loadCultures } from '../lib/stores'
import { cultures, setCultures } from '../lib/stores'
import { DiaryContext } from '../DiaryContext'
import { v1 as uuid } from 'uuid'
import CulturesEditor from './CulturesEditor'
let editor

function Editor (props) {
  const {
    showEditor,
    setShowEditor,
    openToEdit,
    setOpenToEdit,
    categorys,
    showGardenMap,
    setShowGardenMap,
    bedCommunication,
    setBedCommunication,
    showCulturesEditor,
    setShowCulturesEditor
  } = useContext(DiaryContext)

  const handleClick = event => {
    if (!showEditor()) return
    if (!editor.contains(event.target) && !showGardenMap) {
      console.log('here was trigged')
      setShowEditor(false)
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClick, true)
    loadCultures()
  })
  onCleanup(() => {
    document.removeEventListener('click', handleClick, true)
    setBedCommunication({ return: null, highlight: false })
  })

  //init entry
  createEffect(() => {
    if (showEditor()) {
      initWithEntry({
        id: Date.now(),
        date: neutralNow(),
        work: '',
        category: 'Pflege',
        done: true,
        duration: 10,
        culture: 0
      })
    }

    if (openToEdit() !== null) {
      loadEntry(openToEdit())
    } else {
      initWithEntry({
        id: Date.now(),
        date: neutralNow(),
        work: '',
        category: 'Pflege',
        done: true,
        duration: 10
      })
    }
  })

  const loadEntry = id => {
    const editEntry = diary().find(entry => entry.id === id)
    initWithEntry(editEntry)
  }

  const initWithEntry = editEntry => {
    setId(editEntry.id)
    setDone(editEntry.done)
    setWork(editEntry.work)
    setEntryDate(editEntry.date)
    setCategory(editEntry.category)
    setDuration(editEntry.duration)
    setCorrespondingBedId(editEntry.correspondingBed?.id || null)
    setCorrespondingBedName(editEntry.correspondingBed?.name || null)
    setBedCommunication('highlight', editEntry.correspondingBed?.id || null)
    setCulture(editEntry.culture || 'none')
  }

  let workInput, durationInput
  const [work, setWork] = createSignal('')
  const [entryDate, setEntryDate] = createSignal(Date.now())
  const [done, setDone] = createSignal(false)
  const [duration, setDuration] = createSignal(10)
  const [category, setCategory] = createSignal('Pflege')
  const [workInvalid, setWorkInvalid] = createSignal(false)
  const [id, setId] = createSignal(uuid())
  const [correspondingBedId, setCorrespondingBedId] = createSignal(null)
  const [correspondingBedName, setCorrespondingBedName] = createSignal(null)
  const [culture, setCulture] = createSignal('none')

  function selectCultureModel (el, value) {
    const [field, setField] = value()
    createRenderEffect(() => (el.value = field()))
    el.oninput = e => setField(e.target.value)
  }

  const save = () => {
    if (work().length < 1) {
      setWorkInvalid(true)
      return
    }
    let newEntry = {
      id: id(),
      work: work(),
      date: entryDate(),
      done: done(),
      duration: duration(),
      category: category(),
      correspondingBed: {
        id: correspondingBedId(),
        name: correspondingBedName()
      },
      culture: culture()
    }
    props.saveNewEntry(newEntry)
    setShowEditor(false)
    window.scrollTo(0, 0)
  }

  //reset invalidate
  createEffect(
    on(
      () => work(),
      () => setWorkInvalid(false)
    )
  )

  //recieve selected Bed from Map
  createEffect(() => {
    if (bedCommunication.return && bedCommunication.return !== true) {
      let bed = bedCommunication.return
      setBedCommunication('return', null)
      setShowGardenMap(false)
      setCorrespondingBedId(bed.id)
      setCorrespondingBedName(bed.name)
    }
  })

  return (
    <dialog attr:open={showEditor()}>
      <CulturesEditor />

      <article ref={editor}>
        <header>
          <button class='icon-button outline' onclick={() => save()}>
            <i class='fa-solid fa-floppy-disk'></i>
          </button>
          <button
            class='icon-button outline'
            onclick={() => setShowEditor(false)}
          >
            <i class='fa-solid fa-circle-xmark'></i>
          </button>
        </header>
        <label>
          <input
            type='checkbox'
            checked={done()}
            onChange={() => setDone(!done())}
          />
          done
        </label>
        <textarea
          rows='5'
          cols='40'
          ref={workInput}
          value={work()}
          placeholder='describe work'
          aria-invalid={workInvalid()}
          oninput={() => setWork(workInput.value)}
        />

        <input
          type='date'
          value={standard_date(entryDate())}
          onChange={e => setEntryDate(epoc_date(e.target.value))}
        />
        <label for='duration'>
          duration <mark>{duration()}</mark>
        </label>
        <input
          type='range'
          id='duration'
          min='0'
          max='240'
          step='5'
          ref={durationInput}
          value={duration()}
          oninput={() => setDuration(durationInput.value)}
        />
        <fieldset role='group'>
          <input
            type='text'
            readOnly='true'
            value={correspondingBedName()}
            placeholder='no bed selected'
          />
          <button
            class='secondary outline'
            onclick={() => {
              setBedCommunication('return', true)
              setShowGardenMap(true)
            }}
          >
            <i class='fa-solid fa-location-dot'></i>
          </button>
        </fieldset>
        <fieldset>
          <legend>Kategorie</legend>
          <For each={categorys}>
            {cat => (
              <label>
                <input
                  type='radio'
                  name='category'
                  checked={cat === category()}
                  onchange={() => setCategory(cat)}
                  on
                />
                {cat}
              </label>
            )}
          </For>
        </fieldset>
        <fieldset role='group'>
          <select use:selectCultureModel={[culture, setCulture]}>
            <For each={cultures()}>
              {c => <option value={c.id}>{c.name}</option>}
            </For>
          </select>
          <button onClick={() => setShowCulturesEditor(true)}>
            Add Cultures
          </button>
        </fieldset>
      </article>
    </dialog>
  )
}
export default Editor
