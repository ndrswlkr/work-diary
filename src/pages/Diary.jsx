import {
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
  useContext,
  createResource
} from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'
import { ofetch } from 'ofetch'
import Editor from '../components/Editor'
import './Diary.css'
import { prettyDate } from '../lib/date-functions'
import { DiaryContext } from '../components/DiaryContext'
import BottomNav from '../components/BottomNav'
import FloatingButton from '../components/FloatingButton'

const enterAnimation = (el, done) => {
  
  const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 600
  })
  a.finished.then(done)
}

const exitAnimation = (el, done) => {
  const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 600
  })
  a.finished.then(done)
}

function Diary () {
  const {
    setReload,
    reload,
    setToastMessage,
    setShowEditor,
    setEditItem,
    emptyItem,
    year,
    filter
  } = useContext(DiaryContext)

  const fetchData = async reload => {
    //if (!authenticated()) return {}
    const year = reload.year
    console.log('fetching workdata: ', year)

    const data = await ofetch('/api/workdata', {
      method: 'POST',
      body: { year: year }
    }).catch(e => {
      setToastMessage({
        show: true,
        title: 'error',
        message: 'unable to load diary data'
      })
    })
    console.log(data)
    return data
  }

  const [data, { mutate, refetch }] = createResource(reload, fetchData)

  function openEditor (item = emptyItem) {
    setEditItem(item)
    setShowEditor(true)
  }

  async function updateDone (done, id) {
    done = done ? 1 : 0
    console.log('update done', done, id)
    const res = await ofetch('/api/update-done', {
      method: 'POST',
      body: { done, id }
    }).catch(e =>
      setToastMessage({
        show: true,
        title: 'error',
        message: 'error updating done ' + e
      })
    )

    if (res.success) {
      console.log("mutating")
      mutate(data =>
        data.map(entry => {
          if (entry.id == id) 
            return {...entry, done: done}
          //else
            return entry
        })
      )
    }
  }

  function checkDonePending (item) {
    console.log("checking done/pending")
    if (item.done && filter().done) return true
    if (!item.done && filter().pending) return true
    return false
  }

  onMount(() => {
    console.log('mounted')
    setReload({ year: year() })
  })

  createMemo(() => {
    console.log(year())
    setReload({ year: year() })
  })

  return (
    <section class='diary-section'>
      <Editor mutate={mutate} />
      <FloatingButton action={openEditor} />
      <BottomNav />
      <Show when={!data.loading} fallback={<span aria-busy='true'></span>}>
        <TransitionGroup onEnter={enterAnimation} onExit={exitAnimation}>
          <For each={data()}>
            {diaryItem => (
              <Show when={checkDonePending(diaryItem)}>
                <article class='diary-element'>
                  {/* work */}
                  <p class='diary-work'>{diaryItem.work}</p>

                  {/* date */}
                  <p className='diary-date'>{prettyDate(diaryItem.date)}</p>

                  {/* duration */}
                  <p className='diary-duration'>
                    <i class='fa-solid fa-clock'></i> {diaryItem.duration}min
                  </p>

                  {/* edit-button */}
                  <button
                    className='edit-button'
                    onclick={() => openEditor(diaryItem)}
                  >
                    <i class='fa-solid fa-pen-to-square'></i>
                  </button>

                  {/* checkbox done */}
                  <input
                    type='checkbox'
                    id={`done${diaryItem.id}`}
                    className='diary-done'
                    checked={diaryItem.done}
                    onchange={e => updateDone(e.target.checked, diaryItem.id)}
                  />

                  {/* image */}
                  <Show when={diaryItem.image}>
                    <img
                      src={diaryItem.image}
                      alt='image showing work'
                      className='diary-image'
                    />
                  </Show>
                </article>
              </Show>
            )}
          </For>
        </TransitionGroup>
      </Show>
    </section>
  )
}
export default Diary
