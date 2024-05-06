import { createSignal, onMount } from 'solid-js'
import './App.css'
import { hasNotificationPermission, registerSW, requestNotificationPermission, sendMessageToSW } from './lib/notifications'
import '@picocss/pico'
import Diary from './Diary'
import NavBar from './components/NavBar'
import Menu from './components/Menu'
import Toast from './components/Toast'
function App () {
  const [ask, setAsk] = createSignal(false)

  onMount(async () => {
    registerSW()
    const hasPermission = await hasNotificationPermission()
    if (!hasPermission) {
      setAsk(true)
    }
  })

  return (
    <>
      <NavBar />
      <Menu />
      <Toast />
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
        </div>
      <Diary />
    </>
  )
}

export default App
