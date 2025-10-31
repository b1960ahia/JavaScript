const CACHE_NAME = 'loterias-cache-v1';
const urlsToCache = [
  '/JavaScript/LotoMenu/',
  '/JavaScript/LotoMenu/lotomenu.html',
  '/JavaScript/LotoMenu/manifest.json',
  '/JavaScript/LotoMenu/icone-192.png',
  '/JavaScript/LotoMenu/icone-512.png'
  // acrescente outros arquivos JS/CSS que usar
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