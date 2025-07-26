const cacheName = "sky-net-cache-v1";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style/style.css",
  "./script/script.js",
  "./img/card1.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});