"use strict";

/* Sala Giochi 2.0 — Rebus, prima serie
   v2.13.0: 12 tavole illustrate complete, 3 per livello. */
(() => {
  const VERSION='2.13.0';
  const GAME_ID='rebus';
  const PROGRESS_KEY='sala_giochi_rebus_serie1_v1';

  GAME_NAMES[GAME_ID]='Rebus';
  ICONS[GAME_ID]='✒';
  DEFAULT_GAME_PALETTES[GAME_ID]='gold';

  GAME_HELP[GAME_ID]={
    title:'Rebus',
    goal:'Ricostruisci la frase finale leggendo la scena, le azioni e le sigle stampate nella tavola.',
    steps:[
      'Osserva prima tutta la scena: figure, azioni e posizione delle sigle fanno parte del rebus.',
      'Lo schema numerico indica la lunghezza delle parole della soluzione finale.',
      'Scrivi la frase completa e premi “Controlla”. Maiuscole, accenti e apostrofi non sono obbligatori.',
      'Aiuto 1 orienta sulla scena; Aiuto 2 chiarisce il meccanismo senza dare tutta la risposta.',
      '“Prima lettura” mostra come si concatenano i segmenti del rebus; usala solo se sei bloccato.',
      'Dopo la soluzione puoi passare alla tavola successiva dello stesso livello.'
    ],
    tips:[
      'Punteggio iniziale: 100. Risposta errata −8, Aiuto 1 −12, Aiuto 2 −18, Prima lettura −25.',
      'Rivelare direttamente la soluzione chiude la tavola con 0 punti.',
      'Questa prima serie contiene 12 tavole: 3 per ciascun livello.'
    ]
  };

  const PUZZLES={
    easy:[
      {id:1,img:'rebus_01.jpg',title:'Nel parco',schema:'7, 2, 5',solution:'LEGGERE AL PARCO',aliases:[],
       help1:'La donna sta compiendo un’azione molto precisa; la sigla RE completa quella parola.',
       help2:'Dopo l’azione trovi AL e l’ambientazione della scena.',reading:'LEGGE + RE / AL / PARCO'},
      {id:2,img:'rebus_02.jpg',title:'Gatto goloso',schema:'8, 2, 9',solution:'ANNUSARE IL FORMAGGIO',aliases:[],
       help1:'Il gatto non sta mangiando: usa il naso. La sigla RE completa il verbo.',
       help2:'Dopo il verbo c’è IL; il grande alimento davanti al gatto dà l’ultima parola.',reading:'ANNUSA + RE / IL / FORMAGGIO'},
      {id:3,img:'rebus_03.jpg',title:'Partita insolita',schema:'7, 3, 5',solution:'GIOCARE COL LEONE',aliases:['GIOCARE CON IL LEONE'],
       help1:'Il tennista sta compiendo l’azione base del suo sport; RE completa il verbo.',
       help2:'COL è già indicato: l’ultimo soggetto è il grande felino sulla destra.',reading:'GIOCA + RE / COL / LEONE'}
    ],
    medium:[
      {id:4,img:'rebus_04.jpg',title:'Notizie in piazza',schema:'8, 2, 8',solution:'LEGGENDO IL GIORNALE',aliases:[],
       help1:'Osserva cosa fa l’uomo col quotidiano. La sigla NDO trasforma l’azione.',
       help2:'Dopo il gerundio viene IL e poi l’oggetto che tiene tra le mani.',reading:'LEGGE + NDO / IL / GIORNALE'},
      {id:5,img:'rebus_05.jpg',title:'Il cane e lo stivale',schema:'5, 6, 4, 7',solution:'DORME VICINO ALLO STIVALE',aliases:[],
       help1:'Il cane è sdraiato e tranquillo: descrivi prima ciò che sta facendo.',
       help2:'Le due targhette centrali danno la relazione spaziale con l’oggetto sulla destra.',reading:'DORME / VICINO / ALLO / STIVALE'},
      {id:6,img:'rebus_06.jpg',title:'Sul molo',schema:'7, 3, 4',solution:'PESCARE DAL MOLO',aliases:[],
       help1:'L’uomo usa una canna: la sua azione più naturale è il primo segmento.',
       help2:'RE completa il verbo; DAL precede il luogo da cui sta pescando.',reading:'PESCA + RE / DAL / MOLO'}
    ],
    hard:[
      {id:7,img:'rebus_07.jpg',title:'Concerto privato',schema:'9, 7, 4, 6',solution:'SUONATORE DAVANTI ALLA STATUA',aliases:[],
       help1:'Il musicista SUONA; la sigla TORE trasforma l’azione nel nome della persona.',
       help2:'Poi conta la posizione reciproca tra il musicista e la figura marmorea.',reading:'SUONA + TORE / DAVANTI / ALLA / STATUA'},
      {id:8,img:'rebus_08.jpg',title:'Verso la cima',schema:'7, 5, 2, 9',solution:'SALENDO VERSO LO STAMBECCO',aliases:[],
       help1:'L’escursionista SALE: aggiungi la sigla NDO.',
       help2:'VERSO LO è già indicato; resta da riconoscere l’animale di montagna.',reading:'SALE + NDO / VERSO / LO / STAMBECCO'},
      {id:9,img:'rebus_09.jpg',title:'In cucina',schema:'8, 3, 2, 7',solution:'CUOCENDO PER LA SIGNORA',aliases:[],
       help1:'Il cuoco CUOCE; la sigla NDO completa il gerundio.',
       help2:'PER LA introduce la persona sulla destra.',reading:'CUOCE + NDO / PER / LA / SIGNORA'}
    ],
    extreme:[
      {id:10,img:'rebus_10.jpg',title:'Il cavaliere',schema:'10, 5, 2, 5',solution:'CAVALCANDO VERSO IL POZZO',aliases:[],
       help1:'Il personaggio non è semplicemente “a cavallo”: descrivi l’azione che sta compiendo e aggiungi NDO.',
       help2:'La seconda targa indica la direzione; il manufatto di pietra sulla destra dà l’ultima parola.',reading:'CAVALCA + NDO / VERSO / IL / POZZO'},
      {id:11,img:'rebus_11.jpg',title:'Studio con compagnia',schema:'9, 2, 5, 3, 5',solution:'STUDIANDO IL MONDO COL GATTO',aliases:['STUDIANDO IL MONDO CON IL GATTO'],
       help1:'L’uomo STUDIA: la sigla NDO completa il gerundio.',
       help2:'IL introduce ciò che il globo rappresenta; COL introduce l’animale accanto a lui.',reading:'STUDIA + NDO / IL / MONDO / COL / GATTO'},
      {id:12,img:'rebus_12.jpg',title:'Sguardo sul mare',schema:'9, 2, 4, 2, 7',solution:'GUARDANDO IL MARE DA LONTANO',aliases:[],
       help1:'La donna osserva l’orizzonte: parti dal verbo GUARDA e aggiungi NDO.',
       help2:'IL introduce ciò che ha davanti; l’ultima targa completa la distanza della scena.',reading:'GUARDA + NDO / IL / MARE / DA / LONTANO'}
    ]
  };

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function norm(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[’']/g,' ').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
  function loadProgress(){try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')}catch{return{}}}
  function saveProgress(p){localStorage.setItem(PROGRESS_KEY,JSON.stringify(p))}
  function levelState(level){const p=loadProgress();p[level]??={next:0,solved:[],best:{}};return [p,p[level]]}

  const oldStartGame=startGame;
  startGame=function(game,level,opts={}){
    if(game!==GAME_ID)return oldStartGame(game,level,opts);
    activeSaved=false;activeGame=game;activeLevel=level;activeSessionTracked=false;
    activeNoteKey=noteKeyFor(game,level);
    setHeader(GAME_NAMES[game],LEVEL_NAMES[level]);
    const [p,s]=levelState(level);
    const pool=PUZZLES[level]||PUZZLES.easy;
    s.next=Math.max(0,Math.min(pool.length-1,s.next||0));saveProgress(p);
    renderPuzzle(level,s.next);
  };

  function renderPuzzle(level,index){
    stopTimer();activeStart=Date.now();startTimer();
    const pool=PUZZLES[level]||PUZZLES.easy;
    const q=pool[index%pool.length];
    let score=100,mistakes=0,used1=false,used2=false,usedReading=false,finished=false;
    const [progress,state]=levelState(level);
    const solvedCount=new Set(state.solved||[]).size;

    const body=`<div class="rebus-game">
      <section class="rebus-stage">
        <div class="rebus-stage-head"><div><span class="rebus-series">PRIMA SERIE · TAVOLA ${index+1}/3</span><h2>${esc(q.title)}</h2></div><div class="rebus-schema">${esc(q.schema)}</div></div>
        <button id="rebusZoomBtn" class="rebus-board" type="button" aria-label="Ingrandisci la tavola"><img src="${q.img}" alt="Rebus ${q.id}: ${esc(q.title)}"><span>🔍 Ingrandisci</span></button>
      </section>
      <aside class="rebus-play-panel">
        <div class="rebus-score-row"><span>Punti</span><strong id="rebusScore">100</strong><small>${solvedCount}/3 risolti</small></div>
        <label for="rebusAnswer">Soluzione</label>
        <input id="rebusAnswer" class="rebus-answer" autocomplete="off" autocapitalize="characters" placeholder="Scrivi la frase completa">
        <button id="rebusCheck" class="primary wide" type="button">Controlla</button>
        <div class="rebus-help-grid"><button id="rebusHelp1" class="secondary" type="button">Aiuto 1 · −12</button><button id="rebusHelp2" class="secondary" type="button">Aiuto 2 · −18</button><button id="rebusReading" class="secondary" type="button">Prima lettura · −25</button><button id="rebusReveal" class="secondary danger" type="button">Rivela soluzione</button></div>
        <div id="rebusFeedback" class="rebus-feedback">Osserva l’intera scena e usa lo schema ${esc(q.schema)}.</div>
      </aside>
    </div>
    <dialog id="rebusZoom" class="rebus-zoom"><div><button id="rebusZoomClose" type="button">×</button><img src="${q.img}" alt="Rebus ingrandito"></div></dialog>`;
    app.innerHTML=gameShell(GAME_ID,level,body);

    const answer=document.getElementById('rebusAnswer'),feedback=document.getElementById('rebusFeedback'),scoreEl=document.getElementById('rebusScore');
    const zoom=document.getElementById('rebusZoom');
    document.getElementById('rebusZoomBtn').onclick=()=>zoom.showModal();
    document.getElementById('rebusZoomClose').onclick=()=>zoom.close();
    zoom.onclick=e=>{if(e.target===zoom)zoom.close()};

    const refresh=()=>scoreEl.textContent=Math.max(0,score);
    const valid=v=>[q.solution,...(q.aliases||[])].some(x=>norm(x)===norm(v));
    const lock=()=>['rebusCheck','rebusHelp1','rebusHelp2','rebusReading','rebusReveal'].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=true});
    function finish(ok,revealed=false){
      if(finished)return;finished=true;stopTimer();lock();answer.disabled=true;
      const pts=revealed?0:Math.max(0,score);
      feedback.className=`rebus-feedback ${ok?'ok':'solution'}`;
      feedback.innerHTML=`<b>${ok?'✓ Soluzione corretta':'Soluzione'}</b><strong>${esc(q.solution)}</strong><span>Prima lettura: ${esc(q.reading)}</span><div class="rebus-finish-actions"><button id="rebusNext" class="primary" type="button">${index<2?'Tavola successiva →':'Risultato serie →'}</button><button id="rebusHome" class="secondary" type="button">Home</button></div>`;
      if(ok){const [p,s]=levelState(level);s.solved=[...new Set([...(s.solved||[]),q.id])];s.best??={};s.best[q.id]=Math.max(s.best[q.id]||0,pts);s.next=index<2?index+1:0;saveProgress(p);endRecord(GAME_ID,level,pts,true,{series:1,board:q.id});}
      else endRecord(GAME_ID,level,0,false,{series:1,board:q.id});
      document.getElementById('rebusNext').onclick=()=>{if(index<2)renderPuzzle(level,index+1);else renderSeriesResult(level)};
      document.getElementById('rebusHome').onclick=()=>renderHome();
    }
    function check(){
      const v=answer.value.trim();if(!v){feedback.textContent='Scrivi prima una soluzione.';answer.focus();return}
      if(valid(v)){finish(true,false);return}
      mistakes++;score=Math.max(10,score-8);refresh();feedback.className='rebus-feedback wrong';feedback.textContent=mistakes===1?'Non è ancora la frase giusta. Ricontrolla schema e sigle.':mistakes===2?'Ancora no: prova a leggere la scena come un verbo o una relazione, non solo come nomi di oggetti.':'Risposta non corretta. Puoi usare un aiuto o la prima lettura.';answer.select();
    }
    document.getElementById('rebusCheck').onclick=check;answer.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}};
    document.getElementById('rebusHelp1').onclick=()=>{if(used1)return;used1=true;score=Math.max(10,score-12);refresh();feedback.className='rebus-feedback hint';feedback.textContent=q.help1;document.getElementById('rebusHelp1').disabled=true};
    document.getElementById('rebusHelp2').onclick=()=>{if(used2)return;used2=true;score=Math.max(10,score-18);refresh();feedback.className='rebus-feedback hint';feedback.textContent=q.help2;document.getElementById('rebusHelp2').disabled=true};
    document.getElementById('rebusReading').onclick=()=>{if(usedReading)return;usedReading=true;score=Math.max(10,score-25);refresh();feedback.className='rebus-feedback reading';feedback.innerHTML=`<b>Prima lettura</b><br>${esc(q.reading)}`;document.getElementById('rebusReading').disabled=true};
    document.getElementById('rebusReveal').onclick=()=>{if(confirm('Rivelare la soluzione? Questa tavola terminerà con 0 punti.'))finish(false,true)};
    setTimeout(()=>answer.focus(),80);
  }

  function renderSeriesResult(level){
    stopTimer();const [p,s]=levelState(level);const pool=PUZZLES[level]||PUZZLES.easy;const solved=new Set(s.solved||[]);const best=s.best||{};const total=pool.reduce((a,q)=>a+(best[q.id]||0),0);
    app.innerHTML=resultShell(GAME_ID,level,`<div class="rebus-series-result"><div class="result-emblem">✒</div><div class="session-kicker">Prima serie · ${LEVEL_NAMES[level]}</div><h2>${solved.size===3?'Serie completata':'Serie in corso'}</h2><p>Hai risolto <b>${solved.size}/3</b> tavole. Miglior punteggio complessivo: <b>${total}/300</b>.</p><div class="rebus-result-grid">${pool.map((q,i)=>`<div><span>${i+1}</span><b>${esc(q.title)}</b><strong>${best[q.id]??'—'}</strong></div>`).join('')}</div><div class="actions"><button class="primary" onclick="startGame('rebus','${level}')">Gioca la serie</button><button class="secondary" onclick="renderHome()">Home</button></div></div>`);
  }

  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');if(!grid)return;
    let btn=grid.querySelector('.art-rebus');
    if(!btn){btn=document.createElement('button');btn.className='sg2-classic-card art-rebus';btn.onclick=()=>chooseDifficulty(GAME_ID);const ncc=grid.querySelector('.art-nomicosacitta');if(ncc)ncc.after(btn);else grid.appendChild(btn)}
    btn.innerHTML=`<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>12 tavole illustrate · 4 livelli</small>`;
  };

  const oldHome=renderHome;
  renderHome=function(){oldHome();const v=document.querySelector('.sg2-home-copy .sg2-eyebrow b');if(v)v.textContent=`v${VERSION}`};

  const oldClue=typeof currentClueText==='function'?currentClueText:null;
  if(oldClue)currentClueText=function(){if(activeGame===GAME_ID){const t=document.querySelector('.rebus-stage-head h2')?.textContent||'Rebus';const s=document.querySelector('.rebus-schema')?.textContent||'';return `${t} · schema ${s}`}return oldClue()};

  renderHome();
})();
