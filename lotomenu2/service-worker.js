const CACHE_NAME = 'loterias-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});