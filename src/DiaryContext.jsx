import { createContext, createResource, createSignal } from 'solid-js'

export const DiaryContext = createContext()

export function DiaryContextProvider (props) {
  const [toastMessage, setToastMessage] = createSignal({
    show: false,
    title: '',
    message: ''
  })
  const [showEditor, setShowEditor] = createSignal(false)
  const [openToEdit, setOpenToEdit] = createSignal(null)
  const [deleteHot, setDeleteHot] = createSignal(false)
  const [showMenu, setShowMenu] = createSignal(false)
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
        setShowMenu
      }}
    >
      {props.children}
    </DiaryContext.Provider>
  )
}
