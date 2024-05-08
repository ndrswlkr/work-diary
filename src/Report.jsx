import { createSignal, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { diary } from './lib/stores'
import { pretty_date } from './lib/diary_functions'
import { setToastMessage } from './lib/globals'
import ReportView from './components/ReportView'
const [shareSuccess, setShareSuccess] = createSignal('')

function generateReport () {
  let totalTime = 0
  diary().forEach(entry => {
    totalTime += Number(entry.duration)
  })
  let report = {}
  report.totalTime = `${totalTime} min`
  report.totalLines = 0
  report.report = {}
  diary().forEach(entry => {
    let date = pretty_date(entry.date)
    if (!(date in report.report)) report.report[date] = {works:[], duration: 0}
    report.report[date].duration += Number(entry.duration)
    let lines = entry.work.split('\n')
    lines = lines.filter(line => line.length > 0)
    report.totalLines += lines.length
    report.report[date].works.push({
      date: date,
      duration:  entry.duration,
      work: lines,
      category: entry.category
      

    })
  })
  return report
}
/* function generateReport () {
  let totalTime = 0
  diary().forEach(entry => {
    totalTime += Number(entry.duration)
  })
  let report = 'Arbeitsraport\n-------------\n'
  report += `\nZeitaufwand total: ${totalTime} min\n\n`
  diary().forEach(entry => {
    report += `${pretty_date(entry.date)} Zeitaufwand: ${entry.duration} min\n${
      entry.work
    }\n\n`
  })
  return report
} */
function generateHTMLReport () {
  let totalTime = 0
  diary().forEach(entry => {
    totalTime += Number(entry.duration)
  })
  let report = `
    <!doctype html><html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>work report</title>
      </head>
      <body>
        <div>
          <h2>Arbeitsraport</h2>
    `
  report += `<h3>Zeitaufwand total: ${totalTime} min</h3>`

  diary().forEach(entry => {
    report += `<h4>${pretty_date(entry.date)} Zeitaufwand: ${
      entry.duration
    } min</h4>\n<p>${entry.work}</p>\n\n`
  })
  report += `</div></body> </html> `

  return report
}
function shareReport () {
  //const report = generateHTMLReport()
  var canvas = document.querySelector("#report-canvas")
  console.log(canvas)
const report = canvas.toDataURL("image/png")
  const file = new File([report], 'report.png', {
    type: 'image/png'
  })
  console.log(navigator.canShare())
  setShareSuccess('pending')
  navigator
    .share({
      title: 'Work Report',
      text: 'hier ist der neuste Arbeitsraport',
      files: [file]
    })
    .then(() => {
      setShareSuccess('shared successfully')
    })
    .catch(e =>
      setToastMessage({
        show: true,
        title: 'error while sharing report ',
        message: e
      })
    )
}
function Report () {
  const { showReport, setShowReport } = useContext(DiaryContext)
  return (
    <article style={{"min-height": "100vh", height: "100vh"}}>
      <header>
        Work Report can share: {navigator.canShare() ? 'yes' : 'no'}
      </header>
      <ReportView report={generateReport()} />
      <footer>
        <button onClick={() => setShowReport(false)}>close Report</button>
        <button onClick={() => shareReport()}>share report</button>
        <p>{shareSuccess() || ' '}</p>
      </footer>
    </article>
  )
}
export default Report
