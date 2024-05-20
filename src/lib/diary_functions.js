export function pretty_date(date){
  date = new Date(date)
  let month = date.getMonth()+1
  if (month < 10) month = `0${month}`  
  let day = date.getDate()
  if (day < 10) day = `0${day}`
  return `${day}.${month}.${date.getFullYear()}`
}
export function short_date(date){
  date = new Date(date)
  let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let m = date.getMonth()
  let y = String(date.getFullYear())
  return `${months[m]} ${y.substring(2,4)}`
}

export function standard_date(date){
  date = new Date(date)
  let month = date.getMonth()+1
  if (month < 10) month = `0${month}`
  let day = date.getDate()
  if (day < 10) day = `0${day}`
  return `${date.getFullYear()}-${month}-${day}`
 
}

export function epoc_date(date){
  date = new Date(date)
  return Number(date)
}

export function currentDay(){
  let date = new Date(Date.now())
  let day =  date.getDate() + 1
  if (day < 10) day = `0${day}`
  return String(day)
}
export function currentMonth(){
  let date = new Date(Date.now())
  let month =  date.getMonth() + 1
  if (month < 10) month = `0${month}`
  return month
}
export function currentYear(){
  let date = new Date(Date.now())
  let year =  date.getFullYear()
  
  return String(year)
}

export function lastDayOfMonth(y,m){
  return new Date(y, Number(m), 0).getDate()
}

export function neutralNow(){

  return epoc_date(new Date(currentYear(), currentMonth(), currentDay()))
}