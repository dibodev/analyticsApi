;(function () {
  const apiUrl = new URL(document.currentScript.src).origin
  const domain = document.currentScript.getAttribute('data-domain')

  if (domain !== window.location.hostname) {
    console.warn('Domain is not the same as the current page')
    return
  }

  const eventSource = new EventSource(`${apiUrl}/sse`)

  function sendSseMessage(type, data) {
    eventSource.send(JSON.stringify({ type, data }))
  }

  function onRouteChange() {
    const eventData = {
      url: window.location.href,
      referrer: document.referrer || null,
      domain,
      userAgent: navigator.userAgent,
    }
    sendSseMessage('pageview', eventData)
  }

  window.addEventListener('load', onRouteChange)

  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    onRouteChange()
  }

  window.addEventListener('popstate', onRouteChange)
})()
