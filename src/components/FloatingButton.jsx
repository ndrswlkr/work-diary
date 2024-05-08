import { Show, createSignal, onMount, useContext } from 'solid-js'
import './FloatingButton.css'
import { DiaryContext } from '../DiaryContext'

function FloatingButton (props) {
  const { showEditor, setShowEditor, showReport } = useContext(DiaryContext)
  const [buzz, setBuzz] = createSignal()
  onMount(() => {
    setInterval(() => {
      setBuzz(true)
      setTimeout(() => setBuzz(false), 400)
    }, 7000)
  })
  return (
    <Show when={!showReport()}>
      <button
        class='float  primary'
        id='floating-button'
        attr:buzz={buzz()}
        onClick={() => setShowEditor(!showEditor())}
      >
        <i class='fa-solid fa-plus fa-2xl float-icon'></i>
      </button>
    </Show>
  )
}
export default FloatingButton
