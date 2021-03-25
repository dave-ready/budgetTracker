const FILES_TO_CACHE = [
    "/",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/index.html",
    "/index.js",
    "/indexedDB.js"
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
          console.log(CACHE_NAME);
          console.log("Your files have been succesfully pre-cached");
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
  });



//Activate
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





  


  
