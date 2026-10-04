// Service Worker for Verdalia Admin PWA & Native Notifications
const CACHE_NAME = 'verdalia-admin-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
    ])
  );
});

// Handle notification clicks (Mobile PWA & Desktop)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin/dashboard/messages';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin/dashboard') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle incoming push events if web-push is triggered
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || '🔔 Verdalia Admin';
    const options = {
      body: data.body || 'Nouvelle notification commerciale reçue.',
      icon: data.icon || '/images/verdalia-logo.jpg',
      badge: data.badge || '/images/verdalia-logo.jpg',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/admin/dashboard/messages' },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Push error:', err);
  }
});
