const CACHE='ysm-v12';
const ASSETS=['./','./yangmingshan-jinshan-radar.html','./data/trip/ysm_spots.json','./data/trip/ysm_food.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    if(hit)return hit;
    return fetch(e.request).then(resp=>{
      if(resp.ok&&e.request.url.includes('github.io')){
        const cp=resp.clone();
        caches.open(CACHE_NAME).then(c=>c.put(e.request,cp));
      }
      return resp;
    }).catch(()=>caches.match('./')));
  }));
});