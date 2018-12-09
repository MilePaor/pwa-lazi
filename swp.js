// without library
const staticAssets = [
  "./",
  "./reset.css",
  "./main.css",
  "./main.js",
  "./fallback.json",
  "./images/dog.jpg"
];

async function networkFirst(req) {
  const cache = await caches.open("news-dynamic");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || (await caches.match("./fallback.json"));
  }
}

async function cacheFirst(req) {
  // console.log("req", req);

  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}
// koristi se kada se pojavi novi i kada se instalira
self.addEventListener("install", async () => {
  const cache = await caches.open("news-static");
  cache.addAll(staticAssets);
});
// event that intercept calls to outside
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});
