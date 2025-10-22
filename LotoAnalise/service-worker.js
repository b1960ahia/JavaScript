const CACHE_NAME = 'loto-analise-cache-v2';
const urlsToCache = [
  '/JavaScript/LotoAnalise/',
  '/JavaScript/LotoAnalise/aprimorandoanaliseloterias.html',
  '/JavaScript/LotoAnalise/manifest.json',
  '/JavaScript/LotoAnalise/icone-192.svg',
  '/JavaScript/LotoAnalise/icone-512.svg',
  '/JavaScript/LotoMenu/icone-192.png',
  '/JavaScript/LotoMenu/icone-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
