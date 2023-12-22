import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext
} from 'solid-js'
import './Reports.css'
import PieChartMulti from '../components/PieChartMulti'
import { DiaryContext } from '../components/DiaryContext'
import { currentYear } from '../lib/date-functions'
import { ofetch } from 'ofetch'
import { Transition } from 'solid-transition-group'

let target
const [show, setShow] = createSignal(1)
const [gatherReady, setGatherReady] = createSignal(false)
const enterAnimation = (el, done) => {
  const a = el.animate(
    [
      { opacity: 0, transform: 'translateY( 500px)' },
      { opacity: 1, transform: 'translateY( 0px)' }
    ],
    {
      duration: 1600
    }
  )
  a.finished.then(done)
}

function handleIntersection (entries) {
  entries.map(entry => {
    if (entry.isIntersecting) {
      //setTimeout(() => setShow(show() + 1), 400)
      setShow(show() + 1)
    } else {
      //nothing
    }
  })
}
const options = {
  threshold: 1
}

const [totalDuration, setTotalDuration] = createSignal(0)
const [planting, setPlanting] = createSignal(0)
const [watering, setWatering] = createSignal(0)
const [takeCare, setTakeCare] = createSignal(0)
const [mowing, setMowing] = createSignal(0)
const [harvesting, setHarvesting] = createSignal(0)
const [other, setOther] = createSignal(0)

function Reports () {
  let observer
  const { setToastMessage } = useContext(DiaryContext)
  const [data, setData] = createSignal([])
  const size = () => window.innerWidth / 2

  onMount(async () => {
    console.log('MOUNT!!!!!!!!!!!', gatherReady())
    observer = new IntersectionObserver(handleIntersection, options)
    observer.observe(target)

    const data = await ofetch('/api/workdata', {
      method: 'POST',
      body: { year: currentYear() }
    }).catch(e => {
      setToastMessage({
        show: true,
        title: 'error',
        message: 'unable to load diary data'
      })
    })
    setData(data)
    gatherData(data)
  })

  onCleanup(() => {
    observer.unobserve(target)
    setGatherReady(false)
    setPlanting(0)
    setTakeCare(0)
    setWatering(0)
    setTotalDuration(0)
    setMowing(0)
    setHarvesting(0)
    setOther(0)
    setShow(1)
  })

  function gatherData (data) {
    setTotalDuration(
      data.reduce((total, item) => (total += Number(item.duration)), 0)
    )

    data.forEach(item => {
      //console.log(item.work)
      if (
        /pflanzen|setzen|sähen|aussaat|umtopfen|eintopfen|pickieren|gepflanzt|gesäht|pflanzung/i.test(
          item.work
        )
      ) {
        setPlanting(planting() + item.duration)
      } else if (/wässern|giessen|bewässerung/i.test(item.work)) {
        setWatering(watering() + item.duration)
      } else if (
        /pflege|hacken|häufeln|pendelhacke|jäten|vorbereiten|fräsen|fräse|spritzen|schneiden|aufbinden|penac|stützen/i.test(
          item.work
        )
      ) {
        setTakeCare(takeCare() + item.duration)
      } else if (/mähen/i.test(item.work)) {
        setMowing(mowing() + item.duration)
      } else if (/ernten|pflücken/i.test(item.work)) {
        setHarvesting(harvesting() + item.duration)
      } else {
        setOther(other() + item.duration)
        //console.log('not tracked', item.work)
      }
    })

    setGatherReady(true)
  }

  return (
    <>
      <Show when={gatherReady()}>
        <Transition onEnter={enterAnimation}>
          <Show when={show() >= 1}>
            <section>
              <h1>total: {(totalDuration() / 60).toFixed(2)} hours</h1>
              <h3>planting: {(planting() / 60).toFixed(2)} hours</h3>
              <PieChartMulti
                size={size()}
                captions={['Auspflanzen']}
                values={[planting() / (totalDuration() / 100)]}
              />
            </section>
          </Show>
        </Transition>

        <Transition onEnter={enterAnimation}>
          <Show when={show() >= 2}>
            <section>
              <h3>watering: {(watering() / 60).toFixed(2)} hours</h3>
              <PieChartMulti
                size={size()}
                captions={['Wässern']}
                colors={['blue', 'skyblue']}
                values={[watering() / (totalDuration() / 100)]}
              />
            </section>
          </Show>
        </Transition>
        <Transition onEnter={enterAnimation}>
          <Show when={show() >= 3}>
            <section>
              <h3>taking care: {(takeCare() / 60).toFixed(2)} hours</h3>
              <PieChartMulti
                size={size()}
                captions={['Pflege']}
                values={[takeCare() / (totalDuration() / 100)]}
              />
            </section>
          </Show>
        </Transition>
      </Show>
      <Transition onEnter={enterAnimation}>
        <Show when={show() >= 4}>
          <section>
            <h3>harvesting: {(harvesting() / 60).toFixed(2)} hours</h3>
            <PieChartMulti
              size={size()}
              captions={['Ernte']}
              colors={['brown', 'orange']}
              values={[harvesting() / (totalDuration() / 100)]}
            />
          </section>
        </Show>
      </Transition>
      <Transition onEnter={enterAnimation}>
        <Show when={show() >= 5}>
          <section>
            <h3>mowing: {(mowing() / 60).toFixed(2)} hours</h3>
            <PieChartMulti
              size={size()}
              captions={['Rasen mähen']}
              values={[mowing() / (totalDuration() / 100)]}
            />
          </section>
        </Show>
      </Transition>

      <footer style={{ 'padding-top': '30vh' }} ref={target}>
        {' '}
      </footer>
    </>
  )
}

export default Reports
