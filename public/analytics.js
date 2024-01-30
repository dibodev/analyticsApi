;(function () {
  const apiUrl = new URL(document.currentScript.src).origin
  const domain = document.currentScript.getAttribute('data-domain')
  function createEventData(url, referrer) {
    return {
      url,
      referrer,
      domain,
      userAgent: navigator.userAgent,
    }
  }
  function sendEvent(url, referrer, path) {
    const data = createEventData(url, referrer)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', apiUrl + path, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  }

  function onRouteChange() {
    sendEvent(window.location.href, document.referrer || null, '/pageview')
  }

  function onLeave() {
    const data = createEventData(window.location.href, document.referrer || null)

    if (navigator.sendBeacon !== undefined) {
      const headers = { type: 'application/json' }
      const blob = new Blob([JSON.stringify(data)], headers)
      navigator.sendBeacon(apiUrl + '/leave', blob)
    } else {
      // Fallback XMLHttpRequest for browsers that do not support sendBeacon
      sendEvent(window.location.href, document.referrer || null, '/leave')
    }
  }

  // Envoi de l'événement initial lors du chargement de la page
  window.addEventListener('load', onRouteChange)

  // Modification de history.pushState pour déclencher un événement à chaque fois qu'il est appelé
  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    onRouteChange()
  }

  // Écoute des événements popstate pour détecter les navigations via la barre d'URL ou le bouton retour
  window.addEventListener('popstate', onRouteChange)

  // Écoute des événements beforeunload pour détecter lorsque l'utilisateur quitte la page
  window.addEventListener('beforeunload', onLeave)
})()
