// 양산여중 DID — 간단한 Service Worker
// 목적: PWA 설치 가능 조건 충족 + 오프라인 폴백
// 캐시 전략
//  - 페이지(HTML): 네트워크 우선 — 배포 후 처음 켤 때부터 최신 버전 (4초 안에 응답 없거나 오프라인이면 캐시)
//  - 아이콘 등 정적 자산: stale-while-revalidate (캐시 우선 표시, 백그라운드 갱신)

const CACHE_VERSION = 'ysgm-did-v2';
const PAGE_TIMEOUT_MS = 4000;
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
  if (request.method !== 'GET') return;

  // 페이지: 네트워크 우선 (느리거나 끊기면 캐시로 대체)
  const accept = request.headers.get('accept') || '';
  if (request.mode === 'navigate' || accept.indexOf('text/html') !== -1) {
    e.respondWith(
      caches.open(CACHE_VERSION).then(cache => {
        // 브라우저 HTTP 캐시도 건너뛰고 서버에 확인 (navigate 요청은 옵션을 붙일 수 없어 URL로 다시 요청)
        const fetched = fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        });
        const fallback = new Promise(resolve => {
          setTimeout(() => cache.match(request).then(c => { if (c) resolve(c); }), PAGE_TIMEOUT_MS);
          fetched.catch(() => cache.match(request).then(c => resolve(c || Response.error())));
        });
        return Promise.race([fetched.catch(() => fallback), fallback]);
      })
    );
    return;
  }

  // 정적 자산: stale-while-revalidate
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
