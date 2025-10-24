const CACHE_NAME = 'pwa-dinamico-v2';

// Lista apenas os arquivos essenciais para o shell (esqueleto) do app
const shellUrls = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    'service-worker.js'
    // Arquivos críticos, como a página principal e scripts de inicialização
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    // Pré-caching apenas do shell (esqueleto) do aplicativo
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Pré-cache do Shell Completo');
            return cache.addAll(shellUrls);
        })
    );
});

// Ativação (Limpeza de caches antigos)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


// ESTRATÉGIA: Rede Primeiro, com Cache de Reserva (melhor para muitos arquivos)
self.addEventListener('fetch', event => {
    // Ignora requisições que não sejam GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        // 1. Tenta buscar o recurso na rede (para ter o mais atualizado)
        fetch(event.request)
            .then(response => {
                // Se a rede retornar um erro (ex: 404) ou for inválida, retorna a resposta da rede
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    // Tenta pegar o cache como fallback se a rede falhar de forma estranha
                    return caches.match(event.request) || response;
                }

                // Se a rede for bem sucedida:
                // Abre o cache e clona a resposta para guardar no cache e retornar ao navegador
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    // Evita cachear extensões que mudam muito ou não são necessárias (ex: APIs)
                    // Adicione mais filtros aqui (ex: se for uma URL de API, não cachear)
                    if (event.request.url.startsWith(self.location.origin)) {
                        cache.put(event.request, responseToCache);
                    }
                });
                return response;
            })
            .catch(() => {
                // 2. Se a rede falhar (está offline), busca o recurso no cache
                return caches.match(event.request)
                    .then(response => {
                        // Se encontrar no cache, retorna. Senão, retorna null/página de erro.
                        return response || caches.match('/index.html'); // Retorna index.html como último fallback
                    });
            })
    );
});