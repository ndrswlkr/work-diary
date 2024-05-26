import { createContext, createSignal } from 'solid-js'
import { diary } from './lib/stores'
export const DiaryContext = createContext()
import { toastMessage, setToastMessage } from './lib/globals'
import { neutralNow } from './lib/diary_functions'
import { createStore } from 'solid-js/store'

export function DiaryContextProvider (props) {
  const [showEditor, setShowEditor] = createSignal(false)
  const [openToEdit, setOpenToEdit] = createSignal(null)
  const [deleteHot, setDeleteHot] = createSignal(false)
  const [showMenu, setShowMenu] = createSignal(false)
  const [showReport, setShowReport] = createSignal(false)
  const [showFilter, setShowFilter] = createSignal(false)
  const [showGardenMap, setShowGardenMap] = createSignal(false)
  const [showGardenMapEditor, setShowGardenMapEditor] = createSignal(false)
  const [showCulturesEditor, setShowCulturesEditor] = createSignal(false) 
  const [bedCommunication, setBedCommunication] = createStore({
    return: null,
    highlight: null
  })
  const initFilter = () => {
    return {
      done: 'both',
      dateBegin: 0,
      dateEnd: neutralNow(),
      category: 'All'
    }
  }
  const [filter, setFilter] = createSignal(initFilter())
  const resetFilter = () => setFilter(initFilter())
  const filteredDiary = () => {
    let filtered = diary().filter(
      e =>
        e.date >= filter().dateBegin &&
        e.date <= filter().dateEnd &&
        (filter().done === 'both' ||
          (filter().done === 'done' && e.done === true) ||
          (filter().done === 'pending' && e.done === false)) &&
        (filter().category === 'All' || filter().category === e.category)
    )
    let sorted = filtered.sort((a,b) => a.date - b.date )
    return sorted
  }
  const categorys = [
    'Pflege',
    'Pflanzen/Setzen',
    'Aussaat',
    'Ernten',
    'Boden',
    'Pflanzenschutz',
    'Anzucht',
    'Umgebungsarbeiten',
    'Anderes'
  ]



  return (
    <DiaryContext.Provider
      value={{
        showEditor,
        setShowEditor,
        openToEdit,
        setOpenToEdit,
        deleteHot,
        setDeleteHot,
        showMenu,
        setShowMenu,
        categorys,
        toastMessage,
        setToastMessage,
        showReport,
        setShowReport,
        showFilter,
        setShowFilter,
        filter,
        setFilter,
        resetFilter,
        filteredDiary,
        showGardenMap,
        setShowGardenMap,
        showGardenMapEditor,
        setShowGardenMapEditor,
        bedCommunication,
        setBedCommunication,
        showCulturesEditor,
        setShowCulturesEditor
      }}
    >
      {props.children}
    </DiaryContext.Provider>
  )
}
