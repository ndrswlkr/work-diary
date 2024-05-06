import { useContext } from 'solid-js'
import { pretty_date } from '../lib/diary_functions'
import './DiaryEntry.css'
import { DiaryContext } from '../DiaryContext'

function DiaryEntry (props) {
  const { setOpenToEdit, deleteHot } = useContext(DiaryContext)

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
      <h6>{props.entry.category}</h6>

      <p style={{ 'white-space': 'pre-wrap' }}>{props.entry.work}</p>
      <footer>
        <div class='diary-grid-1'>
          <label>
            <input type='checkbox' checked={props.entry.done} />
            done
          </label>
          <p>{pretty_date(props.entry.date)}</p>
          <p>
           
              <i style={{"font-size": "1.3rem"}} class='fa-regular fa-clock'></i>
            
            <mark>{props.entry.duration} minutes</mark>
          </p>
        </div>
      </footer>
    </article>
  )
}
export default DiaryEntry
