// Avisos al celu de Tablero Nervo: solo recibe y muestra avisos (no guarda nada en caché).
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function(e){
  var d = {};
  try { d = e.data.json(); } catch (_) { d = { title: "Nervo Design", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Nervo Design", { body: d.body || "", tag: d.tag || undefined, icon: "img/icon-192.png", badge: "img/icon-192.png", data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(cs){
    for (var i = 0; i < cs.length; i++){ if ("focus" in cs[i]){ try { cs[i].navigate(url); } catch (_) {} return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
