"use strict";

/* Sala Giochi 2.0 — Rebus Archivio
   v2.13.1: un record reale di EurekaRebus, nessuna difficoltà artificiale. */
(() => {
  const REBUS_VERSION='2.13.1';
  const GAME_ID='rebus';
  const RECORD={
    id:'eureka-1869-rpc-001',
    solution:"NON VI SONO DIFFICOLTÀ A L'AMORE SINCERO",
    accepted:["NON VI SONO DIFFICOLTA A L AMORE SINCERO","NON VI SONO DIFFICOLTA ALL AMORE SINCERO"],
    firstReading:'N O N - viso - nodi - F fico - L T A A L - amo RE - S in cero',
    diagram:'3, 2, 4, 10, 1, 1, 5, 7',
    magazine:'RPC',
    year:'1869',
    image:'rebus_archivio_001.png',
    hint1:'Segui i gruppi nell’ordine in cui compaiono nella tavola: lettere, figure e relazioni vanno letti come un’unica sequenza.',
    hint2:'Gli ultimi due nuclei conducono a “AMORE” e “SINCERO”.'
  };

  GAME_NAMES[GAME_ID]='Rebus';
  ICONS[GAME_ID]='✒';
  DEFAULT_GAME_PALETTES[GAME_ID]='gold';
  LEVEL_NAMES.archive='Archivio';

  GAME_HELP[GAME_ID]={
    title:'Rebus · Archivio',
    goal:'Risolvi un rebus autentico partendo dalla tavola e dallo schema numerico.',
    steps:[
      'Osserva la tavola e lo schema numerico della soluzione.',
      'Scrivi la frase completa nel campo risposta e premi “Verifica”.',
      'Aiuto 1 e Aiuto 2 danno indizi progressivi senza spiegare le regole base del rebus.',
      '“Prima lettura” mostra la trascrizione archivistica del rebus.',
      '“Soluzione” rivela la frase finale.'
    ],
    tips:[
      'Questo prototipo usa un record reale dell’archivio EurekaRebus.',
      'Non vengono assegnate categorie di difficoltà perché il record non ne contiene una.',
      'La tavola è una ricostruzione grafica della prima lettura: non pretende di riprodurre l’illustrazione originale del 1869.'
    ]
  };

  window.startRebusArchive=function(){
    activeSaved=false;
    activeGame=GAME_ID;
    activeLevel='archive';
    activeSessionTracked=false;
    activeNoteKey=`rebus|archive|${RECORD.id}`;
    setHeader('Rebus','Archivio');
    renderRebusArchive();
  };

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[’']/g,' ').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}

  function renderRebusArchive(){
    stopTimer();
    const body=`<div class="rebus-db-layout">
      <section class="rebus-db-main">
        <div class="rebus-db-card">
          <div class="rebus-db-head">
            <div><span class="rebus-db-kicker">REBUS D’ARCHIVIO</span><h2>Record storico</h2><p>Fonte: EurekaRebus · ${esc(RECORD.magazine)} · ${esc(RECORD.year)}</p></div>
            <div class="rebus-db-diagram">(${esc(RECORD.diagram)})</div>
          </div>
          <button id="rebusDbZoomBtn" class="rebus-db-image-button" type="button" aria-label="Ingrandisci tavola">
            <img src="${esc(RECORD.image)}" alt="Tavola del rebus storico">
            <span>🔍 Ingrandisci</span>
          </button>
        </div>
      </section>

      <aside class="rebus-db-side">
        <div class="rebus-db-panel">
          <div class="rebus-db-score"><span>Punti disponibili</span><strong id="rebusDbScore">100</strong></div>
          <label for="rebusDbAnswer">La tua soluzione</label>
          <textarea id="rebusDbAnswer" rows="3" autocomplete="off" spellcheck="false" placeholder="Scrivi la frase completa..."></textarea>
          <div class="rebus-db-actions">
            <button id="rebusDbCheck" class="primary" type="button">✓ Verifica</button>
            <button id="rebusDbHint1" class="secondary" type="button">Aiuto 1</button>
            <button id="rebusDbHint2" class="secondary" type="button">Aiuto 2</button>
            <button id="rebusDbReading" class="secondary" type="button">Prima lettura</button>
            <button id="rebusDbSolution" class="secondary" type="button">Soluzione</button>
          </div>
          <div id="rebusDbFeedback" class="rebus-db-feedback" aria-live="polite">Osserva la tavola e prova a ricostruire la frase.</div>
        </div>
      </aside>
    </div>
    <dialog id="rebusDbZoom" class="rebus-db-zoom"><div><button id="rebusDbZoomClose" type="button">×</button><img src="${esc(RECORD.image)}" alt="Tavola ingrandita"></div></dialog>`;

    app.innerHTML=`<div class="screen-theme game-theme" style="${paletteVars(getGamePalette(GAME_ID))}"><section class="game-shell game-rebus"><div class="game-head"><div><span class="badge">✒ Rebus · Archivio</span></div></div><div class="game-utility-bar"><button class="utility-btn" onclick="openHelp()">ⓘ Come si gioca</button><button class="utility-btn notes-btn" onclick="openNotes()">📝 Taccuino</button></div>${body}</section></div>`;

    let score=100, solved=false, hint1=false, hint2=false, reading=false;
    const scoreEl=document.getElementById('rebusDbScore');
    const feedback=document.getElementById('rebusDbFeedback');
    const answer=document.getElementById('rebusDbAnswer');
    const zoom=document.getElementById('rebusDbZoom');
    const refresh=()=>scoreEl.textContent=score;
    const setFeedback=(html,cls='')=>{feedback.className='rebus-db-feedback'+(cls?' '+cls:'');feedback.innerHTML=html;};

    document.getElementById('rebusDbZoomBtn').onclick=()=>zoom.showModal();
    document.getElementById('rebusDbZoomClose').onclick=()=>zoom.close();
    zoom.addEventListener('click',e=>{if(e.target===zoom)zoom.close();});

    function check(){
      if(solved)return;
      const a=norm(answer.value);
      if(!a){setFeedback('Scrivi prima una soluzione.','warn');answer.focus();return;}
      const ok=RECORD.accepted.map(norm).includes(a);
      if(ok){
        solved=true;
        setFeedback(`<b>✓ Esatto</b><div class="rebus-db-solution">${esc(RECORD.solution)}</div><div class="rebus-db-reading"><b>Prima lettura:</b> ${esc(RECORD.firstReading)}</div>`,'ok');
        document.querySelectorAll('.rebus-db-actions button').forEach(b=>b.disabled=true);
        answer.disabled=true;
      }else{
        score=Math.max(10,score-8);refresh();setFeedback('Non è la soluzione archivistica. Riprova oppure usa un aiuto.','wrong');
      }
    }
    document.getElementById('rebusDbCheck').onclick=check;
    answer.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();check();}});

    document.getElementById('rebusDbHint1').onclick=()=>{
      if(!hint1){hint1=true;score=Math.max(10,score-10);refresh();}
      setFeedback(esc(RECORD.hint1),'hint');
    };
    document.getElementById('rebusDbHint2').onclick=()=>{
      if(!hint2){hint2=true;score=Math.max(10,score-15);refresh();}
      setFeedback(esc(RECORD.hint2),'hint');
    };
    document.getElementById('rebusDbReading').onclick=()=>{
      if(!reading){reading=true;score=Math.max(10,score-25);refresh();}
      setFeedback(`<b>Prima lettura</b><br>${esc(RECORD.firstReading)}`,'reading');
    };
    document.getElementById('rebusDbSolution').onclick=()=>{
      if(!confirm('Rivelare la soluzione?'))return;
      score=0;refresh();solved=true;
      setFeedback(`<b>Soluzione</b><div class="rebus-db-solution">${esc(RECORD.solution)}</div><div class="rebus-db-reading"><b>Prima lettura:</b> ${esc(RECORD.firstReading)}</div>`,'solution');
      document.querySelectorAll('.rebus-db-actions button').forEach(b=>b.disabled=true);
      answer.disabled=true;
    };
    answer.focus();
  }

  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');
    if(!grid)return;
    let btn=grid.querySelector('.art-rebus');
    if(btn){
      btn.onclick=()=>window.startRebusArchive();
      btn.innerHTML=`<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Archivio italiano · senza livelli</small>`;
      return;
    }
    btn=document.createElement('button');
    btn.className='sg2-classic-card art-rebus';
    btn.onclick=()=>window.startRebusArchive();
    btn.innerHTML=`<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Archivio italiano · senza livelli</small>`;
    const ncc=grid.querySelector('.art-nomicosacitta');
    if(ncc)ncc.after(btn);else grid.appendChild(btn);
  };

  const oldHome=renderHome;
  renderHome=function(){
    oldHome();
    const v=document.querySelector('.sg2-home-copy .sg2-eyebrow b');
    if(v)v.textContent=`v${REBUS_VERSION}`;
  };

  const oldClue=typeof currentClueText==='function'?currentClueText:null;
  if(oldClue)currentClueText=function(){
    if(activeGame===GAME_ID)return `Rebus archivio · (${RECORD.diagram})`;
    return oldClue();
  };

  renderHome();
})();
