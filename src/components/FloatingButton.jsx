import './FloatingButton.css'

function FloatingButton (props) {
  return (
    <button className='float' onclick={() => props.action()}>
      <i class='fa-solid fa-circle-plus'></i>
    </button>
  )
}
export default FloatingButton
