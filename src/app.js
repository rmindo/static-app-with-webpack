/**
 * Initialize
 */
function init() {
  const anchors = document.getElementsByTagName('a')

  clickable(anchors, (e) => {
    e.preventDefault()
    console.log(e.target)
  })
}



/**
 * Clickable elements
 * 
 * @param {object} nodes | All nodes found in the DOM
 * @param {functin} cb | The callback of the element being clicked
 */
function clickable(nodes, cb) {
  for(var node of nodes) {
    node.onclick = (e) => cb(e)
  }
}


export default {init}