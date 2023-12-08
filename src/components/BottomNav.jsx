import './BottomNav.css'
import { For, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { currentYear } from '../lib/date-functions'

function BottomNav () {
  const { year, setYear, filter, setFilter } = useContext(DiaryContext)
  const years = []
  
  for (let y = currentYear() - 3; y <= currentYear() + 3; y += 1) {
    years.push(y)
  }

  return (
    <div class='bottom-nav'>
      <select id='filter-year' onChange={(e)=>setYear(e.target.value)}>
        <For each={years}>
          {y => (
            <option value={y} selected={y == currentYear()}>
              {y}
            </option>
          )}
        </For>
      </select>
      <fieldset>
        <label>
          <input
            type='checkbox'
            name='done'
            id='filter-done'
            checked={filter().done}
            onclick={e => setFilter({ ...filter(), done: e.target.checked })}
          />
          done
        </label>
        <label>
          <input
            type='checkbox'
            name='language'
            id='filter-pending'
            checked={filter().pending}
            onclick={e => setFilter({ ...filter(), pending: e.target.checked })}
          />
          pending
        </label>
      </fieldset>
    </div>
  )
}
export default BottomNav
