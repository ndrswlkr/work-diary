import { For, mergeProps, onMount } from 'solid-js'
import './PieChart.css'

function PieChartMulti (props) {
  props = mergeProps(
    { size: 100, colors: ['#655', 'orange', 'red', 'limegreen'], values: [50] },
    props
  )
  const radius = props.size / 2
  const circum = radius * Math.PI
  const values = props.values.map(v => (circum / 100) * v)
  const total = props.values.reduce( (prev, val) => prev + val, 0 )
  console.log('TOTTAL',   total)
  const dur = (1600 / 100) * total
  let circle = []

  function calcOffset (index, value = 0) {
    if (index >= 0) {
      return calcOffset(index - 1, value + values[index])
    }
    return value + 0
  }

  onMount(() => {
    circle.forEach(async (myCircle, index) => {
      myCircle.setAttribute('stroke', props.colors[index + 1])
      
      const animation = myCircle.animate(
        [
          {
            // from
            strokeDasharray: `0, ${circum}`,
            strokeDashoffset: 0
          },
          {
            // to
            strokeDashoffset: -calcOffset(index - 1),
            strokeDasharray: `${values[index]}, ${circum}`
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
      //console.log(animation)
    })
  })
  return (
    <>
      <div class='grid'>
        <svg width={props.size} height={props.size}>
          <circle
            class='lower-circle'
            style={{ stroke: props.colors[0], 'stroke-width': props.size / 4 }}
            r={props.size / 4}
            cx={props.size / 2}
            cy={props.size / 2}
          />
          <For each={props.values}>
            {(val, index) => (
              <circle
                class='circle'
                style={{
                  stroke: props.colors[index + 1],
                  'stroke-width': props.size / 4
                }}
                ref={el => circle.push(el)}
                r={props.size / 4}
                cx={props.size / 2}
                cy={props.size / 2}
              />
            )}
          </For>
        </svg>
        <div class='all-caption'>
          <For each={props.values}>
            {(val, index) => (
              <div class='chart-caption'>
                <div
                  class='color-indicator'
                  style={{ 'background-color': props.colors[index() + 1] }}
                >
                  {' '}
                </div>
                <h2>{val}%</h2>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  )
}
export default PieChartMulti
