const CACHE_NAME = 'blue-shark';

const urlsToCache = [
  './',
  './index.html',
  './style.min.css',
  './script.min.js',
  './sprite.png',
  './components/x-navigation/',
  './components/x-navigation/index.html',
  './components/x-navigation/style.css',
  './components/x-navigation/script.js',
  './components/x-navigation-item/',
  './components/x-navigation-item/index.html',
  './components/x-navigation-item/style.css',
  './components/x-navigation-item/script.js',
  './components/x-chart/',
  './components/x-chart/index.html',
  './components/x-chart/style.css',
  './components/x-chart/script.js',
];

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
});

// this.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       if (response) {
//         console.log(`Load from cache: ${response.url}`);
//         return response;
//       }
//       console.log(`Load from server: ${event.request.url}`);
//       return fetch(event.request);
//     })
//   );
// });

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(`Load from cache: ${response.url}`);
        return response;
      }

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(r => {
        if (!r || r.status !== 200 || r.type !== 'basic') {
          return r;
        }

        console.log(`Load from server: ${r.url}`);
        const responseToCache = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return r;
      });
    })
  );
});

// this.addEventListener('fetch', event => {
//   let response;
//   event.respondWith(
//     caches
//       .match(event.request)
//       .catch(() => fetch(event.request))
//       .then(r => {
//         response = r;
//         console.log(`Load from server: ${response.url}`);
//         caches.open(CACHE_NAME).then(cache => {
//           console.log(`Load in cache: ${response.url}`);
//           cache.put(event.request, response);
//         });
//         return response.clone();
//       })
//       .catch(() => caches.match('./img/portfolio-default.jpg'))
//   );
// });
