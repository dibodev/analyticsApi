;(function () {
  const apiUrl = new URL(document.currentScript.src).origin
  const domain = document.currentScript.getAttribute('data-domain')

  if (domain !== window.location.hostname) {
    console.warn('Domain is not the same as the current page')
    return
  }

  function createEventData(url, referrer) {
    return {
      url,
      referrer,
      domain,
      userAgent: navigator.userAgent,
    }
  }
  function sendEvent(url, referrer, path, callback = null) {
    const data = createEventData(url, referrer)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', apiUrl + path, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        if (callback) {
          callback(response)
        }
      }
    }
    xhr.send(JSON.stringify(data))
  }

  function onRouteChange() {
    sendEvent(window.location.href, document.referrer || null, '/pageview', (response) => {
      const sse = new EventSource(`${apiUrl}/sse/pageview?pageViewId=${response.pageViewId}`)

      sse.onerror = function (err) {
        console.error('SSE error', err)
        sse.close()
      }
    })
  }

  // Sending initial event on a page load
  window.addEventListener('load', onRouteChange)

  const pushStateEvent = new Event('pushstate')

  window.addEventListener('pushstate', onRouteChange)

  // Changing history.pushState to fire an event every time it is called
  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    window.dispatchEvent(pushStateEvent)
  }

  // Listening to popstate events to detect navigations via URL bar or back button
  window.addEventListener('popstate', onRouteChange)
})()
