// Service worker: abre rápido, funciona con mala señal y recibe avisos al celu.
const CACHE="nervo-v1"; const BASE=["./","index.html","css/app.css","js/app.js","js/config.js","img/logo.svg","img/icon-192.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{ const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request))); });
self.addEventListener("push",e=>{ let d={}; try{ d=e.data.json(); }catch(_){ d={title:"Tablero Nervo",body:e.data&&e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title||"Tablero Nervo",{body:d.body||"",icon:"img/icon-192.png",badge:"img/icon-192.png",data:{url:d.url||"./"}})); });
self.addEventListener("notificationclick",e=>{ e.notification.close(); e.waitUntil(clients.openWindow(e.notification.data.url||"./")); });
