const CACHE = "menu-semaine-v1";
const RESSOURCES = [
  "./", "./index.html", "./manifest.json", "./icon.svg",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://cdn.tailwindcss.com",
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
