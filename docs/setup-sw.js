const checkPermission = () =>{
    if (!("serviceWorker" in navigator)){
        throw new Error ("No support for service worker")
    }

    if (!("Notification" in window)){
        throw new Error("no support for Notifications")
    }
}

const registerSW = async () =>{
    const registration = await navigator.serviceWorker.register("/pwa-example/serviceworker.js")
    return registration
}

const requestNotificationPermission = async () =>{
    const permission = await Notification.requestPermission()
    if (permission !== "granted"){
        throw new Error("Notification permission not granted")
    } 
}


const main = async () => {

    checkPermission()
    const reg = await registerSW()
    requestNotificationPermission()
    window.addEventListener("boom", evt => {
        setTimeout(() =>    {

            reg.showNotification("yo o o  fo realllll " + evt )
        }, 7000)
    })
}

