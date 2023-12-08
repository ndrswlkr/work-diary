import { A, useNavigate } from '@solidjs/router'
import { Show, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { ofetch } from 'ofetch'
import './Nav.css'

function Nav () {
  const {authenticated} = useContext(DiaryContext)
  const navigate = useNavigate()
  async function logout () {
    await ofetch('/api/logout')
    navigate('/login')
  }
  return (
    <Show when={authenticated()}>
      <nav>
        <ul>
          <li>
            <i id='brand-symbol' class='fa-solid fa-person-digging'></i>
            <strong>work-diary</strong>
          </li>
        </ul>
        <ul>
          <li>
            <A href='/diary'>diary</A>
          </li>
          <li>
            <A href='/about'>about</A>
          </li>
          <li>
            <A href='/reports'>reports</A>
          </li>
          <li>
            <button onclick={() => logout()}>logout</button>
          </li>
        </ul>
      </nav>
    </Show>
  )
}
export default Nav
