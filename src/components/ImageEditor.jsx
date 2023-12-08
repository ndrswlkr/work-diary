import { Show, onMount, useContext } from 'solid-js'
import { DiaryContext } from './DiaryContext'

let imageInput, canvas

async function previewImage () {
  let convertedImage
  //console.log('image was set')
  if (imageInput.files.length == 0) return

  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = URL.createObjectURL(imageInput.files[0])
  await img.decode()

  canvas.width = img.width / 15
  canvas.height = img.height / 15
  //console.log(canvas.width, canvas.height)
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  const data = canvas.toDataURL('image/png')
  return data
}

function previewConvertedImage (imgData) {
  console.log('image was given')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.onload = function () {
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
  }

  img.src = imgData
}

function clearCanvas () {
  console.log('clear canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function ImageEditor () {
  const { editItem, setEditItem } = useContext(DiaryContext)

  onMount(() => {
    if (editItem().image) {
      previewConvertedImage(editItem().image)
    } else {
      clearCanvas()
    }
  })
  function doImageConversion () {
    previewImage().then(img => {
      setEditItem({ ...editItem(), image: img })
    })
  }
  return (
    <>
      <section>
        <input
          ref={imageInput}
          type='file'
          name='image'
          id='image'
          onChange={() => doImageConversion()}
        />
      </section>

      <section>
        <canvas
          ref={canvas}
          id='image-display'
          class='image-display'
          width='150'
          height='266'
        />

      </section>
    </>
  )
}
export default ImageEditor
