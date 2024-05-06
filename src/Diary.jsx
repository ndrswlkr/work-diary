import {
  For,
  Match,
  Switch,
  createEffect,
  on,
  onMount,
  useContext
} from 'solid-js'
import { diary, setDiary, loadDiary, saveDiary } from './lib/stores'
import DiaryEntry from './components/DiaryEntry'
import FloatingButton from './components/FloatingButton'
import Editor from './components/Editor'
import Report from './Report'
import { DiaryContext } from './DiaryContext'
function Diary () {
  const {
    showEditor,
    setShowEditor,
    openToEdit,
    setOpenToEdit,
    deleteHot,
    setDeleteHot,
    showReport
  } = useContext(DiaryContext)

  onMount(async () => {
    loadDiary()
  })

  const saveNewEntry = async entry => {
    setDiary([entry, ...diary().filter(e => e.id !== entry.id)])
    saveDiary()
  }

  const deleteEntry = async entryId => {
    if (deleteHot() === false) {
      setDeleteHot(entryId)
      setTimeout(() => setDeleteHot(false), 2000)
      return
    }
    if (deleteHot() === entryId) {
      setDiary(diary().filter(entry => entry.id !== entryId))
      saveDiary()
    } else {
      setDeleteHot(entryId)
    }
  }

  createEffect(
    on(
      () => openToEdit(),
      () => {
        if (openToEdit() !== null) setShowEditor(true)
      }
    )
  )
  createEffect(
    on(
      () => showEditor(),
      () => {
        if (showEditor() === false) setOpenToEdit(null)
      }
    )
  )

  return (
    <div>
      <FloatingButton />
      <Editor saveNewEntry={saveNewEntry} />
      <Switch>
        <Match when={!showReport()}>
          <For each={diary()}>
            {entry => <DiaryEntry entry={entry} deleteEntry={deleteEntry} />}
          </For>
        </Match>
        <Match when={showReport()}>
            <Report />
        </Match>
      </Switch>
    </div>
  )
}
export default Diary
