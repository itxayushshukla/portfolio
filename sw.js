const CACHE_NAME = "as-portfolio-v1";
const OFFLINE_URL = "offline.html";

const CORE_ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "manifest.json",
  "offline.html",
  "assets/logo.png",
  "assets/profile.jpg",
  "assets/projects/pothole.jpg",
  "assets/projects/jarvis.jpg",
  "assets/projects/academy.jpg",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Network-first for GitHub API calls so stats stay fresh
  if (event.request.url.includes("api.github.com")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match(OFFLINE_URL);
        });
    })
  );
});
