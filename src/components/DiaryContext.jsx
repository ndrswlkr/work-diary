import { createContext, createResource, createSignal } from 'solid-js'
import { currentYear, epocDate } from '../lib/date-functions'
import { ofetch } from 'ofetch'



export const DiaryContext = createContext()

export function DiaryContextProvider (props) {
  const [toastMessage, setToastMessage] = createSignal({
    show: false,
    title: '',
    message: ''
  })
  const [reload, setReload] = createSignal({ })
  const [authenticated, setAuthenticated] = createSignal(false)
  const [year, setYear] = createSignal(currentYear())
  const [filter, setFilter] = createSignal({done: true, pending: true})

  const [showEditor, setShowEditor] = createSignal(false)
  const emptyItem = {
      done: true,
      work: '',
      date: epocDate(),
      duration: 10,
      image: null,
      id: null,
  }
  const [editItem, setEditItem] = createSignal(emptyItem)
  function resetEditItem(){
      setEditItem(emptyItem)
  }
  return (
    <DiaryContext.Provider
      value={{
        setReload,
        reload,
        authenticated,
        setAuthenticated,
        toastMessage,
        setToastMessage,
        showEditor,
        setShowEditor,
        editItem,
        setEditItem,
        resetEditItem,
        emptyItem,
        year,
        setYear,
        filter,
        setFilter
      }}
    >
      {props.children}
    </DiaryContext.Provider>
  )
}
