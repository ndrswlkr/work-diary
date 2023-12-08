import { createEffect, createMemo, createSignal, useContext } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { DiaryContext } from './DiaryContext'
import ImageEditor from './ImageEditor'
import { ofetch } from 'ofetch'
import { epocDate, standardDate } from '../lib/date-functions'
import './Editor.css'

//update and save functions
async function update (editItem) {
  console.log(editItem)
  const res = await ofetch('/api/update', {
    method: 'POST',
    body: editItem
  })
  console.log(res)
  return res
}

async function saveNew (editItem) {
  const res = await ofetch('/api/save', {
    method: 'POST',
    body: editItem
  })
  return res
}

//animations
const enterAnimation = (el, done) => {
  const a = el.animate([{ top: '-200vh' }, { top: 0 }], {
    duration: 400
  })
  a.finished.then(done)
}

const exitAnimation = (el, done) => {
  const a = el.animate([{ top: 0 }, { top: '-200vh' }], {
    duration: 400
  })
  a.finished.then(done)
}

function Editor (props) {
  const mutate = props.mutate
  const {
    showEditor,
    setShowEditor,
    editItem,
    setEditItem,
    setToastMessage
  } = useContext(DiaryContext)

  createMemo(() => {
    if (editItem()) console.log(editItem())
  })

  async function save () {
    let res = {}
    setEditItem({ ...editItem(), done: editItem().done ? 1 : 0 })
    if (editItem().id) {
      //update
      res = await update(editItem())
      mutate(data =>
        data.map(entry => {
          if (entry.id == editItem().id) {
            return editItem()
          } else {
            return entry
          }
        })
      )
    } else {
      //save new
      res = await saveNew(editItem())
      const newItem = res.item
      mutate(data => [newItem, ...data])
    }
    if (res.success) {
      setToastMessage({
        show: true,
        title: 'success',
        message: 'successfully updated/saved entry'
      })
    } else {
      setToastMessage({
        show: true,
        title: 'error',
        message: 'failed to update/save entry'
      })
    }
    setShowEditor(false)
  }

  async function deleteItem (id) {
    console.log("deleting", id)
    const res = await ofetch('/api/delete', {
      method: 'POST',
      body: { id }
    })
    if (res.success){
      setToastMessage({
        show: true,
        title: 'success',
        message: 'successfully deleted Diary Entry'
      })
      mutate( data => data.filter(item => item.id !== id))
    }
    if (!res.success)
      setToastMessage({
        show: true,
        title: 'no success',
        message: 'unable to delete Diary Entry'
      })
      setShowEditor(false)
  }

  let doneInput, workInput, durationInput, dateInput
  const [workInvalid, setWorkInvalid] = createSignal('')

  return (
    <Transition onEnter={enterAnimation} onExit={exitAnimation}>
      <Show when={showEditor()}>
        <dialog id='editor' open>
          <article>
            <header>
              <a
                href='#'
                aria-label='Close'
                class='close'
                onclick={() => setShowEditor(false)}
              />
              <p>
                <strong>
                  {editItem() == {} ? 'create' : 'edit'} diary entry
                </strong>
              </p>
            </header>
            <section class='editor-buttons-container'>
              {/* save */}
              <button onclick={() => save()}>
                {editItem().id ? 'update' : 'save'}
              </button>
              {/* delete */}
              <button
                style={{ 'background-color': '#D93526' }}
                disabled={!editItem().id}
                onclick={() => deleteItem(editItem().id)}
              >
                delete
              </button>
            </section>
            {/* done */}
            <section>
              <input
                type='checkbox'
                id='done'
                ref={doneInput}
                value={editItem().done}
                checked={editItem().done}
                onclick={() => {
                  setEditItem({ ...editItem(), done: !editItem().done })
                }}
              />
              <label for='done'>done</label>
            </section>
            {/* work */}
            <textarea
              rows='5'
              cols='40'
              ref={workInput}
              value={editItem().work}
              placeholder='describe work'
              aria-invalid={workInvalid()}
              oninput={e =>
                setEditItem({ ...editItem(), work: e.target.value })
              }
            />
            {/* date */}
            <label for='date'>date</label>
            <input
              id='date'
              type='date'
              ref={dateInput}
              value={standardDate(editItem().date)}
              onChange={() =>
                setEditItem({ ...editItem(), date: epocDate(dateInput.value) })
              }
            />
            {/* duration */}
            <label for='duration'>
              duration <mark>{editItem()?.duration}</mark>
            </label>
            <input
              type='range'
              id='duration'
              min='0'
              max='240'
              step='5'
              ref={durationInput}
              value={editItem().duration}
              oninput={() =>
                setEditItem({ ...editItem(), duration: durationInput.value })
              }
            />
            {/* image */}
            <ImageEditor />
          </article>
        </dialog>
      </Show>
    </Transition>
  )
}
export default Editor
