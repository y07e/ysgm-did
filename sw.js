// 양산여중 DID — 간단한 Service Worker
// 목적: PWA 설치 가능 조건 충족 + 오프라인 폴백
// 캐시 전략: stale-while-revalidate (캐시 우선 표시, 백그라운드 갱신)

const CACHE_VERSION = 'ysgm-did-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(PRECACHE_URLS).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  // Firestore/Firebase API/외부 API는 그냥 네트워크 (캐시 X)
  const url = request.url;
  if (url.includes('firestore.googleapis.com') ||
      url.includes('firebase') ||
      url.includes('open-meteo.com') ||
      url.includes('neis.go.kr') ||
      url.includes('googleapis.com')) {
    return;  // 기본 fetch
  }
  // 정적 자산: stale-while-revalidate
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(request).then(cached => {
        const fetched = fetch(request).then(res => {
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetched;
      })
    )
  );
});
