import { createSignal } from 'solid-js'
import localforage from 'localforage'
import { toastMessage, setToastMessage } from './globals'
import { pretty_date, short_date } from './diary_functions'

localforage.config({
  name: 'work-diary'
})

/* localforage
  .ready()
  .then(function () {
    // This code runs once localforage
    // has fully initialized the selected driver.
    console.log(localforage.supports(localforage.INDEXEDDB))
    localforage.setDriver([localforage.WEBSQL, localforage.INDEXEDDB])
    console.log(localforage.driver()) // localforage
  })
  .catch(function (e) {
    console.log(e) // `No available storage method found.`
    // One of the cases that `ready()` rejects,
    // is when no usable storage driver is found
  }) */

export const [diary, setDiary] = createSignal([])
export const [gardenPlan, setGardenPlan] = createSignal({ sections: [] })

export function loadGardenPlan () {
  localforage
    .getItem('gardenPlan')
    .then(data => {
      if (data) {
        setGardenPlan(JSON.parse(data))
      }
    })
    .catch(e => console.log(e))
}

export function saveGardenPlan () {
  let data = JSON.stringify(gardenPlan())
  localforage.setItem('gardenPlan', data).catch(e => console.log(e))
}

export const exportGardenPlan = () => {
  let data =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(gardenPlan()))
  let element = document.createElement('a')
  element.setAttribute('href', data)
  element.setAttribute('download', 'gardenPlan-export.json')

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()

  document.body.removeChild(element)
}

export const importGardenPlan = file => {
  let fr = new FileReader()
  fr.onload = e => {
    try {
      let gardenPlanData = JSON.parse(e.target.result)
      setGardenPlan(gardenPlanData)
      saveDiary()
    } catch (e) {
      setToastMessage({
        show: true,
        title: 'error importing file',
        message: file.name + ' ' + e
      })
    }
  }

  fr.onerror = e => {
    console.log(e)
    setToastMessage({
      show: true,
      title: 'error',
      message: 'error importing gardenPlan data'
    })
  }

  fr.readAsText(file)
}

export function loadDiary () {
  localforage
    .getItem('diary')
    .then(data => {
      if (data) {
        setDiary(JSON.parse(data))
      }
    })
    .catch(e => console.log(e))
}

export function saveDiary () {
  let data = JSON.stringify(diary())
  localforage.setItem('diary', data).catch(e => console.log(e))
}

export const exportDiary = () => {
  let data =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(diary()))
  let element = document.createElement('a')
  element.setAttribute('href', data)
  element.setAttribute('download', 'diary-export.json')

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()

  document.body.removeChild(element)
}

export const importDiary = file => {
  let fr = new FileReader()
  fr.onload = e => {
    try {
      let diaryData = JSON.parse(e.target.result)
      setDiary(diaryData)
      saveDiary()
    } catch (e) {
      setToastMessage({
        show: true,
        title: 'error importing file',
        message: file.name + ' ' + e
      })
    }
  }

  fr.onerror = e => {
    console.log(e)
    setToastMessage({
      show: true,
      title: 'error',
      message: 'error importing diary data'
    })
  }

  fr.readAsText(file)
}
//cultures
export const [cultures, setCultures] = createSignal([
  { name: 'keine Kultur gewählt', id: 'none' },
  { name: 'Kartoffeln', id: '1' },
  { name: 'Karotten', id: '2' },
  { name: 'Bohnen', id: '3' },
  { name: 'Salat', id: '4' }
])
export function loadCultures () {
  localforage
    .getItem('cultures')
    .then(data => {
      if (data) {
        setCultures(JSON.parse(data))
      }
    })
    .catch(e => console.log(e))
}

export function saveCultures () {
  let data = JSON.stringify(cultures())
  localforage.setItem('cultures', data).catch(e => console.log(e))
}

export function cultureFromId (id) {
  let culture = cultures().find(c => c.id === id)
  return culture.name
}

//additional functions
export function allBedIds () {
  let bedIds = []
  gardenPlan().sections.forEach(section => {
    section.beds.forEach(bed => {
      bedIds.push(bed.id)
    })
  })
  return bedIds
}

export async function gatherCultureHistory (bedId) {
  let results = []
  let lookbackTime = 3*365*24*60*60*1000
  diary().forEach(entry => {
    //has bed set
    //has category aussaat or pflanzen/setzen
    if (
      entry.correspondingBed?.id === bedId &&
      (entry.category === 'Aussaat' || entry.category === 'Pflanzen/Setzen') &&
      entry.culture !== 'none' &&
      Date.now() - entry.date < lookbackTime
    ) {
      results.push({
        rawDate: entry.date,
        date: short_date( entry.date),
        category: entry.category,
        culture: cultureFromId(entry.culture)
      })
    }
  
  })

  results = results.sort((a, b) => b.rawDate - a.rawDate)

  return results
}
