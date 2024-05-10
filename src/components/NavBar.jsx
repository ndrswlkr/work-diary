import './NavBar.css'
import { useContext } from 'solid-js'
import { DiaryContext } from '../DiaryContext'

function NavBar () {
  const { showMenu, setShowMenu, showFilter, setShowFilter } =
    useContext(DiaryContext)
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
          <h3>Work Diary</h3>
        </li>
      </ul>
      <ul>
        <li>
          <button
            onClick={() => setShowFilter(!showFilter())}
            class='icon-button outline no-outline'
          >
            <i class='fa-solid fa-filter'></i>
          </button>
        </li>
        <li>
          <button
            class='icon-button outline no-outline'
            onclick={() => setShowMenu(!showMenu())}
          >
            <i class='fa-solid fa-bars'></i>
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default NavBar
