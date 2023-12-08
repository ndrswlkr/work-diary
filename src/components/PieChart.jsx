import { mergeProps, onMount } from 'solid-js'
import './PieChart.css'

function PieChart (props) {
  props = mergeProps(
    { size: 100, colors: ['#655', 'orange', 'red', 'limegreen'], value: 50 },
    props
  )
  const radius = props.size / 2
  const circum = radius * Math.PI
  const value = (circum / 100) * props.value
  const dur = (2000 / 100) * props.value
  let circle
  onMount(async () => {
    circle.setAttribute('stroke', props.colors[3])

    const animation = circle.animate(
      [
        {
          // from
          strokeDasharray: `0, ${circum}`
        },
        {
          // to
          strokeDasharray: `${value}, ${circum}`
        }
      ],
      { duration: dur, iterations: 1, fill: 'forwards' }
    )
    // Wait for the animation to finish
    await animation.finished
    // Commit animation state to style attribute
    animation.commitStyles()
    // Cancel the animation
    animation.cancel()
  })
  return (
    <div class='grid'>
      <svg width={props.size} height={props.size}>
        <circle
          class='lower-circle'
          style={{ stroke: props.colors[0], 'stroke-width': props.size / 4 }}
          ref={circle}
          r={props.size / 4}
          cx={props.size / 2}
          cy={props.size / 2}
        />
        <circle
          class='circle'
          style={{ stroke: props.colors[1], 'stroke-width': props.size / 4 }}
          ref={circle}
          r={props.size / 4}
          cx={props.size / 2}
          cy={props.size / 2}
        />
      </svg>
      <h2>{props.value}%</h2>
    </div>
  )
}
export default PieChart
