'use strict';
if(location.protocol!=='file:'&&'serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}
// I vecchi collegamenti alla pagina unica continuano a raggiungere le sezioni.
if(location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')){
  const redirects={'#esplora':'esplora.html','#percorsi':'esplora.html','#quiz':'quiz.html','#statistiche':'statistiche.html'};
  if(redirects[location.hash])location.replace(redirects[location.hash]);
}
