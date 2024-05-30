import { Show, createEffect, createSignal, on, useContext } from 'solid-js'
import './GardenBed.css'
import { DiaryContext } from '../DiaryContext'
import { gatherCultureHistory } from '../lib/stores'

function GardenBed (props) {
  let timer
  const {
    bedCommunication,
    setBedCommunication,
    setShowGardenMap,
    showGardenMap
  } = useContext(DiaryContext)

  const [bedHistory, setBedHistory] = createSignal([])
  const [historyIndex, setHistoryIndex] = createSignal(0)
  const [highlighted, setHighlighted] = createSignal(false)

  const advanceHistoryIndex = () => {
    setHistoryIndex(historyIndex() + 1)
    if (historyIndex() > bedHistory().length - 1) setHistoryIndex(0)
    timer = setTimeout(() => advanceHistoryIndex(), 2000)
  }

  createEffect(
    on(
      () => showGardenMap(),
      async () => {
        if (timer) clearTimeout(timer)
        setBedHistory(await gatherCultureHistory(props.bed.id))
        timer = setTimeout(() => advanceHistoryIndex(), 2000)
      }
    )
  )

  const returnBed = () => {
    if (bedCommunication.return === true) {
      setBedCommunication('return', props.bed)
      setShowGardenMap(false)
    }
  }

  createEffect(() => {
    if (bedCommunication.highlight === props.bed.id) {
      setHighlighted(true)
    } else {
      setHighlighted(false)
    }
  })

  return (
    <div
      onclick={() => returnBed()}
      class={highlighted() ? 'bed highlight' : 'bed'}
      id={props.bed.id}
    >
      <div class='bed-content'>
        <h6>{props.bed.name}</h6>
        <p>{bedHistory()[historyIndex()]?.date}</p>
        <Show when={bedHistory().length > 0} fallback={<span> </span>}>
          <span class='history-index'>{historyIndex() + 1}</span>
        </Show>
        <p>{bedHistory()[historyIndex()]?.culture}</p>
      </div>
    </div>
  )
}
export default GardenBed
