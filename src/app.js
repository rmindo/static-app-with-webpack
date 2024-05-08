/**
 * Initialize
 */
function init() {
  const view = document.getElementsByClassName('view')
  const anchors = document.getElementsByTagName('a')

  clickable(anchors, (e) => {
    e.preventDefault()
    console.log(e.target)
  })
  clickable(view, (e) => preview(e.target))
}


/**
 * Replace variable name in a string with a value
 * 
 * @param {string} string The string to replace
 * @param {object} data | The value of variable
 * @returns {string}
 */
function replace(string, data = {}) {
  function repl(v) {
    var value = data[v.match(/([a-zA-Z_]+)/g)]
    if(value) {
      return value
    }
    return ''
  }

  if(string) {
    var patt = string.match(/(\{[a-zA-Z_]+\})/g)
    if(patt) {
      return string.replace(new RegExp(patt.join('|'), 'g'), repl)
    }
  }
  return string
}


/**
 * Get the html template using AJAX
 * @param {string} name | The name of the template
 * @returns {string}
 */
function getTemplate(name) {
  const ajax = new XMLHttpRequest()

  ajax.open('GET', `template/${name}.html`, false)
  ajax.send()
  return ajax.responseText
}


/**
 * View image with modal template
 * @param {object} node 
 */
function preview(node) {
  const name = node.getAttribute('alt')
  const parser = new DOMParser()

  const template = replace(getTemplate('preview'), {
    IMAGE_NAME: name
  })
  const parsed = parser.parseFromString(template, 'text/html')
  const view = parsed.body.firstChild
  
  
  const close = document.createElement('div')
  close.textContent = 'Close'

  /**
   * Close the modal
   */
  view.onclick = function(e) {
    console.log(e.target)
    document.body.lastChild.remove()
  }
  view.insertBefore(close, view.firstChild)
  
  document.body.appendChild(view)
  console.log(node)
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