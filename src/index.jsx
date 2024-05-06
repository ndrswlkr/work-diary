/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { DiaryContextProvider } from './DiaryContext'

const root = document.getElementById('root')

render(
  () => (
    <DiaryContextProvider>
      <App />
    </DiaryContextProvider>
  ),
  root
)
