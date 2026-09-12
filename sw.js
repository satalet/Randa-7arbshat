const CACHE_NAME = 'basem-notebook-v2';

// إجبار التفعيل الفوري بدون انتظار إغلاق التطبيق
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// مسح كل ملفات الكاش القديمة فوراً
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب الملفات المباشرة من النت أولاً (Network First) للتحديث دائماً
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
