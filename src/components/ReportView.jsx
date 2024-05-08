import { createEffect, onMount } from 'solid-js'
import './ReportView.css'

function ReportView (props) {
  let canvas
  let context
  let center
  onMount(() => {
    console.log("mountex")
    canvas.width = window.innerWidth * 0.85
    //canvas.height = window.innerHeight * 0.8
    canvas.height = 35+35+(props.report.totalLines * 22)+20+(Object.keys(props.report.report).length * 22)
    context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black'
    console.log('canvas registered...')
  })

  console.log(props.report)
  let y = 0
  function drawDone (x, y) {
    context.font = '900 17px "Font Awesome 6 Free"'
    context.fillText('\uf14a', 10, y)
  }
  function drawPending () {
    context.font = '900 17px "Font Awesome 6 Free"'
    context.fillText('\uf2d3', 10, y)
  }
  function writeWork (work) {
   console.log(work.work)
    //drawCheckMark(10, y)

    drawDone(10, y)
    context.font = '15px system-ui'
    for (let line of work.work) {
      if (line.length) {
        context.fillText(line, 35, y)
        y += 22
      }
    }
  }
  createEffect(() => {
    let report = props.report
    
    y = 20
    if (report) {
      context.font = '20px system-ui'
      context.fillText('Work Report', 10, y)
      y += 35
      context.fillText('Zeitaufwand in Periode: ' + report.totalTime, 10, y)
      y += 35
      context.font = '15px system-ui'
      for (let day in report.report) {
        context.fillText(day, 10, y)
        context.fillText(report.report[day].duration + ' min', 120, y)
        y += 22
        for (let work of report.report[day].works) {
          writeWork(work)
        }
      }
    }
  })
  return <canvas  height='600' ref={canvas} id='report-canvas' />
}
export default ReportView
