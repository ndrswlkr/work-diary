import { createEffect, createSignal, useContext } from 'solid-js'
import { DiaryContext } from '../DiaryContext'
import { cultures, saveCultures, setCultures } from '../lib/stores'
import { v1 as uuid } from 'uuid'

function CulturesEditor () {
  let newCultureInput
  const { showCulturesEditor, setShowCulturesEditor } = useContext(DiaryContext)
  const [newCulture, setNewCulture] = createSignal('')
  const [newCultureInvalid, setNewCultureInvalid] = createSignal(false)
  createEffect(() => {
    if (newCulture().length > 2) setNewCultureInvalid(false)
  })
  const addCulture = () => {
    if (newCulture().length < 3) setNewCultureInvalid(true)
    let c = { name: newCulture(), id: uuid() }
    setCultures([...cultures(), c])
    saveCultures()
    setNewCulture('')
    showCulturesEditor(false)
  }
  return (
    <dialog attr:open={showCulturesEditor()}>
      <article>
        <header>
          <button
            class='icon-button outline'
            onclick={() => setShowCulturesEditor(false)}
          >
            <i class='fa-solid fa-circle-xmark'></i>
          </button>
        </header>
        <h4>add new Culture</h4>
        <input
          ref={newCultureInput}
          type='text'
          value={newCulture()}
          placeholder='Name of new Culture'
          onchange={() => setNewCulture(newCultureInput.value)}
          aria-invalid={newCultureInvalid()}
        />
        <button onclick={()=>addCulture()}> add Culture </button>
      </article>
    </dialog>
  )
}
export default CulturesEditor
