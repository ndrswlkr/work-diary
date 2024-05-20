import { For, createEffect } from 'solid-js'
import GardenBed from './GardenBed'
import './GardenSection.css'
function GardenSection (props) {
    createEffect( () => console.log("from section", props.section, "was updated"))
  return (
    <div class="section">
      <h4>{props.section.name}</h4>
        {props.children}
    </div>
  )
}
export default GardenSection
