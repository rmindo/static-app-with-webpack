/**
 * Parse the html string back to node object
 * 
 * @param {string} html 
 * @returns {object}
 */
function parse(html) {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
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
 * Clickable elements
 * 
 * @param {object} nodes | All nodes found in the DOM
 * @param {functin} cb | The callback of the element being clicked
 */
function clickable(nodes, cb) {
  if(typeof cb !== 'function') {
    throw TypeError('Second argument must be type of function.')
  }
  for(var node of nodes) {
    node.onclick = (e) => cb(e)
  }
}



/**
 * 
 * @param {array} elements | List of element names 
 * @param {function} cb | The callback receiving the nodes
 * @returns {array}
 */
function createElements(elements, cb) {
  var nodes = []

  if(elements.length > 1) {
    for(var element of elements) {
      nodes.push(document.createElement(element))
    }
  }
  else {
    nodes = document.createElement(elements[0])
  }

  if(typeof cb == 'function') {
    cb(nodes)
  }
  return nodes
}

export default {
  parse,
  replace,
  clickable,
  createElements,
}