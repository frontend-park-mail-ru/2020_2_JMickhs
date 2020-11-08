const CACHE = 'network-or-cache-v9';
const timeout = 400;

self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll([
                '/',
            ])
        )
        .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event: FetchEvent) {
    if (navigator.onLine) {
        event.respondWith(fromNetwork(event.request, timeout)
            .catch((err) => {
                return fromCache(event.request);
            }));
    } else {
        console.log('off');
        event.respondWith(useFallback());
    }
});

function fromNetwork(request: Request, timeout: number) {
    return new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request: Request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function useFallback() {
    const tmp = {code: 'Вы оффлайн'};
    return Promise.resolve(new Response(JSON.stringify(tmp), { headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }}));
}
