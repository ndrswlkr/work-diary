import './NavBar.css'
import { useContext } from 'solid-js'
import { DiaryContext } from '../DiaryContext'
function NavBar () {
  const {showMenu, setShowMenu} = useContext(DiaryContext)
  return (
    <nav>
      <ul>
        <li>
          <h2>
            <i class='fa-solid fa-person-digging'></i>
          </h2>
        </li>
      </ul>
      <ul>
        <li>
          <h2>Work Diary</h2>
        </li>
      </ul>
      <ul>
        <li>
          <button onclick={()=>setShowMenu(!showMenu())}>Menu</button>
        </li>
      </ul>
    </nav>
  )
}
export default NavBar
