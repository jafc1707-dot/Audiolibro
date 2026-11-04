// Guarda la app en el celular para que abra aunque no haya internet.
const V='audiolibro-telefono-v1', FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET' || u.origin!==location.origin) return;   // el diccionario va directo a internet
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{ if(r.ok) caches.open(V).then(c=>c.put(e.request,r.clone())); return r; }).catch(()=>hit);
    return hit || net;      // abre al tiro desde el celular y se actualiza solo en segundo plano
  }));
});
