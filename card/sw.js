const CACHE = 'martin-card-v1';
const URLS = ['/card/', '/card/index.html', '/card/headshot.jpg', '/card/martin-burks.vcf'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
