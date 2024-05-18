import { useContext } from 'solid-js'
import { pretty_date } from '../lib/diary_functions'
import './DiaryEntry.css'
import { DiaryContext } from '../DiaryContext'
import { diary, saveDiary, setDiary, cultures } from '../lib/stores'

function DiaryEntry (props) {
  const { setOpenToEdit, deleteHot } = useContext(DiaryContext)

  const toggleDone = entry => {
    //entry.done = !entry.done
    setDiary([
      ...diary().map(e =>
        e.id === entry.id ? { ...e, done: !e.done } : (e = e)
      )
    ])
    console.log(diary())
    saveDiary()
  }
 
  const cultureName = (entry) =>{
    if (entry.culture === 'none') return '-'
    let culture = cultures().find(c => c.id === entry.culture)
   
    return culture?.name

  }
  return (
    <article>
      <header>
        <button
          class='icon-button outline'
          onClick={() => setOpenToEdit(props.entry.id)}
        >
          <i class='fa-solid fa-pencil'></i>
        </button>
        <button
          class='icon-button outline'
          onClick={() => props.deleteEntry(props.entry.id)}
        >
          <i
            style={{
              color:
                deleteHot() === props.entry.id
                  ? 'var(--pico-del-color)'
                  : 'var(--pico-primary)'
            }}
            class='fa-solid fa-trash-can'
          ></i>{' '}
        </button>
      </header>

      <div style={{ display: 'grid', 'grid-template-columns': '1fr 2fr 1fr', gap: '.5rem' }}>
        <h6>{props.entry.category}</h6>
        <h6> {cultureName(props.entry)}</h6>
        <h6>{props.entry.correspondingBed?.name}</h6>
      </div>

      <p style={{ 'white-space': 'pre-wrap' }}>{props.entry.work}</p>
      <footer>
        <div class='diary-grid-1'>
          <label>
            <input
              type='checkbox'
              checked={props.entry.done}
              onClick={() => toggleDone(props.entry)}
            />
            done
          </label>
          <p>{pretty_date(props.entry.date)}</p>
          <p>
            <i
              style={{ 'font-size': '1.3rem' }}
              class='fa-regular fa-clock'
            ></i>

            <mark>{props.entry.duration} minutes</mark>
          </p>
        </div>
      </footer>
    </article>
  )
}
export default DiaryEntry
