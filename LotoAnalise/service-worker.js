/* Simple PWA Service Worker for Loto Analise */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `loto-cache-${CACHE_VERSION}`;
const CORE_ASSETS = [
  './aprimorandoanaliseloterias.html',
  './manifest.json'
  // Adicione aqui arquivos locais adicionais, se criar (CSS/JS locais)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Não cacheia chamadas da API da Caixa (mantém network-first e não intercepta)
  if (url.hostname.includes('caixa.gov.br')) {
    return; // deixa seguir default
  }

  // Estratégia: Stale-While-Revalidate para assets do mesmo origem
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return resp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
