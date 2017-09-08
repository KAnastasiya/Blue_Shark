const CACHE = 'blue-shark-v3';

const urlsToCache = [
  './',
  './index.html',
  './style.min.css',
  './script.min.js',
  './sprite.png',
  './components/x-navigation/index.html',
  './components/x-navigation/script.js',
  './components/x-navigation/style.css',
  './components/x-navigation-item/index.html',
  './components/x-navigation-item/script.js',
  './components/x-navigation-item/style.css',
  './components/x-chart/index.html',
  './components/x-chart/script.js',
  './components/x-chart/style.css',
];

this.addEventListener('install', event => {
  console.log('The service worker is being installed');
  event.waitUntil(preCache());
});

this.addEventListener('activate', event => {
  console.log('The service worker is being activate');
  event.waitUntil(cleanCache());
  return this.clients.claim();
});

this.addEventListener('fetch', event => {
  console.log('The service worker is serving the resourses');
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(response => {
        if (response) {
          return response;
        }
        return loadDataFromServer(event.request);
      })
    )
  );
});

function preCache() {
  caches.open(CACHE).then(cache => cache.addAll(urlsToCache));
}

function updateCache(request, response) {
  const responseToCache = response.clone();
  caches.open(CACHE).then(c => c.put(request, responseToCache));
}

function cleanCache() {
  caches.keys().then(keys =>
    Promise.all(
      keys.map(key => {
        if (key !== CACHE) {
          return caches.delete(key);
        }
      })
    )
  );
}

function loadDataFromServer(request) {
  const fetchRequest = request.clone();
  return fetch(fetchRequest).then(r => {
    if (!r || r.status !== 200 || r.type !== 'basic') {
      return r;
    }
    updateCache(request, r);
    return r;
  });
}
