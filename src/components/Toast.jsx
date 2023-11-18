import { onMount, onCleanup, createSignal, Show } from 'solid-js'
import './Toast.css'


function Toast () {
  const [show, setShow] = createSignal(false)
  const [message, setMessage] = createSignal("message")
  
  const showToast = (msg) => {
    setShow(true)
    setMessage(msg)
    setTimeout(() => setShow(false), 3000)
  }

  onMount(() => {
    addEventListener('toast', event => showToast(event.detail))
  })

  onCleanup(() => removeEventListener('toast', event => showToast(event.detail)))

  return (
   
      <div id='toast' attr:open={show()}>
        <h3>toast</h3>
        <p>{message()}</p>
      </div>
    
  )
}
export default Toast
