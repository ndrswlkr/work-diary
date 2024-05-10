import { createEffect, createSignal, onMount, useContext, on } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { diary } from './lib/stores'
import { pretty_date } from './lib/diary_functions'
import { setToastMessage } from './lib/globals'
import ReportView from './components/ReportView'
const [shareSuccess, setShareSuccess] = createSignal('')

function generateReport (diary) {
  let totalTime = 0
  diary.forEach(entry => {
    totalTime += Number(entry.duration)
  })
  let report = {}
  report.totalTime = `${totalTime} min`
  report.totalLines = 0
  report.report = {}
  diary.forEach(entry => {
    let date = pretty_date(entry.date)
    if (!(date in report.report))
      report.report[date] = { works: [], duration: 0 }
    report.report[date].duration += Number(entry.duration)
    let lines = entry.work.split('\n')
    lines = lines.filter(line => line.length > 0)
    report.totalLines += lines.length
    report.report[date].works.push({
      date: date,
      duration: entry.duration,
      work: lines,
      category: entry.category,
      done: entry.done
    })
  })
  return report
}

function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function shareReport () {
  //const report = generateHTMLReport()
  var canvas = document.querySelector('#report-canvas')
  const report = canvas.toDataURL('image/png')
  const file = dataURLtoFile(report, 'report.png')
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
  const { showReport, setShowReport, filter, filteredDiary } =
    useContext(DiaryContext)
  const [report, setReport] = createSignal(generateReport(filteredDiary()))
  onMount(() => {
    setShareSuccess(' ')
  })

  createEffect(
    on(
      () => filter(),
      () => {
        console.log("re run generate report")
        setReport(generateReport(filteredDiary()))
        console.log(report())

      }
    )
  )

  return (
    <article>
      <header>
        <button
          class='icon-button outline'
          onClick={() => setShowReport(false)}
        >
          <i class='fa-solid fa-circle-xmark'></i>
        </button>
        <button class='icon-button outline' onClick={() => shareReport()}>
          <i class='fa-solid fa-share-nodes'></i>
        </button>
        <p>{shareSuccess() || ' '}</p>
      </header>
      <ReportView report={report()} />
    </article>
  )
}
export default Report
