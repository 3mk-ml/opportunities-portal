/**
 * بوابة الفرص — Service Worker
 * Offline-first caching strategy
 */
const CACHE_VERSION = 'op-v2.1';
const CACHE_STATIC_FILES = [
  './',
  './index.html',
  './detail.html',
  './about.html',
  './css/main.css',
  './js/i18n.js',
  './js/favorites.js',
  './js/list.js',
  './js/detail.js',
  './js/hero-fx.js',
  './js/cursor.js',
  './js/main.js',
  './assets/images/oxford.jpg',
  './data/opportunities.json',
];

// Install — cache static assets dynamically resolved to scope
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      const scope = self.registration.scope;
      const urlsToCache = CACHE_STATIC_FILES.map(file => new URL(file, scope).toString());
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for data
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Network-first for opportunities data
  if (url.pathname.includes('opportunities.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
