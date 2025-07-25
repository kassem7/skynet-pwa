const cacheName = "sky-net-cache-v1";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style/style.css",
  "./script/script.js",
  "./img/card1.png"
];

// تثبيت الملفات
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// عند الطلب من المتصفح
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});