/* Service worker di Patente Pronta: l'app funziona anche senza rete dopo la prima apertura.
   Cambia VERSION quando cambiano bank.json o le figure, così la cache si rinnova. */
const VERSION = 'v3';
const CACHE = 'patente-pronta-' + VERSION;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'bank.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];
const FIGURES = 409;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    // Le figure si scaricano in blocchi; se qualcuna fallisce verrà presa alla prima richiesta.
    const urls = Array.from({length: FIGURES}, (_, i) => `f/${i}.jpg`);
    for (let i = 0; i < urls.length; i += 40) {
      await Promise.allSettled(urls.slice(i, i + 40).map(u => cache.add(u)));
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('patente-pronta-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Caratteri di Google Fonts: se non disponibili, l'app usa i caratteri di sistema.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })());
    return;
  }
  if (url.origin !== location.origin) return;

  // Pagina e archivio domande: prima la rete (per prendere gli aggiornamenti), poi la cache.
  if (req.mode === 'navigate' || url.pathname.endsWith('/bank.json') || url.pathname.endsWith('/index.html')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const r = await fetch(req);
        if (r.ok) cache.put(req.mode === 'navigate' ? 'index.html' : req, r.clone());
        return r;
      } catch (e) {
        return (await cache.match(req)) || (await cache.match('index.html')) || Response.error();
      }
    })());
    return;
  }

  // Figure, icone e il resto: prima la cache.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok) cache.put(req, r.clone());
    return r;
  })());
});
