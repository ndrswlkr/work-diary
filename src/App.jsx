import styles from './App.module.css';
import '@picocss/pico'
import {For, onMount} from 'solid-js'
import {createStore} from 'solid-js/store'
const raw_diary = [
  {
    work: 'Tomaten pickieren',
    date: Date.now(),
    duration: 0.75
  },
  {
    work: 'Fliegentüre montieren',
    date: Date.now(),
    duration: 0.5
  }
  ]
  
function App() {
  let entry_input
  const [diary, set_diary] = createStore([])

  onMount( () => {
    set_diary(JSON.parse(localStorage.getItem('diary')))
  })
  const add_entry = () => {
    console.log(entry_input.value)
    console.log(diary.reverse())
    set_diary([
      {work: entry_input.value, date: Date.now(), duration: 0.1},
      ...diary
    ])
    localStorage.setItem('diary', JSON.stringify(diary))
  }
  return (
    <main class='container'>
      <input 
        ref={entry_input} 
        type='text' 
        placeholder='describe work' 
      />
      <button onclick={()=>add_entry()}>add</button>
      <For each={diary}>
        {(entry, i) => (<p>{entry.work}</p>) }
      </For>
    </main>
  );
}

export default App;
