const CACHE_NAME = 'static';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.min.css',
  '/script.min.js',
  '/components/',
  '/fonts/',
  '/icons/',
  '/img/',
  '/sprite.png',
];

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Save cache');
      return cache.addAll(urlsToCache);
    })
  );
});

this.addEventListener('fetch', event => {
  let response;
  event.respondWith(
    caches
      .match(event.request)
      .catch(() => fetch(event.request))
      .then(r => {
        console.log('Load data from server');
        response = r;
        caches.open(CACHE_NAME).then(cache => {
          console.log('Update cache');
          cache.put(event.request, response);
        });
        return response.clone();
      })
      .catch(() => caches.match('/img/'))
  );
});
