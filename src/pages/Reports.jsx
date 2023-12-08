import {onMount } from 'solid-js'
import './Reports.css'
import PieChartMulti from '../components/PieChartMulti'
import Story from '../components/Story'

function Reports () {
  let size

  onMount(() => {
    size = window.innerWidth / 2
  })

  const elements = []
  elements.push(() => (
    <PieChartMulti
      size={size}
      colors={['green', 'blue', 'orange', 'yellow', 'red', 'hotpink']}
      values={[25, 25, 33, 10]}
    />
  ))
  elements.push(() => (
    <p>
      Lorem, ipsum dolor.lorem20 Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Aperiam ea dolores nihil similique tempore! Quis, odio
      praesentium? Cupiditate, sapiente modi!
    </p>
  ))

  elements.push(() => (
    <PieChartMulti
      size={size}
      colors={['green', 'blue', 'orange', 'yellow', 'red', 'hotpink']}
      values={[25, 25, 33, 10]}
    />
  ))
  elements.push(() => (
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus, amet
      tempore laborum odio ab cum inventore dolorem adipisci repellat iusto
      fugiat dolor corporis sit architecto a qui eum maxime neque. Mollitia vel
      quisquam eveniet sapiente magni sed, itaque, accusamus distinctio
      blanditiis ut minus consectetur impedit quae consequuntur cupiditate
      consequatur beatae corrupti commodi reprehenderit iste. Sit saepe nam
      reprehenderit eius dolorum.
    </p>
  ))
  elements.push(() => (
    <PieChartMulti
      size={size}
      colors={['green', 'blue', 'orange', 'yellow', 'red', 'hotpink']}
      values={[25, 25, 33, 10]}
    />
  ))
  elements.push(() => (
    <PieChartMulti
      size={size}
      colors={['green', 'blue', 'orange', 'yellow', 'red', 'hotpink']}
      values={[25, 25, 33, 10]}
    />
  ))
  elements.push(() => (
    <PieChartMulti size={size} colors={['green', 'hotpink']} values={[25]} />
  ))

  return (
    <>
      <Story elements={elements}></Story>
    </>
  )
}

export default Reports
