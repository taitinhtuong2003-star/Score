const CACHE_NAME = 'score-v3'; // Nâng cấp lên v3 để ép iPhone xóa cache chữ S cũ
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon-512.png' // Đảm bảo file ảnh này đã được upload lên GitHub
];

// Kích hoạt cài đặt và lưu các file vào bộ nhớ đệm
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Xóa bỏ toàn bộ các phiên bản cache cũ (v1, v2) giúp hiển thị icon mới lập tức
self.addEventListener('activate', (e) => {
  e.waitUntil(
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

// Phục vụ app mượt mà ngay cả khi điện thoại mất mạng (Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
