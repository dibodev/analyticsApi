;(function () {
  const apiUrl = new URL(document.currentScript.src).origin
  const domain = document.currentScript.getAttribute('data-domain')

  // Verify if same domain
  if (domain !== window.location.hostname) {
    console.warn('Domain is not the same as the current page')
    return
  }

  function getLocalStorageItem(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key) || null
  }

  function setLocalStorageItem(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn('localStorage is not available')
      try {
        sessionStorage.setItem(key, value)
      } catch (e) {
        console.warn('sessionStorage is not available')
      }
    }
  }

  function createEventData(url, referrer) {
    return {
      visitorId: getLocalStorageItem('visitorId'),
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
    sendEvent(window.location.href, document.referrer || null, '/pageview', function (response) {
      if (response && response.success && response.visitorId) {
        setLocalStorageItem('visitorId', response.visitorId)
      }
    })
  }

  async function onLeave() {
    const data = createEventData(window.location.href, document.referrer || null)
    const headers = { type: 'application/json' }
    const blob = new Blob([JSON.stringify(data)], headers)

    if (window.fetch) {
      await fetch(apiUrl + '/leave', {
        body: JSON.stringify(data),
        method: 'POST',
        keepalive: true,
      })
    } else if (navigator.sendBeacon && Blob.prototype.isPrototypeOf(blob)) {
      const beaconSent = navigator.sendBeacon(apiUrl + '/leave', blob)

      if (!beaconSent) {
        sendEvent(window.location.href, document.referrer || null, '/leave')
      }
    } else {
      // Si ni fetch ni sendBeacon ne sont disponibles, utilisez XMLHttpRequest
      sendEvent(window.location.href, document.referrer || null, '/leave')
    }
  }

  // Envoi de l'événement initial lors du chargement de la page
  window.addEventListener('load', onRouteChange)

  const pushStateEvent = new Event('pushstate')

  window.addEventListener('pushstate', onRouteChange)

  // Modification de history.pushState pour déclencher un événement à chaque fois qu'il est appelé
  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    window.dispatchEvent(pushStateEvent)
  }

  // Écoute des événements popstate pour détecter les navigations via la barre d'URL ou le bouton retour
  window.addEventListener('popstate', onRouteChange)

  // Écoute des événements beforeunload pour détecter lorsque l'utilisateur quitte la page
  window.addEventListener('beforeunload', onLeave)
})()
