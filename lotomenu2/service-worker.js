const CACHE_NAME = 'loterias-cache-v1';
const urlsToCache = [
  '/JavaScript/LotoMenu/analisededados.html',
  '/JavaScript/LotoMenu/manifest.json',
  '/JavaScript/LotoMenu/icon-192.png',
  '/JavaScript/LotoMenu/icon-512.png',
  '/JavaScript/LotoMenu/service-worker.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});