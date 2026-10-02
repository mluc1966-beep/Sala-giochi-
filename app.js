'use strict';

const STORE_KEY='sala_giochi_locale_v1';
const app=document.getElementById('app');
const backBtn=document.getElementById('backBtn');
const homeBtn=document.getElementById('homeBtn');
const titleEl=document.getElementById('pageTitle');
const subEl=document.getElementById('pageSub');
const dialog=document.getElementById('difficultyDialog');
const difficultyTitle=document.getElementById('difficultyTitle');
const toastEl=document.getElementById('toast');
let pendingGame=null, activeTimer=null, activeStart=0, activeSaved=false, activeRng=Math.random, activeSessionTracked=true, activeGame=null, activeLevel=null, activeNoteKey=null;

const GAME_NAMES={mixed:'Partita Mista',sudoku:'Sudoku',wordsearch:'Cerca-parole',anagram:'Anagrammi',quiz:'Quiz',logic:'Logica',escape:'Escape Room'};
const LEVEL_NAMES={easy:'Facile',medium:'Medio',hard:'Difficile',extreme:'Difficilissimo'};
const LEVEL_ORDER=['easy','medium','hard','extreme'];
const SESSION_GAMES=new Set(['mixed','sudoku','wordsearch','anagram','quiz','logic']);
const ICONS={mixed:'🎲',sudoku:'🔢',wordsearch:'🔤',anagram:'🔡',quiz:'❓',logic:'🧠',escape:'🔐'};

const GAME_HELP={
  mixed:{title:'Partita Mista',goal:'Completa una sequenza di prove prese da giochi diversi.',steps:['Ogni prova mostra chiaramente il tipo di gioco da affrontare.','Rispondi o completa la prova e premi il pulsante di conferma quando presente.','Terminata una prova, passa alla successiva fino alla fine della sessione.'],tips:['Il punteggio somma i risultati delle singole prove.','Il Taccuino è utile per conservare calcoli, esclusioni e parole chiave tra una prova e l’altra.']},
  sudoku:{title:'Sudoku',goal:'Completa la griglia 9×9 senza ripetere i numeri da 1 a 9.',steps:['Tocca una casella vuota e inserisci un numero da 1 a 9.','Ogni numero può comparire una sola volta nella stessa riga, nella stessa colonna e nello stesso riquadro 3×3.','Le caselle iniziali sono fisse e non possono essere modificate.','Usa “Controlla” per verificare le caselle compilate e “Concludi” quando pensi di aver finito.'],tips:['Un errore non si risolve per tentativi: cerca prima quali numeri sono già esclusi da riga, colonna e riquadro.','Il Taccuino può servire per annotare candidati o passaggi logici.']},
  wordsearch:{title:'Cerca-parole',goal:'Trova nella griglia tutte le parole elencate sotto la griglia.',steps:['Guarda l’elenco “Parole da trovare” sotto la griglia.','Per selezionare una parola NON devi trascinare il dito: tocca una delle due lettere estreme della parola, poi tocca l’altra lettera estrema.','La selezione deve essere una linea perfettamente orizzontale, verticale o diagonale.','Se la parola è corretta, le sue lettere vengono evidenziate e la parola nell’elenco viene barrata.','Continua finché tutte le parole dell’elenco risultano trovate.'],example:'Esempio: se nella griglia compare C A S A in orizzontale, puoi toccare la C e poi l’ultima A. Se compare al contrario A S A C, puoi comunque toccare i due estremi: il gioco riconosce entrambe le direzioni.',tips:['Dopo il primo tocco la casella scelta resta evidenziata: a quel punto devi solo scegliere l’altro estremo.','Ai livelli più alti le parole possono essere al contrario e in tutte le diagonali.']},
  anagram:{title:'Anagrammi',goal:'Ricostruisci la parola corretta usando tutte le lettere mostrate.',steps:['Osserva le lettere mescolate.','Scrivi nel campo la parola che usa esattamente quelle lettere.','Premi “Conferma”; se non riesci puoi usare un aiuto o saltare la parola.'],tips:['Nei livelli più alti la categoria può essere nascosta e le parole diventano più lunghe.','Il Taccuino può essere usato per provare segmenti, prefissi e suffissi.']},
  quiz:{title:'Quiz',goal:'Scegli la risposta corretta tra quattro alternative.',steps:['Leggi per intero la domanda.','Tocca una sola risposta.','Dopo la scelta il gioco evidenzia la risposta corretta e mostra una spiegazione.','Premi “Avanti” per passare alla domanda successiva.'],tips:['Le risposte errate non bloccano la sessione ma riducono il punteggio ottenibile.','Ai livelli alti le alternative sono intenzionalmente più vicine tra loro.']},
  logic:{title:'Logica',goal:'Trova l’unica soluzione che soddisfa tutti i vincoli del problema.',steps:['Leggi tutti i dati prima di scegliere una risposta.','Usa esclusioni, ordinamenti, calcoli o combinazioni secondo il tipo di enigma.','Tocca la soluzione che ritieni corretta; dopo la risposta compare la spiegazione.'],tips:['Nei problemi a più vincoli conviene riportare nel Taccuino ciò che è certo e ciò che è escluso.','Difficile e Difficilissimo richiedono più passaggi: non fermarti alla prima regola che sembra funzionare.']},
  escape:{title:'Escape Room',goal:'Esplora la stanza, trova indizi e oggetti e scopri autonomamente come usarli per uscire.',steps:['Tocca gli elementi della stanza che vuoi esaminare: non esiste un ordine obbligatorio.','Alcuni oggetti possono essere raccolti nell’Inventario.','Seleziona un oggetto nell’Inventario quando vuoi provare a usarlo su un elemento della stanza.','Codici e messaggi non indicano necessariamente subito dove devono essere usati: collega gli indizi.','La porta finale si apre solo quando hai risolto ciò che serve, ma il gioco non ti dirà automaticamente quale passaggio fare dopo.'],tips:['Copia nel Taccuino date, simboli, sequenze e testi che potrebbero avere relazioni tra loro.','Un tentativo non valido non significa necessariamente che l’oggetto sia inutile: potrebbe essere usato altrove o in un momento diverso.']}
};
const LEVEL_HELP={easy:'Più elementi espliciti, meno direzioni o vincoli e più aiuti disponibili.',medium:'Più alternative e collegamenti; alcuni indizi non sono immediati.',hard:'Richiede deduzioni autonome, più passaggi e pochi aiuti.',extreme:'Massima complessità: più vincoli, meno guida e contenuti meno immediati.'};


const DEFAULT_GAME_PALETTES={mixed:'violet',sudoku:'ocean',wordsearch:'forest',anagram:'sunset',quiz:'steel',logic:'ember',escape:'gold'};
const DEFAULT_SETTINGS={homePalette:'aurora',gamePalettes:{...DEFAULT_GAME_PALETTES}};
const PALETTES={
  aurora:{name:'Aurora',s1:'#0f1631',s2:'#1e2e68',a1:'#6a5cff',a2:'#29c7ff',a3:'#7dffb3'},
  ocean:{name:'Ocean',s1:'#0a1c2c',s2:'#12395a',a1:'#168dff',a2:'#38d7ff',a3:'#8bf3ff'},
  forest:{name:'Forest',s1:'#0f251e',s2:'#1e4a37',a1:'#17b26a',a2:'#70d66b',a3:'#c8f169'},
  sunset:{name:'Sunset',s1:'#321322',s2:'#652341',a1:'#ff7a18',a2:'#ff4d6d',a3:'#ffd166'},
  ember:{name:'Ember',s1:'#2a1620',s2:'#53253e',a1:'#ff5e5b',a2:'#ff9a3c',a3:'#ffe066'},
  violet:{name:'Violet',s1:'#1d1739',s2:'#39256c',a1:'#8b5cf6',a2:'#c084fc',a3:'#f0abfc'},
  steel:{name:'Steel',s1:'#121826',s2:'#22304c',a1:'#5ea1ff',a2:'#60c2ff',a3:'#cad8ff'},
  gold:{name:'Gold',s1:'#2a1c0d',s2:'#5a3c12',a1:'#ffb703',a2:'#ffd166',a3:'#ffe7a3'}
};
const freshStore=()=>({version:2,createdAt:new Date().toISOString(),history:[],stats:{},sessions:{},notes:{},settings:{...DEFAULT_SETTINGS,gamePalettes:{...DEFAULT_GAME_PALETTES}}});
function normalizeStoreShape(raw){const base=freshStore();const out={...base,...raw};out.sessions=raw.sessions&&typeof raw.sessions==='object'?raw.sessions:{};out.notes=raw.notes&&typeof raw.notes==='object'?raw.notes:{};out.settings={...base.settings,...(raw.settings||{})};out.settings.gamePalettes={...base.settings.gamePalettes,...((raw.settings||{}).gamePalettes||{})};return out}
function loadStore(){try{return normalizeStoreShape(JSON.parse(localStorage.getItem(STORE_KEY)||'{}'))}catch{return freshStore()}}
let store=loadStore();
function persist(){localStorage.setItem(STORE_KEY,JSON.stringify(store))}
function paletteVars(key){const p=PALETTES[key]||PALETTES.aurora;return `--p-s1:${p.s1};--p-s2:${p.s2};--p-a1:${p.a1};--p-a2:${p.a2};--p-a3:${p.a3};`}
function getHomePalette(){return store.settings?.homePalette||DEFAULT_SETTINGS.homePalette}
function getGamePalette(game){return store.settings?.gamePalettes?.[game]||DEFAULT_GAME_PALETTES[game]||'aurora'}
function setHomePalette(key){store.settings.homePalette=key;persist()}
function setGamePalette(game,key){store.settings.gamePalettes[game]=key;persist()}
function paletteOptions(selected){return Object.entries(PALETTES).map(([k,v])=>`<option value="${k}" ${selected===k?'selected':''}>${v.name}</option>`).join('')}
function paletteSwatches(selected){return Object.entries(PALETTES).map(([k,v])=>`<button class="palette-chip ${selected===k?'selected':''}" onclick="setHomePalette('${k}');renderSettings()"><span class="swatch" style="--s1:${v.s1};--s2:${v.a1};--s3:${v.a2}"></span>${v.name}</button>`).join('')}

function noteKeyFor(game,level){if(activeSessionTracked&&SESSION_GAMES.has(game)){const s=sessionState(game,level);return `${game}|${level}|c${s.cycle}|s${s.session}`}return `${game}|${level}|free`}
function openHelp(){if(!activeGame)return;const d=document.getElementById('helpDialog'),h=GAME_HELP[activeGame]||{title:GAME_NAMES[activeGame],goal:'',steps:[],tips:[]};document.getElementById('helpTitle').textContent=`${ICONS[activeGame]} ${h.title}`;document.getElementById('helpLevel').textContent=`${LEVEL_NAMES[activeLevel]||''} · ${LEVEL_HELP[activeLevel]||''}`;document.getElementById('helpContent').innerHTML=`<div class="help-goal"><b>Obiettivo</b><p>${h.goal||''}</p></div>${h.steps?.length?`<div class="help-section"><b>Come si gioca</b><ol>${h.steps.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:''}${h.example?`<div class="help-example"><b>Esempio</b><p>${h.example}</p></div>`:''}${h.tips?.length?`<div class="help-section"><b>Da sapere</b><ul>${h.tips.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}<div class="help-note"><b>📝 Taccuino</b><br>Puoi scrivere liberamente oppure usare “Copia elemento attuale” per aggiungere la domanda o l’indizio visibile in quel momento.</div>`;d.showModal()}
function currentClueText(){const picks=['.escape-panel-v2 .panel-body','.escape-panel-v2 .symbol-code','.escape-panel-v2 .terminal-code','.quiz-q','.big-word','.word-list','.message'];for(const sel of picks){const el=document.querySelector(sel);if(el&&el.offsetParent!==null){const t=el.innerText.trim();if(t)return t}}return `${GAME_NAMES[activeGame]||'Gioco'} · ${LEVEL_NAMES[activeLevel]||''}`}
function copyTextToNotes(text){appendNote(text);toast('Indizio copiato nel taccuino')}
function appendNote(text){if(!activeNoteKey)return;store.notes??={};const old=store.notes[activeNoteKey]||'';const clean=String(text||'').trim();if(!clean)return;store.notes[activeNoteKey]=old+(old?'\n':'')+`• ${clean}`;persist();const area=document.getElementById('notesArea');if(area)area.value=store.notes[activeNoteKey]}
function openNotes(){if(!activeGame)return;const d=document.getElementById('notesDialog');store.notes??={};document.getElementById('notesContext').textContent=`${GAME_NAMES[activeGame]} · ${LEVEL_NAMES[activeLevel]}${activeSessionTracked&&SESSION_GAMES.has(activeGame)?` · ${sessionLabel(activeGame,activeLevel).replace(/<[^>]+>/g,'')}`:''}`;const area=document.getElementById('notesArea');area.value=store.notes[activeNoteKey]||'';area.oninput=()=>{store.notes[activeNoteKey]=area.value;persist()};document.getElementById('copyCurrentBtn').onclick=()=>{appendNote(currentClueText());toast('Elemento copiato nel taccuino')};document.getElementById('clearNotesBtn').onclick=()=>{if(confirm('Cancellare gli appunti di questa sessione?')){store.notes[activeNoteKey]='';persist();area.value=''}};document.getElementById('calcBtn').onclick=runMiniCalc;document.getElementById('calcInput').onkeydown=e=>{if(e.key==='Enter')runMiniCalc()};d.showModal();setTimeout(()=>area.focus(),50)}
function closeNotes(){const d=document.getElementById('notesDialog');if(d.open)d.close()}
function runMiniCalc(){const input=document.getElementById('calcInput'),out=document.getElementById('calcResult');let expr=(input.value||'').replace(/×/g,'*').replace(/÷/g,'/').replace(/,/g,'.');if(!/^[0-9+\-*/().%\s]+$/.test(expr)){out.textContent='Espressione non valida';return}try{const val=Function(`"use strict";return (${expr})`)();out.textContent=Number.isFinite(val)?String(Math.round(val*1e10)/1e10):'Errore'}catch{out.textContent='Errore'}}

function hashString(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function makeRng(seed){let x=(seed>>>0)||0x6d2b79f5;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function sessionState(game,level){store.sessions??={};store.sessions[game]??={};store.sessions[game][level]??={session:1,cycle:1,completed:0,cycleComplete:false};return store.sessions[game][level]}
function sessionSeed(game,level){const s=sessionState(game,level);return hashString(`${game}|${level}|${s.cycle}|${s.session}|sala-giochi-v2`)}
function sessionLabel(game,level){if(!SESSION_GAMES.has(game)||!activeSessionTracked)return'';const s=sessionState(game,level);return `<span class="session-badge">Sessione ${s.session}/100 · Ciclo ${s.cycle}</span>`}
function difficultyMeta(game,level){if(!SESSION_GAMES.has(game))return level==='extreme'?'Esplorazione senza guida':'Scenario interattivo';const s=sessionState(game,level);return s.cycleComplete?`Ciclo ${s.cycle} completato`:`Sessione ${s.session}/100 · ciclo ${s.cycle}`}
function resultShell(game,level,html){activeGame=game;activeLevel=level;return `<div class="screen-theme game-theme" style="${paletteVars(getGamePalette(game))}"><section class="game-shell game-${game}"><div class="game-head"><span class="badge">${ICONS[game]} ${GAME_NAMES[game]} · ${LEVEL_NAMES[level]}</span></div><div class="game-utility-bar"><button class="utility-btn" onclick="openHelp()">ⓘ Come si gioca</button><button class="utility-btn notes-btn" onclick="openNotes()">📝 Taccuino</button></div>${html}</section></div>`}
function concludeSession(game,level,score,success,message=''){if(activeSaved)return;const tracked=activeSessionTracked&&SESSION_GAMES.has(game);const s=tracked?sessionState(game,level):null;const doneSession=s?.session||null,doneCycle=s?.cycle||null;endRecord(game,level,score,success,{session:doneSession,cycle:doneCycle});if(!tracked){app.innerHTML=resultShell(game,level,`<div class="session-finish"><div class="result-emblem">${success?'🏆':'◼'}</div><h2>${success?'Sessione conclusa':'Partita conclusa'}</h2><p>${message||`Punteggio: ${score}`}</p><div class="actions"><button class="primary" onclick="startGame('${game}','${level}',{trackSession:false})">Gioca ancora</button><button class="secondary" onclick="renderHome()">Home</button></div></div>`);return}
  if(doneSession<100){s.completed=Math.max(s.completed||0,doneSession);s.session=doneSession+1;s.cycleComplete=false;persist();app.innerHTML=resultShell(game,level,`<div class="session-finish"><div class="result-emblem">${success?'🏆':'✓'}</div><div class="session-kicker">Ciclo ${doneCycle} · Sessione ${doneSession}/100</div><h2>${success?'Sessione completata':'Sessione terminata'}</h2><p>${message||`Punteggio: ${score}`}</p><div class="session-progress"><span style="width:${doneSession}%"></span></div><div class="actions"><button class="primary" onclick="startGame('${game}','${level}')">Gioca la sessione ${doneSession+1}</button><button class="secondary" onclick="renderHome()">Torna alla Home</button></div></div>`);return}
  s.completed=100;s.cycleComplete=true;persist();renderCycleComplete(game,level,score,message,doneCycle);
}
function renderCycleComplete(game,level,score=0,message='',cycleOverride=null){activeSaved=true;const s=sessionState(game,level);const cycle=cycleOverride||s.cycle;const idx=LEVEL_ORDER.indexOf(level),next=LEVEL_ORDER[idx+1];app.innerHTML=resultShell(game,level,`<div class="session-finish cycle-complete"><div class="result-emblem">💯</div><div class="session-kicker">Ciclo ${cycle} completato</div><h2>100 sessioni concluse</h2><p>${message||`Hai completato tutte le 100 sessioni di ${GAME_NAMES[game]} a livello ${LEVEL_NAMES[level]}.`}</p><div class="session-progress"><span style="width:100%"></span></div><div class="actions"><button class="primary" onclick="resetSessionCycle('${game}','${level}')">Rigenera tutto · nuovo ciclo</button>${next?`<button class="secondary level-up" onclick="advanceSessionLevel('${game}','${level}')">Passa a ${LEVEL_NAMES[next]}</button>`:''}<button class="secondary" onclick="renderHome()">Home</button></div></div>`)}
function resetSessionCycle(game,level){const s=sessionState(game,level);s.cycle=(s.cycle||1)+1;s.session=1;s.completed=0;s.cycleComplete=false;persist();startGame(game,level)}
function advanceSessionLevel(game,level){const idx=LEVEL_ORDER.indexOf(level),next=LEVEL_ORDER[idx+1];if(!next)return;const n=sessionState(game,next);if(n.cycleComplete){renderCycleComplete(game,next);return}persist();startGame(game,next)}

function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function norm(s){return String(s).trim().toLocaleUpperCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function shuffle(a,r=activeRng){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),1800)}
function fmtTime(sec){const m=Math.floor(sec/60),s=sec%60;return `${m}:${String(s).padStart(2,'0')}`}
function startTimer(){stopTimer();activeStart=Date.now();const el=document.getElementById('timer');if(!el)return;const tick=()=>el.textContent=fmtTime(Math.floor((Date.now()-activeStart)/1000));tick();activeTimer=setInterval(tick,1000)}
function stopTimer(){if(activeTimer){clearInterval(activeTimer);activeTimer=null}return activeStart?Math.floor((Date.now()-activeStart)/1000):0}
function setHeader(title,sub=''){titleEl.textContent=title;subEl.textContent=sub;backBtn.classList.toggle('hidden',title==='Sala Giochi');homeBtn.classList.toggle('hidden',title==='Sala Giochi')}
function endRecord(game,level,score,success,extra={}){if(activeSaved)return;activeSaved=true;const seconds=stopTimer();const row={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:new Date().toISOString(),game,level,score:Math.round(score),success,seconds,...extra};store.history.unshift(row);store.history=store.history.slice(0,5000);const k=`${game}:${level}`;const s=store.stats[k]||{played:0,won:0,bestScore:0,bestTime:null};s.played++;if(success)s.won++;s.bestScore=Math.max(s.bestScore,row.score);if(success&&(s.bestTime===null||seconds<s.bestTime))s.bestTime=seconds;store.stats[k]=s;persist();return row}

backBtn.onclick=()=>{stopTimer();renderHome()}; homeBtn.onclick=()=>{stopTimer();renderHome()};
dialog.addEventListener('close',()=>{const level=dialog.returnValue;if(level&&level!=='cancel'&&pendingGame)startGame(pendingGame,level)});

function renderHome(){activeSaved=false;setHeader('Sala Giochi','Un solo giocatore · archivio locale · v2.2.0');const total=store.history.length,wins=store.history.filter(x=>x.success).length,best=store.history.reduce((m,x)=>Math.max(m,x.score||0),0);app.innerHTML=`
<div class="screen-theme home-theme" style="${paletteVars(getHomePalette())}">
<section class="hero"><div class="hero-kicker">🎮 SALA GIOCHI</div><h2>Cosa vuoi giocare?</h2><p>Scegli una sfida, imposta il livello e gioca. Tutto resta memorizzato soltanto su questo dispositivo.</p><div class="hero-note"><span>● 4 livelli</span><span>◉ Offline</span><span>▣ Archivio locale</span></div></section>
<button class="daily-card" onclick="renderDaily()"><span class="daily-icon">⭐</span><span><strong>Sfida del giorno</strong><small>Una nuova prova da affrontare ogni giorno</small></span><span class="card-arrow">›</span></button>
<div class="section-title"><h3>Scegli un gioco</h3><small>Facile · Medio · Difficile · Difficilissimo</small></div>
<div class="grid">
${gameCard('mixed','Partita Mista','Sei prove diverse in una sola partita')}
${gameCard('sudoku','Sudoku','Griglia 9×9 con soluzione unica')}
${gameCard('wordsearch','Cerca-parole','Trova le parole nascoste')}
${gameCard('anagram','Anagrammi','Ricomponi le parole')}
${gameCard('quiz','Quiz','Cultura generale e curiosità')}
${gameCard('logic','Logica','Sequenze, deduzioni e codici')}
${gameCard('escape','Escape Room','Enigmi concatenati in una storia')}
</div>
<div class="section-title"><h3>Le tue statistiche</h3><div class="inline-actions"><button class="secondary" onclick="renderArchive()">Archivio</button><button class="secondary" onclick="renderSettings()">Palette</button></div></div>
<div class="stat-grid"><div class="stat"><b>${total}</b><span>Partite</span></div><div class="stat"><b>${wins}</b><span>Completate</span></div><div class="stat"><b>${total?Math.round(wins/total*100):0}%</b><span>Successo</span></div><div class="stat"><b>${best}</b><span>Record punti</span></div></div>
<p class="footer-note">🔒 Nessun dato viene inviato a un server. Il browser conserva lo storico in memoria locale; dall'Archivio puoi esportare un backup JSON.</p>
</div>`} 
function gameCard(id,name,desc){return `<button class="game-card game-${id}" onclick="chooseDifficulty('${id}')"><span class="game-icon">${ICONS[id]}</span><strong>${name}</strong><small>${desc}</small><span class="mini-arrow">›</span></button>`}
function chooseDifficulty(game){pendingGame=game;difficultyTitle.textContent=`${ICONS[game]} ${GAME_NAMES[game]} · livello`;dialog.querySelectorAll('.difficulty').forEach(b=>{const level=b.value,label=LEVEL_NAMES[level],symbols={easy:'●',medium:'●●',hard:'●●●',extreme:'✦✦✦✦'}[level];b.innerHTML=`<span>${symbols}</span><div><b>${label}</b><small>${difficultyMeta(game,level)}</small></div>`});dialog.showModal()}
function gameShell(game,level,body){return `<div class="screen-theme game-theme" style="${paletteVars(getGamePalette(game))}"><section class="game-shell game-${game}"><div class="game-head"><div><span class="badge">${ICONS[game]} ${GAME_NAMES[game]} · ${LEVEL_NAMES[level]}</span>${sessionLabel(game,level)}</div><span id="timer" class="timer">0:00</span></div><div class="game-utility-bar"><button class="utility-btn" onclick="openHelp()">ⓘ Come si gioca</button><button class="utility-btn notes-btn" onclick="openNotes()">📝 Taccuino</button></div>${body}</section></div>`}
function startGame(game,level,opts={}){activeSaved=false;activeGame=game;activeLevel=level;activeSessionTracked=opts.trackSession!==false&&SESSION_GAMES.has(game);if(activeSessionTracked){const s=sessionState(game,level);if(s.cycleComplete){renderCycleComplete(game,level);return}activeRng=makeRng(sessionSeed(game,level))}else activeRng=Math.random;activeNoteKey=noteKeyFor(game,level);setHeader(GAME_NAMES[game],LEVEL_NAMES[level]);({sudoku:startSudoku,wordsearch:startWordSearch,anagram:startAnagram,quiz:startQuiz,logic:startLogic,escape:startEscape,mixed:startMixed}[game])(level)}

// ---------- Sudoku ----------
function pattern(r,c){return (r*3+Math.floor(r/3)+c)%9}
function sudokuFull(){const rows=shuffle([0,1,2]).flatMap(g=>shuffle([0,1,2]).map(r=>g*3+r));const cols=shuffle([0,1,2]).flatMap(g=>shuffle([0,1,2]).map(c=>g*3+c));const nums=shuffle([1,2,3,4,5,6,7,8,9]);return rows.flatMap(r=>cols.map(c=>nums[pattern(r,c)]))}
function countSolutions(board,limit=2){let count=0;function go(){if(count>=limit)return;let idx=-1,best=null;for(let i=0;i<81;i++){if(board[i])continue;const cand=[];for(let n=1;n<=9;n++)if(validSudoku(board,i,n))cand.push(n);if(!cand.length)return;if(!best||cand.length<best.length){best=cand;idx=i;if(cand.length===1)break}}if(idx<0){count++;return}for(const n of best){board[idx]=n;go();board[idx]=0;if(count>=limit)return}}go();return count}
function validSudoku(b,i,n){const r=Math.floor(i/9),c=i%9;for(let k=0;k<9;k++){if(b[r*9+k]===n||b[k*9+c]===n)return false}const br=Math.floor(r/3)*3,bc=Math.floor(c/3)*3;for(let rr=br;rr<br+3;rr++)for(let cc=bc;cc<bc+3;cc++)if(b[rr*9+cc]===n)return false;return true}
function makeSudoku(level){const target={easy:38,medium:32,hard:26,extreme:22}[level];let best=null;const tries={easy:1,medium:2,hard:4,extreme:7}[level];for(let attempt=0;attempt<tries;attempt++){const solution=sudokuFull(),puzzle=[...solution];let clues=81;for(const idx of shuffle([...Array(81).keys()])){if(clues<=target)break;const old=puzzle[idx];puzzle[idx]=0;if(countSolutions([...puzzle],2)!==1)puzzle[idx]=old;else clues--}if(!best||clues<best.clues)best={solution,puzzle,clues};if(clues<=target)break}return {solution:best.solution,puzzle:best.puzzle}}
function startSudoku(level){const g=makeSudoku(level);let hints={easy:3,medium:2,hard:1,extreme:0}[level];app.innerHTML=gameShell('sudoku',level,`<div class="message">Completa la griglia. Lo schema generato ha una sola soluzione.</div><div id="sudoku" class="sudoku"></div><div class="actions"><button class="secondary" id="checkSudoku">Controlla</button><button class="secondary" id="hintSudoku">💡 Suggerimento (${hints})</button><button class="primary" id="finishSudoku">Concludi</button></div><div id="sudokuMsg"></div>`);const grid=document.getElementById('sudoku');g.puzzle.forEach((v,i)=>{const inp=document.createElement('input');inp.inputMode='numeric';inp.maxLength=1;inp.dataset.i=i;if(v){inp.value=v;inp.readOnly=true;inp.className='given'}else inp.addEventListener('input',()=>{inp.value=inp.value.replace(/[^1-9]/g,'').slice(0,1);if([...grid.querySelectorAll('input')].every((x,j)=>Number(x.value)===g.solution[j]))finish(true)});grid.appendChild(inp)});const msg=document.getElementById('sudokuMsg');document.getElementById('checkSudoku').onclick=()=>{let wrong=0;grid.querySelectorAll('input:not(.given)').forEach(x=>{const i=+x.dataset.i;x.style.background=(x.value&&+x.value!==g.solution[i])?'#fef2f2':'';if(x.value&&+x.value!==g.solution[i])wrong++});msg.innerHTML=`<div class="message ${wrong?'bad':'ok'}">${wrong?`Ci sono ${wrong} valori errati.`:'Nessun errore tra i valori inseriti.'}</div>`};document.getElementById('hintSudoku').onclick=()=>{if(!hints)return toast('Nessun suggerimento rimasto');const empty=[...grid.querySelectorAll('input:not(.given)')].filter(x=>Number(x.value)!==g.solution[+x.dataset.i]);if(!empty.length)return;const x=empty[Math.floor(activeRng()*empty.length)];x.value=g.solution[+x.dataset.i];x.style.background='#fff7d6';hints--;document.getElementById('hintSudoku').textContent=`💡 Suggerimento (${hints})`};document.getElementById('finishSudoku').onclick=()=>{const ok=[...grid.querySelectorAll('input')].every((x,j)=>Number(x.value)===g.solution[j]);finish(ok)};startTimer();function finish(ok){const sec=Math.floor((Date.now()-activeStart)/1000),filled=[...grid.querySelectorAll('input')].filter(x=>x.value).length;const score=ok?Math.max(100,1000-sec-Math.max(0,81-filled)*2):Math.round(filled/81*500);concludeSession('sudoku',level,score,ok,`${ok?'Sudoku completato':'Sudoku terminato'}. Punteggio: <b>${score}</b>.`)}}

// ---------- Cerca-parole ----------
const WORD_THEMES={
  'Animali':['TIGRE','DELFINO','CAVALLO','PANDA','VOLPE','AQUILA','GIRAFFA','ZEBRA','LONTRA','FALCO','KOALA','ORSO','LUPO','CIGNO','RICCIO','TASSO','FOCA','GATTO'],
  'Cucina':['PASTA','RISOTTO','FORNO','TEGAME','COLTELLO','FARINA','LIEVITO','PENTOLA','MESTOLO','CANNELLA','RAGU','BRODO','TORTA','PANE','OLIO','SALE','PEPE','CREMA'],
  'Geografia':['ITALIA','EUROPA','TORINO','ROMA','ALPI','FIUME','ISOLA','OCEANO','DESERTO','PIANURA','COLLINA','VULCANO','LAGO','COSTA','VALLE','PORTO','NORD','SUD'],
  'Scienza':['ATOMO','CELLULA','ENERGIA','ORBITA','GALASSIA','NEUTRONE','FOTONE','GENOMA','PLASMA','QUARK','LASER','ENZIMA','MOLECOLA','GRAVITA','ECLISSE','COMETA','REAZIONE','CRISTALLO','PROTEINA','MAGNETE'],
  'Storia':['IMPERO','SENATO','CASTELLO','DINASTIA','REPUBBLICA','BATTAGLIA','TRATTATO','ARCHIVIO','MONARCA','COLONIA','RIVOLTA','MEDIOEVO','RINASCITA','LEGIONE','CONSOLE','REGNO','FRONTIERA','CRONACA','SCETTRO','FORTEZZA'],
  'Arte':['AFFRESCO','MOSAICO','SCULTURA','PITTURA','TAVOLOZZA','PENNELLO','TEATRO','OPERA','RITRATTO','PROSPETTIVA','GALLERIA','MUSEO','CERAMICA','INCISIONE','DISEGNO','ATELIER','CORNICE','TELA','ACQUERELLO','BOZZETTO'],
  'Tecnologia':['CODICE','SERVER','ROBOT','SENSORE','MEMORIA','PROCESSORE','RETE','PIXEL','DISPLAY','ALGORITMO','DATABASE','CLOUD','SOFTWARE','HARDWARE','CIRCUITO','SEGNALE','BROWSER','ARCHIVIO','CONSOLE','PROTOCOLLO']
};
function makeWordSearch(level){const size={easy:11,medium:14,hard:16,extreme:18}[level],count={easy:8,medium:12,hard:15,extreme:18}[level];const theme=shuffle(Object.keys(WORD_THEMES))[0];const selected=shuffle(WORD_THEMES[theme].filter(w=>w.length<=size)).slice(0,count);const dirs=level==='easy'?[[1,0],[0,1]]:level==='medium'?[[1,0],[0,1],[1,1],[-1,1],[-1,0],[0,-1]]:[[1,0],[0,1],[1,1],[-1,1],[-1,0],[0,-1],[-1,-1],[1,-1]];let best=null;for(let attempt=0;attempt<20;attempt++){const grid=Array(size*size).fill(''),placed=[];const placementOrder=[...selected].sort((a,b)=>b.length-a.length);for(const w of placementOrder){let ok=false;for(let tries=0;tries<1000&&!ok;tries++){const [dx,dy]=dirs[Math.floor(activeRng()*dirs.length)],x=Math.floor(activeRng()*size),y=Math.floor(activeRng()*size);const endx=x+dx*(w.length-1),endy=y+dy*(w.length-1);if(endx<0||endx>=size||endy<0||endy>=size)continue;let good=true,cells=[];for(let i=0;i<w.length;i++){const xx=x+dx*i,yy=y+dy*i,idx=yy*size+xx;cells.push(idx);if(grid[idx]&&grid[idx]!==w[i]){good=false;break}}if(good){cells.forEach((idx,i)=>grid[idx]=w[i]);placed.push({word:w,cells});ok=true}}}if(!best||placed.length>best.placed.length)best={grid,placed};if(placed.length===selected.length)break}const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';for(let i=0;i<best.grid.length;i++)if(!best.grid[i])best.grid[i]=letters[Math.floor(activeRng()*letters.length)];return {size,theme,grid:best.grid,placed:best.placed,words:shuffle(best.placed.map(p=>p.word))}}
function startWordSearch(level){const made=makeWordSearch(level),{size,theme,grid,placed}=made,words=made.words;let first=null,found=new Set();app.innerHTML=gameShell('wordsearch',level,`<div class="wordsearch-instructions"><b>Come selezionare una parola</b><span>1. Tocca una lettera estrema</span><span>2. Tocca l’altra estremità della stessa parola</span><small>Niente trascinamento: bastano due tocchi.</small></div><div class="wordsearch-status"><span>Tema: <b>${theme}</b></span><span id="wordSelectStatus">Nessuna lettera selezionata</span></div><div id="wordGrid" class="word-grid" style="grid-template-columns:repeat(${size},1fr)"></div><div class="word-list-head"><strong>Parole da trovare</strong><span id="wordCounter">0/${words.length}</span></div><div id="wordList" class="word-list"></div><div class="actions wordsearch-actions"><button id="cancelWordSelection" class="secondary" type="button" disabled>Annulla prima lettera</button></div><div id="wordMsg"></div>`);const wg=document.getElementById('wordGrid'),status=document.getElementById('wordSelectStatus'),cancel=document.getElementById('cancelWordSelection');grid.forEach((l,i)=>{const b=document.createElement('button');b.className='letter';b.textContent=l;b.dataset.i=i;b.setAttribute('aria-label',`Lettera ${l}`);b.onclick=()=>select(i);wg.appendChild(b)});cancel.onclick=resetSelection;renderWords();startTimer();function renderWords(){document.getElementById('wordCounter').textContent=`${found.size}/${words.length}`;document.getElementById('wordList').innerHTML=words.map(w=>`<span class="word-chip ${found.has(w)?'done':''}">${found.has(w)?'✓ ':''}${w}</span>`).join('')};function resetSelection(){if(first!==null)wg.children[first].classList.remove('selected');first=null;status.textContent='Nessuna lettera selezionata';cancel.disabled=true}function select(i){if(first===null){first=i;wg.children[i].classList.add('selected');status.innerHTML=`Prima lettera: <b>${grid[i]}</b> · ora tocca l’altro estremo`;cancel.disabled=false;return}if(i===first){resetSelection();return}const start=first,path=linePath(first,i,size);resetSelection();if(!path)return toast('I due estremi devono essere sulla stessa riga, colonna o diagonale');const text=path.map(j=>grid[j]).join('');const rev=[...text].reverse().join('');const p=placed.find(p=>!found.has(p.word)&&(p.word===text||p.word===rev)&&sameCells(p.cells,path));if(p){found.add(p.word);path.forEach(j=>wg.children[j].classList.add('found'));renderWords();toast(`Trovata: ${p.word}`);if(found.size===words.length){const sec=Math.floor((Date.now()-activeStart)/1000),score=Math.max(100,800-sec);concludeSession('wordsearch',level,score,true,`Tutte le ${words.length} parole trovate. Punteggio: <b>${score}</b>.`)}}else{wg.children[start]?.classList.add('miss');wg.children[i]?.classList.add('miss');setTimeout(()=>{wg.children[start]?.classList.remove('miss');wg.children[i]?.classList.remove('miss')},350);toast('La linea scelta non corrisponde a una parola dell’elenco')}}}
function linePath(a,b,size){const ax=a%size,ay=Math.floor(a/size),bx=b%size,by=Math.floor(b/size),dx=Math.sign(bx-ax),dy=Math.sign(by-ay),sx=Math.abs(bx-ax),sy=Math.abs(by-ay);if(!(sx===0||sy===0||sx===sy))return null;const len=Math.max(sx,sy)+1,out=[];for(let i=0;i<len;i++)out.push((ay+dy*i)*size+(ax+dx*i));return out}
function sameCells(a,b){return a.length===b.length&&a.every(x=>b.includes(x))}

// ---------- Anagrammi ----------
const ANAGRAMS={easy:[['TEATRO','Spettacolo'],['CAMERA','Casa'],['GELATO','Cibo'],['FIUME','Geografia'],['PESCA','Natura'],['TRENO','Trasporti'],['LIBRO','Cultura'],['PIANO','Musica'],['BOSCO','Natura'],['PORTA','Casa'],['TORRE','Architettura'],['PIANTA','Natura']],medium:[['ASTRONAUTA','Spazio'],['PIRAMIDE','Storia'],['BIBLIOTECA','Cultura'],['SCULTURA','Arte'],['ORCHESTRA','Musica'],['VULCANO','Geografia'],['PANORAMA','Paesaggio'],['GIRASOLE','Natura'],['LABIRINTO','Enigma'],['CANGURO','Animali'],['TELESCOPIO','Scienza'],['CASTELLO','Storia']],hard:[['ARCHEOLOGIA','Scienza umana'],['COSTELLAZIONE','Astronomia'],['BIODIVERSITA','Natura'],['CARTOGRAFIA','Geografia'],['METAMORFOSI','Trasformazione'],['CRITTOGRAFIA','Codici'],['ELETTROMAGNETE','Fisica'],['PARALLELEPIPEDO','Geometria'],['INTERPRETAZIONE','Comprensione'],['SPETTROSCOPIA','Scienza'],['MICROSCOPIO','Laboratorio'],['PROBABILITA','Matematica']],extreme:[['INCOMPRENSIBILITA','Linguaggio'],['ANTROPOLOGICHE','Scienze sociali'],['INTERDISCIPLINARE','Conoscenza'],['ELETTROENCEFALOGRAMMA','Medicina'],['CONTROINDICAZIONE','Lessico'],['SPERIMENTAZIONE','Ricerca'],['DISOCCUPAZIONE','Societa'],['ARCHITETTONICO','Arte'],['GIURISPRUDENZA','Diritto'],['CRISTALLIZZAZIONE','Scienza'],['MICROPROCESSORE','Tecnologia'],['IPERSENSIBILITA','Medicina']]};
ANAGRAMS.easy.push(['CUCINA','Casa'],['SCUOLA','Cultura'],['MUSICA','Arte'],['FIABA','Letteratura'],['PONTE','Architettura'],['SPIAGGIA','Paesaggio'],['NUVOLE','Natura'],['FOGLIA','Natura'],['STRADA','Citta'],['VIAGGIO','Tempo libero'],['FARO','Mare'],['QUADRO','Arte']);
ANAGRAMS.medium.push(['PLANETARIO','Astronomia'],['ARCHIVIO','Cultura'],['BICICLETTA','Trasporti'],['CATTEDRALE','Architettura'],['TEMPORALE','Meteo'],['GEOMETRIA','Matematica'],['SCACCHIERA','Giochi'],['FOTOGRAFIA','Arte'],['AEROPORTO','Trasporti'],['ECOSISTEMA','Natura'],['MANOSCRITTO','Cultura'],['OROLOGERIA','Tecnica']);
ANAGRAMS.hard.push(['IMMAGINAZIONE','Mente'],['ORGANIZZAZIONE','Metodo'],['CONSAPEVOLEZZA','Mente'],['CONTEMPORANEO','Tempo'],['COSTITUZIONE','Diritto'],['MOLTIPLICAZIONE','Matematica'],['COMUNICAZIONE','Linguaggio'],['RAPPRESENTAZIONE','Arte'],['CLASSIFICAZIONE','Metodo'],['OSSERVAZIONE','Metodo'],['TRASFORMAZIONE','Cambiamento'],['CONFIGURAZIONE','Tecnologia']);
ANAGRAMS.extreme.push(['ELETTROCARDIOGRAMMA','Medicina'],['IMMUNODEFICIENZA','Medicina'],['CARATTERIZZAZIONE','Metodo'],['INTERNAZIONALIZZAZIONE','Societa'],['RESPONSABILIZZAZIONE','Societa'],['INTERCONNESSIONE','Tecnologia'],['DECONTESTUALIZZAZIONE','Linguaggio'],['ELETTROFISIOLOGIA','Scienza'],['RICONCETTUALIZZAZIONE','Pensiero'],['MULTIDISCIPLINARIETA','Conoscenza'],['SPETTROFOTOMETRIA','Scienza'],['MICROARCHITETTURA','Tecnologia']);
function scramble(w){let s;do{s=shuffle([...w]).join('')}while(s===w);return s}
function startAnagram(level){const rounds=shuffle(ANAGRAMS[level]).slice(0,8);let i=0,score=0,hints={easy:3,medium:2,hard:1,extreme:1}[level];app.innerHTML=gameShell('anagram',level,`<div class="progress"><span id="anaProg" style="width:0%"></span></div><div id="anaBox"></div><div id="anaMsg"></div>`);startTimer();render();function render(){if(i>=rounds.length){concludeSession('anagram',level,score,true,`Anagrammi conclusi. Punteggio: <b>${score}</b>/${rounds.length*100}.`);return}const [word,cat]=rounds[i],showCat=!['hard','extreme'].includes(level);document.getElementById('anaProg').style.width=`${i/rounds.length*100}%`;document.getElementById('anaBox').innerHTML=`<div class="message">Parola ${i+1}/${rounds.length}${showCat?` · Categoria: <b>${cat}</b>`:''}</div><div class="big-word">${scramble(word)}</div><div class="answer-row"><input id="anaInput" autocomplete="off" placeholder="Scrivi la parola"><button id="anaOk" class="primary">Conferma</button></div><div class="actions"><button id="anaHint" class="secondary">💡 Aiuto (${hints})</button><button id="anaSkip" class="secondary">Salta</button></div>`;const input=document.getElementById('anaInput');input.focus();document.getElementById('anaOk').onclick=check;input.onkeydown=e=>{if(e.key==='Enter')check()};document.getElementById('anaHint').onclick=()=>{if(!hints)return toast('Nessun aiuto rimasto');hints--;toast(level==='easy'?`Inizia con ${word[0]}`:level==='medium'?`Prime lettere: ${word.slice(0,2)}`:`Contiene la sequenza ${word.slice(1,4)}`);document.getElementById('anaHint').textContent=`💡 Aiuto (${hints})`};document.getElementById('anaSkip').onclick=()=>{i++;render()};function check(){if(norm(input.value)===norm(word)){score+=100;toast('Corretto!');i++;render()}else toast('Non ancora')}}}

// ---------- Quiz ----------
const QUIZ={
easy:[
['Qual è la capitale della Francia?',['Parigi','Lione','Marsiglia','Nizza'],0,'Parigi è la capitale della Francia.'],
['Quanti lati ha un esagono?',['5','6','7','8'],1,'Un esagono ha sei lati.'],
['Quale pianeta è noto come Pianeta Rosso?',['Venere','Marte','Giove','Mercurio'],1,'Marte appare rossastro per gli ossidi di ferro.'],
['Chi ha dipinto la Gioconda?',['Michelangelo','Raffaello','Leonardo da Vinci','Caravaggio'],2,'La Gioconda è opera di Leonardo da Vinci.'],
['In quale continente si trova il Kenya?',['Asia','Africa','Europa','America'],1,'Il Kenya si trova in Africa orientale.'],
['Quale gas è più abbondante nell’atmosfera terrestre?',['Ossigeno','Azoto','Anidride carbonica','Idrogeno'],1,'L’azoto costituisce circa il 78% dell’atmosfera.'],
['Quale mare bagna Venezia?',['Tirreno','Adriatico','Ionio','Ligure'],1,'Venezia si affaccia sull’Adriatico.'],
['Quanto fa 12 × 8?',['86','92','96','104'],2,'12×8=96.'],
['Quale animale è un mammifero?',['Squalo','Delfino','Trota','Polpo'],1,'Il delfino è un mammifero marino.'],
['Quale strumento misura la temperatura?',['Barometro','Termometro','Altimetro','Igrometro'],1,'Il termometro misura la temperatura.'],
['Qual è la formula chimica dell’acqua?',['CO₂','H₂O','O₂','NaCl'],1,'L’acqua è H₂O.'],
['Qual è il pianeta più grande del Sistema Solare?',['Terra','Saturno','Giove','Nettuno'],2,'Giove è il pianeta più grande.'],
['Chi è tradizionalmente indicato come autore della Divina Commedia?',['Petrarca','Dante Alighieri','Boccaccio','Ariosto'],1,'La Divina Commedia è di Dante Alighieri.'],
['Quanti metri ci sono in un chilometro?',['100','500','1000','10 000'],2,'Un chilometro equivale a 1000 metri.'],
['Qual è la capitale d’Italia?',['Milano','Roma','Napoli','Torino'],1,'Roma è la capitale d’Italia.'],
['Quanto vale 5²?',['10','15','20','25'],3,'5²=25.'],
['Quale organo pompa il sangue nel corpo?',['Polmone','Fegato','Cuore','Rene'],2,'Il cuore pompa il sangue.'],
['Quale pianeta è celebre per il suo sistema di anelli?',['Mercurio','Saturno','Marte','Venere'],1,'Saturno è celebre per il suo esteso sistema di anelli.'],
['Il Nilo scorre in quale continente?',['Africa','Asia','Europa','Oceania'],0,'Il Nilo scorre in Africa.'],
['Quale figura ha tre lati?',['Quadrato','Pentagono','Triangolo','Cerchio'],2,'Il triangolo ha tre lati.']
],
medium:[
['Quale elemento chimico ha simbolo Fe?',['Fluoro','Ferro','Fermio','Francio'],1,'Fe deriva dal latino ferrum.'],
['Quale città è attraversata dal Tamigi?',['Madrid','Londra','Vienna','Praga'],1,'Il Tamigi attraversa Londra.'],
['Chi scrisse “Il nome della rosa”?',['Italo Calvino','Umberto Eco','Primo Levi','Dino Buzzati'],1,'Il romanzo è di Umberto Eco.'],
['Qual è il più grande oceano della Terra?',['Atlantico','Indiano','Pacifico','Artico'],2,'Il Pacifico è il più esteso.'],
['Quante note distinte ha la scala diatonica prima della ripetizione all’ottava?',['5','6','7','8'],2,'Le note distinte sono sette.'],
['Quale organo produce l’insulina?',['Fegato','Pancreas','Rene','Milza'],1,'L’insulina è prodotta dalle cellule beta pancreatiche.'],
['Quale civiltà costruì Machu Picchu?',['Maya','Aztechi','Inca','Olmechi'],2,'Machu Picchu fu costruita dagli Inca.'],
['Qual è la radice quadrata di 144?',['10','11','12','14'],2,'12×12=144.'],
['Chi dipinse “La notte stellata”?',['Van Gogh','Monet','Picasso','Klimt'],0,'La Notte stellata è di Vincent van Gogh.'],
['Il Danubio sfocia in quale mare?',['Baltico','Nero','Egeo','Caspio'],1,'Il Danubio sfocia nel Mar Nero.'],
['Qual è l’unità SI della forza?',['Joule','Pascal','Newton','Watt'],2,'La forza si misura in newton.'],
['Quante basi azotate standard compongono il DNA?',['3','4','5','6'],1,'Adenina, timina, citosina e guanina sono quattro.'],
['In quale anno fu concessa la Magna Carta?',['1066','1215','1492','1648'],1,'La Magna Carta fu concessa nel 1215.'],
['Qual è la valuta del Giappone?',['Won','Yuan','Yen','Baht'],2,'La valuta giapponese è lo yen.'],
['In quale Paese si trova il Kilimangiaro?',['Kenya','Tanzania','Etiopia','Uganda'],1,'Il Kilimangiaro si trova in Tanzania.'],
['Qual è l’unità SI della pressione?',['Pascal','Tesla','Weber','Volt'],0,'La pressione si misura in pascal.'],
['Qual è il più piccolo numero primo?',['0','1','2','3'],2,'2 è il più piccolo numero primo.'],
['A chi è tradizionalmente attribuita l’Odissea?',['Omero','Sofocle','Virgilio','Erodoto'],0,'L’Odissea è tradizionalmente attribuita a Omero.'],
['I Trattati di Roma che istituirono la CEE furono firmati in quale anno?',['1949','1957','1968','1973'],1,'I Trattati di Roma furono firmati nel 1957.'],
['In quale città nacque Mozart?',['Vienna','Salisburgo','Praga','Monaco'],1,'Mozart nacque a Salisburgo.']
],
hard:[
['Quale elemento ha numero atomico 74?',['Molibdeno','Tungsteno','Renio','Osmio'],1,'Il tungsteno, simbolo W, ha numero atomico 74.'],
['Qual è la capitale del Bhutan?',['Thimphu','Kathmandu','Paro','Dhaka'],0,'Thimphu è la capitale del Bhutan.'],
['La battaglia di Lepanto avvenne in quale anno?',['1453','1492','1571','1648'],2,'La battaglia di Lepanto ebbe luogo nel 1571.'],
['Quale discontinuità sismica separa crosta e mantello?',['Gutenberg','Mohorovičić','Lehmann','Conrad'],1,'La discontinuità di Mohorovičić segna il confine crosta-mantello.'],
['Qual è l’unità SI dell’attività catalitica?',['Becquerel','Katal','Siemens','Weber'],1,'L’attività catalitica si misura in katal.'],
['Chi compose il “Quartetto per la fine del Tempo”?',['Debussy','Messiaen','Ravel','Boulez'],1,'L’opera è di Olivier Messiaen.'],
['Chi risolse il problema di Basilea determinando la somma degli inversi dei quadrati?',['Gauss','Euler','Bernoulli','Lagrange'],1,'Euler trovò π²/6.'],
['Chi dipinse “Las Meninas”?',['Goya','Velázquez','El Greco','Murillo'],1,'Las Meninas è di Diego Velázquez.'],
['Chi fu la prima donna a ricevere un Premio Nobel?',['Marie Curie','Rosalind Franklin','Ada Lovelace','Lise Meitner'],0,'Marie Curie ricevette il Nobel per la Fisica nel 1903.'],
['Chi scrisse “L’uomo senza qualità”?',['Thomas Mann','Robert Musil','Hermann Hesse','Stefan Zweig'],1,'Il romanzo è di Robert Musil.'],
['A quale famiglia linguistica appartiene l’ungherese?',['Slava','Romanza','Uralica','Turca'],2,'L’ungherese appartiene alla famiglia uralica.'],
['Qual è la montagna più alta al di fuori dell’Asia?',['Denali','Aconcagua','Kilimangiaro','Elbrus'],1,'L’Aconcagua è la cima più alta fuori dall’Asia.'],
['Quale enzima digerisce principalmente le proteine nello stomaco?',['Amilasi','Pepsina','Lipasi pancreatica','Tripsina'],1,'La pepsina agisce nello stomaco sulle proteine.'],
['Quale particella media l’interazione elettromagnetica nel Modello Standard?',['Gluone','Fotone','Bosone W','Gravitone'],1,'L’interazione elettromagnetica è mediata dal fotone.'],
['Quale filosofo scrisse “Essere e tempo”?',['Heidegger','Husserl','Sartre','Jaspers'],0,'Essere e tempo è di Martin Heidegger.'],
['Quale imperatore romano emanò, con Licinio, l’Editto di Milano del 313?',['Augusto','Costantino','Teodosio','Diocleziano'],1,'L’editto è associato a Costantino e Licinio.'],
['In quale organello eucariotico avviene principalmente la fosforilazione ossidativa?',['Nucleo','Mitocondrio','Lisosoma','Perossisoma'],1,'Avviene sulla membrana mitocondriale interna.'],
['Quale matematico è associato alla trasformata che converte una funzione del tempo in frequenze?',['Fourier','Cauchy','Riemann','Noether'],0,'La trasformata di Fourier porta dal dominio temporale a quello delle frequenze.'],
['Quale romanzo di Bulgakov ha come figure centrali Woland, il Maestro e Margherita?',['Cuore di cane','Il Maestro e Margherita','Guardia bianca','Uova fatali'],1,'Sono personaggi de Il Maestro e Margherita.'],
['Quale ormone ipofisario stimola la tiroide?',['ACTH','TSH','FSH','GH'],1,'Il TSH stimola la ghiandola tiroidea.']
],
extreme:[
['Il teorema di Noether collega direttamente quali due concetti?',['Simmetrie continue e leggi di conservazione','Curvatura e massa','Entropia e informazione quantistica','Prime e zeri della zeta'],0,'Il teorema di Noether associa simmetrie continue a quantità conservate.'],
['Qual è l’entropia di Shannon di una variabile binaria con due esiti equiprobabili?',['0 bit','0,5 bit','1 bit','2 bit'],2,'Per due esiti con probabilità 1/2 l’entropia è 1 bit.'],
['Quale affermazione sintetizza il primo teorema di incompletezza di Gödel?',['Ogni teoria coerente è completa','Un sistema formale effettivamente assiomatizzato, coerente e sufficientemente espressivo contiene proposizioni indecidibili al suo interno','L’aritmetica è contraddittoria','Ogni proposizione vera è dimostrabile'],1,'Il teorema mostra che, sotto le opportune ipotesi di efficacia, coerenza ed espressività, esistono enunciati non dimostrabili né confutabili nel sistema.'],
['Il processo Haber-Bosch produce industrialmente soprattutto quale sostanza?',['Acido solforico','Ammoniaca','Metanolo','Cloro'],1,'Il processo sintetizza ammoniaca da azoto e idrogeno.'],
['Quale DNA polimerasi termostabile è storicamente associata alla PCR classica?',['Taq polimerasi','DNA polimerasi I di E. coli','RNA polimerasi II','Ligasi T4'],0,'La Taq polimerasi, da Thermus aquaticus, è termostabile.'],
['Chi completò la dimostrazione della congettura di Poincaré nei primi anni 2000?',['Andrew Wiles','Grigori Perelman','Terence Tao','Michael Atiyah'],1,'Grigori Perelman dimostrò la congettura usando il flusso di Ricci.'],
['La congettura di Riemann riguarda la parte reale di quali zeri della funzione zeta?',['Tutti gli zeri','Gli zeri banali','Gli zeri non banali','Solo gli zeri reali'],2,'Afferma che gli zeri non banali hanno parte reale 1/2.'],
['Qual è il commutatore canonico tra posizione x e quantità di moto p in meccanica quantistica?',['0','iħ','−iħ²','ħ/2'],1,'Il commutatore canonico è [x,p]=iħ.'],
['Il limite di Chandrasekhar riguarda la massa massima stabile di quale oggetto?',['Stella di neutroni','Nana bianca','Buco nero stellare','Gigante rossa'],1,'Il limite riguarda le nane bianche sostenute dalla degenerazione elettronica.'],
['Quale discontinuità separa mantello e nucleo esterno terrestre?',['Mohorovičić','Gutenberg','Lehmann','Conrad'],1,'La discontinuità di Gutenberg è al confine mantello-nucleo esterno.'],
['Quale criterio è associato alla fattorizzazione di una statistica sufficiente?',['Cramér-Rao','Fisher-Neyman','Kolmogorov-Smirnov','Bonferroni'],1,'Il teorema di fattorizzazione di Fisher-Neyman caratterizza statistiche sufficienti.'],
['Chi scrisse il romanzo “Pale Fire”?',['Vladimir Nabokov','Thomas Pynchon','Jorge Luis Borges','Samuel Beckett'],0,'Pale Fire è di Vladimir Nabokov.'],
['Chi compose l’opera “Wozzeck”?',['Alban Berg','Arnold Schönberg','Anton Webern','Paul Hindemith'],0,'Wozzeck è di Alban Berg.'],
['Quale ciclo metabolico ossida l’acetil-CoA producendo equivalenti riducenti?',['Ciclo dell’urea','Ciclo di Krebs','Via dei pentoso fosfati','Glicolisi'],1,'Il ciclo di Krebs ossida l’acetil-CoA.'],
['Chi dipinse “Gli ambasciatori” del 1533, celebre per il teschio anamorfico?',['Dürer','Holbein il Giovane','Bruegel il Vecchio','Cranach il Vecchio'],1,'Il dipinto è di Hans Holbein il Giovane.'],
['Quale relazione termodinamica esprime dU = T dS − P dV per un sistema semplice comprimibile?',['Relazione fondamentale','Legge di Boyle','Equazione di Clausius-Clapeyron','Legge di Wien'],0,'È una forma della relazione termodinamica fondamentale.'],
['Nella teoria dell’informazione, quale unità corrisponde a logaritmi naturali anziché in base 2?',['bit','nat','baud','hartley'],1,'Con logaritmi naturali l’informazione si misura in nat.'],
['Quale principio afferma che nessun algoritmo generale può decidere per ogni programma se terminerà?',['Problema dell’arresto','Principio di esclusione','Teorema di Bayes','Lemma di Zorn'],0,'L’indecidibilità del problema dell’arresto è un risultato fondamentale della computabilità.'],
['Quale struttura matematica richiede un’operazione associativa, un elemento neutro e un inverso per ogni elemento?',['Anello','Gruppo','Campo','Spazio vettoriale'],1,'Queste sono le proprietà essenziali di un gruppo, insieme alla chiusura.'],
['Nella relatività generale, quale tensore rappresenta la curvatura che compare direttamente nelle equazioni di campo di Einstein?',['Tensore di Einstein','Tensore metrico soltanto','Tensore elettromagnetico','Tensore di Levi-Civita'],0,'Le equazioni di campo usano il tensore di Einstein Gμν.']
]};
function startQuiz(level){const qs=shuffle(QUIZ[level]).slice(0,8);let i=0,score=0;app.innerHTML=gameShell('quiz',level,`<div class="progress"><span id="quizProg"></span></div><div id="quizBox"></div>`);startTimer();render();function render(){if(i>=qs.length){concludeSession('quiz',level,score,true,`Quiz concluso: <b>${score}/${qs.length*100}</b>.`);return}document.getElementById('quizProg').style.width=`${i/qs.length*100}%`;const [q,choices]=qs[i];document.getElementById('quizBox').innerHTML=`<div class="message">Domanda ${i+1}/${qs.length}</div><div class="quiz-q">${q}</div><div class="choices">${choices.map((c,j)=>`<button class="choice" data-j="${j}">${c}</button>`).join('')}</div><div id="quizExplain"></div>`;document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answer(+b.dataset.j))}function answer(j){const [q,choices,correct,explain]=qs[i];document.querySelectorAll('.choice').forEach((b,k)=>{b.disabled=true;if(k===correct)b.classList.add('correct');if(k===j&&j!==correct)b.classList.add('wrong')});if(j===correct)score+=100;document.getElementById('quizExplain').innerHTML=`<div class="message ${j===correct?'ok':'bad'}">${j===correct?'Corretto.':'Risposta errata.'} ${explain}</div><div class="actions"><button id="nextQuiz" class="primary">Avanti</button></div>`;document.getElementById('nextQuiz').onclick=()=>{i++;render()}}}

// ---------- Logica ----------
const LOGIC={
easy:[
['Completa la sequenza: 3, 7, 15, 31, …',['47','55','63','64'],2,'Ogni termine è il precedente ×2 +1: 31×2+1=63.'],
['Anna è più grande di Bruno. Carla è più giovane di Bruno. Diego è più grande di Anna. Chi è il più giovane?',['Anna','Bruno','Carla','Diego'],2,'L’ordine certo è Diego > Anna > Bruno > Carla.'],
['Completa: 4, 7, 6, 9, 8, 11, …',['9','10','12','14'],1,'La sequenza alterna +3 e −1: dopo 11 viene 10.'],
['Tutti i medici del gruppo sono laureati. Alcuni laureati del gruppo suonano il piano. Quale conclusione è certa?',['Alcuni medici suonano il piano','Tutti i pianisti sono medici','I medici sono laureati','Nessun medico suona il piano'],2,'La sola conclusione garantita dalle premesse è che i medici del gruppo sono laureati.'],
['Se CASA viene trasformata in DBTB spostando ogni lettera avanti di una posizione, come diventa LUNA?',['MVOB','MVOA','NVOB','MVPA'],0,'L→M, U→V, N→O, A→B.'],
['Un numero aumentato del suo doppio vale 36. Qual è il numero?',['9','10','12','18'],2,'x+2x=36, quindi 3x=36 e x=12.'],
['Quattro libri A, B, C, D sono in fila. A è prima di B; D è dopo B; C è prima di A. Quale libro è certamente primo?',['A','B','C','D'],2,'Dalle relazioni segue C < A < B < D.'],
['Un autobus parte ogni 12 minuti. Se uno parte alle 10:06, quale dei seguenti orari è una partenza?',['10:28','10:30','10:32','10:36'],1,'10:06 + 24 minuti = 10:30.'],
['Un rettangolo ha perimetro 30 cm e un lato di 6 cm. Quanto misura l’altro lato?',['7 cm','8 cm','9 cm','12 cm'],2,'2×(6+x)=30, quindi x=9.'],
['Tre scatole contengono rispettivamente 2, 4 e 8 gettoni. Sposti metà dei gettoni dalla scatola con 8 a quella con 2. Quanti gettoni avrà quest’ultima?',['4','6','8','10'],1,'Metà di 8 è 4; 2+4=6.'],
['Se ieri era due giorni prima di venerdì, che giorno è oggi?',['Mercoledì','Giovedì','Venerdì','Sabato'],1,'Due giorni prima di venerdì è mercoledì; oggi è giovedì.'],
['Quale numero non appartiene alla stessa regola degli altri?',['16','25','36','45'],3,'16, 25 e 36 sono quadrati perfetti; 45 non lo è.']
],
medium:[
['Completa: 2, 6, 12, 20, 30, …',['36','40','42','48'],2,'I termini sono n×(n+1): 1×2, 2×3, …, 6×7=42.'],
['Tre stampanti identiche producono 180 pagine in 4 minuti. Quante pagine producono 5 stampanti in 6 minuti?',['360','400','450','540'],2,'Ogni stampante produce 15 pagine/minuto; 5×6×15=450.'],
['Alle 2:20, qual è l’angolo minore tra le lancette di un orologio?',['40°','50°','60°','70°'],1,'La lancetta dei minuti è a 120°; quella delle ore a 70°; la differenza è 50°.'],
['Sei persone si stringono la mano una sola volta con ciascun’altra. Quante strette di mano avvengono?',['12','15','18','30'],1,'Le coppie sono 6×5/2=15.'],
['Dopo uno sconto del 20%, un oggetto costa 96 €. Qual era il prezzo iniziale?',['115 €','120 €','124 €','128 €'],1,'96 € rappresenta l’80% del prezzo: 96/0,8=120.'],
['Tre scatole sono etichettate “Mele”, “Arance”, “Misto”, ma tutte e tre le etichette sono sbagliate. Da quale scatola conviene estrarre per prima un frutto per poter correggere tutte le etichette?',['Mele','Arance','Misto','È indifferente'],2,'La scatola “Misto” non può essere mista: un solo frutto ne rivela il contenuto e consente di dedurre le altre due.'],
['Paolo è prima di Marta; Marta è prima di Luca; Sara è dopo Luca. Chi è certamente secondo?',['Paolo','Marta','Luca','Sara'],1,'L’ordine relativo obbligato è Paolo, Marta, Luca, Sara.'],
['Lanci tre monete equilibrate. Qual è la probabilità di ottenere esattamente due teste?',['1/4','3/8','1/2','5/8'],1,'Indicando con T testa e C croce, gli esiti favorevoli sono TTC, TCT e CTT: 3 su 8.'],
['In un codice ogni lettera avanza di 2 posizioni nell’alfabeto. CASA diventa ECUC. Come diventa LUNA?',['NWPC','NVPC','MWOB','NWQB'],0,'L→N, U→W, N→P, A→C.'],
['La somma di due numeri è 34 e la loro differenza è 8. Qual è il maggiore?',['18','19','20','21'],3,'x+y=34 e x−y=8: 2x=42, quindi x=21.'],
['Un treno percorre 150 km in 2 ore e 30 minuti a velocità media costante. Qual è la velocità media?',['50 km/h','60 km/h','65 km/h','75 km/h'],1,'2 ore e 30 minuti sono 2,5 ore; 150/2,5=60 km/h.'],
['Un sacchetto contiene 3 palline rosse e 2 blu. Estrai una pallina, la rimetti e ne estrai un’altra. Probabilità di due rosse?',['6/25','9/25','3/5','9/10'],1,'Con reinserimento: (3/5)×(3/5)=9/25.']
],
hard:[
['Cinque libri distinti sono disposti in fila. In quanti modi si possono ordinare se A e B non devono essere adiacenti?',['48','60','72','96'],2,'Le permutazioni totali sono 120; con A e B adiacenti sono 2×4!=48; quindi 120−48=72.'],
['Trova il più piccolo intero positivo che dà resto 2 diviso per 3, resto 3 diviso per 5 e resto 5 diviso per 7.',['53','68','83','103'],1,'68 mod 3=2, mod 5=3 e mod 7=5; nessun intero positivo minore soddisfa tutte e tre.'],
['Un numero di tre cifre ha somma delle cifre 9. La cifra delle decine è il doppio di quella delle centinaia. Invertendo le cifre il numero aumenta di 99. Qual è?',['234','243','342','423'],1,'243 ha somma 9, decine 4=2×2 e il rovescio 342 è maggiore di 99.'],
['Cinque persone A, B, C, D, E sono in fila. D è a un’estremità; B è immediatamente a sinistra di D; A è a sinistra di C; E non è a un’estremità; C è immediatamente a destra di E. Qual è l’ordine?',['A-E-C-B-D','E-A-C-B-D','A-B-E-C-D','D-B-A-E-C'],0,'I vincoli ammettono un solo ordine: A-E-C-B-D.'],
['Tre abitanti sono sempre sinceri o sempre bugiardi. A dice: “B e C sono dello stesso tipo”. B dice: “A mente”. C dice: “B dice la verità”. Chi è l’unico sincero?',['A','B','C','Nessuno'],0,'L’unica assegnazione coerente è A sincero, B e C bugiardi.'],
['Due dadi equilibrati sono lanciati sapendo che la somma è 8. Qual è la probabilità che almeno uno dei due mostri 3?',['1/5','2/5','1/2','3/5'],1,'Gli esiti ordinati con somma 8 sono cinque; (3,5) e (5,3) sono favorevoli: 2/5.'],
['Completa: 2, 3, 7, 22, 89, …',['356','445','446','534'],2,'Si moltiplica successivamente per 1,2,3,4 e si aggiunge 1; quindi 89×5+1=446.'],
['Alle 7:20 qual è l’angolo minore tra le lancette?',['90°','95°','100°','110°'],2,'La lancetta delle ore è a 220°, quella dei minuti a 120°: differenza 100°.'],
['Hai 9 monete identiche all’aspetto; una è più pesante. Con una bilancia a due piatti, quante pesate servono nel caso peggiore per identificarla?',['1','2','3','4'],1,'Dividi 9 in gruppi da 3: una pesata individua il gruppo, la seconda la moneta.'],
['Tutti i K sono L. Nessun L è M. Alcuni N sono K. Quale affermazione è necessariamente vera?',['Alcuni N non sono M','Nessun N è M','Tutti gli N sono L','Alcuni M sono N'],0,'Gli N che sono K sono anche L e quindi non possono essere M: almeno alcuni N non sono M.'],
['Un’urna contiene 5 palline rosse e 4 blu. Estrai due palline senza reinserimento. Qual è la probabilità che abbiano lo stesso colore?',['1/3','4/9','1/2','5/9'],1,'Casi favorevoli C(5,2)+C(4,2)=16; casi totali C(9,2)=36; 16/36=4/9.'],
['Un percorso ha archi A-B=4, A-C=7, B-C=1, B-D=5, C-D=2, D-E=3, C-E=8. Qual è il costo minimo da A a E?',['9','10','11','12'],1,'A-B-C-D-E costa 4+1+2+3=10, meno delle alternative.']
],
extreme:[
['Quattro case sono in fila. Anna vive nella rossa; Bruno beve tè; la verde è immediatamente a destra della blu; Carla è all’estrema destra; chi ha il cane beve caffè; l’uccello è nella casa blu; Diego vive accanto a chi ha il gatto; la gialla beve succo; il pesce è all’estrema sinistra; Diego non vive all’estrema sinistra. Chi possiede l’uccello?',['Anna','Bruno','Carla','Diego'],1,'I vincoli determinano un’unica disposizione: Anna, Bruno, Diego, Carla; l’uccello è di Bruno.'],
['Hai 12 monete; una è falsa e può essere più pesante o più leggera, senza sapere quale. Con una bilancia a due piatti, qual è il minimo numero di pesate che garantisce di identificarla e stabilire se è più pesante o più leggera?',['2','3','4','5'],1,'Il classico problema delle 12 monete è risolvibile in 3 pesate e non in 2.'],
['Sei persone distinte siedono attorno a un tavolo rotondo. In quanti modi possono sedersi se A e B non devono essere vicini?',['48','60','72','96'],2,'Le disposizioni circolari totali sono 5!=120; quelle con A e B adiacenti sono 2×4!=48; restano 72.'],
['Quattro persone devono attraversare un ponte di notte con una sola torcia. Impiegano 1, 2, 7 e 10 minuti; al massimo due alla volta e la coppia procede alla velocità del più lento. Qual è il tempo minimo?',['15','17','19','20'],1,'Strategia ottima: 1+2 (2), 1 torna (1), 7+10 (10), 2 torna (2), 1+2 (2): totale 17.'],
['Un codice usa tutte le cifre 1,2,3,4,5 una volta sola. Deve essere pari e la prima cifra deve essere maggiore dell’ultima. Quanti codici esistono?',['18','20','24','30'],2,'Enumerando le ultime cifre pari 2 o 4 e rispettando prima>ultima si ottengono 24 permutazioni valide.'],
['Nel problema delle tre porte di Monty Hall, dopo aver scelto una porta il conduttore apre sempre una porta perdente tra le altre e offre il cambio. Qual è la probabilità di vincere cambiando?',['1/3','1/2','2/3','3/4'],2,'La scelta iniziale è corretta con probabilità 1/3; cambiando si vince nei restanti 2/3 dei casi.'],
['Cinque dischi di dimensioni diverse devono essere spostati nella Torre di Hanoi con le regole classiche. Numero minimo di mosse?',['15','25','31','32'],2,'Il minimo è 2⁵−1=31.'],
['Un intero positivo n soddisfa n≡2 (mod 3), n≡3 (mod 5), n≡5 (mod 7). Qual è il secondo valore positivo che soddisfa tutte le congruenze?',['103','158','173','208'],2,'Le soluzioni sono congruenti a 68 modulo 105: 68, 173, 278, …; il secondo è 173.'],
['Due giocatori lanciano alternativamente una moneta equa; vince chi ottiene per primo testa. A lancia per primo. Qual è la probabilità che vinca A?',['1/2','3/5','2/3','3/4'],2,'p=1/2+(1/4)p, perché dopo due croci il gioco riparte nelle stesse condizioni; quindi p=2/3.'],
['Un grafo completo ha 7 vertici. Quanti archi contiene?',['14','18','21','28'],2,'Ogni coppia di vertici determina un arco: C(7,2)=21.'],
['Un numero AB di due cifre sommato al numero BA vale 121. A e B sono cifre non nulle e diverse. Quante coppie ordinate (A,B) sono possibili?',['6','7','8','9'],2,'11(A+B)=121, quindi A+B=11. Le coppie ordinate di cifre non nulle distinte che sommano 11 sono 8.'],
['Un’urna contiene 4 rosse, 3 blu e 2 verdi. Si estraggono 3 palline senza reinserimento. Quanti diversi insiemi di colori possono comparire con esattamente due colori presenti?',['2','3','4','6'],1,'Le coppie di colori possibili sono rosso-blu, rosso-verde e blu-verde: 3.']
]};
function startLogic(level){const qs=shuffle(LOGIC[level]).slice(0,8);let i=0,score=0;app.innerHTML=gameShell('logic',level,`<div class="progress"><span id="logicProg"></span></div><div id="logicBox"></div>`);startTimer();render();function render(){if(i>=qs.length){concludeSession('logic',level,score,true,`Sessione logica completata. Punteggio: <b>${score}/${qs.length*100}</b>.`);return}document.getElementById('logicProg').style.width=`${i/qs.length*100}%`;const [q,c]=qs[i];document.getElementById('logicBox').innerHTML=`<div class="logic-panel"><div class="logic-title"><h3>🧠 Enigma ${i+1}/${qs.length}</h3><span class="badge">${LEVEL_NAMES[level]}</span></div><div class="logic-meta"><span class="logic-chip">Tempo attivo</span><span class="logic-chip">Punteggio ${score}</span><span class="logic-chip">${level==='extreme'?'Più vincoli, più passaggi':'Una sola soluzione corretta'}</span></div><div class="quiz-q">${q}</div><div class="choices">${c.map((x,j)=>`<button class="choice" data-j="${j}">${x}</button>`).join('')}</div><div id="logicExplain"></div></div>`;document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>ans(+b.dataset.j))}function ans(j){const [q,c,ok,why]=qs[i];document.querySelectorAll('.choice').forEach((b,k)=>{b.disabled=true;if(k===ok)b.classList.add('correct');if(k===j&&j!==ok)b.classList.add('wrong')});if(j===ok)score+=100;document.getElementById('logicExplain').innerHTML=`<div class="message ${j===ok?'ok':'bad'}">${j===ok?'Corretto.':'Non è la soluzione.'} ${why}</div><div class="actions"><button id="logicNext" class="primary">Avanti</button></div>`;document.getElementById('logicNext').onclick=()=>{i++;render()}}}

// ---------- Escape Room 2.0: stanza a stati, piste parallele e inventario ----------
const ESCAPE_DESIGN={
  easy:{hints:4,labels:true,pulse:true,board:'Sulla lavagna: △=7 · ○=2 · ◇=4 · □=9',desk:'Sul retro di un foglio: II · IV · I · III. Una nota a matita aggiunge: “usa la cifra delle unità”.',monitor:'UNITÀ // ORDINE DAL FOGLIO'},
  medium:{hints:3,labels:true,pulse:true,board:'Sulla lavagna: △=7 · ○=2 · ◇=4 · □=9',desk:'Su un foglio strappato: II · IV · I · III',monitor:'SAFE // CIFRA DELLE UNITÀ'},
  hard:{hints:2,labels:false,pulse:true,board:'Lavagna: △+○=9 · ○+◇=6 · ◇−○=2 · □−△=2',desk:'Foglio: II / IV / I / III',monitor:'SAFE // U'},
  extreme:{hints:1,labels:false,pulse:false,board:'Lavagna: △+○=9 · ○+◇=6 · ◇−○=2 · □−△=2',desk:'Foglio macchiato: II  IV  I  III',monitor:'U // II IV I III'}
};
function startEscape(level){
  const cfg=ESCAPE_DESIGN[level]||ESCAPE_DESIGN.medium;
  let score=1000,hints=cfg.hints,selected=null;
  const inv=[];
  const flags={cabinet:false,battery:false,fuse:false,power:false,safe:false,uvLamp:false,keycard:false,uvReady:false,wall:false,escaped:false};
  const labels=cfg.labels?'':' no-labels',pulse=cfg.pulse?'':' no-pulse';
  app.innerHTML=gameShell('escape',level,`
  <div class="escape-v2${labels}${pulse}">
    <div class="escape-mission"><div><span class="mission-kicker">CASO 01</span><strong>Il laboratorio del professor Varzi</strong><small>La porta è bloccata. Esplora liberamente la stanza e trova una via d'uscita.</small></div><button id="escHint" class="secondary">💡 ${hints}</button></div>
    <div class="escape-room-v2" id="escapeRoomV2">
      <div class="escape-bg-v2"></div>
      <div class="ambient-beam beam1"></div><div class="ambient-beam beam2"></div>
      ${spot('board','Lavagna','hs2-board')}${spot('microscope','Microscopio','hs2-micro')}${spot('calendar','Calendario','hs2-calendar')}${spot('desk','Scrivania','hs2-desk')}${spot('shelf','Scaffale','hs2-shelf')}${spot('cabinet','Armadietto','hs2-cabinet')}${spot('power','Quadro','hs2-power')}${spot('monitor','Monitor','hs2-monitor')}${spot('safe','Cassaforte','hs2-safe')}${spot('wall','Parete','hs2-wall')}${spot('door','Porta','hs2-door')}
      <div id="cabinetDoor" class="cabinet-door-v2"></div>
      <div id="powerGlow" class="power-glow-v2"></div>
      <div id="safeDoor" class="safe-door-v2"></div>
      <div id="doorPanel" class="door-panel-v2"></div>
      <div id="uvWriting" class="uv-writing-v2">VARZI</div>
      <div class="dust-v2"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="escape-bottom-v2">
      <div class="inventory-v2"><div class="inventory-head"><div><strong>Inventario</strong><small id="selectedInfo">Seleziona un oggetto per usarlo</small></div><span id="escScore">${score} pt</span></div><div id="inventorySlots" class="inventory-slots-v2"><span class="inventory-empty">Vuoto</span></div></div>
      <div id="escapePanel" class="escape-panel-v2"><div class="escape-panel-placeholder"><b>Nessuna istruzione iniziale.</b><br>Tocca gli elementi della stanza e prendi appunti mentalmente.</div></div>
    </div>
  </div>`);
  startTimer();
  document.querySelectorAll('.room-spot-v2').forEach(b=>b.onclick=()=>inspect(b.dataset.spot));
  document.getElementById('escHint').onclick=()=>{if(!hints)return toast('Non hai altri indizi');hints--;score=Math.max(0,score-80);updateHud();const h=hintForState();show('Indizio',h,'💡')};
  function spot(id,label,cls){return `<button class="room-spot-v2 ${cls}" data-spot="${id}" aria-label="${label}"><span class="spot-ring">+</span><b>${label}</b></button>`}
  function updateHud(){document.getElementById('escScore').textContent=`${score} pt`;document.getElementById('escHint').textContent=`💡 ${hints}`}
  function hintForState(){
    if(!flags.cabinet)return level==='easy'?'Confronta l’ordine dei simboli osservato al microscopio con i valori della lavagna.':'Lavagna e microscopio parlano la stessa lingua.';
    if(!flags.fuse)return 'L’armadietto aperto contiene qualcosa che manca al quadro elettrico.';
    if(!flags.power)return 'Un oggetto dell’inventario può essere usato direttamente su un elemento della stanza.';
    if(!flags.safe)return 'Calendario, foglio della scrivania e monitor forniscono tre parti della stessa regola.';
    if(!flags.uvReady)return 'Due oggetti dell’inventario sembrano incompleti separatamente.';
    if(!flags.wall)return 'Una superficie apparentemente vuota potrebbe non esserlo sotto una luce diversa.';
    return 'La porta ha sia un lettore di tessere sia una tastiera.';
  }
  function inspect(id){if(flags.escaped)return;
    if(id==='board'){show('Lavagna',cfg.board,'🧮');return}
    if(id==='microscope'){show('Microscopio','Nel vetrino sono incisi quattro simboli, in quest’ordine:<div class="symbol-code">○ &nbsp; ◇ &nbsp; △ &nbsp; □</div>','🔬');return}
    if(id==='calendar'){show('Calendario','Sono cerchiati quattro giorni: <b>4 · 11 · 18 · 25</b>. Non ci sono altre annotazioni.','📅');return}
    if(id==='desk'){show('Scrivania',cfg.desk,'🗒️');return}
    if(id==='shelf'){
      if(!flags.battery){flags.battery=true;addItem('battery','🔋','Batteria');score+=40;updateHud();show('Scaffale','Dietro un volume trovi una batteria ancora carica. L’hai raccolta.','📚')}else show('Scaffale','Libri, vetreria e polvere. Non trovi altro di utile.','📚');return
    }
    if(id==='cabinet'){
      if(flags.cabinet){show('Armadietto aperto',flags.fuse?'È vuoto. Hai già preso il fusibile.':'Sul fondo c’è un fusibile.','🗄️');if(!flags.fuse)takeFuse();return}
      showCode('Armadietto','La serratura mostra quattro simboli: <b>○ ◇ △ □</b>. Inserisci il codice numerico.', '2479',()=>{flags.cabinet=true;score+=120;document.getElementById('cabinetDoor').classList.add('open');setTimeout(()=>{show('Armadietto aperto','All’interno c’è un <b>fusibile</b>.','🗄️');takeFuse()},450)});return
    }
    if(id==='power'){
      if(flags.power){show('Quadro elettrico','Le spie sono verdi. Il circuito è alimentato.','⚡');return}
      if(selected==='fuse'){removeItem('fuse');flags.power=true;score+=120;document.getElementById('powerGlow').classList.add('on');updateHud();show('Quadro elettrico','Il fusibile entra nello slot. Un relè scatta e l’impianto torna sotto tensione.','⚡');return}
      show('Quadro elettrico','Una sede portafusibile è vuota. Nessuna etichetta indica dove sia il ricambio.','⚡');return
    }
    if(id==='monitor'){
      if(!flags.power){show('Monitor','Nero. Nessun segnale di alimentazione.','🖥️');return}
      show('Monitor acceso',`Il terminale mostra soltanto:<div class="terminal-code">${cfg.monitor}</div>`, '🖥️');return
    }
    if(id==='safe'){
      if(flags.safe){show('Cassaforte aperta','Lo scomparto è aperto.','🔓');return}
      showCode('Cassaforte','Tastierino a quattro cifre. Non compare alcun suggerimento.', '1548',()=>{flags.safe=true;score+=180;document.getElementById('safeDoor').classList.add('open');addItem('uv','🔦','Lampada UV');flags.uvLamp=true;addItem('card','💳','Tessera');flags.keycard=true;updateHud();setTimeout(()=>show('Cassaforte aperta','Dentro trovi una <b>lampada UV senza batteria</b> e una <b>tessera magnetica</b>.','🔓'),420)});return
    }
    if(id==='wall'){
      if(selected==='uvReady'){flags.wall=true;score+=120;document.getElementById('uvWriting').classList.add('visible');show('Scritta invisibile','Sotto la luce UV compare una sola parola: <b>VARZI</b>.','🟣');return}
      show('Parete','Una zona della pittura è leggermente diversa dal resto, ma a occhio nudo non si legge nulla.','🧱');return
    }
    if(id==='door'){
      if(selected!=='card'){show('Porta blindata','Accanto alla maniglia ci sono un <b>lettore magnetico</b> e una <b>tastiera alfabetica</b>.','🚪');return}
      showPassword('Terminale porta','Tessera accettata. Inserisci la parola di autorizzazione.','VARZI',()=>{flags.escaped=true;score+=300;document.getElementById('doorPanel').classList.add('open');updateHud();setTimeout(()=>{endRecord('escape',level,score,true);show('Uscita sbloccata',`La serratura arretra e la porta si apre.<br><br><b>Punteggio ${score}</b> · ${fmtTime(Math.floor((Date.now()-activeStart)/1000))}`,'🏆')},850)});return
    }
  }
  function takeFuse(){if(flags.fuse)return;flags.fuse=true;addItem('fuse','⚙️','Fusibile');score+=40;updateHud()}
  function addItem(id,icon,label){if(inv.some(x=>x.id===id))return;inv.push({id,icon,label});renderInventory(true)}
  function removeItem(id){const i=inv.findIndex(x=>x.id===id);if(i>=0)inv.splice(i,1);if(selected===id)selected=null;renderInventory()}
  function renderInventory(animate=false){const el=document.getElementById('inventorySlots');el.innerHTML=inv.length?inv.map(x=>`<button class="inventory-item-v2 ${selected===x.id?'selected':''}" data-id="${x.id}"><span>${x.icon}</span><small>${x.label}</small></button>`).join(''):'<span class="inventory-empty">Vuoto</span>';el.querySelectorAll('.inventory-item-v2').forEach(b=>b.onclick=()=>selectItem(b.dataset.id));if(animate&&el.lastElementChild){el.lastElementChild.classList.add('item-enter');setTimeout(()=>el.lastElementChild?.classList.remove('item-enter'),500)}document.getElementById('selectedInfo').textContent=selected?`Selezionato: ${inv.find(x=>x.id===selected)?.label||''}`:'Seleziona un oggetto per usarlo'}
  function selectItem(id){
    if(selected&&selected!==id){const pair=new Set([selected,id]);if(pair.has('battery')&&pair.has('uv')){removeItem('battery');removeItem('uv');flags.uvReady=true;addItem('uvReady','🟣','UV attiva');selected='uvReady';score+=100;updateHud();renderInventory();show('Oggetti combinati','Inserisci la batteria nella lampada. La luce ultravioletta si accende.','🧰');return}}
    selected=selected===id?null:id;renderInventory();const item=inv.find(x=>x.id===id);if(item)show('Inventario',`${item.icon} <b>${item.label}</b><br><small>Selezionalo e poi prova a usarlo su un elemento della stanza, oppure seleziona un secondo oggetto per tentare una combinazione.</small>`,'🎒')
  }
  function show(title,html,icon=''){document.getElementById('escapePanel').innerHTML=`<div class="panel-head"><span>${icon}</span><strong>${title}</strong></div><div class="panel-body">${html}</div>`}
  function showCode(title,text,answer,onOk){document.getElementById('escapePanel').innerHTML=`<div class="panel-head"><span>🔢</span><strong>${title}</strong></div><div class="panel-body"><p>${text}</p><div class="code-pad"><input id="roomCode" inputmode="numeric" autocomplete="off" maxlength="4"><button id="roomCodeOk" class="primary">Conferma</button></div><div id="roomCodeMsg"></div></div>`;const inp=document.getElementById('roomCode');const check=()=>{if(norm(inp.value)===norm(answer))onOk();else{score=Math.max(0,score-35);updateHud();shakePanel();document.getElementById('roomCodeMsg').innerHTML='<div class="message bad">La serratura non reagisce.</div>'}};document.getElementById('roomCodeOk').onclick=check;inp.onkeydown=e=>{if(e.key==='Enter')check()};inp.focus()}
  function showPassword(title,text,answer,onOk){document.getElementById('escapePanel').innerHTML=`<div class="panel-head"><span>⌨️</span><strong>${title}</strong></div><div class="panel-body"><p>${text}</p><div class="answer-row"><input id="roomPass" autocomplete="off"><button id="roomPassOk" class="primary">Invia</button></div><div id="roomPassMsg"></div></div>`;const inp=document.getElementById('roomPass');const check=()=>{if(norm(inp.value)===norm(answer))onOk();else{score=Math.max(0,score-35);updateHud();shakePanel();document.getElementById('roomPassMsg').innerHTML='<div class="message bad">ACCESSO NEGATO</div>'}};document.getElementById('roomPassOk').onclick=check;inp.onkeydown=e=>{if(e.key==='Enter')check()};inp.focus()}
  function shakePanel(){const el=document.getElementById('escapePanel');el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}
}

// ---------- Partita mista ----------
function startMixed(level){const aq=shuffle(ANAGRAMS[level]).slice(0,2),qq=shuffle(QUIZ[level]).slice(0,2),lq=shuffle(LOGIC[level]).slice(0,2);const tasks=shuffle([
...aq.map(x=>({type:'text',title:'🔡 Anagramma',q:`Ricomponi: ${scramble(x[0])}${['hard','extreme'].includes(level)?'':` · ${x[1]}`}`,answer:x[0],why:`Soluzione: ${x[0]}`})),
...qq.map(x=>({type:'choice',title:'❓ Quiz',q:x[0],choices:x[1],correct:x[2],why:x[3]})),
...lq.map(x=>({type:'choice',title:'🧠 Logica',q:x[0],choices:x[1],correct:x[2],why:x[3]}))]).slice(0,6);let i=0,score=0;app.innerHTML=gameShell('mixed',level,`<div class="progress"><span id="mixProg"></span></div><div id="mixBox"></div>`);startTimer();render();function render(){if(i>=tasks.length){concludeSession('mixed',level,score,true,`Partita mista completata. Punteggio: <b>${score}/600</b>.`);return}const t=tasks[i];document.getElementById('mixProg').style.width=`${i/tasks.length*100}%`;if(t.type==='text')document.getElementById('mixBox').innerHTML=`<div class="message">Prova ${i+1}/6 · ${t.title}</div><div class="quiz-q">${t.q}</div><div class="answer-row"><input id="mixInput"><button id="mixOk" class="primary">Conferma</button></div>`;else document.getElementById('mixBox').innerHTML=`<div class="message">Prova ${i+1}/6 · ${t.title}</div><div class="quiz-q">${t.q}</div><div class="choices">${t.choices.map((c,j)=>`<button class="choice" data-j="${j}">${c}</button>`).join('')}</div><div id="mixWhy"></div>`;if(t.type==='text'){document.getElementById('mixOk').onclick=()=>{if(norm(document.getElementById('mixInput').value)===norm(t.answer)){score+=100;i++;render()}else toast('Non è corretto')};document.getElementById('mixInput').focus()}else document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const j=+b.dataset.j;document.querySelectorAll('.choice').forEach((x,k)=>{x.disabled=true;if(k===t.correct)x.classList.add('correct');if(k===j&&j!==t.correct)x.classList.add('wrong')});if(j===t.correct)score+=100;document.getElementById('mixWhy').innerHTML=`<div class="message ${j===t.correct?'ok':'bad'}">${t.why}</div><div class="actions"><button id="mixNext" class="primary">Avanti</button></div>`;document.getElementById('mixNext').onclick=()=>{i++;render()}})} }

// ---------- Sfida del giorno ----------
function dateSeed(){const d=new Date(),s=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);return s}
function seeded(seed){let x=seed%2147483647;if(x<=0)x+=2147483646;return()=>((x=x*16807%2147483647)-1)/2147483646}
function renderDaily(){const r=seeded(dateSeed()),games=['anagram','quiz','logic','mixed','wordsearch','escape'],game=games[Math.floor(r()*games.length)],levels=['easy','medium','hard','extreme'],level=levels[Math.floor(r()*levels.length)];setHeader('Sfida del giorno',`${LEVEL_NAMES[level]} · cambia ogni giorno`);app.innerHTML=`<div class="screen-theme home-theme" style="${paletteVars(getHomePalette())}"><section class="hero"><h2>⭐ ${GAME_NAMES[game]}</h2><p>La sfida di oggi è <b>${LEVEL_NAMES[level]}</b>. Sullo stesso dispositivo resta uguale per tutta la giornata.</p><div class="actions"><button class="primary" id="dailyStart">Inizia la sfida</button><button class="secondary" onclick="renderHome()">Torna alla Home</button></div></section></div>`;document.getElementById('dailyStart').onclick=()=>startGame(game,level,{trackSession:false})}

// ---------- Archivio locale ----------
function renderArchive(){stopTimer();setHeader('Archivio locale','Storico e backup sul dispositivo');const rows=store.history.slice(0,100);app.innerHTML=`
<div class="screen-theme home-theme" style="${paletteVars(getHomePalette())}">
<div class="stat-grid"><div class="stat"><b>${store.history.length}</b><span>Partite salvate</span></div><div class="stat"><b>${store.history.filter(x=>x.success).length}</b><span>Completate</span></div><div class="stat"><b>${Object.keys(store.stats).length}</b><span>Gioco/livello usati</span></div><div class="stat"><b>${store.history.reduce((m,x)=>Math.max(m,x.score||0),0)}</b><span>Record punti</span></div></div>
<div class="section-title"><h3>Backup</h3></div><div class="actions"><button id="exportBtn" class="primary">Esporta JSON</button><label class="secondary" style="text-align:center">Importa JSON<input id="importFile" type="file" accept="application/json" hidden></label><button id="clearBtn" class="secondary danger">Cancella archivio</button></div>
<div class="section-title"><h3>Ultime partite</h3><small>massimo 100 mostrate</small></div>
${rows.length?`<div style="overflow:auto"><table class="table"><thead><tr><th>Data</th><th>Gioco</th><th>Livello</th><th>Ciclo</th><th>Sessione</th><th>Esito</th><th>Punti</th><th>Tempo</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${new Date(x.date).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})}</td><td>${GAME_NAMES[x.game]||x.game}</td><td>${LEVEL_NAMES[x.level]||x.level}</td><td>${x.cycle||'—'}</td><td>${x.session||'—'}</td><td>${x.success?'✅':'—'}</td><td>${x.score}</td><td>${fmtTime(x.seconds||0)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Non ci sono ancora partite archiviate.</div>'}
<p class="footer-note">L'esportazione crea una copia del solo archivio giochi. L'importazione sostituisce l'archivio presente su questo dispositivo.</p></div>`;
document.getElementById('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`sala-giochi-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};document.getElementById('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(!obj||!Array.isArray(obj.history)||typeof obj.stats!=='object')throw new Error();store=normalizeStoreShape(obj);persist();toast('Backup importato');renderArchive()}catch{toast('File di backup non valido')}};document.getElementById('clearBtn').onclick=()=>{if(confirm('Cancellare definitivamente tutto lo storico locale?')){store=freshStore();persist();renderArchive()}}}


function renderSettings(){stopTimer();setHeader('Palette e aspetto','Home page e singoli giochi');app.innerHTML=`
<div class="screen-theme home-theme" style="${paletteVars(getHomePalette())}">
<section class="game-shell" style="background:var(--surface);color:var(--text)">
  <div class="section-title" style="margin-top:0"><h3>Palette Home</h3><small>Scelta globale per la pagina iniziale</small></div>
  <div class="palette-grid">${paletteSwatches(getHomePalette())}</div>
  <div class="section-title"><h3>Palette per ogni gioco</h3><small>Salvate in locale</small></div>
  <div class="settings-list">
    ${['mixed','sudoku','wordsearch','anagram','quiz','logic','escape'].map(game=>`<div class="setting-row"><div><strong>${ICONS[game]} ${GAME_NAMES[game]}</strong><small>Palette attuale: ${PALETTES[getGamePalette(game)].name}</small></div><select data-game="${game}" class="palette-select">${paletteOptions(getGamePalette(game))}</select></div>`).join('')}
  </div>
  <div class="actions" style="margin-top:18px"><button class="secondary" id="applyHomeToGames">Usa palette Home per tutti i giochi</button><button class="primary" onclick="renderHome()">Torna alla Home</button></div>
  <p class="footer-note">Le palette modificano l’aspetto grafico; le scelte vengono salvate solo su questo dispositivo insieme all’archivio locale.</p>
</section>
</div>`;
 document.querySelectorAll('.palette-select').forEach(sel=>sel.onchange=e=>{setGamePalette(e.target.dataset.game,e.target.value);renderSettings()});
 document.getElementById('applyHomeToGames').onclick=()=>{const key=getHomePalette();Object.keys(DEFAULT_GAME_PALETTES).forEach(g=>setGamePalette(g,key));renderSettings();toast('Palette applicata a tutti i giochi')}
}

if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderHome();
