const CACHE_NAME = "gyano-v3"; 

const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install → cache core files
self.addEventListener("install", (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate → delete old caches
self.addEventListener("activate", (event) => {
  clients.claim(); 

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch → smart handling
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);


  if (url.pathname.startsWith("/api")) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );
});