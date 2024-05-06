import { useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'
import { diary } from './lib/stores'
import { pretty_date } from './lib/diary_functions'

function generateReport(){
    let report = ""
    diary().forEach(entry => {
        report += `${pretty_date( entry.date)} Zeitaufwand: ${entry.duration} min\n${entry.work}\n\n`
    })
    return report
}
function shareReport(){
    let report = generateReport()
    console.log(navigator.canShare())
}
function Report () {
  const { showReport, setShowReport } = useContext(DiaryContext)
  return (
    <article>
        <header>
            Work Report can share: {navigator.canShare() ? "yes": "no"}
        </header>
        <pre>{generateReport()}</pre>
      <footer>
        <button onClick={() => setShowReport(false)}>close Report</button>
        <button onClick={()=>shareReport()}>share report</button>
      </footer>
    </article>
  )
}
export default Report
