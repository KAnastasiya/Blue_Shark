const CACHE_NAME = 'blue-shark-v2';

const urlsToCache = ['./', './index.html', './style.min.css', './script.min.js', './sprite.png'];

this.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(r => {
        if (!r || r.status !== 200 || r.type !== 'basic') {
          return r;
        }

        const responseToCache = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return r;
      });
    })
  );
});

this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  return this.clients.claim();
});
