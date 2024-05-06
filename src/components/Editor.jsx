import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  For,
  useContext,
  on
} from 'solid-js'
import { epoc_date, standard_date } from '../lib/diary_functions'
import { diary } from '../lib/stores'
import { DiaryContext } from '../DiaryContext'
let editor

function Editor (props) {
  const { showEditor, setShowEditor, openToEdit, setOpenToEdit, categorys } =
    useContext(DiaryContext)

  const handleClick = event => {
    if (!showEditor()) return
    if (!editor.contains(event.target)) {
      setShowEditor(false)
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClick, true)
  })
  onCleanup(() => {
    document.removeEventListener('click', handleClick, true)
  })

  createEffect(() => {
    if (showEditor()) {
      initWithEntry({
        id: Date.now(),
        date: Date.now(),
        work: '',
        category: 'Pflege',
        done: true,
        duration: 10
      })
    }

    if (openToEdit() !== null) {
      loadEntry(openToEdit())
    } else {
      initWithEntry({
        id: Date.now(),
        date: Date.now(),
        work: '',
        category: 'Pflege',
        done: true,
        duration: 10
      })
    }
  })
  const loadEntry = id => {
    const editEntry = diary().find(entry => entry.id === id)
    console.log('from Editor', id)
    initWithEntry(editEntry)
  }
  const initWithEntry = editEntry => {
    setId(editEntry.id)
    setDone(editEntry.done)
    setWork(editEntry.work)
    setEntryDate(editEntry.date)
    setCategory(editEntry.category)
    setDuration(editEntry.duration)
  }
  let workInput, durationInput
  const [work, setWork] = createSignal('')
  const [entryDate, setEntryDate] = createSignal(Date.now())
  const [done, setDone] = createSignal(false)
  const [duration, setDuration] = createSignal(10)
  const [category, setCategory] = createSignal('Pflege')
  const [workInvalid, setWorkInvalid] = createSignal(false)
  const [id, setId] = createSignal(Date.now())
  
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
      category: category()
    }
    props.saveNewEntry(newEntry)
    setShowEditor(false)
  }
  createEffect(on(()=>work(), ()=>setWorkInvalid(false)))
  return (
    <dialog attr:open={showEditor()}>
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
      </article>
    </dialog>
  )
}
export default Editor
