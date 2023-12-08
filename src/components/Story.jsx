import { children, onMount, createSignal, Show, Index } from 'solid-js'
import { Transition } from 'solid-transition-group'

const enterAnimation = (el, done) => {
  
    const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 600
    })
    a.finished.then(done)
  }

function Story (props) {
  let target
  const [show, setShow] = createSignal(1)

  function handleIntersection (entries) {
    entries.map(entry => {
      if (entry.isIntersecting) {
        //setTimeout(() => setShow(show() + 1), 400)
        setShow(show()+1)
      } else {
        //nothing
      }
    })
  }
  const options = {
    threshold: 1
  }

  onMount(() => {
    const observer = new IntersectionObserver(handleIntersection, options)
    observer.observe(target)
  })

  //const resolved = children(() => props.children)
  return (
    <>
      <For each={props.elements}>
        {(child, index) => (
          <Transition onEnter={enterAnimation}>
            <Show when={show() >= index()}>
              <section>{child}</section>
            </Show>
          </Transition>
        )}
      </For>
      <footer style={{ 'padding-top': '30vh' }} ref={target}>
        {' '}
      </footer>
    </>
  )
}
export default Story
