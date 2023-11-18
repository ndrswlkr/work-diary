import { createSignal, onMount, createMemo, on } from 'solid-js'
import { Routes, Route, useNavigate, useLocation } from '@solidjs/router'
import { ofetch } from 'ofetch'
import Toast from './components/toast'
import Diary from './pages/Diary'
import About from './pages/About'
import './App.css'
import Login from './pages/Login'
import Digging from './assets/person-digging-solid.svg?component-solid'; 

async function checkAuthentication () {
  const res = await ofetch('/api/is-authenticated')
  console.log(`checking ... ${res.authenticated}`)
  return res.authenticated
}

function App () {
  const [count, setCount] = createSignal(0)
  const [name, setName] = createSignal({})
  const navigate = useNavigate()
  const location = useLocation()

  createMemo( async () => {
    const loc = location.pathname
    if (! await checkAuthentication()){
      console.log('not authenticated')
      dispatchEvent(new CustomEvent('toast', { detail: 'not authenticated' }))
      navigate('/login', {replace: true})
    }
  
  })

  onMount(async () => {
    window.onfocus =async event => {
      //if (event.explicitOriginalTarget === window)
     
    }

    const data = await ofetch('/api/test')
    //dispatchEvent(new CustomEvent('toast', { detail: 'hello' }))

    setName(data)
  })
  return (
    <>
    <Digging class='icon' />
    <Routes>
      <Route path='/diary' component={Diary} />
      <Route path='/about' component={About} />
      <Route path='/login' component={Login} />
    </Routes>
      <div class='container'>
        <h2>{name().name}</h2>
        <h2>{name().lastName}</h2>
        <Toast></Toast>
      </div>
    </>
  )
}

export default App
