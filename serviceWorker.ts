var config = {
    version: 'achilles',
    staticCacheItems: [
        '/'
    ],
    cachePathPattern: new RegExp('^.*\\.(jpg|png|jpeg|woff)$'),
    offlinePage: '/offline/'
};

function cacheName (key: string, opts: Record<string, unknown>) {
    return `${opts.version}-${key}`;
}

function addToCache (cacheKey: string, request: Request, response: Response) {
    if (response.ok) {
        var copy = response.clone();
        caches.open(cacheKey).then( cache => {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache (event: FetchEvent) {
    return caches.match(event.request).then(response => {
        if (!response) {
            throw Error(`${event.request.url} not found in cache`);
        }
        return response;
    });
}

function offlineResponse (resourceType: string, opts: Record<string, unknown>) {
    const tmp = {code: 'Вы оффлайн'};
    return Promise.resolve(new Response(JSON.stringify(tmp), { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }}));
}

self.addEventListener('install', (event: ExtendableEvent) => {
    function onInstall (event: ExtendableEvent, opts: Record<string, unknown>) {
        var cacheKey = cacheName('static', opts);
        return caches.open(cacheKey)
            .then(cache => cache.addAll(<Array<string>>opts.staticCacheItems));
    }

    event.waitUntil(
        onInstall(event, config).then( () => self.skipWaiting() )
    );
});

self.addEventListener('fetch', (event: FetchEvent) => {

    function onFetch (event: FetchEvent, opts: Record<string, unknown>, isStatic: boolean) {
        var request = event.request;
        var resourceType = 'static';
        var cacheKey: string;

        cacheKey = 'cache-v1';

        if (!isStatic) {
            event.respondWith(
                fetch(request)
                    .then(response => addToCache(cacheKey, request, response))
                    .catch(() => fetchFromCache(event))
                    .catch(() => offlineResponse(resourceType, opts))
            );
        } else {
            event.respondWith(
                fetchFromCache(event)
                    .catch(() => fetch(request))
                    .then(response => addToCache(cacheKey, request, response))
                    .catch(() => offlineResponse(resourceType, opts))
            );
        }
    }
    if (event.request.method === 'GET') {
        const url = new URL(event.request.url);
        if (url.pathname === '/sw.js') {
            return;
        }
        onFetch(event, config, (<RegExp>config.cachePathPattern).test(url.href));
    }
});
