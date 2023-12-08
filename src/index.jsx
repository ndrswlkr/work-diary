/* @refresh reload */
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import '@picocss/pico'
import './index.css'
import App from './App'
import { DiaryContextProvider } from './components/DiaryContext'
const root = document.getElementById('root')

render(
  () => (
    <Router>
      <DiaryContextProvider>
        <App />
      </DiaryContextProvider>
    </Router>
  ),
  root
)
