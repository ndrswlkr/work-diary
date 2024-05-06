import { register } from 'register-service-worker'

export function registerSW () {
    register(`/work-diary/serviceworker.js`)
  }
  
 export const hasNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      return false
    }
    return true
  }
  
 export const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }
  }
  
 export function sendMessageToSW (intervals) {
    window.navigator.serviceWorker.ready.then(reg => {
      reg.active.postMessage({ type: 'message', body: { text: 'hey', data: intervals } })
    })
  }
  