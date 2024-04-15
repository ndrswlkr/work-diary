console.log('this message is from your service worker + 1')

self.addEventListener('message', message => {
  const intervals = message.data.body.data || []

  //console.log('got message, with all the best wishes, your SW')
  //self.registration.showNotification('from SW with love', { body: 'yesyesyes' })
  let intervalSum = 0
  intervals.forEach(int => {
    let interval = int + intervalSum
    intervalSum = intervalSum + int
    setTimeout(() => {
      self.registration.showNotification('next Workout step', {
        body: `int ${int} sum ${intervalSum}`,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'workout-interval',
        renotify: true,
        icon: '/workout-timer/pwa-192x192.png',
        actions: [{action: 'repeat_this', title: 'REPEAT'}]
      })
    }, interval * 1000)
  })
})

self.addEventListener('notificationclick', event => {
  //console.log('On notification click: ', event.notification)
  //console.log(event.action)
  event.notification.close()
  event.waitUntil(
    self.clients
      .matchAll({includeUncontrolled: true, type: 'window'})
      .then((clientList) => {
        for (const client of clientList) {
          if ( "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      }),
  );
}

)
