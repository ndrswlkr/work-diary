 const _gardenGlobals = {canvas: null, context: null, width: null, height: null}
export const gardenGlobals = () => {return _gardenGlobals}
export function setUpGardenCanvas(canvas, width, height){
    _gardenGlobals.canvas = canvas
    _gardenGlobals.context = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height
    _gardenGlobals.width = width
    _gardenGlobals.height = height

}