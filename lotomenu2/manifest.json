// Nome do cache atual - altere esta versão quando atualizar o app
const CACHE_NAME = 'loterias-analisador-v2.0.0';

// Arquivos para cache inicial (instalação)
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CSS e JS são embutidos no HTML, então não precisam ser cacheados separadamente
  'https://cdn.jsdelivr.net/npm/chart.js',
  // Ícones - ajuste conforme sua estrutura de pastas
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Domínios permitidos para cache (API da Caixa)
const ALLOWED_CACHE_DOMAINS = [
  'servicebus2.caixa.gov.br'
];

// Evento de instalação - cache dos arquivos estáticos
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto, adicionando arquivos estáticos...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker instalado com sucesso');
        return self.skipWaiting(); // Ativa imediatamente
      })
      .catch((error) => {
        console.error('Erro durante instalação do Service Worker:', error);
      })
  );
});

// Evento de ativação - limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos que não correspondem ao nome atual
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker ativado com sucesso');
      return self.clients.claim(); // Toma controle de todas as abas
    })
  );
});

// Evento de fetch - estratégia de cache
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignora requisições que não são GET
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Se temos uma resposta em cache e está online, retorna do cache
        if (cachedResponse) {
          // Atualiza o cache em background para próxima vez
          fetchAndCache(request);
          return cachedResponse;
        }

        // Se não está em cache, busca na rede
        return fetchAndCache(request);
      })
      .catch((error) => {
        console.log('Fetch falhou, retornando página offline:', error);
        
        // Se é uma requisição HTML, tenta retornar a página principal do cache
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        
        // Para outros tipos de erro, retorna uma resposta de fallback
        return new Response('Conteúdo não disponível offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Função para buscar e armazenar em cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Verifica se a resposta é válida
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // Verifica se o domínio é permitido para cache
      const url = new URL(request.url);
      const isAllowedDomain = ALLOWED_CACHE_DOMAINS.some(domain => 
        url.hostname.includes(domain)
      );

      // Cache apenas para domínios permitidos e recursos importantes
      if (isAllowedDomain || 
          request.url.includes('/icons/') ||
          request.url === self.location.origin + '/' ||
          request.url === self.location.origin + '/index.html') {
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache);
          });
      }

      return response;
    })
    .catch((error) => {
      console.error('Erro no fetch:', error);
      throw error;
    });
}

// Evento para mensagens do cliente (página)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Evento de sync em background (para funcionalidades futuras)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync disparado');
    // Aqui você pode implementar sincronização em background
  }
});

// Evento de push (para notificações futuras)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Novo resultado de loteria disponível!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Analisador de Loterias', options)
  );
});

// Evento de clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
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