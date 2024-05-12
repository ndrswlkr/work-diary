import { useContext, onMount, onCleanup, For } from 'solid-js'
import { DiaryContext } from '../DiaryContext'
import { currentDay, currentMonth, currentYear, epoc_date, lastDayOfMonth, standard_date } from '../lib/diary_functions'

function Filter () {
  const {
    showFilter,
    setShowFilter,
    setFilter,
    resetFilter,
    filter,
    categorys
  } = useContext(DiaryContext)
  let filterArticle
  let dateBegin
  let dateEnd
  const handleClick = event => {
    if (!showFilter()) return
    if (!filterArticle.contains(event.target)) {
      setShowFilter(false)
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClick, true)
  })
  onCleanup(() => {
    document.removeEventListener('click', handleClick, true)
  })
  const setThisYear= () =>{
    setFilter({...filter(), dateBegin: epoc_date(`${currentYear()}-01-01`)})
    setFilter({...filter(), dateEnd: epoc_date(`${currentYear()}-12-31`)})
  } 
  const setThisMonth = () =>{
    setFilter({...filter(), dateBegin: epoc_date(`${currentYear()}-${currentMonth()}-1`)})
    setFilter({...filter(), dateEnd: epoc_date(`${currentYear()}-${currentMonth()}-${lastDayOfMonth(currentYear(), currentMonth())}`)})
  }
  const setLastMonth = () =>{
    setFilter({...filter(), dateBegin: epoc_date(`${currentYear()}-${Number(currentMonth())-1}-1`)})
    setFilter({...filter(), dateEnd: epoc_date(`${currentYear()}-${Number(currentMonth())-1}-${lastDayOfMonth(currentYear(), Number(currentMonth())-1)}`)})
  }
  return (
    <dialog attr:open={showFilter()}>
      <article ref={filterArticle}>
      <header>
          <button
            class='icon-button outline'
            onclick={() => setShowFilter(false)}
          >
           <i class="fa-solid fa-caret-left"></i>
          </button>
          <button
            class='icon-button outline'
            onclick={() => resetFilter()}
          >
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </button>
        </header>
        <label>
          starting from:
          <input
            type='date'
            ref={dateBegin}
            value={
              filter().dateBegin ? standard_date(filter().dateBegin) : null
            }
            onChange={() =>
              setFilter({
                ...filter(),
                dateBegin: epoc_date(dateBegin.value)
              })
            }
          />
        </label>
        <label>
          ending at:
          <input
            type='date'
            ref={dateEnd}
            value={standard_date(filter().dateEnd)}
            onChange={() =>
              setFilter({
                ...filter(),
                dateEnd: epoc_date(dateEnd.value)
              })
            }
          />
        </label>
        <button onclick={()=> setThisYear()} >this year</button>
        <button onclick={()=> setThisMonth()} >this month</button>
        <button onclick={()=> setLastMonth()} >last month</button>
        <fieldset>
          <legend>done/pending</legend>
          <label>
            <input
              type='radio'
              name='done-pending'
              checked={filter().done === 'done'}
              onChange={() => setFilter({ ...filter(), done: 'done' })}
            />
            done
          </label>
          <label>
            <input
              type='radio'
              name='done-pending'
              checked={filter().done === 'pending'}
              onChange={() => setFilter({ ...filter(), done: 'pending' })}
            />
            pending
          </label>
          <label>
            <input
              type='radio'
              name='done-pending'
              checked={filter().done === 'both'}
              onChange={() => setFilter({ ...filter(), done: 'both' })}
            />
            both
          </label>
        </fieldset>
        <fieldset>
          <legend>Kategorie</legend>
          <For each={[...categorys, 'All']}>
            {cat => (
              <label>
                <input
                  type='radio'
                  name={cat}
                  checked={cat === filter().category}
                  onChange={() => setFilter({...filter(), category: cat})}
                />
                {cat}
              </label>
            )}
          </For>
        </fieldset>
      </article>
    </dialog>
  )
}
export default Filter
