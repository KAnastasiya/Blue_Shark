const CACHE_NAME = 'blue-shark-v1';

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
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
