const CACHE_NAME = 'cache_v1';
const STATIC_CACHE_ITEMS = [
    '/',
];
const CACHE_URL_PATTERN = /^.*\.(jpg|png|jpeg|woff|woff2)$/;

function addToCache(cacheKey: string, request: Request, response: Response): Response {
    if (response.ok && request.method === 'GET') {
        const copy = response.clone();
        caches.open(cacheKey).then((cache) => {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache(event: FetchEvent): Promise<Response> {
    return caches.match(event.request).then((response) => {
        if (!response) {
            throw Error(`${event.request.url} not found in cache`);
        }
        return response;
    });
}

function offlineResponse(): Promise<Response> {
    const tmp = { code: 'Вы оффлайн' };
    return Promise.resolve(new Response(JSON.stringify(tmp), {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    }));
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event: ExtendableEvent) => {
    function onInstall(): Promise<void> {
        return caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_CACHE_ITEMS));
    }

    event.waitUntil(
        // eslint-disable-next-line no-restricted-globals
        onInstall().then(() => self.skipWaiting()),
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event: FetchEvent) => {
    function onFetch(isStatic: boolean): void {
        const cacheKey = CACHE_NAME;

        if (isStatic) {
            event.respondWith(
                fetchFromCache(event)
                    .catch(() => fetch(event.request))
                    .then((response) => addToCache(cacheKey, event.request, response))
                    .catch(() => offlineResponse()),
            );
            return;
        }
        event.respondWith(
            fetch(event.request)
                .then((response) => addToCache(cacheKey, event.request, response))
                .catch(() => fetchFromCache(event))
                .catch(() => offlineResponse()),
        );
    }

    const url = new URL(event.request.url);
    if (url.pathname === '/sw.js') {
        return;
    }
    onFetch(CACHE_URL_PATTERN.test(url.href));
});
