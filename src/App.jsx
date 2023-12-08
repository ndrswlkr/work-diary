import { createSignal, onMount, createEffect, useContext } from 'solid-js'
import { Routes, Route, useNavigate, useLocation } from '@solidjs/router'
import { ofetch } from 'ofetch'
import { DiaryContext } from './components/DiaryContext.jsx'
import Toast from './components/toast'
import Diary from './pages/Diary'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import Nav from './components/Nav'
import Reports from './pages/Reports.jsx'
//store


async function checkAuthentication () {
  const res = await ofetch('/api/is-authenticated')
  return res.authenticated
}


function App () {
  const {setToastMessage,authenticated, setAuthenticated} = useContext(DiaryContext)
  const navigate = useNavigate()
  const location = useLocation()

  createEffect(async () => {
    const loc = location.pathname
    if (await checkAuthentication()) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
    if (authenticated() || loc == '/register' || loc == '/login') {
      return
    } else {
      setToastMessage({show: true, title: 'warning', message: 'not authenticated'})
      navigate('/login', { replace: true })
    }
  })

   onMount(async () => {

    //window.onfocus = async event => {
    //if (event.explicitOriginalTarget === window)
    //}
  }) 
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/diary' component={Diary} />
        <Route path='/reports' component={Reports} />
        <Route path='/about' component={About} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Routes>
      <div class='container'>
        <Toast></Toast>
      </div>
    </>
  )
}

export default App
