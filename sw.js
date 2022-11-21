const staticCacheName = "static-app-v3";
const dynamicCacheName = "dynamic-app-v1";

// Список статических файлов для кеша
const assetUrls = [
  "index.html",
  "/js/app.js",
  "/css/styles.css",
  "offline.html",
];

// self.addEventListener("install", (event) => {
//   console.log("[SW]: install");
//   // caching app
//   event.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       cache.addAll(assetUrls);
//     })
//   );
// });

// Alternative
self.addEventListener("install", async (event) => {
  console.log("[SW]: install");
  // caching app
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener("activate", async (event) => {
  console.log("[SW]: activate");
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", (event) => {
  // console.log("Fetch:", event.request.url);
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }

  // Перехватываем запрос от нашего приложения и с помощью respondWith мы решаем какими данными ответить
  // event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  console.log(cached);
  return cached ?? fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(req);
    return cached ?? (await caches.match("/offline.html"));
  }
}
