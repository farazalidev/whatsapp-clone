self.addEventListener('activate', (e) => {
  console.log(document);
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    console.log('🚀 ~ self.addEventListener ~ data:', data);
    const title = data.title;
    const body = data.body;
    const icon = data.icon;
    const url = data.data.url;

    const notificationOptions = {
      body: body,
      tag: data.tag,
      icon: icon,
      data: {
        url: url,
      },
    };

    self.registration.showNotification(title, notificationOptions);
  } catch (error) {
    console.log('Notification Error');
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
