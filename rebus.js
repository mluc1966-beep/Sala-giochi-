"use strict";

/* Sala Giochi 2.0 — Rebus Atelier
   v2.12.1: 4 tavole campione illustrate, identiche alle anteprime approvate. */
(() => {
  const REBUS_VERSION='2.12.1';
  const GAME_ID='rebus';

  GAME_NAMES[GAME_ID]='Rebus';
  ICONS[GAME_ID]='✒';
  DEFAULT_GAME_PALETTES[GAME_ID]='gold';

  GAME_HELP[GAME_ID]={
    title:'Rebus Atelier',
    goal:'Valutare tavole illustrate complete, in stile enigmistica italiana classica, direttamente dentro l\'app.',
    steps:[
      'Scegli un livello per aprire una tavola campione reale, identica all’anteprima approvata.',
      'Tocca la tavola per ingrandirla a tutto schermo e verificare nitidezza e leggibilità.',
      'Usa Taccuino per annotare ipotesi, sillabe e possibili letture.',
      'Con Aiuto 1, Aiuto 2, Prima lettura e Soluzione puoi verificare il meccanismo proposto della tavola.',
      'Questa è una versione atelier: serve a validare qualità grafica e impostazione del gioco, prima di creare il pacchetto definitivo di rebus.'
    ],
    tips:[
      'Le tavole sono immagini complete: non vengono più ricostruite da piccoli SVG.',
      'La resa è pensata soprattutto per tablet, ma con zoom leggibile anche su smartphone.',
      'Dopo la tua approvazione, da qui si passerà a un primo set di rebus giocabili completi.'
    ]
  };

  const BOARDS={
    easy:{
      kicker:'Tavola campione',
      title:'Facile · Nel parco',
      img:'rebus_facile_nel_parco.png',
      schema:'(4, 5)',
      subtitle:'Prima prova di tavola classica con scena unica illustrata.',
      help1:'Concentrati sui due elementi marcati: il libro con la sigla “LI” e il cane con la lettera “C”.',
      help2:'La tavola è volutamente semplice: serve soprattutto a verificare la resa grafica della scena, del tratto e delle lettere integrate.',
      reading:'Bozza di lettura atelier: “LI + C + cane”.',
      solution:'Soluzione atelier provvisoria: tavola campione per validazione grafica. La lettura definitiva sarà fissata nella versione completa del gioco.'
    },
    medium:{
      kicker:'Tavola campione',
      title:'Medio · Nella piazza di paese',
      img:'rebus_italiano_nella_piazza_di_paese.png',
      schema:'(3, 5, 5)',
      subtitle:'Scena più ricca, con personaggi e più lettere distribuite nell’illustrazione.',
      help1:'Osserva i quattro nuclei principali: LA sul giornale, V sull’astuccio del musicista, P nel cesto della donna e GA presso il gatto.',
      help2:'Qui il rebus comincia a essere “di scena”: non conta solo l’oggetto, ma anche il ritmo con cui leggi gli elementi da sinistra a destra.',
      reading:'Bozza di lettura atelier: “LA + V + P + GA”, da integrare con i soggetti rappresentati.',
      solution:'Soluzione atelier provvisoria: tavola campione intermedia. In questa fase l’obiettivo è approvare il livello qualitativo della scena e della distribuzione delle lettere.'
    },
    hard:{
      kicker:'Tavola campione',
      title:'Difficile · Nel porto al chiaro di luna',
      img:'rebus_difficile_nel_porto_al_chiaro_di_luna.png',
      schema:'(4, 2, 6, 5)',
      subtitle:'Composizione adulta, atmosfera narrativa e più punti di lettura.',
      help1:'I marcatori principali sono P sul pescatore, RO nel mazzo di rose, LE sul baule e SC sulla scala.',
      help2:'In un rebus di questo tipo la scena non è decorativa: l’ambientazione portuale crea il tono, mentre i segmenti devono essere letti in successione coerente.',
      reading:'Bozza di lettura atelier: “P + RO + LE + SC”, integrata dalle figure e dalla scena.',
      solution:'Soluzione atelier provvisoria: tavola difficile di validazione. Serve a giudicare composizione, eleganza del tratto e densità enigmistica.'
    },
    extreme:{
      kicker:'Tavola campione',
      title:'Difficilissimo · In biblioteca',
      img:'rebus_difficilissimo_in_biblioteca.png',
      schema:'(5, 4, 3, 6, 4)',
      subtitle:'Tavola complessa con molti elementi, da usare come modello per il livello alto.',
      help1:'Leggi i gruppi evidenziati: P sul busto, LA sulla lampada, O sull’orologio, ST sul libro, M sul globo, R sull’armatura, G sulla gabbia, TI sul gatto, VA sul baule.',
      help2:'Qui il valore della tavola sta nella vera stratificazione visiva: molte figure, molta atmosfera, molte possibilità di costruzione enigmistica.',
      reading:'Bozza di lettura atelier: “P + LA + O + ST + M + R + G + TI + VA”.',
      solution:'Soluzione atelier provvisoria: tavola di riferimento per il livello difficilissimo. Dopo il tuo ok verranno fissate lettura e soluzione definitive in rebus completi.'
    }
  };

  const oldStartGame=startGame;
  startGame=function(game,level,opts={}){
    if(game!==GAME_ID) return oldStartGame(game,level,opts);
    activeSaved=false;
    activeGame=game;
    activeLevel=level;
    activeSessionTracked=false;
    activeNoteKey=noteKeyFor(game,level);
    setHeader(GAME_NAMES[game], LEVEL_NAMES[level]);
    renderBoard(level);
  };

  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function renderBoard(level){
    stopTimer(); activeStart=Date.now();
    const b=BOARDS[level] || BOARDS.easy;
    const body=`<div class="rebus-atelier">
      <section class="atelier-main">
        <div class="atelier-board-card">
          <div class="atelier-board-head">
            <div>
              <div class="atelier-kicker">${esc(b.kicker)}</div>
              <h2>${esc(b.title)}</h2>
              <p>${esc(b.subtitle)}</p>
            </div>
            <div class="atelier-schema">${esc(b.schema)}</div>
          </div>
          <button id="atelierZoomBtn" type="button" class="atelier-board-button" aria-label="Ingrandisci la tavola">
            <img src="${esc(b.img)}" alt="${esc(b.title)}">
            <span class="atelier-zoom-chip">🔍 Tocca per ingrandire</span>
          </button>
        </div>
      </section>

      <aside class="atelier-side">
        <div class="atelier-panel">
          <h3>Area di prova</h3>
          <p class="atelier-note">Questa è una <b>versione atelier</b>: serve a validare tavola, leggibilità e impostazione del gioco.</p>
          <label for="atelierAnswer">Ipotesi di soluzione</label>
          <input id="atelierAnswer" class="atelier-answer" autocomplete="off" placeholder="Scrivi qui la tua ipotesi...">
          <div class="atelier-actions">
            <button id="atelierCheck" class="primary" type="button">Controlla</button>
            <button id="atelierHelp1" class="secondary" type="button">Aiuto 1</button>
            <button id="atelierHelp2" class="secondary" type="button">Aiuto 2</button>
            <button id="atelierReading" class="secondary" type="button">Prima lettura</button>
            <button id="atelierSolution" class="secondary" type="button">Soluzione</button>
          </div>
          <div id="atelierFeedback" class="atelier-feedback">Usa questa schermata per valutare se la tavola funziona davvero dentro l’app.</div>
        </div>
      </aside>
    </div>
    <dialog id="atelierZoom" class="atelier-zoom-dialog">
      <div class="atelier-zoom-wrap">
        <button id="atelierZoomClose" class="atelier-zoom-close" type="button" aria-label="Chiudi">×</button>
        <img src="${esc(b.img)}" alt="${esc(b.title)} ingrandita">
      </div>
    </dialog>`;

    app.innerHTML=gameShell(GAME_ID,level,body);
    const feedback=document.getElementById('atelierFeedback');
    const answer=document.getElementById('atelierAnswer');
    const zoom=document.getElementById('atelierZoom');
    document.getElementById('atelierZoomBtn').onclick=()=> zoom.showModal();
    document.getElementById('atelierZoomClose').onclick=()=> zoom.close();
    zoom.addEventListener('click',(e)=>{ if(e.target===zoom) zoom.close(); });

    document.getElementById('atelierCheck').onclick=()=>{
      const val=(answer.value||'').trim();
      feedback.className='atelier-feedback';
      feedback.innerHTML= val
        ? 'Controllo automatico <b>disattivato volutamente</b> in questa versione atelier. Usa gli aiuti per valutare la tavola e il meccanismo.'
        : 'Prima scrivi almeno una tua ipotesi o una possibile lettura.';
    };
    document.getElementById('atelierHelp1').onclick=()=>{feedback.className='atelier-feedback'; feedback.textContent=b.help1;};
    document.getElementById('atelierHelp2').onclick=()=>{feedback.className='atelier-feedback'; feedback.textContent=b.help2;};
    document.getElementById('atelierReading').onclick=()=>{feedback.className='atelier-feedback atelier-reading'; feedback.innerHTML='<b>Prima lettura atelier</b><br>'+esc(b.reading);};
    document.getElementById('atelierSolution').onclick=()=>{feedback.className='atelier-feedback atelier-solution'; feedback.innerHTML='<b>Nota sulla soluzione</b><br>'+esc(b.solution);};
    answer.focus();
  }

  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');
    if(!grid || grid.querySelector('.art-rebus')) return;
    const btn=document.createElement('button');
    btn.className='sg2-classic-card art-rebus';
    btn.onclick=()=>chooseDifficulty(GAME_ID);
    btn.innerHTML=`<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Atelier · 4 tavole campione</small>`;
    const ncc=grid.querySelector('.art-nomicosacitta');
    if(ncc) ncc.after(btn); else grid.appendChild(btn);
  };

  const oldRenderHome=renderHome;
  renderHome=function(){
    oldRenderHome();
    const v=document.querySelector('.sg2-home-copy .sg2-eyebrow b');
    if(v) v.textContent=`v${REBUS_VERSION}`;
  };

  renderHome();
})();
