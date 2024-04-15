import { For, Show, createSignal, onMount } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { register } from 'register-service-worker'

function registerSW () {
  register(`/workout-timer/serviceworker.js`)
}

const hasNotificationPermission = async () => {
  if (Notification.permission !== 'granted') {
    return false
  }
  return true
}

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Notification permission not granted')
  }
}

function sendMessageToSW (intervals) {
  window.navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({ type: 'message', body: { text: 'hey', data: intervals } })
  })
}

function App () {
  const [ask, setAsk] = createSignal(false)

  onMount(async () => {
    registerSW()
    const hasPermission = await hasNotificationPermission()
    if (!hasPermission) {
      setAsk(true)
    }
  })

  const [interval, setInterval] = createSignal(30)
  const [intervals, setIntervals] = createSignal([])

  const addInterval = () => {
    setIntervals([...intervals(), Number(interval())])
  }


  return (
    <>
      <div></div>
      <h1>Workout Timer</h1>
      <div class='card'>
        <dialog prop:open={ask()}>
          <h4>Like to get Notified?</h4>
          <button
            onclick={() => {
              requestNotificationPermission()
              setAsk(false)
            }}
          >
            activate notifications
          </button>
        </dialog>
        <input
          type='number'
          from='30'
          to='240'
          value={interval()}
          step='10'
          id='duration'
          onchange={e => setInterval(e.target.value)}
        />
        <button onClick={() => addInterval()}>Add Interval</button>
        <For each={intervals()}>
          { (int) => (
            <p>{int}</p>
          )}
        </For>
        <button onclick={() => sendMessageToSW(intervals())}>START</button>
      </div>
    </>
  )
}

export default App
