if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('serwiceWorker.js')
    .then(registration => console.info('ServiceWorker registration successful with scope: ', registration.scope))
    .catch(err => console.error('ServiceWorker registration failed: ', err));
}
