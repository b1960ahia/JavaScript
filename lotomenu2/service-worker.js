// Nome do cache atual - altere esta versão quando atualizar o app
const CACHE_NAME = 'loterias-analisador-v2.1.0';

// Arquivos para cache durante a instalação
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  './icone-192.png',
  './icone-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Estratégia: Cache First com fallback para network
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto, adicionando URLs estáticas...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker instalado com sucesso');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Falha na instalação do Service Worker:', error);
      })
  );
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker ativado com sucesso');
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Ignora requisições que não são GET
  if (request.method !== 'GET') return;

  // Para a API da Caixa, usa estratégia Network First
  if (request.url.includes('servicebus2.caixa.gov.br')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Se a resposta da rede é válida, armazena no cache
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se a rede falha, tenta buscar do cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Se não tem no cache, retorna uma resposta de fallback
              return new Response(
                JSON.stringify({ error: 'Sem conexão e sem cache disponível' }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
  } else {
    // Para recursos estáticos, usa estratégia Cache First
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Fallback para página offline se for uma navegação
              if (request.mode === 'navigate') {
                return caches.match('/')
                  .then((cachedPage) => {
                    return cachedPage || new Response('Página offline', {
                      status: 503,
                      headers: { 'Content-Type': 'text/html' }
                    });
                  });
              }
              
              return new Response('Recurso não disponível offline', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronização em background para atualizar dados
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-loterias') {
    console.log('Sincronização em background iniciada...');
    // Aqui você pode adicionar lógica para sincronizar dados em background
  }
});

// Notificações push (exemplo básico)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Novos resultados disponíveis!',
    icon: './icone-192.png',
    badge: './icone-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver resultados',
        icon: './icone-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: './icone-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Analisador de Loterias', options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event.notification.tag);
  event.notification.close();

  if (event.action === 'explore') {
    // Abre a aplicação
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});