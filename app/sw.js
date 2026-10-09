const CACHE='sala-giochi-app-v2.11.4';
const PHOTO_CACHE='sala-giochi-puzzle-photos-v1';
const ASSETS=[
  './','./index.html','./manifest.webmanifest?v=2.11.4',
  '../styles.css','../nextgen.css?v=2.10.2','../nomi-cose-citta.css?v=2.11.4',
  '../app.js','../nextgen.js?v=2.10.2','../nomi-cose-citta.js?v=2.11.4',
  '../icon.svg','../escape-room-bg.jpg',
  '../assets/home-room.svg','../assets/classic-desk.svg','../assets/future-city.svg','../assets/ng-shiftline.svg','../assets/ng-lumina.svg','../assets/ng-everybody.svg','../assets/ng-another.svg','../assets/ng-alibi.svg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k.startsWith('sala-giochi-app-')&&k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const isPuzzlePhoto=u.hostname==='upload.wikimedia.org';
  if(isPuzzlePhoto){
    e.respondWith(
      caches.open(PHOTO_CACHE).then(async cache=>{
        const hit=await cache.match(e.request);
        if(hit)return hit;
        try{
          const resp=await fetch(e.request);
          await cache.put(e.request,resp.clone());
          return resp;
        }catch{
          return Response.error();
        }
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>e.request.destination==='document'?caches.match('./index.html'):Response.error()))
  );
});
