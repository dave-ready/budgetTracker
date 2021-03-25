const FILES_TO_CACHE = [
    "/",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/index.html",
    "/index.js",
    "/indexedDB.js",
    "/manifest.webmanifest",
    "/styles.css"
  ];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//Install
self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
    console.log(CACHE_NAME);
    console.log("Your files have been succesfully pre-cached");
  });

//Activate
// This handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
    //const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
          ); 
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
                console.log("Your caches have been successfully deleted!");
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });


  //Fetch
  self.addEventListener("fetch", event => {
    // Non-GET requests + requests to other origins are not cached
    if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
        event.respondWith(fetch(event.request));
        return;
    }
  
    // handle GET requests for data from /api routes
    if (event.request.url.includes("/api/transaction")) {
      // if network request fails - make network request and fallback to cache 
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => caches.match(event.request));
        })
      );
      return;
    }
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  });





  


  
