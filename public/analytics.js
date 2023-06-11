;(function () {
  let referrer = document.referrer || null
  const apiUrl = new URL(document.currentScript.src).origin
  const projectId = document.currentScript.getAttribute('data-project-id')

  window.addEventListener('load', function () {
    const data = {
      url: window.location.href,
      referrer: referrer,
      userAgent: navigator.userAgent,
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', apiUrl + '/event', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({ data: data, projectId }))
  })
})()
