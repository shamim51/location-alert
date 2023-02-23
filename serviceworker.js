//v2

const assets = ["/", "style.css", "sw-register.js", "chainsaw-04.mp3", "icons", "app.webmanifest"];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("assets").then( cache => {
            cache.addAll(assets);
        })
    );
});

// State while revalidate strategy
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then( cachedResponse => {
                // Even if the response is in the cache, we fetch it
                // and update the cache for future usage
                const fetchPromise = fetch(event.request).then(
                     networkResponse => {
                        //var responseToCache = networkResponse.clone();
                        caches.open("assets").then( cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                // We use the currently cached version if it's there
                return cachedResponse || fetchPromise; // cached or a network fetch
            })
        );
    }); 

/*
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)  // searching in the cache
            .then( response => {
                if (response) {
                    // The request is in the cache 
                    return response; // cache hit
                } else {
                    // We need to go to the network  
                    return fetch(event.request);  // cache miss
                }
            })
    );
});*/
/*
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            } 
            else {
                return fetch(event.request)
                    .then(function(response) {
                        // Cache the response for future use
                        caches.open('assets')
                        .then(function(cache) {
                            cache.put(event.request, response.clone());
                        });

                    return response;
                });
            }
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request).then(function(response) {
            // Clone the response before reading its body
            var responseToCache = response.clone();
  
            // Cache the response for future use
            caches.open('assets').then(function(cache) {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        }
      })
    );
  });
  */