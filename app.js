// Verifica se o navegador suporta Service Workers
if ('serviceWorker' in navigator) {
    // Registra o Service Worker no evento 'load' da página
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha no registro do Service Worker:', error);
            });
    });
} else {
    console.log('Status: Navegador não suporta PWA')
}