/**
 * Initialize
 */
function init() {
  const view = document.getElementsByClassName('view')
  const anchors = document.getElementsByTagName('a')

  /**
   * Get dummy post
   */
  getPosts('posts.json')
  
  /**
   * Execute only when all the content is loaded
   */
  setTimeout(() => {
    clickable(anchors, (e) => {
      e.preventDefault()
      console.log(e.target)
    })
  }, 1000)

  clickable(view, (e) => preview(e.target))
}


/**
 * A dummy API fetch to load posts
 * 
 * @param {string} url | Dummy API endpoint
 */
async function getPosts(url) {
  const post = getTemplate('post')
  const grid = document.getElementById('grid')

  fetch(url)
  .then(async (res) => {
    var json = await res.json()

    for(var item of json) {
      const node = parse(
        replace(post, {
          TITLE: item.title,
          CONTENT: item.content,
          IMAGE_URL: item.image,
        })
      )
      grid.appendChild(node.body.firstChild)
    }
  })
  .finally(() => {
    document.getElementById('spinner').remove()
  })
  .catch(console.log)
}



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

  const template = parse(
    replace(
      getTemplate('preview'), {IMAGE_NAME: name}
    )
  )
  const preview = template.body.firstChild
  
  
  /**
   * Create a close button
   */
  const close = document.createElement('div')
  close.textContent = 'Close'

  /**
   * Close the modal on click
   */
  preview.onclick = function(e) {
    console.log(e.target)
    document.body.lastChild.remove()
  }
  preview.insertBefore(close, preview.firstChild)
  
  document.body.appendChild(preview)
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