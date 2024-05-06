import './Toast.css'
import { createEffect, useContext } from 'solid-js'
import { DiaryContext } from '../DiaryContext'

function Toast () {
  const {toastMessage, setToastMessage} = useContext(DiaryContext)
  createEffect(() => {
    if (toastMessage().show) {
      setTimeout(
        () =>
          setToastMessage(msg => {
            return {
              title: msg.title,
              message: msg.message,
              show: false
            }
          }),
        3000
      )
    }
  })

  return (
    <div id='toast' attr:open={toastMessage().show}>
      <h3>{toastMessage().title}</h3>
      <p>{toastMessage().message}</p>
    </div>
  )
}
export default Toast
