import { createSignal } from 'solid-js'
import localforage from 'localforage'
import { toastMessage, setToastMessage } from './globals'

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
export const [gardenPlan, setGardenPlan] = createSignal({
  sections: [
    { name: 'Herbs', num: 0, beds: [{name: "Herbs 1", num: 0}] },
    { name: 'nord', num: 1, beds: [{name: "nord 1", num: 0}, {name: "nord 2", num: 1}] },
    { name: 'middle', num: 2, beds: [{name: "middle 1", num: 0},{name: "middle 2", num: 0},{name: "middle 3", num: 2}] },
    { name: 'south', num: 3, beds: [{name: "south 1", num: 0},{name: "south 2", num: 1},{name: "south 3", num: 2},{name: "south 4", num: 3},] },
  ]
})
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
