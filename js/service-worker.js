const cacheName = "meu-app-cache-v1";
const arquivosParaCache = [
    // HTML
    "/",
    "/index.html",
    "/manifest.json",

    // JavaScript
    "/js/bootstrap.bundle.min.js",
    "/js/service-worker.js",
    "/js/bootstrap.bundle.js",

    // CSS
    "/css/bootstrap.min.css",
    "/css/bootstrap.css",

    // Fontes
    "/fonts/BebasNeue-Regular.otf",

    // Ícones do app
    "/icons/icon-192.png",
    "/icons/icon-512.png",

    // SVGs se forem usados diretamente
    "/bootstrap-icons/fonts/bootstrap-icons.woff",
    "/bootstrap-icons/fonts/bootstrap-icons.woff2",
    "/bootstrap-icons/arrow-counterclockwise.svg",
    "/bootstrap-icons/bootstrap-icons.css",
    "/bootstrap-icons/bootstrap-icons.json",
    "/bootstrap-icons/bootstrap-icons.min.css",
    "/bootstrap-icons/bootstrap-icons.scss",
    "/bootstrap-icons/bootstrap-icons.svg",
    "/bootstrap-icons/brightness-high-fill.svg",
    "/bootstrap-icons/chevron-compact-left.svg",
    "/bootstrap-icons/chevron-compact-right.svg",
    "/bootstrap-icons/play-fill.svg",
    "/bootstrap-icons/x-circle.svg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(arquivosParaCache))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((resposta) => resposta || fetch(event.request))
    );
});
