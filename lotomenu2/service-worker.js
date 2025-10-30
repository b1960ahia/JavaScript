const CACHE_NAME = 'loterias-app-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/icone-192.png',
  '/icone-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  // Para a API da Caixa, sempre busca da rede primeiro
  if (event.request.url.includes('servicebus2.caixa.gov.br')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Se a resposta é válida, armazena no cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Se offline, tenta buscar do cache
          return caches.match(event.request);
        })
    );
  } else {
    // Para outros recursos, usa cache primeiro
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});