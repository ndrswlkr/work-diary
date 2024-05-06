import { createContext, createResource, createSignal } from 'solid-js'

export const DiaryContext = createContext()
import {toastMessage, setToastMessage} from './lib/globals'
export function DiaryContextProvider (props) {
 
  const [showEditor, setShowEditor] = createSignal(false)
  const [openToEdit, setOpenToEdit] = createSignal(null)
  const [deleteHot, setDeleteHot] = createSignal(false)
  const [showMenu, setShowMenu] = createSignal(false)
  const [showReport, setShowReport] = createSignal(false)
  const categorys = [
    "Pflege",
    "Pflanzen/Setzen",
    "Ernten",
    "Pflanzenschutz",
    "Anzucht",
    "Umgebungsarbeiten",
    "Anderes"
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
        setShowReport
      }}
    >
      {props.children}
    </DiaryContext.Provider>
  )
}
