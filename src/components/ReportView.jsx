import { createEffect, onMount } from 'solid-js'
import './ReportView.css'

class ReportWriter {
  constructor (canvas) {
    canvas.width = window.innerWidth * 0.85
    canvas.height = window.innerHeight * 0.8
    canvas.style.background = 'white'
    let context = canvas.getContext('2d')

    context.fillStyle = 'black'
    this.canvas = canvas
    this.context = context
    console.log('canvas registered...')
    this.initialY = 25
    this.y = this.initialY
    this.indent = 10
  }
  adjustHeight () {
    this.canvas.height = this.y + 10
  }
  drawDone () {
    this.context.font = '900 17px "Font Awesome 6 Free"'
    this.context.fillText('\uf14a', this.indent, this.y)
  }

  drawPending () {
    this.context.font = '900 17px "Font Awesome 6 Free"'
    this.context.fillText('\uf2d3', this.indent, this.y)
  }
  drawSeparator(){
    this.context.beginPath()
    this.context.fillStyle = "black"
    this.context.moveTo(10, this.y)
    this.context.lineTo(this.canvas.width - 10, this.y)
    this.context.stroke()
    this.y += 22
  }
  writeTitle (title) {
    this.context.font = '800 25px system-ui'
    this.context.fillText(title, this.indent, this.y)
    this.y += 35
  }
  writeSubtitle (subtitle) {
    this.y += 10
    this.context.font = '700 20px system-ui'
    this.context.fillText(subtitle, this.indent, this.y)
    this.y += 25
  }

  writeCategory(line, indent = 10) {
    this.context.font = '700 15px system-ui'
    this.context.fillStyle = 'black'
    this.context.fillText(line, indent, this.y)
    this.y += 22
  }
  writeLine (line, indent = 10) {
    this.context.font = '15px system-ui'
    this.context.fillStyle = 'black'
    this.context.fillText(line, indent, this.y)
    this.y += 22
  }
}

function ReportView (props) {
  let canvas
  let context
  let center
  let reportWriter
  onMount(() => {
    console.log('mountex')
    reportWriter = new ReportWriter(canvas)
  })

  function writeWork (work) {
    if (work.done){
        reportWriter.drawDone()
    }else{
        reportWriter.drawPending()
    }
    let categoryAndCulture = work.category.toUpperCase()
    if(work.culture && work.culture !== "keine Kultur gewählt") categoryAndCulture += "   " + work.culture.toUpperCase()
      reportWriter.writeCategory(categoryAndCulture, 35)
    for (let line of work.work) {
      if (line.length) reportWriter.writeLine(line, 35)
    }
  }
  createEffect(() => {
    let report = props.report
    reportWriter.y = reportWriter.initialY
    for (let i = 0; i < 2; i++) {
      //run twice to adjust the canvas size

      if (report) {
        reportWriter.writeTitle('Work Report')

        reportWriter.writeSubtitle(
          'Zeitaufwand in Periode: ' + report.totalTime
        )
        reportWriter.drawSeparator()
        for (let day in report.report) {
          reportWriter.writeSubtitle(
            `${day}     ${report.report[day].duration} min`
          )

          for (let work of report.report[day].works) {
            writeWork(work)
          }
          reportWriter.drawSeparator()
        }
        if (i === 0) {
          reportWriter.adjustHeight()
          reportWriter.y = reportWriter.initialY
        }
      }
    }
  })
  return <canvas height='600' ref={canvas} id='report-canvas' />
}
export default ReportView
