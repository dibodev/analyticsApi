(function () {
  let id = new URL(document.currentScript.src).searchParams.get('id')

  window.addEventListener('load', function () {
    const data = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      // autres informations que vous voulez collecter...
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3333/collect', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({ id: id, data: data }))
  })
})()
