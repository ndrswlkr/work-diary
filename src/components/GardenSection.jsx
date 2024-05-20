import './GardenSection.css'
function GardenSection (props) {
  return (
    <div class="section">
      <h4>{props.section.name}</h4>
        {props.children}
    </div>
  )
}
export default GardenSection
