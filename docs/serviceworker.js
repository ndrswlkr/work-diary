//console.log('this message is from your service worker + 1')
let done = false
let timer = null
self.addEventListener('message', message => {
  //const intervals = message.data.body.data || []

  console.log("message recieved")
 remindDiary()
})

function remindDiary(){
  let twoMinutes = 2 * 60 * 1000
  if (timeToAsk()){
    done = true
    self.registration.showNotification('Any work done today', {
      body: `note your work in work-diary`,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'diary-reminder',
      renotify: true,
      icon: '/work-diary/pwa-192x192.png',
      //actions: [{action: 'repeat_this', title: 'REPEAT'}]
    })
  }
  timer = null
  timer = setTimeout( ()=>remindDiary(), twoMinutes)
}

function timeToAsk(){
  let fiveMinutes = 5*60*1000
  let threeMinutes = 3 * 60* 1000
  let current = new Date(Date.now())
  let next = new Date(Date.now())
  next.setHours(21)
  next.setMinutes(0)
  next.setSeconds(0)
  next.setMilliseconds(0)

  if (next - current < -fiveMinutes)
    done = false
    
    if (done === false && next - current < 0 && next - current > -threeMinutes)
    return true
  return false
}

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
