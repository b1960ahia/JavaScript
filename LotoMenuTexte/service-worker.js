const CACHE_NAME = 'loterias-cache-v1';
const urlsToCache = [
  './',
  './analisededados.html',
  './manifest.json',
  './icone-192.png',
  './icone-512.png'
  // Se tiver CSS/JS externos locais, adicione aqui, ex: './app.css', './app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});