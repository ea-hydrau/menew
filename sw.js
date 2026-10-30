const CACHE = "menu-semaine-v2";
const RESSOURCES = [
  "./", "./index.html", "./manifest.json", "./icon.svg",
  "https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js",
  "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js",
  "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(RESSOURCES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cache) =>
      cache || fetch(e.request).then((reponse) => {
        if (reponse && (reponse.status === 200 || reponse.type === "opaque")) {
          const copie = reponse.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copie));
        }
        return reponse;
      }).catch(() => cache)
    )
  );
});