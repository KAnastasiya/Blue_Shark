const CACHE_NAME = 'static';
const urlsToCache = ['/', '/style.min.css', '/script.min.js', '/sprite.png', '/components', '/fonts', '/icons', '/img'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// self.addEventListener('activate', event => {
//   console.log('Opened cache');
//   // Do activate stuff: This will come later on.
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });
