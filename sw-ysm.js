'use strict';
const VERSION='ysm-v3.1.0';
const CACHE_STATIC='static-'+VERSION;
const CACHE_DATA='data-'+VERSION;
const PRECACHE=['./','./yangmingshan-jinshan-radar.html','./data/trip/ysm_spots.json','./data/trip/ysm_food.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_STATIC).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE_STATIC&&k!==CACHE_DATA).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=e.request.url;
  // JSON 資料：cache-first + 背景更新（stale-while-revalidate）
  if(u.includes('/data/trip/')){
    e.respondWith(caches.open(CACHE_DATA).then(async c=>{
      const hit=await c.match(e.request);
      const net=fetch(e.request).then(resp=>{if(resp.ok)c.put(e.request,resp.clone());return resp;}).catch(()=>hit);
      return hit||net(resp);
      function net(p){return p;}
    }).catch(()=>fetch(e.request)));
    return;
  }
  // 頁面殼：cache-first
  if(u.includes('github.io')||u.includes('trip-radar')){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{
      if(resp.ok){const cp=resp.clone();caches.open(CACHE_STATIC).then(c=>c.put(e.request,cp));}
      return resp;
    }).catch(()=>caches.match('./yangmingshan-jinshan-radar.html'))));
  }
});
