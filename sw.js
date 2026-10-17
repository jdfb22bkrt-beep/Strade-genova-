// GitHub Pages può ospitare più progetti sullo stesso dominio.
// Ogni progetto gestisce soltanto la propria cache e i propri file pubblici.
const PREFIX=`genova-da-scoprire:${new URL(self.registration.scope).pathname}:`;
const CACHE=PREFIX+'turismo-v1';
const FILES=["./","404.html","bassa-val-bisagno.html","centro-est.html","centro-ovest.html","esplora.html","index.html","informazioni.html","levante.html","media-val-bisagno.html","medio-levante.html","medio-ponente.html","ponente.html","quiz.html","statistiche.html","val-polcevera.html","style.css","navigation.js","data.js","quiz.js","app.js","foto-crediti.json","sitemap.xml","robots.txt","archive/original-questions.json","assets/bassa-val-bisagno.webp","assets/boccadasse.webp","assets/centro-ovest.webp","assets/centro.webp","assets/garibaldi.webp","assets/media-val-bisagno.webp","assets/medio-ponente.webp","assets/panorama.webp","assets/ponente.webp","assets/porto.webp","assets/sanlorenzo.webp"];
const PUBLIC_URLS=new Set(FILES.map(file=>new URL(file,self.registration.scope).href));
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  url.hash='';
  if(event.request.method!=='GET'||!PUBLIC_URLS.has(url.href))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response.ok)await cache.put(url.href,response.clone());
      return response;
    }catch{
      return await cache.match(url.href)||Response.error();
    }
  })());
});
