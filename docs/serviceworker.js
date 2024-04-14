console.log('this message is from your service worker + 1')

self.addEventListener('message', () => {
  console.log('got message, with all the best wishes, your SW')
  self.registration.showNotification('from SW with love', { body: 'yesyesyes' })
  setTimeout(() => {
    self.registration.showNotification('from SW with love', {
      body: 'yesyesyes',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample'
    })
  }, 7000)
})
