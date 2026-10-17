'use strict';
const $ = selector => document.querySelector(selector);
const key = 'genova-da-scoprire-v2';
const oldKey = 'strade-genova-quiz-v1';
const byId = new Map(QUESTIONS.map(q => [q.id, q]));
const emptyTotals = () => ({completed:0,correct:0});
const freshState = () => ({version:2,totals:emptyTotals(),levels:[emptyTotals(),emptyTotals(),emptyTotals()],legacy:emptyTotals(),history:{1:[],2:[],3:[]},round:null,migrated:false});
let state = freshState();
function validTotals(t) { return t && Number.isSafeInteger(t.completed) && Number.isSafeInteger(t.correct) && t.correct >= 0 && t.completed >= t.correct; }
function validState(s) {
  if (!s || s.version !== 2 || !validTotals(s.totals) || !validTotals(s.legacy) || !Array.isArray(s.levels) || s.levels.length !== 3 || !s.levels.every(validTotals) || typeof s.migrated !== 'boolean') return false;
  if (['completed','correct'].some(k => s.totals[k] !== s.legacy[k] + s.levels.reduce((n,t) => n+t[k],0))) return false;
  if (![1,2,3].every(l => Array.isArray(s.history?.[l]) && s.history[l].every(id => byId.get(id)?.level === l) && new Set(s.history[l]).size === s.history[l].length)) return false;
  if (!s.round) return true;
  const r=s.round;
  if (![1,2,3].includes(r.level) || !Array.isArray(r.ids) || r.ids.length!==10 || new Set(r.ids).size!==10 || !r.ids.every(id=>byId.get(id)?.level===r.level) || !Number.isInteger(r.position) || r.position<0 || r.position>9 || !r.answers || typeof r.answers!=='object' || Array.isArray(r.answers)) return false;
  const n=Object.keys(r.answers).length;
  if (n<r.position || n>r.position+1 || !r.ids.every((id,i)=>i<n?Number.isInteger(r.answers[id])&&r.answers[id]>=0&&r.answers[id]<4:!Object.hasOwn(r.answers,id))) return false;
  if (!r.choices || !r.ids.every(id=>Array.isArray(r.choices[id])&&r.choices[id].length===4&&new Set(r.choices[id]).size===4&&r.choices[id].every(i=>Number.isInteger(i)&&i>=0&&i<4))) return false;
  const hits=r.ids.filter(id=>r.answers[id]===byId.get(id).correct).length;
  return s.levels[r.level-1].completed>=n && s.levels[r.level-1].correct>=hits;
}
let storageBlocked=false;
try {
  const raw=localStorage.getItem(key);
  if (raw) { const saved=JSON.parse(raw);if (!validState(saved)) throw Error('saved');state=saved; }
  else { const legacyRaw=localStorage.getItem(oldKey);if (legacyRaw) {const old=JSON.parse(legacyRaw);if(old.version!==1||!validTotals(old))throw Error('legacy');state.legacy={completed:old.completed,correct:old.correct};state.totals={...state.legacy};state.migrated=true;} }
} catch { $('#quiz-storage').textContent='Impossibile leggere i dati salvati. Puoi giocare in memoria; i dati precedenti non vengono sovrascritti. Esporta i progressi prima di chiudere.';storageBlocked=true; }
function save() { if(storageBlocked)return;try {localStorage.setItem(key,JSON.stringify(state));}catch{$('#quiz-storage').textContent='Salvataggio non disponibile: esporta una copia dei progressi prima di chiudere.';} }
function shuffle(items) {const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function sourceLink(source) {const a=document.createElement('a');a.href=SOURCES[source][1];a.textContent=SOURCES[source][0]+' ↗';a.target='_blank';a.rel='noopener noreferrer';a.className='text-link';return a;}
function percent(t) {return t.completed?Math.round(t.correct/t.completed*100):0;}
function renderStats() {
  $('#stats-total').replaceChildren();
  for(const [n,label] of [[state.totals.completed,'risposte date'],[state.totals.correct,'risposte corrette'],[percent(state.totals)+'%','successo complessivo']]){const card=document.createElement('div');const strong=document.createElement('strong');strong.textContent=n;const span=document.createElement('span');span.textContent=label;card.append(strong,span);$('#stats-total').append(card);}
  $('#stats-levels').replaceChildren();state.levels.forEach((t,i)=>{const tr=document.createElement('tr');for(const value of [`${i+1} · ${LEVELS[i]}`,t.completed,t.correct,`${percent(t)}%`]){const td=document.createElement('td');td.textContent=value;tr.append(td);}$('#stats-levels').append(tr);});
  $('#legacy-note').textContent=state.migrated?`Archivio precedente importato: ${state.legacy.correct} corrette su ${state.legacy.completed}. Questi risultati sono inclusi nei totali, separati dai nuovi livelli. Il vecchio salvataggio è conservato.`:'Nessun totale precedente trovato a questo indirizzo. Se usavi il file locale, apri qui index.html con lo stesso browser oppure importa una copia esportata.';
}
function startRound(level) {
  // Prima le meno recenti; una domanda per municipio in ciascun passaggio.
  const history=state.history[level];const pool=shuffle(QUESTIONS.filter(q=>q.level===level)).sort((a,b)=>history.indexOf(a.id)-history.indexOf(b.id));const ids=[];
  while(ids.length<10){const areas=new Set();for(const q of pool){if(ids.length===10)break;if(!ids.includes(q.id)&&!areas.has(q.municipio)){ids.push(q.id);areas.add(q.municipio);}}}
  state.history[level]=[...history.filter(id=>!ids.includes(id)),...ids];state.round={level,ids,position:0,answers:{},choices:Object.fromEntries(ids.map(id=>[id,shuffle([0,1,2,3])]))};save();renderQuiz(true);
}
function renderQuiz(focus=false) {
  const r=state.round;document.querySelectorAll('[data-level]').forEach(b=>{const active=r?.level===Number(b.dataset.level);b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);});$('#quiz-play').hidden=!r;if(!r)return;
  const q=byId.get(r.ids[r.position]),answered=Object.hasOwn(r.answers,q.id),done=answered&&r.position===9;const count=Object.keys(r.answers).length,score=r.ids.filter(id=>r.answers[id]===byId.get(id).correct).length;
  $('#quiz-progress').textContent=`Livello ${r.level} · ${LEVELS[r.level-1]} · Domanda ${r.position+1} di 10`;$('#quiz-stats').textContent=`Punteggio del giro: ${score} / 10 · Risposte date: ${count}`;$('#round-progress').value=count;
  const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.tabIndex=-1;legend.textContent=q.question;fieldset.append(legend);
  r.choices[q.id].forEach(choice=>{const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='quiz-answer';input.value=choice;input.checked=answered&&r.answers[q.id]===choice;input.disabled=answered;input.setAttribute('aria-describedby','quiz-feedback');if(answered&&choice===q.correct)label.classList.add('answer-correct');if(answered&&choice===r.answers[q.id]&&choice!==q.correct)label.classList.add('answer-wrong');input.addEventListener('change',()=>{if(Object.hasOwn(r.answers,q.id))return;r.answers[q.id]=choice;state.totals.completed++;state.levels[r.level-1].completed++;if(choice===q.correct){state.totals.correct++;state.levels[r.level-1].correct++;}save();renderQuiz();renderStats();(r.position===9?$('#quiz-final-score'):$('#quiz-next')).focus();});label.append(input,document.createTextNode(q.answers[choice]));fieldset.append(label);});
  const feedback=document.createElement('div');feedback.id='quiz-feedback';feedback.className='quiz-feedback';feedback.setAttribute('aria-live','polite');feedback.hidden=!answered;if(answered){const p=document.createElement('p');p.textContent=`${r.answers[q.id]===q.correct?'Corretto!':'Questa volta no.'} La risposta corretta è: ${q.answers[q.correct]}. ${q.explanation}`;feedback.append(p,sourceLink(q.source));}fieldset.append(feedback);$('#quiz-questions').replaceChildren(fieldset);$('#quiz-next').hidden=!answered||done;$('#quiz-result').hidden=!done;$('#quiz-final-score').textContent=`Punteggio del giro: ${score} / 10 (${score*10}%)`;$('#quiz-final-total').textContent=`Totale complessivo: ${state.totals.correct} corrette su ${state.totals.completed} (${percent(state.totals)}%). Il prossimo giro riparte da zero; i tuoi totali restano.`;if(focus)legend.focus();
}
LEVELS.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.dataset.level=i+1;b.className='level-card';b.setAttribute('aria-pressed','false');const n=document.createElement('span');n.className='eyebrow';n.textContent=`LIVELLO ${i+1} · ${QUESTIONS.filter(q=>q.level===i+1).length} DOMANDE`;const title=document.createElement('strong');title.textContent=name;const description=document.createElement('span');description.textContent=['Storie, monumenti e curiosità da riscoprire.','Quartieri, geografia e collegamenti della città.','Vie, dettagli storici e percorsi meno evidenti.'][i];b.append(n,title,description);b.addEventListener('click',()=>{if(state.round&&Object.keys(state.round.answers).length<10&&!confirm('Iniziare un nuovo giro? I punti già ottenuti restano nelle statistiche complessive.'))return;startRound(i+1);});$('#level-choices').append(b);});
$('#quiz-form').addEventListener('submit',e=>e.preventDefault());$('#quiz-next').addEventListener('click',()=>{const r=state.round;if(!r||!Object.hasOwn(r.answers,r.ids[r.position])||r.position>=9)return;r.position++;save();renderQuiz(true);});$('#quiz-retry').addEventListener('click',()=>startRound(state.round.level));
$('#export-stats').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='genova-da-scoprire-progressi.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('#data-status').textContent='Copia esportata. Conserva il file per recuperare statistiche e partita.';});
$('#import-stats').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error();const imported=JSON.parse(await file.text());if(!validState(imported))throw Error();if(!confirm('Sostituire i progressi correnti con questa copia? Esporta prima i dati correnti se vuoi conservarli.'))return;state=imported;storageBlocked=false;save();renderQuiz();renderStats();$('#data-status').textContent='Progressi importati.';}catch{$('#data-status').textContent='File non valido: nessun progresso modificato.';}finally{e.target.value='';}});

renderQuiz();renderStats();
