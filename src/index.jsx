/* @refresh reload */
import { render } from 'solid-js/web'
//import { register } from "register-service-worker";

import './index.css'
import App from './App'

const root = document.getElementById('root')

//register(`/serviceworker.js`)
render(() => <App />, root)
