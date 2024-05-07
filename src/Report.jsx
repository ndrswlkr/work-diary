import { createSignal, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { diary } from './lib/stores'
import { pretty_date } from './lib/diary_functions'
import { setToastMessage } from './lib/globals'
const [shareSuccess, setShareSuccess] = createSignal('')
function generateReport () {
  let report = ''
  diary().forEach(entry => {
    report += `${pretty_date(entry.date)} Zeitaufwand: ${entry.duration} min\n${
      entry.work
    }\n\n`
  })
  return report
}
function generateHTMLReport () {
    let report = ''
    diary().forEach(entry => {
      report += `<h4>${pretty_date(entry.date)} Zeitaufwand: ${entry.duration} min</h4>\n<p>${
        entry.work
      }</p>\n\n`
    })
    return report
  }
function shareReport () {
  const report = generateHTMLReport()
  const file = new File([report], "report.html", {
    type: "text/html",
  })
  console.log(navigator.canShare())
  setShareSuccess('pending')
  navigator
    .share({ title: 'Work Report', text: "hier ist der neuste Arbeitsraport", files: [file]})
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
    <article>
      <header>
        Work Report can share: {navigator.canShare() ? 'yes' : 'no'}
      </header>
      <pre>{generateReport()}</pre>
      <footer>
        <button onClick={() => setShowReport(false)}>close Report</button>
        <button onClick={() => shareReport()}>share report</button>
        <p>{shareSuccess() || " "}</p>
      </footer>
    </article>
  )
}
export default Report
