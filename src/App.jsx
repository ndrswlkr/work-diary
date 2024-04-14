import { createSignal, onMount } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

onMount( ()=>{
 
})

function sendMessageToSW() {
  console.log("sendom message to sw")
  window.navigator.serviceWorker.ready.then((reg) => {
      console.log("sw is ready")
     reg.active.postMessage({ type: "message", body: {text: "hey"}})
     
    })
}

//window.addEventListener("boom", ()=>console.log("boom detected in app"))
function App() {
  const [count, setCount] = createSignal(0)
  const event = new CustomEvent("boom")
  
 
  return (
    <>
      <div>

      </div>
      <h1>PWA Example</h1>
      <div class="card">
      <button onclick="main()">activate notifications</button>
    <button onclick={()=>sendMessageToSW()}>send message to sw</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
