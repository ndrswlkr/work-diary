import { createSignal } from "solid-js"
export const [toastMessage, setToastMessage] = createSignal({
    show: false,
    title: '',
    message: ''
  })