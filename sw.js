const CACHE_NAME = "MegaChat-app-v1";

/* Pre-cache: all main pages (clean URLs) + static assets */
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/blog",
  "/faq",
  "/about",
  "/how-it-works",
  "/privacy-policy",
  "/terms",
  "/blog/how-to-earn-money-chatting-online",
  "/blog/kelvin-success-story",
  "/blog/withdraw-money-megachat-mpesa",
  "/blog/chat-guidelines-for-beginners",
  "/manifest.json",
];

/* ─────────────────────────────
   INSTALL
───────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add each URL individually so one 404 doesn't break the whole cache
      return Promise.all(
        FILES_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] Failed to cache:", url, err);
          }),
        ),
      );
    }),
  );
  self.skipWaiting();
});

/* ─────────────────────────────
   ACTIVATE
───────────────────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

/* ─────────────────────────────
   FETCH
───────────────────────────── */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only handle same-origin requests (avoid caching analytics, external images, etc.)
  if (url.origin !== self.location.origin) return;

  // ── Navigation requests (HTML pages): network-first, fallback to cache, then to home
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((response) => {
          // Cache fresh copy of the page
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return response;
        })
        .catch(() => {
          // Offline: try cache for this exact page, then fallback to homepage
          return caches
            .match(req)
            .then((cached) => cached || caches.match("/"));
        }),
    );
    return;
  }

  // ── Static assets (CSS, JS, images, fonts): cache-first, update in background
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((response) => {
          // Only cache successful same-origin responses
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return response;
        })
        .catch(() => cached); // network failed → return cached (may be undefined)

      // Return cached immediately if available, refresh in background
      return cached || network;
    }),
  );
});