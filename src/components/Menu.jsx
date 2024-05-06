import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  For,
  useContext
} from 'solid-js'
import { DiaryContext } from '../DiaryContext'
import { exportDiary, importDiary } from '../lib/stores'
let menu
let fileInput

function Menu (props) {
  const { showMenu, setShowMenu } = useContext(DiaryContext)

  const handleClick = event => {
    if (!showMenu()) return
    if (!menu.contains(event.target)) {
      setShowMenu(false)
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClick, true)
  })
  onCleanup(() => {
    document.removeEventListener('click', handleClick, true)
  })

  return (
    <dialog attr:open={showMenu()}>
      <article ref={menu}>
        <header>
          <button
            class='icon-button outline'
            onclick={() => setShowMenu(false)}
          >
            <i class='fa-solid fa-circle-xmark'></i>
          </button>
        </header>
        <h6>export Data</h6>
        <p>
          exports current data to your device
          <br />
          this can serve as an update
        </p>
        <button
          onClick={() => {
            exportDiary()
            setShowMenu(false)
          }}
        >
          export Diary
        </button>
        <hr />
        <h6>import diary data</h6>
        <p>
          <mark>Caution!</mark> Existing data will be overwritten.
        </p>
        <input type='file' ref={fileInput} />
        <button
          style={{
            'background-color': 'var(--pico-del-color)'
          }}
          onClick={() => {
            importDiary(fileInput.files[0])
            setShowMenu(false)
          }}
        >
          import Diary
        </button>
      </article>
    </dialog>
  )
}
export default Menu
