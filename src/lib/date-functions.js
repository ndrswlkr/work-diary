let now = Date.now()
export function prettyDate (date = now) {
  date = new Date(date)
  let month = date.getMonth() + 1
  if (month < 10) month = `0${month}`
  let day = date.getDate()
  if (day < 10) day = `0${day}`
  return `${day}.${month}.${date.getFullYear()}`
}

export function standardDate (date = now) {
  date = new Date(date)
  let month = date.getMonth() + 1
  if (month < 10) month = `0${month}`
  let day = date.getDate()
  if (day < 10) day = `0${day}`
  return `${date.getFullYear()}-${month}-${day}`
}

export function epocDate (date = now) {
  date = new Date(date)
  return Number(date)
}

export function currentYear(){
  return (new Date()).getFullYear()
}