import util from './lib/util'

/**
 * Initialize
 */
function init() {
  const anchors = document.getElementsByTagName('a')

  /**
   * Set fake loading
   */
  setTimeout(() => {
    getContent('api/content.json')
  }, 500)
  
  /**
   * Execute only when all the content is loaded
   */
  setTimeout(() => {
    util.clickable(anchors, (e) => {
      e.preventDefault()
      console.log(e.target)
    })
  }, 1000)
}


/**
 * A dummy API fetch to load posts
 * 
 * @param {string} url | Dummy API endpoint
 */
function getPosts(url) {
  const post = util.getTemplate('post')
  const grid = document.getElementById('grid')

  fetch(url, {})
  .then(async (res) => {
    var json = await res.json()

    for(var item of json) {
      const node = util.parse(
        util.replace(post, {
          TITLE: item.title,
          CONTENT: item.content,
          IMAGE_URL: item.image,
        })
      )
      grid.appendChild(node.body.firstChild)
    }
  })
  .finally(() => {
    document.getElementById('posts').style.display = 'block'
    document.getElementById('spinner').remove()
  })
  .catch(console.log)
}


/**
 * Set note
 * @param {object} data | Note object
 * @returns {function}
 */
function setNote(data) {
  return function(node) {
    node.id = 'note'

    const [h4, paragraph] = util.createElements(['h4','p'], function([h4, p]) {
      p.textContent = data.text
      h4.textContent = data.heading
    })
    node.appendChild(h4)
    node.appendChild(paragraph)
  }
}


/**
 * Set title and description
 * @param {object} data | JSON data fetched from API
 * @returns {function}
 */
function setContent(data) {
  return function([title, description]) {
    /**
     * Title
     */
    title.id = 'title'
    title.textContent = data.title

    /**
     * Description
     */
    description.id = 'description'
    description.textContent = data.description
  }
}


/**
 * Make the photo clickable and display to modal
 * @param {object} photo 
 * @returns {function}
 */
function setPhotos(photo) {
  return function(node) {
    node.src = photo.url
    node.className = photo.class

    node.onclick = function(e) {
      preview(e.target)
    }
    node.setAttribute('alt', photo.name)
  }
}


/**
 * A dummy API fetch to load posts
 * 
 * @param {string} url | Dummy API endpoint
 */
async function getContent(url) {
  const photos = document.getElementById('photos')
  const excerpt = document.getElementById('excerpt')

  fetch(url)
  .then(async function(res) {
    const data  = await res.json()

    /**
     * Photos
     */
    for(var photo of data.gallery) {
      photos.appendChild(
        util.createElements(['img'], setPhotos(photo))
      )
    }

    /**
     * Text content
     */
    const [title, description] = util.createElements(['h1','p'], setContent(data))
    excerpt.appendChild(title)
    excerpt.appendChild(description)

    /**
     * Note
     */
    const note = util.createElements(['div'], setNote(data.note))
    excerpt.appendChild(note)
  })

  .finally(() => {
    getPosts('api/posts.json')
  })

  .catch(console.log)
}


/**
 * View image with modal template
 * @param {object} node 
 */
function preview(node) {
  const name = node.getAttribute('alt')

  const template = util.parse(
    util.replace(
      util.getTemplate('preview'), {IMAGE_NAME: name}
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


export default {init}