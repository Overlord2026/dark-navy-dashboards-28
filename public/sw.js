const CACHE_NAME = 'mybfocfo-cache-v1';
const STATIC_CACHE = 'mybfocfo-static-v1';

// Install event - cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll([
          '/manifest.json',
          '/favicon.png'
        ]);
      })
  );
  self.skipWaiting();
});

// Fetch event - cache-first for static, network-first for HTML
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Cache-first for static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  } 
  // Network-first for HTML and API calls
  else {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});