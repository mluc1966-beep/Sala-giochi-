'use strict';

/* Sala Giochi 2.0 — navigazione a famiglie + giochi Nuova generazione
   v2.10.0: tablet-first globale + Puzzle 2.0 con 100+ fotografie, filtri, anti-ripetizione e tessere variabili. */

(() => {
  const NEXTGEN_VERSION = '2.10.1';

  GAME_NAMES.fifteen = 'Gioco del 15';
  GAME_NAMES.picturepuzzle = 'Puzzle';
  ICONS.fifteen = '▦';
  ICONS.picturepuzzle = '🧩';
  SESSION_GAMES.add('fifteen');
  SESSION_GAMES.add('picturepuzzle');
  DEFAULT_GAME_PALETTES.fifteen = 'gold';
  DEFAULT_GAME_PALETTES.picturepuzzle = 'forest';

  GAME_NAMES.shiftline = 'SHIFTLINE';
  GAME_NAMES.lumina = 'LUMINA';
  GAME_NAMES.everybody = 'EVERYBODY IS RIGHT';
  GAME_NAMES.another = 'ANHOTHER WORLD';
  GAME_NAMES.alibi = "L'ULTIMO ALIBI";
  ICONS.shiftline = '⚡';
  ICONS.lumina = '✦';
  ICONS.everybody = '◎';
  ICONS.another = '◈';
  ICONS.alibi = '⌛';
  SESSION_GAMES.add('shiftline');
  SESSION_GAMES.add('lumina');
  SESSION_GAMES.add('everybody');
  SESSION_GAMES.add('another');
  SESSION_GAMES.add('alibi');
  DEFAULT_GAME_PALETTES.shiftline = 'ocean';
  DEFAULT_GAME_PALETTES.lumina = 'violet';
  DEFAULT_GAME_PALETTES.everybody = 'steel';
  DEFAULT_GAME_PALETTES.another = 'violet';
  DEFAULT_GAME_PALETTES.alibi = 'gold';

  GAME_HELP.fifteen = {
    title: 'Gioco del 15',
    goal: 'Riordina le quindici tessere numerate facendo scorrere una tessera alla volta nello spazio vuoto.',
    steps: [
      'Tocca una tessera adiacente allo spazio vuoto per farla scorrere.',
      'Ricostruisci l’ordine da 1 a 15, lasciando lo spazio vuoto in basso a destra.',
      'Puoi annullare le ultime mosse e, finché disponibili, chiedere un suggerimento.',
      'La difficoltà aumenta con un mescolamento iniziale più profondo e con meno suggerimenti.'
    ],
    example: 'Se lo spazio vuoto è accanto alla tessera 12, tocca 12: la tessera scorre e il vuoto prende il suo posto.',
    tips: [
      'Lavora prima sulle righe superiori e lascia le ultime due righe per la fase finale.',
      'Una configurazione nasce sempre da mosse legali partendo dalla tavola risolta: è quindi sempre risolvibile.',
      'Il numero di mosse incide sul punteggio, ma non esiste un limite che interrompa la partita.'
    ]
  };

  GAME_HELP.picturepuzzle = {
    title: 'Puzzle',
    goal: 'Ricostruisci l’immagine scegliendo foto o illustrazioni e una delle diverse forme di puzzle.',
    steps: [
      'Prima di iniziare scegli il tipo di immagini, la categoria e la modalità delle tessere.',
      'Classico usa una griglia regolare; Mosaico usa pezzi rettangolari di dimensioni diverse; Sagomato usa pezzi irregolari.',
      'Nel Classico tocca due tessere per scambiarle. In Mosaico e Sagomato seleziona un pezzo dal vassoio e poi il punto del quadro in cui pensi vada collocato.',
      'Il gioco ricorda le immagini usate di recente e cerca di non riproporle nelle sessioni successive.'
    ],
    tips: [
      'Sul tablet il puzzle sfrutta lo spazio orizzontale con immagine di riferimento, quadro e vassoio affiancati.',
      'Le fotografie vengono caricate dalla rete la prima volta e poi possono restare nella cache del dispositivo.',
      'Se una fotografia non è disponibile, il gioco passa automaticamente a un’illustrazione locale.'
    ]
  };

  GAME_HELP.shiftline = {
    title: 'SHIFTLINE',
    goal: 'Accendi l’intera rete collegando tutte le tessere in un unico circuito continuo.',
    steps: [
      'Tocca una tessera per ruotarla di 90°.',
      'Ogni tessera influenza anche altre tessere: il simbolo nell’angolo indica il tipo di effetto.',
      'Le linee luminose mostrano in tempo reale quali parti della rete sono già alimentate.',
      'La partita termina quando tutte le tessere sono collegate correttamente e l’energia raggiunge il nodo finale.'
    ],
    example: '↔ ruota insieme a una tessera vicina; ⇄ fa ruotare la tessera speculare in senso opposto; ✦ coinvolge anche le adiacenti; ⟲ combina rotazioni opposte sulle due direzioni.',
    tips: [
      'Non esiste un limite di mosse: puoi sperimentare liberamente.',
      '“Annulla” inverte esattamente l’ultima mossa.',
      'Ogni schema viene creato partendo da una configurazione risolta e poi mescolato con mosse legali.'
    ]
  };



  GAME_HELP.alibi = {
    title: "L'ULTIMO ALIBI",
    goal: 'Risolvi un vero giallo fair-play: identifica il colpevole e dimostra come, quando e perché ha commesso il delitto.',
    steps: [
      'Esamina la scena del crimine: ogni oggetto può essere innocuo, fuorviante oppure decisivo.',
      'Interroga tutti i sospetti. Per ciascuno trovi rapporto con la vittima, alibi e una osservazione sul caso.',
      'Ricostruisci la timeline mettendo gli eventi nell’ordine corretto. Il gioco ti dice soltanto quanti eventi sono fuori posto.',
      'Quando hai esaminato tutti gli elementi essenziali compare “Hai tutto ciò che serve”: da quel momento non verranno introdotti nuovi indizi decisivi.',
      'Formula l’accusa indicando colpevole, movente, metodo, trucco dell’alibi e prova decisiva.'
    ],
    example: 'Un testimone sente la voce della vittima alle 22:20. Sembra un alibi perfetto per chi era altrove a quell’ora; ma se quella voce provenisse da una registrazione, l’ora del delitto cambierebbe completamente.',
    tips: [
      'Il movente da solo non basta: più persone possono avere ottime ragioni per desiderare la morte della vittima.',
      'Gli alibi più forti sono spesso quelli da controllare con maggiore attenzione.',
      'Il generatore usa 30 meccanismi investigativi. Nei livelli alti può combinarne due e aggiungere depistaggi indipendenti.'
    ]
  };


  GAME_HELP.another = {
    title: 'ANHOTHER WORLD',
    goal: 'Scopri le leggi nascoste di un mondo che non obbedisce alle regole che conosci.',
    steps: [
      'Osserva gli eventi iniziali e confronta lo stato della stanza prima e dopo ogni sequenza.',
      'Seleziona le leggi che pensi siano attive: alcune azioni producono effetti indiretti o ritardati.',
      'Usa gli esperimenti per costruire una breve sequenza di azioni e vedere cosa accade partendo sempre dallo stesso stato.',
      'Quando hai identificato tutte le leggi, prevedi lo stato finale di una situazione mai vista.',
      'Nell’ultima fase usa le leggi scoperte per raggiungere uno stato-obiettivo con una sequenza scelta da te.'
    ],
    example: 'Muovi la sfera rossa e la lampada cambia stato. È una coincidenza? Ripeti l’esperimento modificando un solo elemento: il mondo risponderà sempre secondo le sue leggi.',
    tips: [
      'Gli esperimenti sono limitati: cambia una cosa alla volta quando vuoi isolare una causa.',
      'Un effetto può essere immediato, condizionale oppure comparire dopo l’azione successiva.',
      'La sfida finale non richiede la sequenza pensata dal gioco: qualsiasi sequenza che raggiunge davvero l’obiettivo viene accettata.'
    ]
  };


  GAME_HELP.everybody = {
    title: 'EVERYBODY IS RIGHT',
    goal: 'Costruisci una realtà in cui tutte le testimonianze possano essere vere contemporaneamente.',
    steps: [
      'Leggi le testimonianze: nessuno dei personaggi mente.',
      'Tocca un personaggio e poi un luogo per ricostruire dove poteva trovarsi all’ora indicata.',
      'Seleziona le assunzioni che stai probabilmente dando per scontate senza che nessuno le abbia davvero affermate.',
      'Per ogni testimonianza apparentemente impossibile scegli il collegamento nascosto che può renderla vera.',
      'Premi “Verifica realtà”: il gioco controlla i vincoli, non una singola sequenza preconfezionata.'
    ],
    example: 'Se Anna dice “ho visto Marco” e Marco era in un’altra stanza, non significa che qualcuno menta: Anna potrebbe averlo visto attraverso una vetrata, uno specchio o un monitor.',
    tips: [
      'Le tessere “Fatti dell’ambiente” non sono decorative: possono rendere possibile una testimonianza che sembra contraddittoria.',
      'Una ricostruzione diversa da quella generata dal gioco viene accettata se rispetta tutti i fatti e tutti i vincoli.',
      'Nei livelli alti possono esserci due contraddizioni apparenti indipendenti.'
    ]
  };

  GAME_HELP.lumina = {
    title: 'LUMINA',
    goal: 'Lascia che luce, particelle e correnti prendano forma attraverso i tuoi gesti.',
    steps: [
      'Tocca lo spazio per generare una nuova sorgente luminosa.',
      'Trascina il dito per creare una corrente che attira e devia le particelle.',
      'Usa i tre simboli in basso per cambiare il tipo di gesto: luce, fiore o vortice.',
      'Non esiste una soluzione obbligatoria: puoi restare nel mondo quanto vuoi e passare a un nuovo mondo quando ti va.'
    ],
    tips: [
      'Movimenti lenti creano strutture più morbide; gesti rapidi producono scie più energiche.',
      'Quando molte particelle convergono nello stesso punto può comparire spontaneamente una fioritura luminosa.',
      'Ogni sessione usa un seme diverso e sviluppa quindi un ecosistema visivo differente.'
    ]
  };

  const legacyStartGame = startGame;
  const legacyRenderArchive = typeof renderArchive === 'function' ? renderArchive : null;
  const legacyRenderSettings = typeof renderSettings === 'function' ? renderSettings : null;
  const legacyCurrentClueText = typeof currentClueText === 'function' ? currentClueText : null;
  if(legacyCurrentClueText){currentClueText=function(){if(activeGame==='everybody'){const f=document.querySelector('.eir-feedback'),t=document.querySelector('.eir-testimonies');return (f?.innerText||t?.innerText||'EVERYBODY IS RIGHT').trim()}if(activeGame==='another'){const f=document.querySelector('.aw-feedback'),o=document.querySelector('.aw-observations');return (f?.innerText||o?.innerText||'ANHOTHER WORLD').trim()}if(activeGame==='alibi'){const f=document.querySelector('.la-feedback'),e=document.querySelector('.la-evidence-grid'),w=document.querySelector('.la-suspects');return (f?.innerText||e?.innerText||w?.innerText||"L'ULTIMO ALIBI").trim()}return legacyCurrentClueText()}}

  const CLASSIC_GAMES = [
    ['mixed','Partita Mista','Sei prove diverse in una sola sessione','mix'],
    ['sudoku','Sudoku','Completa la griglia 9×9','sudoku'],
    ['wordsearch','Cerca-parole','Trova tutte le parole nascoste','word'],
    ['anagram','Anagrammi','Ricomponi le lettere','anagram'],
    ['quiz','Quiz','Cultura generale e curiosità','quiz'],
    ['logic','Logica','Sequenze, deduzioni e codici','logic'],
    ['fifteen','Gioco del 15','Riordina le quindici tessere','fifteen'],
    ['picturepuzzle','Puzzle','Ricostruisci l’immagine','picturepuzzle'],
    ['escape','Escape Room','Esplora, collega gli indizi, esci','escape']
  ];

  const NEXTGEN_GAMES = [
    ['shiftline','SHIFTLINE','Collega. Trasforma. Risolvi.','Puzzle logico','live'],
    ['lumina','LUMINA','Crea. Esplora. Rilassati.','Passatempo creativo','live'],
    ['everybody','EVERYBODY IS RIGHT','Tutti hanno ragione. Qual è la realtà?','Logica e deduzione','live'],
    ['another','ANHOTHER WORLD','Scopri le leggi di un mondo impossibile.','Esplorazione e logica','live'],
    ['alibi',"L'ULTIMO ALIBI",'Un giallo da risolvere.','Investigazione','live']
  ];

  function clearSG2Mode(){
    document.body.classList.remove('sg2-home','sg2-family','sg2-nextgen','sg2-classic','sg2-detail','sg2-lumina-play','sg2-everybody-play','sg2-another-play','sg2-alibi-play');
  }
  function setSG2Mode(...classes){
    clearSG2Mode();
    document.body.classList.add(...classes);
    stopTimer();
  }
  function bottomNav(active='home'){
    return `<nav class="sg2-bottom" aria-label="Navigazione principale">
      <button class="${active==='home'?'active':''}" onclick="renderHome()"><span>⌂</span><small>Home</small></button>
      <button class="${active==='archive'?'active':''}" onclick="sg2OpenArchive()"><span>▥</span><small>I miei giochi</small></button>
      <button onclick="sg2OpenSettings()"><span>⚙</span><small>Impostazioni</small></button>
    </nav>`;
  }
  function statsMini(){
    const total=store.history.length;
    const wins=store.history.filter(x=>x.success).length;
    return `<div class="sg2-mini-stats"><span><b>${total}</b> partite</span><span><b>${wins}</b> completate</span></div>`;
  }

  window.sg2OpenArchive=()=>{clearSG2Mode();legacyRenderArchive?.()};
  window.sg2OpenSettings=()=>{clearSG2Mode();legacyRenderSettings?.()};
  window.sg2OpenDaily=()=>{clearSG2Mode();renderDaily()};
  window.showNextGenSoon=(name)=>toast(`${name}: in sviluppo`);

  renderHome = function renderHomeV24(){
    activeSaved=false;
    setSG2Mode('sg2-home');
    setHeader('Sala Giochi','Sala giochi 2.0');
    const total=store.history.length;
    app.innerHTML=`<div class="sg2-shell sg2-home-screen">
      <section class="sg2-home-hero">
        <div class="sg2-home-copy">
          <span class="sg2-eyebrow">SALA GIOCHI <b>v${NEXTGEN_VERSION}</b></span>
          <h2>Sala giochi</h2>
          <p>Tanti giochi, un unico posto per divertirsi.</p>
          ${statsMini()}
        </div>
        <div class="sg2-home-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>
      <section class="sg2-family-choice" aria-label="Famiglie di giochi">
        <button class="sg2-family-card classic" onclick="renderClassicFamily()">
          <div class="sg2-family-art classic-art" aria-hidden="true"><span class="tile t1">S</span><span class="tile t2">A</span><span class="mini-grid"></span><span class="ball b1"></span><span class="ball b2"></span></div>
          <div class="sg2-family-copy"><span class="sg2-family-kicker">SEMPRE CON TE</span><h3>Giochi classici</h3><p>I tuoi giochi preferiti di sempre.</p></div>
          <span class="sg2-round-arrow">›</span>
        </button>
        <button class="sg2-family-card next" onclick="renderNextGenFamily()">
          <div class="sg2-family-art future-art" aria-hidden="true"><span class="future-ring r1"></span><span class="future-ring r2"></span><span class="future-core"></span><span class="future-line l1"></span><span class="future-line l2"></span></div>
          <div class="sg2-family-copy"><span class="sg2-family-kicker">NUOVA GENERAZIONE</span><h3>Nuova generazione</h3><p>Nuovi mondi da esplorare.</p></div>
          <span class="sg2-round-arrow">›</span>
        </button>
      </section>
      <p class="sg2-home-foot">${total?`I progressi restano salvati su questo dispositivo.`:'Scegli una famiglia e inizia a giocare.'}</p>
      ${bottomNav('home')}
    </div>`;
  };

  window.renderClassicFamily=function(){
    setSG2Mode('sg2-family','sg2-classic');
    setHeader('Giochi classici','I tuoi giochi preferiti di sempre');
    app.innerHTML=`<div class="sg2-shell sg2-classic-screen">
      <header class="sg2-family-header light">
        <button class="sg2-back" onclick="renderHome()" aria-label="Indietro">←</button>
        <div><span class="sg2-eyebrow">SALA GIOCHI</span><h2>Giochi classici</h2><p>I tuoi giochi preferiti di sempre.</p></div>
        <label class="sg2-desc-toggle">Descrizioni <input id="classicDescToggle" type="checkbox" checked><span></span></label>
      </header>
      <div class="sg2-classic-grid show-desc">
        ${CLASSIC_GAMES.map(([id,name,desc,art])=>`<button class="sg2-classic-card art-${art}" onclick="chooseDifficulty('${id}')"><span class="sg2-classic-icon">${ICONS[id]}</span><strong>${name}</strong><small>${desc}</small></button>`).join('')}
      </div>
      <button class="sg2-daily-strip" onclick="sg2OpenDaily()"><span>★</span><div><b>Sfida del giorno</b><small>Una prova diversa ogni giorno</small></div><i>›</i></button>
      ${bottomNav()}
    </div>`;
    const toggle=document.getElementById('classicDescToggle');
    toggle.onchange=()=>document.querySelector('.sg2-classic-grid')?.classList.toggle('show-desc',toggle.checked);
    document.querySelector('.sg2-classic-grid')?.classList.toggle('show-desc',toggle.checked);
  };

  function ngCard([id,name,payoff,category,status]){
    const liveHandlers={shiftline:'renderShiftlineDetail()',lumina:'renderLuminaDetail()',everybody:'renderEverybodyDetail()',another:'renderAnotherDetail()',alibi:'renderAlibiDetail()'};
    const click=status==='live' ? (liveHandlers[id]||`showNextGenSoon('${name.replace(/'/g,"\\'")}')`) : `showNextGenSoon('${name.replace(/'/g,"\\'")}')`;
    return `<button class="sg2-ng-card ${id} ${status}" onclick="${click}">
      <span class="sg2-ng-visual" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="sg2-ng-copy"><em>${category}</em><strong>${name}</strong><small>${payoff}</small></span>
      <span class="sg2-ng-state">${status==='live'?'GIOCA':'IN SVILUPPO'}</span><span class="sg2-round-arrow">›</span>
    </button>`;
  }

  window.renderNextGenFamily=function(){
    setSG2Mode('sg2-family','sg2-nextgen');
    setHeader('Nuova generazione','Esperienze uniche, mondi da scoprire');
    app.innerHTML=`<div class="sg2-shell sg2-nextgen-screen">
      <header class="sg2-family-header dark">
        <button class="sg2-back" onclick="renderHome()" aria-label="Indietro">←</button>
        <div><span class="sg2-eyebrow">SALA GIOCHI 2.0</span><h2>Nuova generazione</h2><p>Esperienze uniche, mondi da scoprire.</p></div>
        <div class="sg2-tech-mark" aria-hidden="true"><i></i><i></i><i></i></div>
      </header>
      <div class="sg2-ng-grid">${NEXTGEN_GAMES.map(ngCard).join('')}</div>
      ${bottomNav()}
    </div>`;
  };

  window.renderShiftlineDetail=function(){
    setSG2Mode('sg2-family','sg2-nextgen','sg2-detail');
    setHeader('SHIFTLINE','Puzzle logico');
    app.innerHTML=`<div class="sg2-shell sg2-detail-screen">
      <header class="sg2-detail-head"><button class="sg2-back" onclick="renderNextGenFamily()">←</button><span>NUOVA GENERAZIONE</span></header>
      <section class="sg2-shift-detail">
        <div class="sg2-shift-copy"><span class="sg2-eyebrow">PUZZLE LOGICO</span><h2>SHIFTLINE</h2><p class="tagline">Collega. Trasforma. Risolvi.</p><p>Ruota le tessere e ricostruisci la rete: ogni mossa può modificare anche altri nodi. Osserva le reazioni e porta energia all’intero circuito.</p>
          <div class="sg2-feature-row"><span>◎ Reazioni concatenate</span><span>↶ Annulla mosse</span><span>∞ 100 sessioni per livello</span></div>
          <h3>Scegli il livello</h3><div class="sg2-levels">${LEVEL_ORDER.map(l=>`<button onclick="startGame('shiftline','${l}')"><b>${LEVEL_NAMES[l]}</b><small>${difficultyMeta('shiftline',l)}</small></button>`).join('')}</div>
        </div>
        <div class="sg2-shift-preview" aria-label="Anteprima grafica di Shiftline"><span class="pnode a"></span><span class="pnode b"></span><span class="pnode c"></span><span class="pnode d"></span><span class="pline h1"></span><span class="pline v1"></span><span class="pline h2"></span><span class="pline v2"></span><span class="pulse"></span></div>
      </section>
      ${bottomNav()}
    </div>`;
  };


  window.renderLuminaDetail=function(){
    setSG2Mode('sg2-family','sg2-nextgen','sg2-detail');
    setHeader('LUMINA','Passatempo creativo');
    app.innerHTML=`<div class="sg2-shell sg2-detail-screen lumina-detail-screen">
      <header class="sg2-detail-head"><button class="sg2-back" onclick="renderNextGenFamily()">←</button><span>NUOVA GENERAZIONE</span></header>
      <section class="sg2-lumina-detail">
        <div class="sg2-lumina-copy"><span class="sg2-eyebrow">PASSATEMPO CREATIVO</span><h2>LUMINA</h2><p class="tagline">Crea. Esplora. Rilassati.</p><p>Un mondo di luce che prende vita con i tuoi gesti. Nessun punteggio da inseguire: disegna correnti, genera vortici e osserva ciò che nasce.</p>
          <div class="sg2-lumina-features"><span><b>✦</b> Interazione intuitiva</span><span><b>❀</b> Esperienza rilassante</span><span><b>◎</b> Mondi sempre diversi</span></div>
          <h3>Scegli l'intensità del mondo</h3><div class="sg2-levels lumina-levels">${LEVEL_ORDER.map(l=>`<button onclick="startGame('lumina','${l}')"><b>${LEVEL_NAMES[l]}</b><small>${({easy:'Sereno e rarefatto',medium:'Fluido e luminoso',hard:'Ricco e dinamico',extreme:'Cosmico e intenso'})[l]}</small></button>`).join('')}</div>
        </div>
        <div class="sg2-lumina-preview" aria-label="Anteprima grafica di Lumina"><div class="lumina-orb o1"></div><div class="lumina-orb o2"></div><div class="lumina-orb o3"></div><div class="lumina-wave w1"></div><div class="lumina-wave w2"></div><div class="lumina-hand">☝</div></div>
      </section>
      ${bottomNav()}
    </div>`;
  };


  window.renderEverybodyDetail=function(){
    setSG2Mode('sg2-family','sg2-nextgen','sg2-detail');
    setHeader('EVERYBODY IS RIGHT','Logica e deduzione');
    app.innerHTML=`<div class="sg2-shell sg2-detail-screen everybody-detail-screen">
      <header class="sg2-detail-head"><button class="sg2-back" onclick="renderNextGenFamily()">←</button><span>NUOVA GENERAZIONE</span></header>
      <section class="sg2-everybody-detail">
        <div class="sg2-everybody-copy"><span class="sg2-eyebrow">LOGICA E DEDUZIONE</span><h2>EVERYBODY<br>IS RIGHT</h2><p class="tagline">Nessuno mente. Eppure sembra impossibile.</p><p>Ricostruisci luoghi, relazioni e punti di vista finché tutte le testimonianze diventano compatibili. Il gioco non ti chiede di indovinare una risposta: devi costruire una realtà che funzioni.</p>
          <div class="sg2-everybody-features"><span><b>◉</b> Tutte le frasi sono vere</span><span><b>⌘</b> Ricostruzione libera</span><span><b>◇</b> Soluzioni alternative valide</span></div>
          <h3>Scegli la complessità</h3><div class="sg2-levels everybody-levels">${LEVEL_ORDER.map(l=>`<button onclick="startGame('everybody','${l}')"><b>${LEVEL_NAMES[l]}</b><small>${({easy:'3 persone · 1 paradosso',medium:'4 persone · più vincoli',hard:'5 persone · 2 paradossi',extreme:'6 persone · realtà molto ambigua'})[l]}</small></button>`).join('')}</div>
        </div>
        <div class="sg2-everybody-preview" aria-label="Anteprima di Everybody is Right"><div class="eir-orbit"></div><span class="eir-face f1">A</span><span class="eir-face f2">M</span><span class="eir-face f3">S</span><span class="eir-face f4">P</span><i class="eir-link l1"></i><i class="eir-link l2"></i><i class="eir-link l3"></i><div class="eir-core">TUTTI<br><b>VERI</b></div></div>
      </section>
      ${bottomNav()}
    </div>`;
  };


  window.renderAnotherDetail=function(){
    setSG2Mode('sg2-family','sg2-nextgen','sg2-detail');
    setHeader('ANHOTHER WORLD','Esplorazione e logica');
    app.innerHTML=`<div class="sg2-shell sg2-detail-screen another-detail-screen">
      <header class="sg2-detail-head"><button class="sg2-back" onclick="renderNextGenFamily()">←</button><span>NUOVA GENERAZIONE</span></header>
      <section class="sg2-another-detail">
        <div class="sg2-another-copy"><span class="sg2-eyebrow">ESPLORAZIONE E LOGICA</span><h2>ANHOTHER<br>WORLD</h2><p class="tagline">Le regole sono cambiate. Scopri come.</p><p>Entra in una stanza apparentemente normale e osserva ciò che non dovrebbe accadere. Formula ipotesi, sperimenta e usa le leggi scoperte per piegare il mondo a tuo favore.</p>
          <div class="sg2-another-features"><span><b>◉</b> Leggi nascoste</span><span><b>⌁</b> Esperimenti liberi</span><span><b>◇</b> Previsione e creatività</span></div>
          <h3>Scegli la complessità</h3><div class="sg2-levels another-levels">${LEVEL_ORDER.map(l=>`<button onclick="startGame('another','${l}')"><b>${LEVEL_NAMES[l]}</b><small>${({easy:'2 leggi · 7 esperimenti',medium:'3 leggi · 6 esperimenti',hard:'4 leggi · 5 esperimenti',extreme:'5 leggi · 4 esperimenti'})[l]}</small></button>`).join('')}</div>
        </div>
        <div class="sg2-another-preview" aria-label="Anteprima di Another World"><div class="aw-portal-ring r1"></div><div class="aw-portal-ring r2"></div><div class="aw-preview-room"><span class="aw-red"></span><span class="aw-blue"></span><span class="aw-lamp">✦</span><span class="aw-door"></span></div><div class="aw-preview-glitch">REALITY<br><b>≠</b><br>RULES</div></div>
      </section>
      ${bottomNav()}
    </div>`;
  };


  window.renderAlibiDetail=function(){
    setSG2Mode('sg2-family','sg2-nextgen','sg2-detail');
    setHeader("L'ULTIMO ALIBI",'Investigazione');
    app.innerHTML=`<div class="sg2-shell sg2-detail-screen alibi-detail-screen">
      <header class="sg2-detail-head"><button class="sg2-back" onclick="renderNextGenFamily()">←</button><span>NUOVA GENERAZIONE</span></header>
      <section class="sg2-alibi-detail">
        <div class="sg2-alibi-copy"><span class="sg2-eyebrow">GIALLO INVESTIGATIVO</span><h2>L'ULTIMO<br>ALIBI</h2><p class="tagline">Tutti hanno un motivo. Uno solo ha costruito l’alibi perfetto.</p><p>Esamina la scena, interroga i sospetti e ricostruisci gli eventi. Quando avrai visto tutto ciò che serve, il caso ti sfiderà apertamente: da quel momento la soluzione è nelle tue mani.</p>
          <div class="sg2-alibi-features"><span><b>30</b> Meccanismi investigativi</span><span><b>⌕</b> Indizi fair-play</span><span><b>⚖</b> Accusa completa</span></div>
          <h3>Scegli la complessità</h3><div class="sg2-levels alibi-levels">${LEVEL_ORDER.map(l=>`<button onclick="startGame('alibi','${l}')"><b>${LEVEL_NAMES[l]}</b><small>${({easy:'5 sospetti · 1 meccanismo',medium:'6 sospetti · possibili depistaggi',hard:'7 sospetti · 2 meccanismi',extreme:'8 sospetti · 2 meccanismi + depistaggi'})[l]}</small></button>`).join('')}</div>
        </div>
        <div class="sg2-alibi-preview" aria-label="Anteprima di L'Ultimo Alibi"><div class="la-preview-desk"><span class="paper p1"></span><span class="paper p2"></span><span class="glass"></span><span class="clock">22:17</span><span class="key">◆</span></div><div class="la-preview-lamp"></div><div class="la-preview-shadow"></div><div class="la-preview-title"><small>CASO RISERVATO</small><b>CHI<br>MENTE?</b></div></div>
      </section>
      ${bottomNav()}
    </div>`;
  };

  startGame = function startGameV25(game, level, opts = {}) {
    clearSG2Mode();
    if (!['shiftline','lumina','everybody','another','alibi','fifteen','picturepuzzle'].includes(game)) return legacyStartGame(game, level, opts);
    activeSaved = false;
    activeGame = game;
    activeLevel = level;
    activeSessionTracked = opts.trackSession !== false && SESSION_GAMES.has(game);
    if (activeSessionTracked) {
      const s = sessionState(game, level);
      if (s.cycleComplete) { renderCycleComplete(game, level); return; }
      activeRng = makeRng(sessionSeed(game, level));
    } else activeRng = Math.random;
    activeNoteKey = noteKeyFor(game, level);
    setHeader(GAME_NAMES[game], LEVEL_NAMES[level]);
    if(game==='shiftline') startShiftline(level);
    else if(game==='lumina') startLumina(level);
    else if(game==='everybody') startEverybody(level);
    else if(game==='another') startAnother(level);
    else if(game==='alibi') startAlibi(level);
    else if(game==='fifteen') startFifteen(level);
    else startPicturePuzzle(level);
  };

  const DIRS = [
    { bit: 1, dr: -1, dc: 0, opposite: 4, name: 'N' },
    { bit: 2, dr: 0, dc: 1, opposite: 8, name: 'E' },
    { bit: 4, dr: 1, dc: 0, opposite: 1, name: 'S' },
    { bit: 8, dr: 0, dc: -1, opposite: 2, name: 'W' }
  ];

  const SHIFT_CONFIG = {
    easy:    { size: 4, scramble: 12, kinds: ['link'], label: 'Legami gemelli' },
    medium:  { size: 5, scramble: 20, kinds: ['link', 'mirror'], label: 'Gemelli e specchi' },
    hard:    { size: 6, scramble: 30, kinds: ['link', 'mirror', 'pulse'], label: 'Reazioni concatenate' },
    extreme: { size: 6, scramble: 42, kinds: ['link', 'mirror', 'pulse', 'cross'], label: 'Rete instabile' }
  };

  const KIND_META = {
    link:   { symbol: '↔', name: 'Gemella', text: 'Ruota anche la compagna vicina nello stesso senso.' },
    mirror: { symbol: '⇄', name: 'Specchio', text: 'Ruota la tessera opposta in senso contrario.' },
    pulse:  { symbol: '✦', name: 'Impulso', text: 'Ruota anche le tessere adiacenti.' },
    cross:  { symbol: '⟲', name: 'Vortice', text: 'Orizzontali e verticali reagiscono in senso opposto.' }
  };

  function mod4(n) {
    return ((n % 4) + 4) % 4;
  }

  function rotateMask(mask, turns) {
    let m = mask;
    for (let k = 0; k < mod4(turns); k++) {
      m = ((m << 1) & 15) | ((m >> 3) & 1);
    }
    return m;
  }

  function snakePath(size) {
    const path = [];
    for (let r = 0; r < size; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < size; c++) path.push(r * size + c);
      } else {
        for (let c = size - 1; c >= 0; c--) path.push(r * size + c);
      }
    }
    return path;
  }

  function bitBetween(a, b, size) {
    const ar = Math.floor(a / size), ac = a % size;
    const br = Math.floor(b / size), bc = b % size;
    if (br === ar - 1 && bc === ac) return [1, 4];
    if (br === ar && bc === ac + 1) return [2, 8];
    if (br === ar + 1 && bc === ac) return [4, 1];
    if (br === ar && bc === ac - 1) return [8, 2];
    throw new Error('SHIFTLINE: path non adiacente');
  }

  function orthogonalNeighbors(index, size) {
    const r = Math.floor(index / size), c = index % size, out = [];
    for (const d of DIRS) {
      const rr = r + d.dr, cc = c + d.dc;
      if (rr >= 0 && rr < size && cc >= 0 && cc < size) out.push(rr * size + cc);
    }
    return out;
  }

  function partnerFor(index, size, kind) {
    const r = Math.floor(index / size), c = index % size;
    if (kind === 'mirror') {
      let p = size * size - 1 - index;
      if (p === index) p = c + 1 < size ? index + 1 : index - 1;
      return p;
    }
    if (c % 2 === 0 && c + 1 < size) return index + 1;
    if (c > 0) return index - 1;
    return r + 1 < size ? index + size : index - size;
  }

  function buildSolvedTiles(size, kinds) {
    const count = size * size;
    const masks = Array(count).fill(0);
    const path = snakePath(size);

    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      const [ab, ba] = bitBetween(a, b, size);
      masks[a] |= ab;
      masks[b] |= ba;
    }

    return masks.map((baseMask, index) => {
      const kind = kinds[Math.floor(activeRng() * kinds.length)];
      return {
        index,
        baseMask,
        rot: 0,
        kind,
        partner: partnerFor(index, size, kind)
      };
    });
  }

  function effectMap(state, index, direction = 1) {
    const tile = state.tiles[index];
    const changes = new Map();
    const add = (i, delta) => {
      if (i < 0 || i >= state.tiles.length) return;
      changes.set(i, (changes.get(i) || 0) + delta * direction);
    };

    add(index, 1);

    if (tile.kind === 'link') {
      add(tile.partner, 1);
    } else if (tile.kind === 'mirror') {
      add(tile.partner, -1);
    } else if (tile.kind === 'pulse') {
      orthogonalNeighbors(index, state.size).forEach(i => add(i, 1));
    } else if (tile.kind === 'cross') {
      const r = Math.floor(index / state.size), c = index % state.size;
      DIRS.forEach(d => {
        const rr = r + d.dr, cc = c + d.dc;
        if (rr < 0 || rr >= state.size || cc < 0 || cc >= state.size) return;
        add(rr * state.size + cc, d.dc !== 0 ? 1 : -1);
      });
    }

    return changes;
  }

  function applyEffect(state, index, direction = 1) {
    const changes = effectMap(state, index, direction);
    const affected = [];
    changes.forEach((delta, i) => {
      state.tiles[i].rot = mod4(state.tiles[i].rot + delta);
      affected.push(i);
    });
    return affected;
  }

  function maskAt(state, index) {
    const t = state.tiles[index];
    return rotateMask(t.baseMask, t.rot);
  }

  function networkState(state) {
    const size = state.size;
    const masks = state.tiles.map((_, i) => maskAt(state, i));
    const seen = new Set([state.source]);
    const queue = [state.source];

    while (queue.length) {
      const i = queue.shift();
      const r = Math.floor(i / size), c = i % size;
      for (const d of DIRS) {
        if (!(masks[i] & d.bit)) continue;
        const rr = r + d.dr, cc = c + d.dc;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const j = rr * size + cc;
        if (!(masks[j] & d.opposite)) continue;
        if (!seen.has(j)) {
          seen.add(j);
          queue.push(j);
        }
      }
    }

    let perfect = seen.size === state.tiles.length;
    if (perfect) {
      outer:
      for (let i = 0; i < state.tiles.length; i++) {
        const r = Math.floor(i / size), c = i % size;
        for (const d of DIRS) {
          if (!(masks[i] & d.bit)) continue;
          const rr = r + d.dr, cc = c + d.dc;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) {
            perfect = false;
            break outer;
          }
          const j = rr * size + cc;
          if (!(masks[j] & d.opposite)) {
            perfect = false;
            break outer;
          }
        }
      }
    }

    return { masks, seen, perfect };
  }

  function makeShiftline(level) {
    const cfg = SHIFT_CONFIG[level];
    const state = {
      level,
      size: cfg.size,
      tiles: buildSolvedTiles(cfg.size, cfg.kinds),
      source: snakePath(cfg.size)[0],
      target: snakePath(cfg.size).at(-1),
      moves: 0,
      resets: 0,
      history: [],
      finished: false,
      initialRotations: []
    };

    let guard = 0;
    do {
      state.tiles.forEach(t => { t.rot = 0; });
      for (let k = 0; k < cfg.scramble; k++) {
        const idx = Math.floor(activeRng() * state.tiles.length);
        applyEffect(state, idx, 1);
      }
      guard++;
    } while (networkState(state).perfect && guard < 12);

    // Sicurezza estrema: se una rara combinazione si ricompone, forza una mossa legale.
    if (networkState(state).perfect) applyEffect(state, 0, 1);

    state.initialRotations = state.tiles.map(t => t.rot);
    return state;
  }

  function lineSvg(mask) {
    const lines = [];
    if (mask & 1) lines.push('<path d="M50 50 L50 0"/>');
    if (mask & 2) lines.push('<path d="M50 50 L100 50"/>');
    if (mask & 4) lines.push('<path d="M50 50 L50 100"/>');
    if (mask & 8) lines.push('<path d="M50 50 L0 50"/>');
    return `<svg class="shift-wire" viewBox="0 0 100 100" aria-hidden="true">${lines.join('')}<circle cx="50" cy="50" r="8"/></svg>`;
  }

  function startShiftline(level) {
    const state = makeShiftline(level);
    const cfg = SHIFT_CONFIG[level];

    app.innerHTML = gameShell('shiftline', level, `
      <div class="shift-intro">
        <div><b>${cfg.label}</b><span>Ruota una tessera: la rete reagisce.</span></div>
        <div class="shift-goal"><span>●</span> accendi tutto <b>→</b> <span>◆</span></div>
      </div>
      <div class="shift-hud">
        <span>Energia <b id="shiftEnergy">0%</b></span>
        <span>Mosse <b id="shiftMoves">0</b></span>
        <span>Reset <b id="shiftResets">0</b></span>
      </div>
      <div class="shift-board-wrap">
        <div id="shiftBoard" class="shift-board" style="--shift-size:${state.size}"></div>
      </div>
      <div id="shiftLegend" class="shift-legend"></div>
      <div class="actions shift-actions">
        <button id="shiftUndo" class="secondary" type="button">↶ Annulla</button>
        <button id="shiftReset" class="secondary" type="button">⟳ Ripristina schema</button>
      </div>
      <div id="shiftMessage" class="shift-message">Tocca una tessera e osserva quali altre reagiscono.</div>
    `);

    const board = document.getElementById('shiftBoard');
    const undoBtn = document.getElementById('shiftUndo');
    const resetBtn = document.getElementById('shiftReset');

    const usedKinds = [...new Set(state.tiles.map(t => t.kind))];
    document.getElementById('shiftLegend').innerHTML = usedKinds.map(k => {
      const m = KIND_META[k];
      return `<span title="${m.text}"><b>${m.symbol}</b> ${m.name}</span>`;
    }).join('');

    undoBtn.onclick = () => {
      if (state.finished || !state.history.length) return;
      const idx = state.history.pop();
      const affected = applyEffect(state, idx, -1);
      state.moves = Math.max(0, state.moves - 1);
      render(affected);
    };

    resetBtn.onclick = () => {
      if (state.finished) return;
      state.tiles.forEach((t, i) => { t.rot = state.initialRotations[i]; });
      state.history.length = 0;
      state.resets++;
      render(state.tiles.map(t => t.index));
      document.getElementById('shiftMessage').textContent = 'Schema iniziale ripristinato.';
    };

    function render(affected = []) {
      const net = networkState(state);
      const affectedSet = new Set(affected);
      board.innerHTML = state.tiles.map((t, i) => {
        const powered = net.seen.has(i);
        const meta = KIND_META[t.kind];
        const marker = i === state.source ? '<span class="shift-node source">●</span>' : i === state.target ? '<span class="shift-node target">◆</span>' : '';
        return `<button class="shift-tile kind-${t.kind} ${powered ? 'powered' : ''} ${affectedSet.has(i) ? 'affected' : ''}" data-index="${i}" aria-label="Tessera ${i + 1}, ${meta.name}">
          <span class="shift-kind">${meta.symbol}</span>
          ${lineSvg(net.masks[i])}
          ${marker}
        </button>`;
      }).join('');

      board.querySelectorAll('.shift-tile').forEach(btn => {
        btn.onclick = () => {
          if (state.finished) return;
          const idx = Number(btn.dataset.index);
          state.history.push(idx);
          state.moves++;
          const changed = applyEffect(state, idx, 1);
          render(changed);
          checkWin();
        };
      });

      const pct = Math.round(net.seen.size / state.tiles.length * 100);
      document.getElementById('shiftEnergy').textContent = `${pct}%`;
      document.getElementById('shiftMoves').textContent = state.moves;
      document.getElementById('shiftResets').textContent = state.resets;
      undoBtn.disabled = !state.history.length;

      if (affected.length) {
        setTimeout(() => board.querySelectorAll('.affected').forEach(el => el.classList.remove('affected')), 260);
      }
    }

    function checkWin() {
      const net = networkState(state);
      if (!net.perfect || state.finished) return;
      state.finished = true;
      board.classList.add('solved');
      document.getElementById('shiftMessage').innerHTML = '<b>Rete completa.</b> Tutti i nodi sono alimentati.';
      const sec = Math.floor((Date.now() - activeStart) / 1000);
      const score = Math.max(100, 1800 - state.moves * 14 - state.resets * 80 - sec * 2);
      setTimeout(() => {
        concludeSession('shiftline', level, score, true, `Rete completata in <b>${state.moves}</b> mosse. Punteggio: <b>${score}</b>.`);
      }, 650);
    }

    render();
    startTimer();
  }


  // ---------- GIOCO DEL 15 ----------
  const FIFTEEN_CONFIG={
    easy:{scramble:24,hints:5,label:'Mescolamento leggero'},
    medium:{scramble:55,hints:3,label:'Mescolamento medio'},
    hard:{scramble:95,hints:1,label:'Mescolamento profondo'},
    extreme:{scramble:150,hints:0,label:'Mescolamento estremo'}
  };

  function fifteenSolved(board){return board.every((v,i)=>i===15?v===0:v===i+1)}
  function fifteenNeighbors(blank){
    const r=Math.floor(blank/4),c=blank%4,out=[];
    if(r>0)out.push(blank-4); if(r<3)out.push(blank+4);
    if(c>0)out.push(blank-1); if(c<3)out.push(blank+1);
    return out;
  }
  function fifteenDistance(board){
    let total=0;
    board.forEach((v,i)=>{if(!v)return;const target=v-1;total+=Math.abs(Math.floor(i/4)-Math.floor(target/4))+Math.abs((i%4)-(target%4))});
    return total;
  }
  function makeFifteen(level){
    const cfg=FIFTEEN_CONFIG[level],board=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
    let blank=15,last=-1;
    for(let k=0;k<cfg.scramble;k++){
      let options=fifteenNeighbors(blank).filter(x=>x!==last);
      if(!options.length)options=fifteenNeighbors(blank);
      const pick=options[Math.floor(activeRng()*options.length)];
      [board[blank],board[pick]]=[board[pick],board[blank]];
      last=blank;blank=pick;
    }
    if(fifteenSolved(board)){
      const pick=fifteenNeighbors(blank)[0];
      [board[blank],board[pick]]=[board[pick],board[blank]];
      blank=pick;
    }
    return {board,blank};
  }

  function startFifteen(level){
    setHeader('Gioco del 15',LEVEL_NAMES[level]);
    const cfg=FIFTEEN_CONFIG[level],made=makeFifteen(level),board=made.board;
    let blank=made.blank,moves=0,hints=cfg.hints,history=[],finished=false;
    app.innerHTML=gameShell('fifteen',level,`
      <div class="classic-mini-head"><div><span>PUZZLE NUMERICO</span><b>${cfg.label}</b></div><div class="classic-mini-stat"><small>MOSSE</small><strong id="fifteenMoves">0</strong></div></div>
      <div class="fifteen-wrap">
        <div id="fifteenBoard" class="fifteen-board" aria-label="Gioco del 15"></div>
        <div class="fifteen-target"><small>OBIETTIVO</small><div>${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n=>`<span>${n}</span>`).join('')}<span class="empty"></span></div></div>
      </div>
      <div class="actions fifteen-actions">
        <button id="fifteenUndo" class="secondary" disabled>↶ Annulla</button>
        <button id="fifteenHint" class="secondary" ${hints?'':'disabled'}>💡 Suggerimento (${hints})</button>
      </div>
      <div id="fifteenMsg" class="message">Tocca una tessera accanto allo spazio vuoto.</div>
    `);
    const el=document.getElementById('fifteenBoard'),msg=document.getElementById('fifteenMsg'),undo=document.getElementById('fifteenUndo'),hint=document.getElementById('fifteenHint');
    function moveTile(idx,record=true){
      if(finished||!fifteenNeighbors(blank).includes(idx))return false;
      const oldBlank=blank;
      if(record)history.push({idx,oldBlank});
      [board[blank],board[idx]]=[board[idx],board[blank]];
      blank=idx;
      if(record)moves++;
      render();
      if(fifteenSolved(board))win();
      return true;
    }
    function render(){
      el.innerHTML=board.map((v,i)=>v?`<button class="fifteen-tile ${v===i+1?'correct':''}" data-i="${i}" aria-label="Tessera ${v}">${v}</button>`:`<span class="fifteen-hole" aria-label="Spazio vuoto"></span>`).join('');
      el.querySelectorAll('button').forEach(b=>b.onclick=()=>moveTile(+b.dataset.i,true));
      document.getElementById('fifteenMoves').textContent=moves;
      undo.disabled=!history.length;
      hint.disabled=!hints;
      hint.textContent=`💡 Suggerimento (${hints})`;
    }
    undo.onclick=()=>{
      if(finished||!history.length)return;
      const h=history.pop();
      const currentBlank=blank;
      [board[currentBlank],board[h.oldBlank]]=[board[h.oldBlank],board[currentBlank]];
      blank=h.oldBlank;moves=Math.max(0,moves-1);render();msg.textContent='Ultima mossa annullata.';
    };
    hint.onclick=()=>{
      if(finished||!hints)return;
      const before=fifteenDistance(board),cands=fifteenNeighbors(blank);
      let best=cands[0],bestScore=Infinity;
      for(const idx of cands){
        [board[blank],board[idx]]=[board[idx],board[blank]];
        const d=fifteenDistance(board);
        [board[blank],board[idx]]=[board[idx],board[blank]];
        if(d<bestScore){bestScore=d;best=idx}
      }
      hints--;hint.textContent=`💡 Suggerimento (${hints})`;if(!hints)hint.disabled=true;
      const tile=board[best];msg.innerHTML=`Prova a muovere la tessera <b>${tile}</b>${bestScore<before?' per avvicinarti alla soluzione.':'. È una buona mossa per sbloccare la posizione.'}`;
      el.querySelector(`[data-i="${best}"]`)?.classList.add('hinted');
      setTimeout(()=>el.querySelector(`[data-i="${best}"]`)?.classList.remove('hinted'),900);
    };
    function win(){
      finished=true;const sec=Math.floor((Date.now()-activeStart)/1000);
      const score=Math.max(100,1800-moves*8-sec*2-(cfg.hints-hints)*25);
      msg.innerHTML=`<b>Completato.</b> Hai riordinato il Gioco del 15 in ${moves} mosse.`;
      setTimeout(()=>concludeSession('fifteen',level,score,true,`Tavola completata in <b>${moves}</b> mosse. Punteggio: <b>${score}</b>.`),650);
    }
    render();startTimer();
  }

  // ---------- PUZZLE 2.1 — TABLET FIRST, FOTO REALI ----------
  const PICTURE_PUZZLE_CONFIG={
    easy:{size:3,hints:4,mark:true,mosaicCount:9,label:'9 pezzi'},
    medium:{size:4,hints:3,mark:true,mosaicCount:12,label:'12–16 pezzi'},
    hard:{size:5,hints:1,mark:false,mosaicCount:18,label:'18–25 pezzi'},
    extreme:{size:6,hints:0,mark:false,mosaicCount:24,label:'24–36 pezzi'}
  };

  const PICTURE_CATEGORY_DEFS=[
    {id:'natura',label:'Natura',icon:'🌿',search:'landscape nature photograph'},
    {id:'citta',label:'Città',icon:'🏙️',search:'city street urban photograph'},
    {id:'animali',label:'Animali',icon:'🐾',search:'wildlife animal photograph'},
    {id:'cibo',label:'Cibo',icon:'🍽️',search:'food dish cuisine photograph'},
    {id:'architettura',label:'Architettura',icon:'🏛️',search:'architecture building photograph'},
    {id:'mare',label:'Mare',icon:'🌊',search:'sea coast beach photograph'},
    {id:'montagna',label:'Montagna',icon:'⛰️',search:'mountain alps landscape photograph'},
    {id:'fiori',label:'Fiori',icon:'🌸',search:'flower garden macro photograph'},
    {id:'oggetti',label:'Oggetti',icon:'🫖',search:'still life object photograph'}
  ];
  const PICTURE_TYPE_LABELS={mixed:'Miste',photo:'Solo fotografie',illustration:'Solo illustrazioni'};
  const PICTURE_MODE_LABELS={auto:'Automatico',classic:'Classico',mosaic:'Mosaico',shaped:'Sagomato'};
  const PICTURE_PREF_KEY='sg2_picture_prefs_v4';
  const PICTURE_RECENT_KEY='sg2_picture_recent_v4';
  const PICTURE_COMMONS_CACHE_PREFIX='sg2_commons_photos_v2_';
  const PICTURE_COMMONS_CACHE_MS=1000*60*60*24*30;

  function pictureIllustrationSvg(cat,index){
    const palettes={
      natura:['#143d2f','#4f9d69','#9bcf8f','#e8f5df'],citta:['#17233f','#4464ad','#d8a84e','#eef2f7'],
      animali:['#44352d','#9b6b43','#d6b07a','#f7ead8'],cibo:['#6e2636','#c5503d','#efa34a','#fff0c9'],
      architettura:['#24344d','#66788f','#d6c3a5','#f4efe6'],mare:['#064b77','#168aad','#76c9df','#e4f8ff'],
      montagna:['#263b46','#61776e','#b7cfbf','#eef5ef'],fiori:['#67238c','#d55e9f','#ff9eba','#fff1f6'],
      oggetti:['#313745','#75808d','#cc7a4d','#f0eadf']
    };
    const p=palettes[cat]||palettes.natura, v=(index-1)%4;
    const common=`<rect width="1200" height="800" fill="${p[3]}"/><rect x="38" y="38" width="1124" height="724" rx="34" fill="none" stroke="${p[1]}" stroke-width="5" opacity=".35"/>`;
    const scenes={
      natura:`<rect y="500" width="1200" height="300" fill="${p[2]}"/><circle cx="950" cy="150" r="85" fill="#f4c95d"/><path d="M0 520 L260 260 L470 520 L700 300 L980 520 Z" fill="${p[1]}"/><path d="M0 590 Q260 470 500 590 T1200 565 V800 H0Z" fill="${p[0]}"/>`,
      citta:`<rect y="610" width="1200" height="190" fill="${p[0]}"/><g fill="${p[1]}"><rect x="80" y="300" width="150" height="310"/><rect x="270" y="190" width="185" height="420"/><rect x="500" y="350" width="150" height="260"/><rect x="700" y="140" width="210" height="470"/><rect x="950" y="280" width="150" height="330"/></g><g fill="#ffd76a"><rect x="310" y="245" width="28" height="35"/><rect x="750" y="205" width="30" height="38"/><rect x="1010" y="345" width="28" height="34"/></g>`,
      animali:`<rect y="535" width="1200" height="265" fill="${p[2]}"/><ellipse cx="595" cy="425" rx="190" ry="120" fill="${p[1]}"/><circle cx="760" cy="345" r="88" fill="${p[1]}"/><path d="M710 285 l-55 -80 l100 55 M805 285 l70 -72 l-20 105" fill="${p[1]}"/><circle cx="790" cy="330" r="10" fill="${p[0]}"/><path d="M420 470 q-120 20 -155 105" fill="none" stroke="${p[1]}" stroke-width="38" stroke-linecap="round"/>`,
      cibo:`<rect width="1200" height="800" fill="${p[0]}"/><ellipse cx="600" cy="420" rx="365" ry="250" fill="#f7efe2"/><ellipse cx="600" cy="420" rx="275" ry="185" fill="${p[2]}"/><circle cx="515" cy="385" r="80" fill="#79a85b"/><circle cx="690" cy="360" r="72" fill="#d65f4a"/><path d="M430 510 Q600 390 780 520" fill="none" stroke="#f0d070" stroke-width="45" stroke-linecap="round"/>`,
      architettura:`<rect y="610" width="1200" height="190" fill="${p[2]}"/><path d="M220 300 L600 110 L980 300 Z" fill="${p[0]}"/><rect x="270" y="300" width="660" height="310" fill="${p[3]}"/><g fill="${p[1]}"><rect x="335" y="325" width="60" height="260"/><rect x="455" y="325" width="60" height="260"/><rect x="575" y="325" width="60" height="260"/><rect x="695" y="325" width="60" height="260"/><rect x="815" y="325" width="60" height="260"/></g>`,
      mare:`<rect width="1200" height="380" fill="#bde6f4"/><circle cx="930" cy="150" r="75" fill="#f6d36c"/><path d="M0 410 Q180 350 340 420 T680 410 T1020 430 T1200 400 V800 H0Z" fill="${p[1]}"/><path d="M0 520 Q170 455 340 530 T680 515 T1020 540 T1200 520 V800 H0Z" fill="${p[0]}" opacity=".78"/><path d="M130 650 Q430 580 700 680" fill="none" stroke="#f5e5b7" stroke-width="90"/>`,
      montagna:`<rect width="1200" height="800" fill="#dceaf0"/><path d="M40 650 L360 185 L565 650 Z" fill="${p[1]}"/><path d="M410 650 L780 120 L1120 650 Z" fill="${p[0]}"/><path d="M250 345 L360 185 L455 335 L395 310 L360 345 L325 315 Z M660 290 L780 120 L910 305 L830 270 L780 315 L735 275 Z" fill="#fff"/><rect y="650" width="1200" height="150" fill="${p[2]}"/>`,
      fiori:`<rect width="1200" height="800" fill="${p[3]}"/><g transform="translate(600 390)">${[0,60,120,180,240,300].map(a=>`<ellipse rx="85" ry="185" fill="${p[(a/60)%3]}" transform="rotate(${a}) translate(0 -115)" opacity=".9"/>`).join('')}<circle r="105" fill="#f1c84b"/></g><path d="M600 500 Q590 660 520 800" stroke="#4d8b57" stroke-width="32" fill="none"/>`,
      oggetti:`<rect width="1200" height="800" fill="${p[3]}"/><rect y="570" width="1200" height="230" fill="${p[2]}"/><rect x="285" y="290" width="250" height="280" rx="26" fill="${p[1]}"/><circle cx="410" cy="430" r="72" fill="${p[3]}"/><rect x="660" y="240" width="250" height="330" rx="34" fill="${p[0]}"/><rect x="715" y="305" width="140" height="205" rx="18" fill="${p[2]}"/>`
    };
    const title=(PICTURE_CATEGORY_DEFS.find(x=>x.id===cat)?.label||cat).toUpperCase();
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">${common}${scenes[cat]||scenes.natura}<rect x="54" y="670" width="420" height="76" rx="22" fill="rgba(255,255,255,.78)"/><text x="82" y="720" font-family="system-ui,sans-serif" font-size="38" font-weight="850" fill="${p[0]}">${title} ${v+1}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  const PICTURE_ILLUSTRATIONS=PICTURE_CATEGORY_DEFS.flatMap(cat=>
    Array.from({length:4},(_,i)=>({id:`illus-${cat.id}-${i+1}`,type:'illustration',category:cat.id,label:`${cat.label} · illustrazione ${i+1}`,url:pictureIllustrationSvg(cat.id,i+1)}))
  );

  function readPuzzlePrefs(){
    try{const p=JSON.parse(localStorage.getItem(PICTURE_PREF_KEY)||'{}');return{
      type:['mixed','photo','illustration'].includes(p.type)?p.type:'photo',
      category:PICTURE_CATEGORY_DEFS.some(x=>x.id===p.category)?p.category:'all',
      mode:['auto','classic','mosaic','shaped'].includes(p.mode)?p.mode:'auto'
    }}catch{return{type:'photo',category:'all',mode:'auto'}}
  }
  function savePuzzlePrefs(p){try{localStorage.setItem(PICTURE_PREF_KEY,JSON.stringify(p))}catch{}}
  function puzzleRecent(){try{const a=JSON.parse(localStorage.getItem(PICTURE_RECENT_KEY)||'[]');return Array.isArray(a)?a.slice(0,30):[]}catch{return[]}}
  function rememberPuzzleImage(id){try{const a=puzzleRecent().filter(x=>x!==id);a.unshift(id);localStorage.setItem(PICTURE_RECENT_KEY,JSON.stringify(a.slice(0,30)))}catch{}}
  function resolvePuzzleMode(level,mode){
    if(mode!=='auto')return mode;
    if(level==='easy')return 'classic';
    if(level==='medium')return activeRng()<.55?'classic':'mosaic';
    if(level==='hard')return activeRng()<.52?'mosaic':'shaped';
    return activeRng()<.48?'mosaic':'shaped';
  }
  function randomPuzzleCategory(){return PICTURE_CATEGORY_DEFS[Math.floor(activeRng()*PICTURE_CATEGORY_DEFS.length)]}
  function stripHtml(s=''){const d=document.createElement('div');d.innerHTML=s;return (d.textContent||'').trim()}
  function commonsCacheRead(cat){
    try{const o=JSON.parse(localStorage.getItem(PICTURE_COMMONS_CACHE_PREFIX+cat)||'null');if(!o||!Array.isArray(o.items))return null;if(Date.now()-o.time>PICTURE_COMMONS_CACHE_MS)return null;return o.items}catch{return null}
  }
  function commonsCacheWrite(cat,items){try{localStorage.setItem(PICTURE_COMMONS_CACHE_PREFIX+cat,JSON.stringify({time:Date.now(),items:items.slice(0,50)}))}catch{}}
  async function loadCommonsPhotos(catId,force=false){
    const def=PICTURE_CATEGORY_DEFS.find(x=>x.id===catId)||PICTURE_CATEGORY_DEFS[0];
    if(!force){const cached=commonsCacheRead(def.id);if(cached?.length>=12)return cached}
    const params=new URLSearchParams({
      action:'query',generator:'search',gsrnamespace:'6',gsrsearch:`${def.search} filetype:bitmap`,gsrlimit:'50',
      prop:'imageinfo',iiprop:'url|mime|size|extmetadata',iiurlwidth:'1200',
      iiextmetadatafilter:'Artist|LicenseShortName',format:'json',origin:'*'
    });
    const resp=await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`,{mode:'cors',credentials:'omit'});
    if(!resp.ok)throw new Error(`Commons HTTP ${resp.status}`);
    const data=await resp.json(),pages=Object.values(data?.query?.pages||{});
    const raw=pages.map(page=>{
      const ii=page?.imageinfo?.[0];if(!ii||ii.mime!=='image/jpeg')return null;
      const width=Number(ii.width||0),height=Number(ii.height||0),ratio=height?width/height:0;
      if(width<900||height<600||ratio<.90||ratio>2.0)return null;
      return {id:`commons-${page.pageid}`,type:'photo',category:def.id,label:(page.title||'Foto').replace(/^File:/,''),
        url:ii.thumburl||ii.url,sourceUrl:ii.descriptionurl||'',author:stripHtml(ii.extmetadata?.Artist?.value||''),license:stripHtml(ii.extmetadata?.LicenseShortName?.value||'Wikimedia Commons')};
    }).filter(Boolean);
    const unique=[...new Map(raw.map(x=>[x.id,x])).values()];
    if(unique.length<12){
      // Seconda ricerca più ampia, sempre limitata a JPEG fotografici.
      const p2=new URLSearchParams({action:'query',generator:'search',gsrnamespace:'6',gsrsearch:`${def.search.replace(/ photograph/g,'')} filetype:bitmap`,gsrlimit:'50',prop:'imageinfo',iiprop:'url|mime|size|extmetadata',iiurlwidth:'1200',iiextmetadatafilter:'Artist|LicenseShortName',format:'json',origin:'*'});
      const r2=await fetch(`https://commons.wikimedia.org/w/api.php?${p2.toString()}`,{mode:'cors',credentials:'omit'});
      if(r2.ok){const d2=await r2.json();for(const page of Object.values(d2?.query?.pages||{})){
        const ii=page?.imageinfo?.[0];if(!ii||ii.mime!=='image/jpeg')continue;const width=Number(ii.width||0),height=Number(ii.height||0),ratio=height?width/height:0;if(width<900||height<600||ratio<.90||ratio>2.0)continue;
        unique.push({id:`commons-${page.pageid}`,type:'photo',category:def.id,label:(page.title||'Foto').replace(/^File:/,''),url:ii.thumburl||ii.url,sourceUrl:ii.descriptionurl||'',author:stripHtml(ii.extmetadata?.Artist?.value||''),license:stripHtml(ii.extmetadata?.LicenseShortName?.value||'Wikimedia Commons')});
      }}
    }
    const items=[...new Map(unique.map(x=>[x.id,x])).values()].slice(0,50);
    if(items.length)commonsCacheWrite(def.id,items);
    return items;
  }
  function illustrationCandidates(category){return PICTURE_ILLUSTRATIONS.filter(x=>category==='all'||x.category===category)}
  function chooseFreshFromPool(pool){
    const recent=new Set(puzzleRecent()),fresh=pool.filter(x=>!recent.has(x.id)),pick=fresh.length?fresh:pool;
    return pick[Math.floor(activeRng()*pick.length)]||null;
  }
  async function choosePuzzleImageAsync(prefs,statusEl){
    if(prefs.type==='illustration')return chooseFreshFromPool(illustrationCandidates(prefs.category));
    const wantIllustration=prefs.type==='mixed'&&activeRng()<.18;
    if(wantIllustration)return chooseFreshFromPool(illustrationCandidates(prefs.category));
    const cat=prefs.category==='all'?randomPuzzleCategory():PICTURE_CATEGORY_DEFS.find(x=>x.id===prefs.category);
    statusEl&&(statusEl.textContent=`Cerco fotografie reali: ${cat.label}…`);
    const photos=await loadCommonsPhotos(cat.id);
    statusEl&&(statusEl.textContent=`${photos.length} fotografie reali disponibili in ${cat.label}.`);
    return chooseFreshFromPool(photos);
  }
  function preloadPuzzleImage(entry){
    return new Promise(resolve=>{if(!entry){resolve(null);return}const im=new Image();let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok?entry:null)};im.onload=()=>finish(true);im.onerror=()=>finish(false);const timer=setTimeout(()=>finish(false),10000);im.src=entry.url})
  }

  function startPicturePuzzle(level){
    setHeader('Puzzle',LEVEL_NAMES[level]);
    const prefs=readPuzzlePrefs(),session=sessionState('picturepuzzle',level);
    const categoryOptions=[`<option value="all">Tutte le categorie</option>`,...PICTURE_CATEGORY_DEFS.map(x=>`<option value="${x.id}" ${prefs.category===x.id?'selected':''}>${x.icon} ${x.label}</option>`)].join('');
    app.innerHTML=gameShell('picturepuzzle',level,`
      <div class="puzzle-setup tablet-card">
        <div class="puzzle-setup-copy">
          <span class="puzzle-kicker">PUZZLE 2.1 · SESSIONE ${session.session}/100</span>
          <h2>Scegli il tuo puzzle</h2>
          <p><b>Fotografie vere</b> cercate per categoria su Wikimedia Commons, più illustrazioni locali riconoscibili. Il sistema evita le ultime 30 immagini già usate.</p>
        </div>
        <div class="puzzle-filter-grid">
          <fieldset><legend>Immagini</legend><div class="puzzle-segment" data-pref="type">${Object.entries(PICTURE_TYPE_LABELS).map(([id,l])=>`<button type="button" data-value="${id}" class="${prefs.type===id?'active':''}">${l}</button>`).join('')}</div></fieldset>
          <fieldset><legend>Categoria</legend><select id="puzzleCategory">${categoryOptions}</select></fieldset>
          <fieldset class="puzzle-mode-field"><legend>Forma delle tessere</legend><div class="puzzle-mode-grid">${Object.entries(PICTURE_MODE_LABELS).map(([id,l])=>`<button type="button" data-mode="${id}" class="${prefs.mode===id?'active':''}"><b>${id==='classic'?'▦':id==='mosaic'?'▥':id==='shaped'?'⬡':'✦'}</b><span>${l}</span><small>${id==='auto'?'Cambia con il livello':id==='classic'?'Griglia regolare':id==='mosaic'?'Dimensioni diverse':'Profili irregolari'}</small></button>`).join('')}</div></fieldset>
        </div>
        <div class="puzzle-library-note"><span>📷 Foto reali</span><span>🗂 9 categorie</span><span>↻ ultime 30 escluse</span><span>▣ tablet first</span></div>
        <div id="puzzleSourceStatus" class="puzzle-source-status">Le fotografie vengono cercate nella categoria scelta solo quando premi “Crea il puzzle”.</div>
        <button id="puzzleStart" class="primary wide puzzle-start-btn">Crea il puzzle</button>
        <small class="puzzle-photo-note">Fonte fotografica: Wikimedia Commons. In modalità “Solo fotografie” un errore di rete viene segnalato: non viene più sostituito di nascosto con un’illustrazione.</small>
      </div>
    `);
    let current={...prefs};
    document.querySelectorAll('.puzzle-segment button').forEach(b=>b.onclick=()=>{current.type=b.dataset.value;document.querySelectorAll('.puzzle-segment button').forEach(x=>x.classList.toggle('active',x===b));savePuzzlePrefs(current)});
    document.getElementById('puzzleCategory').onchange=e=>{current.category=e.target.value;savePuzzlePrefs(current)};
    document.querySelectorAll('.puzzle-mode-grid button').forEach(b=>b.onclick=()=>{current.mode=b.dataset.mode;document.querySelectorAll('.puzzle-mode-grid button').forEach(x=>x.classList.toggle('active',x===b));savePuzzlePrefs(current)});
    document.getElementById('puzzleStart').onclick=async e=>{
      const btn=e.currentTarget,status=document.getElementById('puzzleSourceStatus');btn.disabled=true;btn.textContent='Preparo il puzzle…';savePuzzlePrefs(current);
      try{
        let pic=await choosePuzzleImageAsync(current,status);
        if(!pic)throw new Error('Nessuna immagine disponibile per questa categoria');
        const loaded=await preloadPuzzleImage(pic);
        if(!loaded)throw new Error(pic.type==='photo'?'La fotografia selezionata non è raggiungibile':'Immagine non disponibile');
        rememberPuzzleImage(pic.id);launchPicturePuzzle(level,pic,resolvePuzzleMode(level,current.mode));
      }catch(err){
        status.textContent=`⚠ ${err.message}. Riprova oppure scegli un'altra categoria.`;status.classList.add('error');
        btn.disabled=false;btn.textContent='Riprova';
      }
    };
  }

  function shufflePuzzleIds(n){
    const a=Array.from({length:n},(_,i)=>i);
    for(let i=a.length-1;i>0;i--){const j=Math.floor(activeRng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
    if(a.length>1&&a.every((v,i)=>v===i))[a[0],a[1]]=[a[1],a[0]];
    return a;
  }
  function puzzleCropStyle(region){
    const x=region.x,y=region.y,w=region.w,h=region.h;
    const sx=(100/Math.max(.001,w)).toFixed(3),sy=(100/Math.max(.001,h)).toFixed(3);
    const px=(x<=0||w>=1)?0:(x/(1-w)*100);
    const py=(y<=0||h>=1)?0:(y/(1-h)*100);
    return `background-size:${sx}% ${sy}%;background-position:${px.toFixed(3)}% ${py.toFixed(3)}%`;
  }
  function gridRegions(n){
    const out=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)out.push({x:c/n,y:r/n,w:1/n,h:1/n,row:r,col:c});
    return out;
  }
  function mosaicRegions(count){
    const regions=[{x:0,y:0,w:1,h:1}];
    while(regions.length<count){
      let idx=0,best=-1;
      regions.forEach((r,i)=>{const a=r.w*r.h;if(a>best){best=a;idx=i}});
      const r=regions.splice(idx,1)[0];
      let vertical=r.w/r.h>1.25?true:r.h/r.w>1.25?false:activeRng()<.5;
      const ratio=.39+activeRng()*.22;
      if(vertical){
        regions.push({x:r.x,y:r.y,w:r.w*ratio,h:r.h},{x:r.x+r.w*ratio,y:r.y,w:r.w*(1-ratio),h:r.h});
      }else{
        regions.push({x:r.x,y:r.y,w:r.w,h:r.h*ratio},{x:r.x,y:r.y+r.h*ratio,w:r.w,h:r.h*(1-ratio)});
      }
    }
    return regions.sort((a,b)=>a.y-b.y||a.x-b.x);
  }
  const SHAPES=[
    'polygon(4% 8%,88% 2%,98% 44%,92% 94%,49% 98%,3% 87%,0 42%)',
    'polygon(7% 0,96% 8%,91% 42%,100% 92%,54% 96%,8% 100%,0 55%)',
    'polygon(0 10%,47% 2%,96% 0,100% 54%,90% 100%,44% 94%,5% 100%)',
    'polygon(10% 3%,90% 0,100% 38%,94% 91%,62% 100%,4% 92%,0 43%)',
    'polygon(0 5%,43% 0,100% 9%,94% 53%,100% 94%,51% 100%,6% 91%)',
    'polygon(6% 6%,92% 0,100% 48%,91% 100%,50% 94%,0 100%,5% 47%)'
  ];

  function launchPicturePuzzle(level,pic,mode){
    const cfg=PICTURE_PUZZLE_CONFIG[level];
    if(mode==='classic')launchClassicPicturePuzzle(level,pic,cfg);
    else launchPlacementPicturePuzzle(level,pic,cfg,mode);
  }

  function puzzleCredit(pic){
    if(pic.type!=='photo')return '';
    const who=pic.author?` · ${esc(pic.author.slice(0,80))}`:'';
    const lic=pic.license?` · ${esc(pic.license)}`:'';
    const href=pic.sourceUrl?pic.sourceUrl.replace(/\"/g,'%22'):'';
    return `<small class="puzzle-credit">Foto: Wikimedia Commons${who}${lic}${href?` · <a href="${href}" target="_blank" rel="noopener">scheda</a>`:''}</small>`;
  }

  function puzzlePlayHeader(level,pic,mode,movesId){
    const cat=PICTURE_CATEGORY_DEFS.find(x=>x.id===pic.category)?.label||'Immagine';
    return `<div class="classic-mini-head puzzle-mini-head">
      <div><span>PUZZLE · ${PICTURE_MODE_LABELS[mode].toUpperCase()}</span><b>${esc(cat)} · ${esc(pic.type==='photo'?'Fotografia':'Illustrazione')}</b></div>
      <div class="classic-mini-stat"><small>MOSSE</small><strong id="${movesId}">0</strong></div>
    </div>`;
  }

  function launchClassicPicturePuzzle(level,pic,cfg){
    const count=cfg.size*cfg.size,ids=shufflePuzzleIds(count);
    let selected=null,moves=0,hints=cfg.hints,finished=false;
    app.innerHTML=gameShell('picturepuzzle',level,`
      ${puzzlePlayHeader(level,pic,'classic','picMoves')}
      <div class="picture-puzzle-layout puzzle-tablet-play">
        <aside class="picture-reference"><small>IMMAGINE COMPLETA</small><img src="${pic.url}" alt="Immagine completa di riferimento: ${esc(pic.label)}"><span>${esc(pic.label)}</span>${puzzleCredit(pic)}</aside>
        <div id="pictureBoard" class="picture-board" style="--puzzle-n:${cfg.size};--puzzle-img:url('${pic.url.replace(/'/g,"%27")}')" aria-label="Puzzle ${cfg.size} per ${cfg.size}"></div>
      </div>
      <div class="actions picture-actions">
        <button id="pictureHint" class="secondary" ${hints?'':'disabled'}>💡 Suggerimento (${hints})</button>
        <button id="pictureResetSelection" class="secondary" disabled>Annulla selezione</button>
      </div>
      <div id="pictureMsg" class="message">Tocca due tessere per scambiarle.</div>
    `);
    const board=document.getElementById('pictureBoard'),hint=document.getElementById('pictureHint'),cancel=document.getElementById('pictureResetSelection'),msg=document.getElementById('pictureMsg');
    function isSolved(){return ids.every((v,i)=>v===i)}
    function render(){
      const n=cfg.size,regions=gridRegions(n);
      board.innerHTML=ids.map((tile,pos)=>{
        const region=regions[tile],correct=tile===pos;
        return `<button class="picture-piece ${selected===pos?'selected':''} ${cfg.mark&&correct?'correct':''}" data-pos="${pos}" style="${puzzleCropStyle(region)}" aria-label="Tessera ${pos+1}"></button>`;
      }).join('');
      board.querySelectorAll('button').forEach(b=>b.onclick=()=>selectPiece(+b.dataset.pos));
      document.getElementById('picMoves').textContent=moves;cancel.disabled=selected===null;hint.disabled=!hints;hint.textContent=`💡 Suggerimento (${hints})`;
    }
    function selectPiece(pos){
      if(finished)return;
      if(selected===null){selected=pos;msg.textContent='Prima tessera selezionata. Ora scegli quella con cui scambiarla.';render();return}
      if(selected===pos){selected=null;msg.textContent='Selezione annullata.';render();return}
      [ids[selected],ids[pos]]=[ids[pos],ids[selected]];selected=null;moves++;render();
      if(isSolved())win();else msg.textContent='Scambio effettuato. Continua a ricomporre l’immagine.';
    }
    cancel.onclick=()=>{selected=null;render();msg.textContent='Selezione annullata.'};
    hint.onclick=()=>{
      if(!hints||finished)return;
      const wrong=ids.findIndex((v,i)=>v!==i);if(wrong<0)return;
      const targetPos=ids.indexOf(wrong);[ids[wrong],ids[targetPos]]=[ids[targetPos],ids[wrong]];
      hints--;moves++;selected=null;render();msg.textContent='Una tessera è stata rimessa nella posizione corretta.';if(isSolved())win();
    };
    function win(){
      finished=true;const sec=Math.floor((Date.now()-activeStart)/1000),score=Math.max(100,2100-moves*10-sec*2-(cfg.hints-hints)*45);
      msg.innerHTML=`<b>Immagine ricomposta.</b> ${moves} scambi.`;
      setTimeout(()=>concludeSession('picturepuzzle',level,score,true,`Puzzle ${esc(PICTURE_MODE_LABELS.classic)} completato in <b>${moves}</b> scambi. Punteggio: <b>${score}</b>.`),650);
    }
    render();startTimer();
  }

  function launchPlacementPicturePuzzle(level,pic,cfg,mode){
    const regions=mode==='mosaic'?mosaicRegions(cfg.mosaicCount):gridRegions(cfg.size);
    const order=shufflePuzzleIds(regions.length),placed=new Set();
    let selected=null,moves=0,hints=cfg.hints,finished=false,lastPlaced=null;
    app.innerHTML=gameShell('picturepuzzle',level,`
      ${puzzlePlayHeader(level,pic,mode,'picMoves')}
      <div class="puzzle-placement-layout" style="--puzzle-img:url(\'${pic.url.replace(/\'/g,"%27")}\')">
        <section class="puzzle-stage-column">
          <div class="picture-reference compact-ref"><small>RIFERIMENTO</small><img src="${pic.url}" alt="Immagine completa: ${esc(pic.label)}"><span>${esc(pic.label)}</span>${puzzleCredit(pic)}</div>
          <div id="puzzleTarget" class="puzzle-target-board ${mode}" style="--puzzle-img:url('${pic.url.replace(/'/g,"%27")}')" aria-label="Quadro da ricostruire"></div>
        </section>
        <aside class="puzzle-tray-panel">
          <div class="puzzle-tray-title"><div><small>PEZZI DA COLLOCARE</small><b id="puzzleLeft">${regions.length}</b></div><span>Tocca un pezzo, poi il suo posto nel quadro.</span></div>
          <div id="puzzleTray" class="puzzle-tray ${mode}"></div>
        </aside>
      </div>
      <div class="actions picture-actions">
        <button id="pictureHint" class="secondary" ${hints?'':'disabled'}>💡 Suggerimento (${hints})</button>
        <button id="pictureUndo" class="secondary" disabled>↶ Rimuovi ultimo</button>
      </div>
      <div id="pictureMsg" class="message">Scegli un pezzo dal vassoio.</div>
    `);
    const target=document.getElementById('puzzleTarget'),tray=document.getElementById('puzzleTray'),hint=document.getElementById('pictureHint'),undo=document.getElementById('pictureUndo'),msg=document.getElementById('pictureMsg');
    function regionStyle(r,i,slot=false){
      const shape=mode==='shaped'?SHAPES[(i*3+i%5)%SHAPES.length]:'none';
      return `left:${(r.x*100).toFixed(4)}%;top:${(r.y*100).toFixed(4)}%;width:${(r.w*100).toFixed(4)}%;height:${(r.h*100).toFixed(4)}%;${mode==='shaped'?`clip-path:${shape};`:''}`;
    }
    function pieceThumbStyle(r,i){
      const ratio=(r.w/r.h).toFixed(3),shape=mode==='shaped'?SHAPES[(i*3+i%5)%SHAPES.length]:'none';
      const area=r.w*r.h,base=Math.max(74,Math.min(150,82+area*650));
      return `--piece-w:${base.toFixed(0)}px;--piece-ratio:${ratio};${puzzleCropStyle(r)};${mode==='shaped'?`clip-path:${shape};`:''}`;
    }
    function render(){
      target.innerHTML=regions.map((r,i)=>`<button class="puzzle-target-slot ${placed.has(i)?'filled':''} ${selected===i?'wanted':''}" data-slot="${i}" style="${regionStyle(r,i,true)}" aria-label="Posizione ${i+1}">${placed.has(i)?`<i class="placed-image" style="${puzzleCropStyle(r)}"></i>`:''}</button>`).join('');
      target.querySelectorAll('.puzzle-target-slot').forEach(b=>b.onclick=()=>tryPlace(+b.dataset.slot));
      tray.innerHTML=order.filter(i=>!placed.has(i)).map(i=>`<button class="puzzle-tray-piece ${selected===i?'selected':''}" data-piece="${i}" style="${pieceThumbStyle(regions[i],i)}" aria-label="Pezzo ${i+1}"></button>`).join('');
      tray.querySelectorAll('.puzzle-tray-piece').forEach(b=>b.onclick=()=>{
        const i=+b.dataset.piece;selected=selected===i?null:i;render();msg.textContent=selected===null?'Selezione annullata.':'Pezzo selezionato: ora tocca il punto del quadro in cui va collocato.';
      });
      document.getElementById('picMoves').textContent=moves;document.getElementById('puzzleLeft').textContent=regions.length-placed.size;
      hint.disabled=!hints||finished;hint.textContent=`💡 Suggerimento (${hints})`;undo.disabled=lastPlaced===null||finished;
    }
    function tryPlace(slot){
      if(finished||selected===null)return toast('Prima scegli un pezzo dal vassoio');
      moves++;
      if(slot===selected){
        placed.add(selected);lastPlaced=selected;selected=null;msg.innerHTML='<b>Aggancio corretto.</b> Il pezzo resta al suo posto.';render();
        if(placed.size===regions.length)win();
      }else{
        msg.textContent='Non combacia in quel punto. Il pezzo torna nel vassoio.';target.querySelector(`[data-slot="${slot}"]`)?.classList.add('wrong');
        setTimeout(()=>target.querySelector(`[data-slot="${slot}"]`)?.classList.remove('wrong'),480);
        render();
      }
    }
    hint.onclick=()=>{
      if(!hints||finished)return;
      const candidate=selected!==null?selected:order.find(i=>!placed.has(i));
      if(candidate===undefined)return;
      placed.add(candidate);lastPlaced=candidate;selected=null;hints--;moves++;render();msg.textContent='Un pezzo è stato agganciato nella posizione corretta.';
      if(placed.size===regions.length)win();
    };
    undo.onclick=()=>{
      if(lastPlaced===null||finished)return;
      placed.delete(lastPlaced);selected=lastPlaced;lastPlaced=null;moves++;render();msg.textContent='Ultimo pezzo rimosso: è di nuovo selezionato nel vassoio.';
    };
    function win(){
      finished=true;render();const sec=Math.floor((Date.now()-activeStart)/1000);
      const score=Math.max(120,2300-moves*8-sec*2-(cfg.hints-hints)*50);
      msg.innerHTML=`<b>Puzzle completato.</b> ${moves} mosse.`;
      setTimeout(()=>concludeSession('picturepuzzle',level,score,true,`Puzzle ${esc(PICTURE_MODE_LABELS[mode])} completato in <b>${moves}</b> mosse. Punteggio: <b>${score}</b>.`),700);
    }
    render();startTimer();
  }


  // ---------- LUMINA ----------
  function startLumina(level){
    setSG2Mode('sg2-lumina-play','sg2-everybody-play','sg2-another-play');
    setHeader('LUMINA',LEVEL_NAMES[level]);
    const cfg={
      easy:{count:70,speed:.30},
      medium:{count:105,speed:.40},
      hard:{count:145,speed:.50},
      extreme:{count:190,speed:.62}
    }[level];
    const session=sessionState('lumina',level);
    app.innerHTML=`<div class="lumina-play-shell">
      <canvas id="luminaCanvas" aria-label="Mondo interattivo Lumina"></canvas>
      <div class="lumina-topbar">
        <button id="luminaBack" class="lumina-circle" aria-label="Torna a Nuova generazione">←</button>
        <div class="lumina-brand"><b>LUMINA</b><span>Sessione ${session.session}/100 · ${LEVEL_NAMES[level]}</span></div>
        <div class="lumina-top-actions"><button id="luminaHelp" class="lumina-circle" aria-label="Come si gioca">?</button><button id="luminaSound" class="lumina-circle" aria-label="Attiva audio">🔈</button><button id="luminaFinish" class="lumina-pill">Nuovo mondo</button></div>
      </div>
      <div class="lumina-discovery"><span id="luminaBloomCount">0</span><small>fioriture</small></div>
      <div class="lumina-modebar" role="toolbar" aria-label="Gesti Lumina">
        <button class="active" data-mode="light" aria-label="Luce" title="Luce">✦</button>
        <button data-mode="bloom" aria-label="Fiore" title="Fiore">❀</button>
        <button data-mode="vortex" aria-label="Vortice" title="Vortice">◎</button>
      </div>
      <div id="luminaHint" class="lumina-hint">Tocca o trascina nello spazio</div>
      <div id="luminaGuide" class="lumina-guide" aria-hidden="true">
        <div class="lumina-guide-card" role="dialog" aria-modal="true" aria-labelledby="luminaGuideTitle">
          <button id="luminaGuideClose" class="lumina-guide-x" type="button" aria-label="Chiudi istruzioni">×</button>
          <span class="lumina-guide-kicker">COME SI GIOCA</span>
          <h2 id="luminaGuideTitle">Lascia che il mondo reagisca ai tuoi gesti</h2>
          <p class="lumina-guide-intro">LUMINA non ha una soluzione da trovare: esplora, combina i gesti e osserva cosa nasce.</p>
          <div class="lumina-guide-grid">
            <div><b>☝</b><span><strong>Tocca</strong>Genera un impulso di luce.</span></div>
            <div><b>〰</b><span><strong>Trascina</strong>Disegna una corrente che muove le particelle.</span></div>
            <div><b>✦</b><span><strong>Luce</strong>Attira e accompagna lo sciame.</span></div>
            <div><b>❀</b><span><strong>Fiore</strong>Crea fioriture luminose nel punto toccato.</span></div>
            <div><b>◎</b><span><strong>Vortice</strong>Fa ruotare le particelle attorno al dito.</span></div>
            <div><b>🔊</b><span><strong>Audio</strong>Il pulsante in alto attiva o disattiva l'ambiente sonoro.</span></div>
          </div>
          <p class="lumina-guide-note">Non esiste Game Over. Quando vuoi cambiare scenario premi <b>Nuovo mondo</b>.</p>
          <button id="luminaGuideStart" class="lumina-guide-start" type="button">Inizia a esplorare</button>
        </div>
      </div>
    </div>`;
    const canvas=document.getElementById('luminaCanvas'),ctx=canvas.getContext('2d',{alpha:false});
    let w=0,h=0,dpr=1,particles=[],blooms=[],pointer=null,mode='light',running=true,bloomCount=0,frame=0,soundOn=false,audioCtx=null,audioNodes=[],audioMaster=null;
    const hueBase={easy:196,medium:204,hard:218,extreme:232}[level];
    const rnd=(a=1,b=0)=>b+(a-b)*activeRng();
    function resize(){dpr=Math.min(2,window.devicePixelRatio||1);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
    function spawnParticle(x=rnd(w),y=rnd(h),energy=.4){const a=rnd(Math.PI*2),sp=rnd(.7,.15)*cfg.speed;return{x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:rnd(3.2,1.1),life:rnd(1,.45),energy,hue:hueBase+rnd(55,-20),phase:rnd(Math.PI*2)}}
    function seed(){particles=Array.from({length:cfg.count},()=>spawnParticle())}
    function burst(x,y,n=12,power=1){for(let i=0;i<n;i++){const p=spawnParticle(x+rnd(28,-28),y+rnd(28,-28),power);const a=rnd(Math.PI*2),sp=rnd(2.2,.5)*power;p.vx+=Math.cos(a)*sp;p.vy+=Math.sin(a)*sp;particles.push(p)}while(particles.length>cfg.count*1.8)particles.shift()}
    function addBloom(x,y,scale=1,countIt=true){blooms.push({x,y,r:8,max:rnd(115,62)*scale,life:1,hue:hueBase+rnd(70,-15)});if(countIt){bloomCount++;document.getElementById('luminaBloomCount').textContent=bloomCount;playChime(.96+rnd(.16,0))}burst(x,y,18,1.2)}
    function forceAt(p){let fx=Math.sin((p.y+frame*.45)*.008+p.phase)*.012,fy=Math.cos((p.x-frame*.35)*.007+p.phase)*.012;if(pointer){let dx=pointer.x-p.x,dy=pointer.y-p.y,dist=Math.hypot(dx,dy)+1;if(dist<220){let s=(1-dist/220);if(mode==='vortex'){fx+=(-dy/dist)*s*.19;fy+=(dx/dist)*s*.19}else if(mode==='bloom'){fx+=(dx/dist)*s*.08;fy+=(dy/dist)*s*.08}else{fx+=(dx/dist)*s*.12;fy+=(dy/dist)*s*.12}}}return[fx,fy]}
    function update(){for(const p of particles){const[fx,fy]=forceAt(p);p.vx=(p.vx+fx)*.992;p.vy=(p.vy+fy)*.992;const lim=2.3*cfg.speed+.4,sp=Math.hypot(p.vx,p.vy);if(sp>lim){p.vx=p.vx/sp*lim;p.vy=p.vy/sp*lim}p.x+=p.vx;p.y+=p.vy;if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;if(p.y<-20)p.y=h+20;if(p.y>h+20)p.y=-20;p.phase+=.009}blooms.forEach(b=>{b.r+=(b.max-b.r)*.035;b.life-=.0045});blooms=blooms.filter(b=>b.life>0)}
    function draw(){ctx.fillStyle='rgba(2,8,22,.18)';ctx.fillRect(0,0,w,h);const bg=ctx.createRadialGradient(w*.5,h*.45,20,w*.5,h*.5,Math.max(w,h)*.7);bg.addColorStop(0,'rgba(15,58,118,.055)');bg.addColorStop(1,'rgba(2,7,18,.02)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const b of blooms){ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.strokeStyle=`hsla(${b.hue},95%,72%,${Math.max(0,b.life)*.34})`;ctx.lineWidth=2.2;ctx.stroke();ctx.beginPath();ctx.arc(b.x,b.y,b.r*.55,0,Math.PI*2);ctx.strokeStyle=`hsla(${b.hue+45},95%,76%,${Math.max(0,b.life)*.22})`;ctx.stroke()}for(const p of particles){const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);glow.addColorStop(0,`hsla(${p.hue},100%,86%,${.72*p.life})`);glow.addColorStop(.28,`hsla(${p.hue},100%,65%,${.35*p.life})`);glow.addColorStop(1,`hsla(${p.hue},100%,50%,0)`);ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);ctx.fill();ctx.fillStyle=`hsla(${p.hue},100%,90%,${.9*p.life})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}ctx.globalCompositeOperation='source-over'}
    function loop(){if(!running)return;frame++;update();draw();requestAnimationFrame(loop)}
    function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
    function down(e){e.preventDefault();const q=pos(e);pointer={...q,last:q,start:performance.now(),travel:0};burst(q.x,q.y,mode==='bloom'?18:10,mode==='vortex'?1.25:1);if(mode==='bloom')addBloom(q.x,q.y,.72);document.getElementById('luminaHint').classList.add('fade')}
    function move(e){if(!pointer)return;e.preventDefault();const q=pos(e);pointer.travel+=Math.hypot(q.x-pointer.last.x,q.y-pointer.last.y);pointer.x=q.x;pointer.y=q.y;pointer.last=q;if(frame%3===0)burst(q.x,q.y,mode==='light'?2:1,.65)}
    function up(){if(!pointer)return;const held=performance.now()-pointer.start;if((pointer.travel>140||held>650)&&activeRng()<.8)addBloom(pointer.x,pointer.y,mode==='vortex'?1.25:1);pointer=null}
    canvas.addEventListener('pointerdown',down,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up,{passive:true});
    document.querySelectorAll('.lumina-modebar button').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('.lumina-modebar button').forEach(x=>x.classList.toggle('active',x===b));if(mode==='vortex')addBloom(w*.5,h*.5,.95)});
    function setGuide(open){const g=document.getElementById('luminaGuide');if(!g)return;g.classList.toggle('show',open);g.setAttribute('aria-hidden',open?'false':'true')}
    function playChime(mult=1){if(!soundOn||!audioCtx||!audioMaster)return;try{const now=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(523.25*mult,now);o.frequency.exponentialRampToValueAtTime(659.25*mult,now+.42);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.055,now+.025);g.gain.exponentialRampToValueAtTime(.0001,now+.75);o.connect(g);g.connect(audioMaster);o.start(now);o.stop(now+.78)}catch{}}
    async function startAmbientAudio(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){document.getElementById('luminaHint').textContent='Audio non disponibile su questo browser';return false}try{audioCtx=new AC();await audioCtx.resume();audioMaster=audioCtx.createGain();audioMaster.gain.setValueAtTime(.0001,audioCtx.currentTime);audioMaster.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.45);const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1350;filter.Q.value=.7;filter.connect(audioMaster);audioMaster.connect(audioCtx.destination);const lfo=audioCtx.createOscillator(),lfoGain=audioCtx.createGain();lfo.frequency.value=.09;lfoGain.gain.value=.012;lfo.connect(lfoGain);for(const [f,vol,type] of [[220,.07,'sine'],[329.63,.045,'sine'],[440,.025,'triangle']]){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;lfoGain.connect(g.gain);o.connect(g);g.connect(filter);o.start();audioNodes.push(o)}lfo.start();audioNodes.push(lfo);soundOn=true;const b=document.getElementById('luminaSound');b.classList.add('active');b.textContent='🔊';b.setAttribute('aria-label','Disattiva audio');playChime(1);document.getElementById('luminaHint').textContent='Audio attivo';setTimeout(()=>{const h=document.getElementById('luminaHint');if(h)h.textContent='Tocca o trascina nello spazio'},1100);return true}catch{soundOn=false;return false}}
    async function stopAmbientAudio(){soundOn=false;const b=document.getElementById('luminaSound');if(b){b.classList.remove('active');b.textContent='🔈';b.setAttribute('aria-label','Attiva audio')}if(audioCtx){try{audioNodes.forEach(n=>n.stop?.());await audioCtx.close()}catch{}audioCtx=null;audioNodes=[];audioMaster=null}}
    function cleanup(){running=false;window.removeEventListener('pointerup',up);window.removeEventListener('resize',resize);if(audioCtx){try{audioNodes.forEach(n=>n.stop?.());audioCtx.close()}catch{}audioCtx=null;audioNodes=[];audioMaster=null}}
    document.getElementById('luminaBack').onclick=()=>{cleanup();renderNextGenFamily()};
    document.getElementById('luminaHelp').onclick=()=>setGuide(true);
    document.getElementById('luminaGuideClose').onclick=()=>setGuide(false);
    document.getElementById('luminaGuideStart').onclick=()=>{localStorage.setItem('sala_giochi_lumina_guide_v1','1');setGuide(false)};
    document.getElementById('luminaGuide').onclick=e=>{if(e.target.id==='luminaGuide')setGuide(false)};
    document.getElementById('luminaSound').onclick=async()=>{if(soundOn)await stopAmbientAudio();else await startAmbientAudio()};
    document.getElementById('luminaFinish').onclick=()=>{if(!running)return;cleanup();clearSG2Mode();const score=Math.max(1,bloomCount)*100;concludeSession('lumina',level,score,true,`Hai lasciato questo mondo con <b>${bloomCount}</b> fioriture luminose. Nessun punteggio da inseguire: puoi semplicemente entrare nel prossimo.`)};
    window.addEventListener('resize',resize,{passive:true});resize();ctx.fillStyle='#020816';ctx.fillRect(0,0,w,h);seed();for(let i=0;i<3;i++)addBloom(rnd(w*.78,w*.22),rnd(h*.72,h*.22),rnd(.9,.5),false);startTimer();loop();if(!localStorage.getItem('sala_giochi_lumina_guide_v1'))setTimeout(()=>setGuide(true),260);
  }


  // ---------- EVERYBODY IS RIGHT ----------
  const EIR_NAMES=['Anna','Marco','Sara','Paolo','Elena','Davide','Giulia','Lorenzo','Marta','Andrea','Clara','Nicolò'];
  const EIR_PLACES=[
    ['salone','Salone','▤'],['studio','Studio','▣'],['cucina','Cucina','◫'],['serra','Serra','⌂'],['corridoio','Corridoio','═'],['terrazza','Terrazza','▱'],['biblioteca','Biblioteca','▥']
  ];
  const EIR_ASSUMPTIONS=[
    ['visual_same','STESSO LUOGO','Per vedere qualcuno devo trovarmi nella sua stessa stanza.','◉'],
    ['audio_same','VOCE = PRESENZA','Se sento una voce, quella persona deve essere lì.','◌'],
    ['spoken_only','“DIRE” = PARLARE','Se qualcuno mi ha detto qualcosa, deve averlo fatto a voce.','⌁'],
    ['one_view','PUNTO DI VISTA','Una scena può essere osservata solo direttamente.','◇'],
    ['continuous','CONTINUITÀ','Ciò che osservo deve accadere nello stesso spazio e nello stesso momento.','∞'],
    ['unique_path','UNICO PERCORSO','Per collegare due luoghi serve necessariamente un passaggio fisico.','↔']
  ];
  const EIR_BRIDGES={
    visual:[
      ['mirror','SPECCHIO','Uno specchio ad angolo rende visibile l’altra stanza.','◇'],
      ['window','VETRATA','Una vetrata interna permette di vedere attraverso due ambienti.','▱'],
      ['camera','MONITOR','Una telecamera in diretta mostra l’altro ambiente.','▣'],
      ['reflection','RIFLESSO','Una superficie riflettente mostra ciò che è fuori campo.','◈']
    ],
    audio:[
      ['intercom','INTERFONO','Le stanze sono collegate da un interfono aperto.','⌁'],
      ['phone','TELEFONO','La voce arriva tramite una chiamata.','◌'],
      ['recording','REGISTRAZIONE','La voce proviene da un messaggio registrato.','▶'],
      ['speaker','ALTOPARLANTE','Un altoparlante ritrasmette la voce altrove.','◉']
    ],
    message:[
      ['text','MESSAGGIO','L’informazione è arrivata per iscritto sul telefono.','▧'],
      ['note','BIGLIETTO','La frase era stata lasciata su un biglietto.','□'],
      ['gesture','GESTO','Il significato è stato comunicato senza parole.','⌘'],
      ['recording','REGISTRAZIONE','Il messaggio era stato registrato prima.','▶']
    ]
  };

  function eirShufflePick(arr,n){return shuffle(arr).slice(0,n)}
  function eirAdjacency(placeCount){
    const adj={};for(let i=0;i<placeCount;i++){adj[i]=new Set();if(i>0)adj[i].add(i-1);if(i<placeCount-1)adj[i].add(i+1)}
    if(placeCount>=4){adj[0].add(2);adj[2].add(0)}
    return adj;
  }
  function eirConstraintText(c,names,places,time){
    const N=i=>names[i], P=i=>places[i][1];
    if(c.type==='at')return `${N(c.a)}: «Alle ${time} ero in ${P(c.p)}.»`;
    if(c.type==='notAt')return `${N(c.a)}: «Alle ${time} non ero in ${P(c.p)}.»`;
    if(c.type==='different')return `${N(c.a)}: «Alle ${time} io e ${N(c.b)} non eravamo nello stesso ambiente.»`;
    if(c.type==='same')return `${N(c.a)}: «Alle ${time} ero nello stesso ambiente di ${N(c.b)}.»`;
    if(c.type==='adjacentPlace')return `${N(c.a)}: «Alle ${time} ero in un ambiente confinante con ${P(c.p)}.»`;
    if(c.type==='adjacentPeople')return `${N(c.a)}: «Alle ${time} ero in una stanza confinante con quella di ${N(c.b)}.»`;
    return '';
  }
  function eirSatisfies(assign,c,adj){
    if(c.type==='at')return assign[c.a]===c.p;
    if(c.type==='notAt')return assign[c.a]!==c.p;
    if(c.type==='different')return assign[c.a]!==assign[c.b];
    if(c.type==='same')return assign[c.a]===assign[c.b];
    if(c.type==='adjacentPlace')return adj[assign[c.a]]?.has(c.p)||false;
    if(c.type==='adjacentPeople')return adj[assign[c.a]]?.has(assign[c.b])||false;
    return true;
  }
  function eirEnumerate(personCount,placeCount,constraints,adj,limit=60){
    const out=[],a=Array(personCount).fill(0);
    function go(i){if(out.length>=limit)return;if(i===personCount){if(constraints.every(c=>eirSatisfies(a,c,adj)))out.push([...a]);return}for(let p=0;p<placeCount;p++){a[i]=p;go(i+1);if(out.length>=limit)return}}
    go(0);return out;
  }
  function makeEverybody(level){
    const cfg={easy:{people:3,places:3,challenges:1,targetSolutions:2},medium:{people:4,places:4,challenges:1,targetSolutions:3},hard:{people:5,places:4,challenges:2,targetSolutions:4},extreme:{people:6,places:5,challenges:2,targetSolutions:5}}[level];
    const names=eirShufflePick(EIR_NAMES,cfg.people);
    const places=eirShufflePick(EIR_PLACES,cfg.places);
    const time=`${20+Math.floor(activeRng()*2)}:${['00','10','15','20','30','40'][Math.floor(activeRng()*6)]}`;
    const adj=eirAdjacency(cfg.places);
    let hidden=[];
    if(level==='easy'||level==='medium')hidden=shuffle([...Array(cfg.places).keys()]).slice(0,cfg.people);
    else hidden=Array.from({length:cfg.people},(_,i)=>i<cfg.places?i:Math.floor(activeRng()*cfg.places));
    hidden=shuffle(hidden);

    const constraints=[];
    const candidates=[];
    for(let i=0;i<cfg.people;i++)candidates.push({type:'at',a:i,p:hidden[i]});
    for(let i=0;i<cfg.people;i++){
      let wrong=(hidden[i]+1+Math.floor(activeRng()*(cfg.places-1)))%cfg.places;
      if(wrong===hidden[i])wrong=(wrong+1)%cfg.places;
      candidates.push({type:'notAt',a:i,p:wrong});
    }
    for(let a=0;a<cfg.people;a++)for(let b=a+1;b<cfg.people;b++){
      if(hidden[a]===hidden[b])candidates.push({type:'same',a,b});
      else candidates.push({type:'different',a,b});
      if(adj[hidden[a]]?.has(hidden[b]))candidates.push({type:'adjacentPeople',a,b});
    }
    for(let a=0;a<cfg.people;a++)for(let p=0;p<cfg.places;p++)if(adj[hidden[a]]?.has(p))candidates.push({type:'adjacentPlace',a,p});

    let pool=shuffle(candidates),solutions=[];
    const minBase={easy:2,medium:3,hard:4,extreme:5}[level];
    for(const c of pool){
      if(constraints.some(x=>JSON.stringify(x)===JSON.stringify(c)))continue;
      constraints.push(c);
      solutions=eirEnumerate(cfg.people,cfg.places,constraints,adj,80);
      if(constraints.length>=minBase && solutions.length<=cfg.targetSolutions && solutions.length>0)break;
    }
    if(!solutions.length)solutions=[hidden];

    const challengeTypes=level==='easy'?['visual']:level==='medium'?[activeRng()<.5?'visual':'audio']:shuffle(['visual','audio','message']).slice(0,cfg.challenges);
    const challenges=[];
    const occupiedPairs=[];
    for(let k=0;k<cfg.challenges;k++){
      const type=challengeTypes[k];
      let observer=0,target=1;
      for(let tries=0;tries<30;tries++){
        observer=Math.floor(activeRng()*cfg.people);target=Math.floor(activeRng()*cfg.people);
        if(observer!==target&&hidden[observer]!==hidden[target]&&!occupiedPairs.some(x=>x[0]===observer&&x[1]===target))break;
      }
      occupiedPairs.push([observer,target]);
      const options=EIR_BRIDGES[type];
      const bridge=options[Math.floor(activeRng()*options.length)];
      let text='';
      if(type==='visual')text=`${names[observer]}: «Alle ${time} ho visto ${names[target]} in ${places[hidden[target]][1]}.»`;
      if(type==='audio')text=`${names[observer]}: «Alle ${time} ho sentito chiaramente la voce di ${names[target]}.»`;
      if(type==='message')text=`${names[observer]}: «Alle ${time} ${names[target]} mi ha detto di non muovermi.»`;
      const fact={
        mirror:`Uno specchio orientabile in ${places[hidden[observer]][1]} riflette parte di ${places[hidden[target]][1]}.`,
        window:`Tra ${places[hidden[observer]][1]} e ${places[hidden[target]][1]} c’è una vetrata interna.`,
        camera:`In ${places[hidden[observer]][1]} è acceso un monitor collegato in diretta a ${places[hidden[target]][1]}.`,
        reflection:`Una superficie lucida in ${places[hidden[observer]][1]} riflette l’ingresso di ${places[hidden[target]][1]}.`,
        intercom:`L’interfono tra ${places[hidden[observer]][1]} e ${places[hidden[target]][1]} risulta aperto.`,
        phone:`Il registro mostra una chiamata tra ${names[observer]} e ${names[target]} alle ${time}.`,
        recording:`In ${places[hidden[observer]][1]} c’è un dispositivo che può riprodurre messaggi registrati.`,
        speaker:`L’impianto audio di ${places[hidden[observer]][1]} può ricevere il segnale da ${places[hidden[target]][1]}.`,
        text:`Sul telefono di ${names[observer]} risulta un messaggio di ${names[target]} alle ${time}.`,
        note:`Sul tavolo di ${places[hidden[observer]][1]} c’è un biglietto scritto da ${names[target]}.`,
        gesture:`Da ${places[hidden[observer]][1]} è possibile vedere i gesti fatti all’ingresso di ${places[hidden[target]][1]}.`
      }[bridge[0]]||`Un dispositivo collega ${places[hidden[observer]][1]} e ${places[hidden[target]][1]}.`;
      challenges.push({type,observer,target,bridge:bridge[0],text,fact});
    }

    const assumptionIds=[...new Set(challenges.map(c=>c.type==='visual'?'visual_same':c.type==='audio'?'audio_same':'spoken_only'))];
    const decoys=shuffle(EIR_ASSUMPTIONS.filter(a=>!assumptionIds.includes(a[0]))).slice(0,level==='easy'?2:level==='medium'?3:4);
    const assumptions=shuffle([...EIR_ASSUMPTIONS.filter(a=>assumptionIds.includes(a[0])),...decoys]);
    const testimony=shuffle([...constraints.map(c=>eirConstraintText(c,names,places,time)),...challenges.map(c=>c.text)]);
    return {cfg,names,places,time,adj,hidden,constraints,solutions,challenges,assumptionIds,assumptions,testimony};
  }

  function startEverybody(level){
    setSG2Mode('sg2-everybody-play','sg2-another-play');
    setHeader('EVERYBODY IS RIGHT',LEVEL_NAMES[level]);
    const g=makeEverybody(level),session=sessionState('everybody',level);
    const selectedAssumptions=new Set(),bridgeChoices={},assign=Array(g.cfg.people).fill(null);
    let selectedPerson=0,checks=0,finished=false,currentTab='dossier';
    if(level==='easy'){
      const c=g.constraints.find(x=>x.type==='at');
      if(c)assign[c.a]=c.p;
    }
    const testimonyCards=g.testimony.map((t,i)=>{
      const m=String(t).match(/^([^:]+):\s*(.*)$/);
      const speaker=m?m[1]:'Testimone',quote=m?m[2]:t;
      return `<article class="eir-testimony-card"><div class="eir-witness"><span>${speaker.charAt(0)}</span><div><b>${speaker}</b><small>Testimonianza ${String(i+1).padStart(2,'0')}</small></div></div><blockquote>${quote}</blockquote></article>`;
    }).join('');
    app.innerHTML=gameShell('everybody',level,`
      <div class="eir-rule"><span>REGOLA DEL CASO</span><b>Nessuno mente.</b><small>Costruisci una realtà in cui tutto possa essere vero.</small></div>
      <div class="eir-sessionline"><span>Sessione <b>${session.session}/100</b></span><span>Ora chiave <b>${g.time}</b></span><span id="eirChecks">Verifiche <b>0</b></span></div>
      <nav class="eir-tabs" aria-label="Fasi del caso">
        <button class="active" data-tab="dossier"><span>1</span><b>Dossier</b><small>Leggi i fatti</small></button>
        <button data-tab="reality"><span>2</span><b>Ricostruzione</b><small>Colloca le persone</small></button>
        <button data-tab="deduction"><span>3</span><b>Deduzione</b><small>Spiega il paradosso</small></button>
      </nav>

      <div class="eir-tab-panel active" data-panel="dossier">
        <section class="eir-panel"><div class="eir-panel-head"><span>01</span><div><b>Testimonianze</b><small>Tutte sono vere, anche quando sembrano incompatibili.</small></div></div><div class="eir-testimonies">${testimonyCards}</div></section>
        <section class="eir-panel"><div class="eir-panel-head"><span>02</span><div><b>Fatti dell’ambiente</b><small>Questi elementi possono rendere possibile ciò che sembra impossibile.</small></div></div><div class="eir-facts">${g.challenges.map((c,i)=>`<article><span>${['◇','⌁','▧'][i%3]}</span><div><b>Indizio ambientale ${i+1}</b><p>${c.fact}</p></div></article>`).join('')}</div></section>
        <button class="eir-step-next" data-go="reality">Ho letto il dossier <span>→</span></button>
      </div>

      <div class="eir-tab-panel" data-panel="reality">
        <section class="eir-panel reality"><div class="eir-panel-head"><span>03</span><div><b>Ricostruisci la realtà</b><small>Scegli una persona e poi il luogo in cui pensi si trovasse alle ${g.time}.</small></div></div>
          <div class="eir-selection-hint"><span>1</span>Scegli una persona <i>→</i><span>2</span>Scegli un luogo</div>
          <div id="eirPeople" class="eir-people"></div>
          <div id="eirMap" class="eir-map"></div>
        </section>
        <button class="eir-step-next" data-go="deduction">Passa alla deduzione <span>→</span></button>
      </div>

      <div class="eir-tab-panel" data-panel="deduction">
        <section class="eir-panel"><div class="eir-panel-head"><span>04</span><div><b>Cosa stai dando per scontato?</b><small>Seleziona solo le assunzioni che devi abbandonare.</small></div></div><div id="eirAssumptions" class="eir-assumptions">${g.assumptions.map(a=>`<button data-id="${a[0]}"><b>${a[3]}</b><span><strong>${a[1]}</strong><small>${a[2]}</small></span></button>`).join('')}</div></section>
        <section class="eir-panel"><div class="eir-panel-head"><span>05</span><div><b>Collegamenti nascosti</b><small>Per ogni paradosso indica come può essere vero.</small></div></div><div class="eir-bridges">${g.challenges.map((c,i)=>`<div class="eir-challenge"><p><b>Paradosso ${i+1}</b><span>${c.text}</span></p><div>${EIR_BRIDGES[c.type].map(o=>`<button data-ch="${i}" data-bridge="${o[0]}"><span>${o[3]}</span><b>${o[1]}</b></button>`).join('')}</div></div>`).join('')}</div></section>
        <div id="eirFeedback" class="eir-feedback"><b>La tua teoria</b><span>Quando sei pronto, verifica se tutte le frasi possono convivere.</span></div>
        <div class="actions eir-actions"><button id="eirReset" class="secondary" type="button">⟳ Azzera</button><button id="eirVerify" class="primary" type="button">Verifica realtà</button></div>
      </div>
    `);
    const people=document.getElementById('eirPeople'),map=document.getElementById('eirMap'),feedback=document.getElementById('eirFeedback');
    function setTab(name){
      currentTab=name;
      document.querySelectorAll('.eir-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
      document.querySelectorAll('.eir-tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
      document.querySelector('.game-everybody')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
    document.querySelectorAll('.eir-tabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
    document.querySelectorAll('.eir-step-next').forEach(b=>b.onclick=()=>setTab(b.dataset.go));
    function renderPeople(){people.innerHTML=g.names.map((n,i)=>`<button class="${selectedPerson===i?'selected':''} ${assign[i]!==null?'placed':''}" data-person="${i}"><span>${n[0]}</span><div><b>${n}</b><small>${assign[i]===null?'Da collocare':g.places[assign[i]][1]}</small></div>${assign[i]!==null?'<i>✓</i>':''}</button>`).join('');people.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedPerson=+b.dataset.person;renderPeople();renderMap()})}
    function renderMap(){map.style.setProperty('--eir-cols',g.cfg.places<=3?g.cfg.places:2);map.innerHTML=g.places.map((p,pi)=>{const here=g.names.map((n,i)=>assign[i]===pi?`<span>${n[0]}<small>${n}</small></span>`:'').join('');const adjacent=[...g.adj[pi]].map(j=>g.places[j][1]).join(' · ');return `<button class="eir-place ${assign[selectedPerson]===pi?'target':''}" data-place="${pi}"><i>${p[2]}</i><b>${p[1]}</b><small>Confina con ${adjacent||'—'}</small><div>${here||'<em>Nessuno collocato</em>'}</div></button>`}).join('');map.querySelectorAll('.eir-place').forEach(b=>b.onclick=()=>{assign[selectedPerson]=+b.dataset.place;renderPeople();renderMap()})}
    renderPeople();renderMap();
    document.querySelectorAll('#eirAssumptions button').forEach(b=>b.onclick=()=>{const id=b.dataset.id;selectedAssumptions.has(id)?selectedAssumptions.delete(id):selectedAssumptions.add(id);b.classList.toggle('selected',selectedAssumptions.has(id))});
    document.querySelectorAll('.eir-challenge button').forEach(b=>b.onclick=()=>{const ch=+b.dataset.ch;bridgeChoices[ch]=b.dataset.bridge;b.closest('.eir-challenge').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b))});
    document.getElementById('eirReset').onclick=()=>{assign.fill(null);selectedAssumptions.clear();for(const k of Object.keys(bridgeChoices))delete bridgeChoices[k];checks=0;document.getElementById('eirChecks').innerHTML='Verifiche <b>0</b>';document.querySelectorAll('#eirAssumptions button,.eir-challenge button').forEach(b=>b.classList.remove('selected'));feedback.className='eir-feedback';feedback.innerHTML='<b>La tua teoria</b><span>Tavolo azzerato. Ricostruisci la realtà da capo.</span>';renderPeople();renderMap();setTab('dossier')};
    document.getElementById('eirVerify').onclick=()=>{
      if(finished)return;checks++;document.getElementById('eirChecks').innerHTML=`Verifiche <b>${checks}</b>`;
      const placed=assign.filter(x=>x!==null).length;
      const locOk=placed===g.cfg.people&&g.constraints.every(c=>eirSatisfies(assign,c,g.adj))&&g.challenges.every(c=>assign[c.observer]===g.hidden[c.observer]&&assign[c.target]===g.hidden[c.target]);
      const assOk=g.assumptionIds.length===selectedAssumptions.size&&g.assumptionIds.every(x=>selectedAssumptions.has(x));
      const bridgeOk=g.challenges.every((c,i)=>bridgeChoices[i]===c.bridge);
      if(locOk&&assOk&&bridgeOk){
        finished=true;const generatedSame=assign.every((p,i)=>p===g.hidden[i]);const sec=Math.floor((Date.now()-activeStart)/1000);const score=Math.max(120,1900-checks*120-sec*2+(generatedSame?0:180));feedback.className='eir-feedback success';feedback.innerHTML=`<b>${generatedSame?'Realtà coerente.':'Soluzione alternativa valida.'}</b><span>Tutte le testimonianze possono essere vere contemporaneamente.</span><div>${g.challenges.map(c=>`<p>${c.fact}</p>`).join('')}</div>`;document.querySelector('.eir-reality-flash')?.remove();const flash=document.createElement('div');flash.className='eir-reality-flash';flash.textContent='EVERYBODY IS RIGHT';document.body.appendChild(flash);setTimeout(()=>flash.remove(),1100);setTimeout(()=>concludeSession('everybody',level,score,true,`${generatedSame?'Hai ricostruito una realtà coerente.':'Hai trovato una soluzione alternativa coerente.'} Verifiche: <b>${checks}</b>.`),950);return;
      }
      const parts=[];
      if(placed<g.cfg.people)parts.push(`${g.cfg.people-placed} persone ancora da collocare`);else if(!locOk)parts.push('la disposizione non soddisfa ancora tutte le testimonianze');
      if(!assOk)parts.push('le assunzioni selezionate non spiegano ancora tutti i paradossi');
      if(!bridgeOk)parts.push('almeno un collegamento nascosto non è compatibile con i fatti');
      feedback.className='eir-feedback bad';feedback.innerHTML=`<b>Questa realtà non regge ancora.</b><span>${parts.join(' · ')}</span>`;
      setTab(placed<g.cfg.people||!locOk?'reality':'deduction');
    };
    startTimer();
    if(!localStorage.getItem('sala_giochi_everybody_help_v2')){localStorage.setItem('sala_giochi_everybody_help_v2','1');setTimeout(()=>openHelp(),260)}
  }


  // ---------- ANHOTHER WORLD ----------
  const AW_ACTIONS={
    orb:{icon:'●',name:'Muovi sfera rossa'},
    cube:{icon:'◆',name:'Muovi cubo blu'},
    lamp:{icon:'✦',name:'Interruttore lampada'},
    key:{icon:'⌁',name:'Premi la chiave'},
    leave:{icon:'⇢',name:'Esci dalla stanza'},
    enter:{icon:'⇠',name:'Entra nella stanza'}
  };
  const AW_RULES=[
    {id:'scarlet',symbol:'●→✦',name:'Risonanza scarlatta',desc:'Muovere la sfera rossa cambia anche lo stato della lampada.'},
    {id:'azure',symbol:'◆→▯',name:'Porta azzurra',desc:'Muovere il cubo blu cambia anche lo stato della porta.'},
    {id:'shadow',symbol:'⇢→●',name:'Deriva invisibile',desc:'Quando l’osservatore esce, la sfera rossa cambia posizione.'},
    {id:'echo',symbol:'●…◆',name:'Eco ritardata',desc:'Dopo aver mosso la sfera, il cubo cambia posizione al termine dell’azione successiva.'},
    {id:'lightkey',symbol:'✦+⌁',name:'Chiave illuminata',desc:'La chiave cambia la porta soltanto quando la lampada è accesa.'},
    {id:'home',symbol:'⇠→◆',name:'Posizione di ritorno',desc:'Quando l’osservatore entra, il cubo torna sempre a sinistra.'},
    {id:'mirror',symbol:'◆↔●',name:'Legame speculare',desc:'Muovere il cubo sposta anche la sfera rossa.'},
    {id:'darkdoor',symbol:'✦↓▯',name:'Memoria del buio',desc:'Spegnere la lampada chiude sempre la porta.'}
  ];
  const AW_CONFIG={
    easy:{rules:2,candidates:5,observations:4,experiments:7,predictLen:2,breakLen:3},
    medium:{rules:3,candidates:6,observations:5,experiments:6,predictLen:3,breakLen:4},
    hard:{rules:4,candidates:8,observations:6,experiments:5,predictLen:4,breakLen:5},
    extreme:{rules:5,candidates:8,observations:7,experiments:4,predictLen:5,breakLen:6}
  };
  const AW_OBSERVATION_SEQUENCES=[
    ['orb'],['cube'],['lamp','key'],['leave'],['cube','enter'],['cube','lamp'],['orb','lamp'],['orb','key'],['lamp','cube'],['leave','enter'],['cube','cube'],['lamp','key','lamp']
  ];
  function awInitial(){return{orb:0,cube:0,lamp:false,door:false,inside:true,echo:false}}
  function awClone(s){return{orb:s.orb,cube:s.cube,lamp:s.lamp,door:s.door,inside:s.inside,echo:s.echo}}
  function awApply(state,action,ruleSet){
    const beforeEcho=state.echo;
    state.echo=false;
    if(action==='orb'){state.orb=1-state.orb;if(ruleSet.has('scarlet'))state.lamp=!state.lamp;if(ruleSet.has('echo'))state.echo=true}
    else if(action==='cube'){state.cube=1-state.cube;if(ruleSet.has('azure'))state.door=!state.door;if(ruleSet.has('mirror'))state.orb=1-state.orb}
    else if(action==='lamp'){state.lamp=!state.lamp;if(ruleSet.has('darkdoor')&&!state.lamp)state.door=false}
    else if(action==='key'){if(ruleSet.has('lightkey')&&state.lamp)state.door=!state.door}
    else if(action==='leave'){state.inside=false;if(ruleSet.has('shadow'))state.orb=1-state.orb}
    else if(action==='enter'){state.inside=true;if(ruleSet.has('home'))state.cube=0}
    if(beforeEcho)state.cube=1-state.cube;
    return state;
  }
  function awRun(sequence,ruleIds,start=awInitial()){
    const rules=ruleIds instanceof Set?ruleIds:new Set(ruleIds),state=awClone(start),steps=[];
    sequence.forEach(a=>{const before=awClone(state);awApply(state,a,rules);steps.push({action:a,before,after:awClone(state)})});
    return{state,steps};
  }
  function awStateKey(s){return`${s.orb}${s.cube}${s.lamp?1:0}${s.door?1:0}${s.inside?1:0}`}
  function awStateDiff(a,b){return['orb','cube','lamp','door','inside'].filter(k=>a[k]!==b[k]).length}
  function awStateText(s){return`Sfera ${s.orb?'destra':'sinistra'} · Cubo ${s.cube?'destra':'sinistra'} · Lampada ${s.lamp?'accesa':'spenta'} · Porta ${s.door?'aperta':'chiusa'} · Osservatore ${s.inside?'dentro':'fuori'}`}
  function awActionText(seq){return seq.map(a=>`${AW_ACTIONS[a].icon} ${AW_ACTIONS[a].name}`).join(' → ')}
  function awPickRules(cfg){return shuffle(AW_RULES).slice(0,cfg.rules).map(r=>r.id)}
  function awCandidateRules(active,cfg){
    const chosen=AW_RULES.filter(r=>active.includes(r.id)),rest=shuffle(AW_RULES.filter(r=>!active.includes(r.id))).slice(0,Math.max(0,cfg.candidates-chosen.length));
    return shuffle([...chosen,...rest]);
  }
  function awInformativeObservation(seq,active){const out=awRun(seq,active);return awStateDiff(awInitial(),out.state)>0||seq.includes('key')}
  function awGenerate(level){
    const cfg=AW_CONFIG[level],active=awPickRules(cfg),candidates=awCandidateRules(active,cfg);
    const pool=shuffle(AW_OBSERVATION_SEQUENCES).filter(s=>awInformativeObservation(s,active));
    const observations=pool.slice(0,cfg.observations).map((sequence,i)=>({id:i+1,sequence,result:awRun(sequence,active).state}));
    let predictSequence=null,predictState=null;
    for(let tries=0;tries<80;tries++){
      const seq=Array.from({length:cfg.predictLen},()=>shuffle(Object.keys(AW_ACTIONS))[0]),res=awRun(seq,active).state;
      if(awStateDiff(awInitial(),res)>=2){predictSequence=seq;predictState=res;break}
    }
    if(!predictSequence){predictSequence=['orb','cube'];predictState=awRun(predictSequence,active).state}
    let breakSequence=null,target=null;
    for(let tries=0;tries<120;tries++){
      const len=Math.max(2,Math.min(cfg.breakLen,2+Math.floor(activeRng()*cfg.breakLen)));
      const seq=Array.from({length:len},()=>shuffle(Object.keys(AW_ACTIONS))[0]),res=awRun(seq,active).state;
      if(awStateDiff(awInitial(),res)>=3){breakSequence=seq;target=res;break}
    }
    if(!breakSequence){breakSequence=['orb','lamp','cube'];target=awRun(breakSequence,active).state}
    return{cfg,active,candidates,observations,predictSequence,predictState,breakSequence,target};
  }
  function awScene(state,compact=false){return`<div class="aw-scene ${compact?'compact':''}">
    <div class="aw-room-glow ${state.lamp?'on':''}"></div>
    <div class="aw-lamp-object ${state.lamp?'on':''}"><span>✦</span><small>${state.lamp?'ACCESA':'SPENTA'}</small></div>
    <div class="aw-door-object ${state.door?'open':''}"><i></i><small>${state.door?'APERTA':'CHIUSA'}</small></div>
    <div class="aw-track"><span class="aw-orb ${state.orb?'right':''}">●</span><span class="aw-cube ${state.cube?'right':''}">◆</span></div>
    <div class="aw-observer ${state.inside?'inside':'outside'}"><span>◉</span><small>${state.inside?'DENTRO':'FUORI'}</small></div>
  </div>`}
  function awStateControls(prefix,state){return`<div class="aw-state-controls" id="${prefix}">
    <button data-k="orb"><span>● Sfera</span><b>${state.orb?'Destra':'Sinistra'}</b></button>
    <button data-k="cube"><span>◆ Cubo</span><b>${state.cube?'Destra':'Sinistra'}</b></button>
    <button data-k="lamp"><span>✦ Lampada</span><b>${state.lamp?'Accesa':'Spenta'}</b></button>
    <button data-k="door"><span>▯ Porta</span><b>${state.door?'Aperta':'Chiusa'}</b></button>
    <button data-k="inside"><span>◉ Osservatore</span><b>${state.inside?'Dentro':'Fuori'}</b></button>
  </div>`}
  function startAnother(level){
    setSG2Mode('sg2-another-play');
    setHeader('ANHOTHER WORLD',LEVEL_NAMES[level]);
    const g=awGenerate(level),session=sessionState('another',level),selectedRules=new Set(),experimentSeq=[],breakSeq=[];
    let experimentsLeft=g.cfg.experiments,phase='observe',hypothesisSolved=false,predictionSolved=false,checks=0,finished=false;
    const predicted=awInitial();
    app.innerHTML=gameShell('another',level,`
      <div class="aw-world-head"><div><span>MONDO ${String(session.session).padStart(2,'0')}</span><b>Le leggi non sono quelle che conosci.</b></div><div class="aw-exp-count"><small>Esperimenti</small><strong id="awExpLeft">${experimentsLeft}</strong></div></div>
      <nav class="aw-tabs">
        <button class="active" data-awtab="observe"><span>1</span><b>Osserva</b></button>
        <button data-awtab="experiment"><span>2</span><b>Esperimenta</b></button>
        <button data-awtab="predict" disabled><span>3</span><b>Prevedi</b></button>
        <button data-awtab="break" disabled><span>4</span><b>Rompi il mondo</b></button>
      </nav>
      <section class="aw-panel active" data-awpanel="observe">
        <div class="aw-intro"><b>Stato di partenza</b><p>Ogni osservazione e ogni esperimento comincia esattamente da qui.</p>${awScene(awInitial(),true)}</div>
        <div class="aw-section-title"><span>01</span><div><b>Eventi osservati</b><small>Confronta la sequenza con lo stato finale.</small></div></div>
        <div class="aw-observations">${g.observations.map(o=>`<article><div class="aw-ob-num">${String(o.id).padStart(2,'0')}</div><div class="aw-ob-body"><p class="aw-sequence">${awActionText(o.sequence)}</p>${awScene(o.result,true)}<small>${awStateText(o.result)}</small></div></article>`).join('')}</div>
        <div class="aw-section-title"><span>02</span><div><b>Le leggi possibili</b><small>Seleziona soltanto quelle che pensi governino questo mondo.</small></div></div>
        <div id="awRules" class="aw-rule-grid">${g.candidates.map(r=>`<button data-rule="${r.id}"><span>${r.symbol}</span><div><b>${r.name}</b><small>${r.desc}</small></div></button>`).join('')}</div>
        <div id="awHypFeedback" class="aw-feedback"><b>Formula un’ipotesi</b><span>Puoi usare gli esperimenti prima di verificare.</span></div>
        <div class="actions"><button class="secondary" data-awgo="experiment">Vai agli esperimenti</button><button id="awCheckRules" class="primary">Verifica leggi</button></div>
      </section>
      <section class="aw-panel" data-awpanel="experiment">
        <div class="aw-section-title"><span>03</span><div><b>Laboratorio</b><small>Costruisci una sequenza di massimo 3 azioni. Ogni prova riparte dallo stato iniziale.</small></div></div>
        ${awScene(awInitial(),false)}
        <div class="aw-action-palette">${Object.entries(AW_ACTIONS).map(([id,a])=>`<button data-awaction="${id}"><span>${a.icon}</span><small>${a.name}</small></button>`).join('')}</div>
        <div id="awExperimentSeq" class="aw-seq-builder"><em>Nessuna azione selezionata</em></div>
        <div class="actions"><button id="awExperimentClear" class="secondary">Azzera</button><button id="awExperimentRun" class="primary">Esegui esperimento</button></div>
        <div id="awExperimentResult" class="aw-feedback"><b>Risultato</b><span>Il mondo mostrerà qui come ha reagito.</span></div>
      </section>
      <section class="aw-panel" data-awpanel="predict">
        <div class="aw-section-title"><span>04</span><div><b>Prevedi</b><small>Ora niente esperimenti: applica mentalmente le leggi scoperte.</small></div></div>
        <div class="aw-predict-seq">${awActionText(g.predictSequence)}</div>
        <p class="aw-predict-copy">Imposta come pensi sarà il mondo dopo questa sequenza.</p>
        <div id="awPredictionScene">${awScene(predicted,false)}</div>
        ${awStateControls('awPredictionControls',predicted)}
        <div id="awPredictFeedback" class="aw-feedback"><b>La tua previsione</b><span>Modifica lo stato e poi verifica.</span></div>
        <div class="actions"><button id="awPredictVerify" class="primary wide">Verifica previsione</button></div>
      </section>
      <section class="aw-panel" data-awpanel="break">
        <div class="aw-section-title"><span>05</span><div><b>Rompi il mondo</b><small>Non cercare la sequenza dell’autore: inventane una che raggiunga davvero questo stato.</small></div></div>
        <div class="aw-target"><b>OBIETTIVO</b>${awScene(g.target,false)}<p>${awStateText(g.target)}</p></div>
        <div class="aw-action-palette">${Object.entries(AW_ACTIONS).map(([id,a])=>`<button data-awbreak="${id}"><span>${a.icon}</span><small>${a.name}</small></button>`).join('')}</div>
        <div id="awBreakSeq" class="aw-seq-builder"><em>Costruisci una sequenza · massimo ${g.cfg.breakLen} azioni</em></div>
        <div class="actions"><button id="awBreakClear" class="secondary">Azzera</button><button id="awBreakRun" class="primary">Esegui sequenza</button></div>
        <div id="awBreakFeedback" class="aw-feedback"><b>Il mondo aspetta.</b><span>Usa le sue leggi contro di lui.</span></div>
      </section>
    `);
    const tabs=[...document.querySelectorAll('.aw-tabs button')],panels=[...document.querySelectorAll('.aw-panel')];
    function setPhase(name){phase=name;tabs.forEach(b=>b.classList.toggle('active',b.dataset.awtab===name));panels.forEach(p=>p.classList.toggle('active',p.dataset.awpanel===name));document.querySelector('.game-another')?.scrollIntoView({behavior:'smooth',block:'start'})}
    tabs.forEach(b=>b.onclick=()=>{if(!b.disabled)setPhase(b.dataset.awtab)});document.querySelectorAll('[data-awgo]').forEach(b=>b.onclick=()=>setPhase(b.dataset.awgo));
    document.querySelectorAll('#awRules button').forEach(b=>b.onclick=()=>{const id=b.dataset.rule;selectedRules.has(id)?selectedRules.delete(id):selectedRules.add(id);b.classList.toggle('selected',selectedRules.has(id))});
    const hypFb=document.getElementById('awHypFeedback');
    document.getElementById('awCheckRules').onclick=()=>{checks++;const exact=selectedRules.size===g.active.length&&g.active.every(id=>selectedRules.has(id));if(exact){hypothesisSolved=true;hypFb.className='aw-feedback success';hypFb.innerHTML='<b>Le leggi combaciano.</b><span>Hai costruito un modello che spiega tutte le osservazioni. Ora usalo per prevedere il mondo.</span>';const p=tabs.find(x=>x.dataset.awtab==='predict');p.disabled=false;setTimeout(()=>setPhase('predict'),550)}else{const tooMany=[...selectedRules].filter(id=>!g.active.includes(id)).length,missing=g.active.filter(id=>!selectedRules.has(id)).length;hypFb.className='aw-feedback bad';hypFb.innerHTML=`<b>Il modello non regge ancora.</b><span>${missing?`${missing} legge${missing>1?'i':''} necessaria${missing>1?'e':''} manca${missing>1?'no':''}. `:''}${tooMany?`${tooMany} ipotesi selezionata${tooMany>1?'e':''} produce effetti che non appartengono a questo mondo.`:''}</span>`}};
    const exBuild=document.getElementById('awExperimentSeq'),exResult=document.getElementById('awExperimentResult');
    function renderEx(){exBuild.innerHTML=experimentSeq.length?experimentSeq.map((a,i)=>`<button data-rm="${i}"><span>${AW_ACTIONS[a].icon}</span><small>${AW_ACTIONS[a].name}</small></button>`).join('<i>→</i>'):'<em>Nessuna azione selezionata</em>';exBuild.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{experimentSeq.splice(+b.dataset.rm,1);renderEx()})}
    document.querySelectorAll('[data-awaction]').forEach(b=>b.onclick=()=>{if(experimentSeq.length>=3)return toast('Massimo 3 azioni per esperimento');experimentSeq.push(b.dataset.awaction);renderEx()});
    document.getElementById('awExperimentClear').onclick=()=>{experimentSeq.length=0;renderEx()};
    document.getElementById('awExperimentRun').onclick=()=>{if(!experimentSeq.length)return toast('Scegli almeno un’azione');if(experimentsLeft<=0)return toast('Esperimenti terminati');experimentsLeft--;document.getElementById('awExpLeft').textContent=experimentsLeft;const out=awRun(experimentSeq,g.active);exResult.className='aw-feedback result';exResult.innerHTML=`<b>${awActionText(experimentSeq)}</b><div>${awScene(out.state,true)}</div><span>${awStateText(out.state)}</span>`};
    const predScene=document.getElementById('awPredictionScene'),predControls=document.getElementById('awPredictionControls'),predFb=document.getElementById('awPredictFeedback');
    function renderPrediction(){predScene.innerHTML=awScene(predicted,false);predControls.querySelectorAll('button').forEach(b=>{const k=b.dataset.k;b.querySelector('b').textContent=k==='orb'?(predicted[k]?'Destra':'Sinistra'):k==='cube'?(predicted[k]?'Destra':'Sinistra'):k==='lamp'?(predicted[k]?'Accesa':'Spenta'):k==='door'?(predicted[k]?'Aperta':'Chiusa'):(predicted[k]?'Dentro':'Fuori')})}
    predControls.querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k==='orb'||k==='cube')predicted[k]=1-predicted[k];else predicted[k]=!predicted[k];renderPrediction()});
    document.getElementById('awPredictVerify').onclick=()=>{if(!hypothesisSolved)return;const diff=awStateDiff(predicted,g.predictState);if(diff===0){predictionSolved=true;predFb.className='aw-feedback success';predFb.innerHTML='<b>Previsione esatta.</b><span>Non stai più osservando questo mondo: hai iniziato a capirlo.</span>';const b=tabs.find(x=>x.dataset.awtab==='break');b.disabled=false;setTimeout(()=>setPhase('break'),650)}else{predFb.className='aw-feedback bad';predFb.innerHTML=`<b>La previsione diverge.</b><span>${diff} elemento${diff>1?'i':''} dello stato finale non coincide${diff>1?'ono':''}. Ricalcola gli effetti nell’ordine.</span>`}};
    const breakBuild=document.getElementById('awBreakSeq'),breakFb=document.getElementById('awBreakFeedback');
    function renderBreak(){breakBuild.innerHTML=breakSeq.length?breakSeq.map((a,i)=>`<button data-brm="${i}"><span>${AW_ACTIONS[a].icon}</span><small>${AW_ACTIONS[a].name}</small></button>`).join('<i>→</i>'):`<em>Costruisci una sequenza · massimo ${g.cfg.breakLen} azioni</em>`;breakBuild.querySelectorAll('[data-brm]').forEach(b=>b.onclick=()=>{breakSeq.splice(+b.dataset.brm,1);renderBreak()})}
    document.querySelectorAll('[data-awbreak]').forEach(b=>b.onclick=()=>{if(breakSeq.length>=g.cfg.breakLen)return toast(`Massimo ${g.cfg.breakLen} azioni`);breakSeq.push(b.dataset.awbreak);renderBreak()});
    document.getElementById('awBreakClear').onclick=()=>{breakSeq.length=0;renderBreak()};
    document.getElementById('awBreakRun').onclick=()=>{if(finished||!predictionSolved)return;if(!breakSeq.length)return toast('Costruisci una sequenza');const out=awRun(breakSeq,g.active),ok=awStateKey(out.state)===awStateKey(g.target);if(ok){finished=true;const sec=Math.floor((Date.now()-activeStart)/1000),score=Math.max(180,2400-checks*90-(g.cfg.experiments-experimentsLeft)*45-sec*2+Math.max(0,g.cfg.breakLen-breakSeq.length)*60);breakFb.className='aw-feedback success';breakFb.innerHTML=`<b>Hai piegato il mondo.</b><span>La tua sequenza raggiunge davvero lo stato-obiettivo in ${breakSeq.length} mosse.</span>`;setTimeout(()=>concludeSession('another',level,score,true,`Leggi scoperte, previsione corretta e mondo modificato in <b>${breakSeq.length}</b> mosse.`),800)}else{const diff=awStateDiff(out.state,g.target);breakFb.className='aw-feedback bad';breakFb.innerHTML=`<b>Il mondo resiste.</b><div>${awScene(out.state,true)}</div><span>${diff} elemento${diff>1?'i':''} non coincide${diff>1?'ono':''} ancora con l’obiettivo.</span>`}};
    renderEx();renderPrediction();renderBreak();startTimer();
    if(!localStorage.getItem('sala_giochi_another_help_v1')){localStorage.setItem('sala_giochi_another_help_v1','1');setTimeout(()=>openHelp(),260)}
  }

  // Ridisegna la Home già caricata da app.js includendo la nuova sezione.
  renderHome();

  // ---------- L'ULTIMO ALIBI ----------
  const LA_CONFIG={
    easy:{suspects:5,evidence:6,events:5,hint:true,attemptInfo:'detail',secondary:0,complications:0},
    medium:{suspects:6,evidence:7,events:5,hint:true,attemptInfo:'count',secondary:.45,complications:1},
    hard:{suspects:7,evidence:8,events:6,hint:false,attemptInfo:'count',secondary:1,complications:1},
    extreme:{suspects:8,evidence:9,events:6,hint:false,attemptInfo:'none',secondary:1,complications:2}
  };
  const LA_NAMES=['Elena Ferri','Andrea Riva','Marta Valli','Riccardo Neri','Giulia Serra','Paolo Conti','Claudia Orsi','Lorenzo Greco','Sara Berti','Davide Sala','Irene Costa','Giorgio Lanza','Nadia Moretti','Tommaso Righi','Beatrice Fontana','Marco De Santis'];
  const LA_ROLES=['nipote della vittima','socio d’affari','segretaria personale','medico di famiglia','fratello della vittima','avvocata di casa','collezionista rivale','governante','giornalista','amico d’infanzia','amministratrice','maggiordomo','restauratrice','notaio','fotografa di famiglia','direttore della fondazione'];
  const LA_MOTIVES=[
    {id:'inheritance',label:'Eredità',text:'una modifica imminente del testamento avrebbe escluso questa persona'},
    {id:'blackmail',label:'Ricatto',text:'la vittima custodiva documenti capaci di distruggerne la reputazione'},
    {id:'debts',label:'Debiti',text:'un debito importante sarebbe diventato esigibile il mattino seguente'},
    {id:'fraud',label:'Frode',text:'la vittima aveva scoperto un ammanco nei conti'},
    {id:'revenge',label:'Vendetta',text:'un vecchio scandalo era stato provocato dalla vittima'},
    {id:'career',label:'Carriera',text:'la vittima stava per revocare un incarico decisivo'},
    {id:'secret',label:'Segreto',text:'una lettera privata rischiava di diventare pubblica'},
    {id:'property',label:'Proprietà',text:'una vendita imminente avrebbe fatto perdere una proprietà contesa'},
    {id:'authorship',label:'Paternità di un’opera',text:'la vittima stava per rivelare chi aveva realmente creato un’opera contesa'},
    {id:'custody',label:'Custodia di documenti',text:'alcuni documenti affidati alla vittima avrebbero provocato conseguenze immediate'}
  ];
  const LA_SETTINGS=[
    {name:'Villa Bellombra',place:'una villa isolata durante un temporale',rooms:['Salone','Biblioteca','Serra','Studio','Sala da musica','Veranda','Cucina','Corridoio']},
    {name:'Hotel Miralago',place:'un albergo sul lago chiuso per la notte',rooms:['Salone','Biblioteca','Veranda','Bar','Sala da tè','Cucina','Corridoio','Giardino d’inverno']},
    {name:'Tenuta Roccanera',place:'una tenuta di campagna durante una cena di famiglia',rooms:['Salone','Studio','Serra','Biblioteca','Sala da pranzo','Cucina','Veranda','Galleria']},
    {name:'Palazzo Orsini',place:'un palazzo storico durante un ricevimento privato',rooms:['Salone','Biblioteca','Galleria','Studio','Sala della musica','Cucina','Terrazza','Corridoio']},
    {name:'Treno Aurora',place:'un treno notturno fermo per una frana',rooms:['Vagone salone','Cabina 4','Vagone ristorante','Cabina 7','Corridoio','Vagone bar','Compartimento bagagli','Piattaforma']},
    {name:'Teatro Fenice Nera',place:'un teatro vuoto dopo la prova generale',rooms:['Palcoscenico','Camerino','Foyer','Sala costumi','Regia','Corridoio','Magazzino','Palco reale']}
  ];
  const LA_ARCHETYPES=[
    {id:'recording',cat:'sound',method:'Colpo alla nuca',trick:'Voce registrata',methodDesc:'un fermacarte di bronzo usato come arma',trickDesc:'una registrazione ha fatto credere che la vittima fosse viva più tardi',decisive:'recording_echo',clueTitle:'Eco nella registrazione',clueIcon:'≋',clueText:'Nella voce attribuita alla vittima compare due volte lo stesso rumore di fondo, con identica intensità e durata.',methodClue:'Fermacarte di bronzo',methodIcon:'◆',methodText:'Sul bordo inferiore resta una microtraccia compatibile con la ferita.',offset:-18,timelineHint:'Un suono udito più tardi non dimostra che la vittima fosse ancora viva.',secondary:true},
    {id:'delay',cat:'time',method:'Veleno ad azione ritardata',trick:'Morte ritardata',methodDesc:'una sostanza ingerita molto prima del collasso',trickDesc:'l’ora del crollo non coincide con l’ora dell’avvelenamento',decisive:'toxin_delay',clueTitle:'Referto tossicologico',clueIcon:'✚',clueText:'La sostanza impiega 25–35 minuti prima di produrre i sintomi visibili.',methodClue:'Residuo nel bicchiere',methodIcon:'◌',methodText:'Sul fondo resta una traccia della sostanza, ma la bottiglia comune è pulita.',offset:-30,timelineHint:'Il momento del collasso non coincide con quello in cui il delitto è stato preparato.',secondary:true},
    {id:'clock',cat:'time',method:'Strangolamento',trick:'Orologio falsificato',methodDesc:'una cordicella sottile poi rimossa dalla scena',trickDesc:'le lancette sono state spostate per creare una falsa ora del delitto',decisive:'clock_dust',clueTitle:'Polvere sulle lancette',clueIcon:'◷',clueText:'Una strisciata recente attraversa la polvere del quadrante: qualcuno ha mosso le lancette dopo l’arresto.',methodClue:'Cordicella di seta',methodIcon:'⌁',methodText:'Un filo spezzato sotto il tappeto presenta fibre compatibili con il segno sul collo.',offset:-12,timelineHint:'L’ora mostrata dalla scena è stata costruita e non coincide con quella reale.',secondary:true},
    {id:'latch',cat:'access',method:'Colpo con oggetto pesante',trick:'Porta a scatto',methodDesc:'un oggetto della stanza ripulito e rimesso al suo posto',trickDesc:'la porta si chiude automaticamente e crea una falsa stanza chiusa',decisive:'latch_test',clueTitle:'Serratura a scatto',clueIcon:'▯',clueText:'La porta si blocca da sola quando viene tirata: la chiave all’interno non prova che nessuno sia uscito.',methodClue:'Statua di marmo',methodIcon:'♜',methodText:'La base è stata pulita di recente; in una scanalatura resta una fibra.',offset:-8,timelineHint:'La porta chiusa non dimostra affatto che il colpevole fosse ancora nella stanza.',secondary:true},
    {id:'glass',cat:'object',method:'Veleno nel bicchiere',trick:'Scambio dei bicchieri',methodDesc:'la sostanza era in un bicchiere diverso da quello originariamente usato dalla vittima',trickDesc:'i bicchieri sono stati scambiati dopo il brindisi',decisive:'glass_monogram',clueTitle:'Bicchiere con monogramma',clueIcon:'◌',clueText:'Il bicchiere personale della vittima è sul carrello; quello accanto al corpo non porta le sue iniziali.',methodClue:'Residuo sul panno',methodIcon:'◇',methodText:'Il panno del carrello contiene la stessa sostanza trovata nel bicchiere accanto al corpo.',offset:-10,timelineHint:'Lo scambio è avvenuto prima che la vittima usasse il bicchiere trovato accanto al corpo.',secondary:true},
    {id:'music',cat:'sound',method:'Colpo alla tempia',trick:'Musica automatica',methodDesc:'un piccolo martello decorativo ha provocato il colpo mortale',trickDesc:'un meccanismo automatico ha simulato una presenza nella sala della musica',decisive:'music_spring',clueTitle:'Meccanismo a molla',clueIcon:'⚙',clueText:'Sotto il leggio c’è un dispositivo che può avviare da solo il motivo udito dagli ospiti.',methodClue:'Martello decorativo',methodIcon:'◆',methodText:'Una piccola ammaccatura recente e una microtraccia lo collegano alla ferita.',offset:-14,timelineHint:'La musica udita più tardi non richiedeva la presenza di nessuno nella stanza.',secondary:true},
    {id:'video',cat:'time',method:'Soffocamento',trick:'Video con orario ingannevole',methodDesc:'un cuscino decorativo è stato usato e poi rimesso al suo posto',trickDesc:'un breve video precedente è stato mostrato come se fosse appena registrato',decisive:'video_metadata',clueTitle:'Metadati del video',clueIcon:'▣',clueText:'Il file mostrato agli ospiti contiene un fotogramma creato ventidue minuti prima dell’orario dichiarato.',methodClue:'Cuscino ricollocato',methodIcon:'□',methodText:'Una cucitura contiene una fibra e una lieve deformazione incompatibili con il normale uso.',offset:-22,timelineHint:'L’immagine è autentica, ma non appartiene all’orario in cui è stata mostrata.',secondary:true},
    {id:'medicine',cat:'poison',method:'Sovradosaggio farmacologico',trick:'Farmaco sostituito',methodDesc:'una compressa è stata sostituita con una dose molto più potente',trickDesc:'la confezione corretta conteneva una compressa che non doveva trovarsi lì',decisive:'pill_mark',clueTitle:'Incisione sulla compressa',clueIcon:'✚',clueText:'Una compressa nel blister ha forma e incisione diverse dalle altre, pur essendo stata rimessa nella stessa sede.',methodClue:'Blister manipolato',methodIcon:'▤',methodText:'La pellicola di una sola cavità è stata richiusa con un adesivo trasparente.',offset:-25,timelineHint:'Il gesto apparentemente normale di assumere una medicina è stato trasformato nel momento decisivo.',secondary:false},
    {id:'container',cat:'object',method:'Avvelenamento',trick:'Scambio di contenitori',methodDesc:'la sostanza era in un piccolo contenitore personale',trickDesc:'due contenitori quasi identici sono stati invertiti prima dell’uso',decisive:'container_scratch',clueTitle:'Graffio sul tappo',clueIcon:'◇',clueText:'Il tappo trovato sulla scrivania combacia con il contenitore sul carrello, non con quello accanto al corpo.',methodClue:'Residuo concentrato',methodIcon:'✚',methodText:'La sostanza è presente solo nel contenitore che non apparteneva alla vittima.',offset:-12,timelineHint:'L’oggetto apparentemente personale della vittima non era quello che aveva usato all’inizio della serata.',secondary:true},
    {id:'hiddenroute',cat:'access',method:'Accoltellamento',trick:'Percorso alternativo',methodDesc:'un tagliacarte della stanza è stato usato come arma',trickDesc:'un passaggio di servizio consente di entrare senza attraversare il corridoio sorvegliato',decisive:'service_dust',clueTitle:'Polvere interrotta',clueIcon:'⌁',clueText:'Dietro una libreria la polvere del battiscopa è interrotta da un arco recente, come se il mobile fosse stato mosso.',methodClue:'Tagliacarte',methodIcon:'◆',methodText:'La lama è stata pulita ma nel punto di innesto resta una microtraccia.',offset:-6,timelineHint:'L’assenza dal corridoio principale non equivale all’impossibilità di raggiungere la stanza.',secondary:true},
    {id:'movedobject',cat:'scene',method:'Colpo con oggetto pesante',trick:'Oggetto spostato dopo il delitto',methodDesc:'un fermalibri è stato usato come arma',trickDesc:'l’arma è stata trasferita in un’altra stanza per far cercare il colpevole altrove',decisive:'dust_outline',clueTitle:'Sagoma nella polvere',clueIcon:'◇',clueText:'Sul ripiano resta la sagoma pulita di un oggetto che ora si trova nella stanza vicina.',methodClue:'Fermalibri',methodIcon:'◆',methodText:'Un’ammaccatura recente coincide con il profilo della ferita.',offset:-8,timelineHint:'La posizione in cui un oggetto viene trovato non prova dove fosse al momento del delitto.',secondary:true},
    {id:'movedbody',cat:'scene',method:'Trauma cranico',trick:'Corpo spostato',methodDesc:'la vittima è stata colpita in un’altra stanza',trickDesc:'il corpo è stato trasferito per alterare luogo e orario apparenti',decisive:'carpet_trace',clueTitle:'Fibra di tappeto',clueIcon:'⌁',clueText:'Sui vestiti della vittima c’è una fibra del tappeto della stanza adiacente, assente nella stanza del ritrovamento.',methodClue:'Macchia ripulita',methodIcon:'◇',methodText:'Una zona del pavimento nella stanza adiacente reagisce al controllo nonostante sia stata lavata.',offset:-16,timelineHint:'Il luogo del ritrovamento non è necessariamente il luogo in cui è avvenuta l’aggressione.',secondary:true},
    {id:'falsescene',cat:'scene',method:'Ferita da taglio',trick:'Falsa scena del crimine',methodDesc:'una lama personale è stata usata altrove',trickDesc:'oggetti e tracce sono stati disposti per simulare una colluttazione nella stanza sbagliata',decisive:'broken_after',clueTitle:'Vetro rotto senza polvere',clueIcon:'◇',clueText:'I frammenti sono sopra uno strato di polvere intatto: il vetro è stato rotto dopo che la stanza era già rimasta inutilizzata.',methodClue:'Lama ripulita',methodIcon:'◆',methodText:'La lama mostra una pulizia recente incompatibile con il resto dell’oggetto.',offset:-12,timelineHint:'La scena racconta una storia coerente solo se si presume che tutte le tracce siano nate lì.',secondary:true},
    {id:'disguisedweapon',cat:'object',method:'Ferita penetrante',trick:'Arma camuffata',methodDesc:'un oggetto decorativo nascondeva una punta rigida',trickDesc:'l’arma sembrava un innocuo accessorio della stanza',decisive:'cap_thread',clueTitle:'Filettatura nascosta',clueIcon:'⌕',clueText:'Il pomolo decorativo può essere svitato: all’interno c’è un alloggiamento con residui recenti.',methodClue:'Bastone ornamentale',methodIcon:'◆',methodText:'La lunghezza della punta interna coincide con la profondità della ferita.',offset:-5,timelineHint:'Un oggetto apparentemente innocuo può spiegare perché nessuno abbia visto entrare un’arma.',secondary:false},
    {id:'improvised',cat:'object',method:'Colpo contundente',trick:'Arma improvvisata e ricollocata',methodDesc:'un oggetto comune è stato usato e poi rimesso nella sua posizione abituale',trickDesc:'l’arma non manca dalla stanza perché è tornata esattamente al suo posto',decisive:'clean_patch',clueTitle:'Zona insolitamente pulita',clueIcon:'◇',clueText:'Un solo lato dell’oggetto è stato lucidato di recente, mentre il resto conserva polvere uniforme.',methodClue:'Candeliere',methodIcon:'♜',methodText:'Il peso e il bordo corrispondono alla lesione descritta nel referto.',offset:-6,timelineHint:'Non serve che un’arma scompaia: può essere rimessa dove tutti si aspettano di trovarla.',secondary:false},
    {id:'remote',cat:'remote',method:'Scarica elettrica',trick:'Dispositivo azionato a distanza',methodDesc:'un contatto elettrico è stato predisposto sulla lampada',trickDesc:'il circuito poteva essere attivato da un comando remoto fuori dalla stanza',decisive:'remote_freq',clueTitle:'Ricevitore radio',clueIcon:'⚡',clueText:'Nel piede della lampada è nascosto un ricevitore con la stessa frequenza di un piccolo telecomando trovato tra gli oggetti comuni.',methodClue:'Contatto modificato',methodIcon:'⚙',methodText:'Due fili sono stati spellati e riposizionati dietro la base della lampada.',offset:0,timelineHint:'Il colpevole non doveva trovarsi accanto alla vittima quando il dispositivo è entrato in funzione.',secondary:true},
    {id:'timer',cat:'remote',method:'Trauma provocato da dispositivo',trick:'Meccanismo temporizzato',methodDesc:'un oggetto pesante è stato liberato da un semplice timer meccanico',trickDesc:'l’azione mortale è avvenuta dopo che il colpevole aveva lasciato la stanza',decisive:'timer_teeth',clueTitle:'Timer meccanico',clueIcon:'⚙',clueText:'Tra gli ingranaggi è incastrato un filo spezzato che poteva trattenere il contrappeso fino all’ora impostata.',methodClue:'Contrappeso',methodIcon:'◆',methodText:'Il bordo del peso mostra un urto recente compatibile con la lesione.',offset:0,timelineHint:'L’alibi all’ora della morte è reale, ma non esclude chi aveva preparato il dispositivo prima.',secondary:true},
    {id:'phone',cat:'location',method:'Colpo alla nuca',trick:'Telefonata da luogo diverso',methodDesc:'un oggetto della stanza è stato usato come arma',trickDesc:'una deviazione di chiamata ha fatto sembrare che la telefonata provenisse da un’altra stanza',decisive:'phone_log',clueTitle:'Registro della centralina',clueIcon:'☎',clueText:'La chiamata è stata inoltrata internamente: il numero visualizzato non identifica il punto da cui si parlava.',methodClue:'Fermaporta',methodIcon:'◆',methodText:'Una piccola scheggiatura recente coincide con la ferita.',offset:-10,timelineHint:'La provenienza apparente di una telefonata non coincide necessariamente con la posizione di chi parla.',secondary:true},
    {id:'scheduledmsg',cat:'time',method:'Avvelenamento',trick:'Messaggio programmato',methodDesc:'una sostanza è stata introdotta durante la cena',trickDesc:'un messaggio automatico ha fatto credere che la vittima fosse ancora attiva più tardi',decisive:'message_queue',clueTitle:'Coda dei messaggi',clueIcon:'✉',clueText:'Il dispositivo registra che il messaggio era stato programmato prima dell’ora in cui è stato ricevuto.',methodClue:'Cucchiaino contaminato',methodIcon:'◇',methodText:'Sul cucchiaino resta una traccia della sostanza assente nella bevanda comune.',offset:-20,timelineHint:'Un messaggio ricevuto a una certa ora non prova che sia stato scritto in quel momento.',secondary:true},
    {id:'identityswap',cat:'identity',method:'Colpo contundente',trick:'Scambio di identità',methodDesc:'un oggetto personale è stato usato durante un incontro privato',trickDesc:'due persone si sono scambiate un elemento distintivo e un testimone ha attribuito la presenza alla persona sbagliata',decisive:'wrong_initials',clueTitle:'Iniziali sul fazzoletto',clueIcon:'⌕',clueText:'Il fazzoletto visto dal testimone porta iniziali diverse da quelle della persona che credeva di aver riconosciuto.',methodClue:'Oggetto personale',methodIcon:'◆',methodText:'Sulla superficie resta una traccia recente incompatibile con l’uso normale.',offset:-8,timelineHint:'Il testimone ha visto davvero qualcuno, ma l’identificazione della persona può essere sbagliata.',secondary:true},
    {id:'disguise',cat:'identity',method:'Strangolamento',trick:'Travestimento parziale',methodDesc:'una sciarpa è stata usata come mezzo di strangolamento',trickDesc:'cappotto e cappello hanno creato una falsa identificazione a distanza',decisive:'coat_size',clueTitle:'Cappotto della misura sbagliata',clueIcon:'▤',clueText:'Il cappotto attribuito a un sospetto è di due taglie più grande e presenta una piega recente sulle maniche.',methodClue:'Sciarpa',methodIcon:'⌁',methodText:'Le fibre corrispondono al segno lasciato sul collo della vittima.',offset:-7,timelineHint:'Un riconoscimento basato su sagoma e abiti può essere sincero ma comunque errato.',secondary:true},
    {id:'reflection',cat:'perception',method:'Ferita da taglio',trick:'Riflesso scambiato per presenza diretta',methodDesc:'un tagliacarte è stato usato nella stanza adiacente',trickDesc:'un testimone ha visto una figura nello specchio e l’ha collocata nella stanza sbagliata',decisive:'mirror_angle',clueTitle:'Angolo dello specchio',clueIcon:'◇',clueText:'Dalla posizione del testimone lo specchio riflette la porta della stanza accanto, non il centro della stanza osservata.',methodClue:'Tagliacarte',methodIcon:'◆',methodText:'La punta è stata ripulita ma conserva una microtraccia nel manico.',offset:-5,timelineHint:'Vedere una persona non significa necessariamente vederla nel luogo che sembra occupare.',secondary:true},
    {id:'misread',cat:'perception',method:'Caduta provocata',trick:'Testimone sincero ma interpretazione errata',methodDesc:'un gradino è stato reso instabile prima del passaggio della vittima',trickDesc:'un gesto normale è stato interpretato come segnale che la vittima fosse ancora cosciente',decisive:'curtain_cord',clueTitle:'Cordoncino della tenda',clueIcon:'⌁',clueText:'Il movimento visto dalla veranda coincide con la tenda tirata dal vento, non con una persona dietro il vetro.',methodClue:'Gradino allentato',methodIcon:'⚙',methodText:'Due viti risultano svitate di recente e conservano segni dello stesso utensile.',offset:-10,timelineHint:'Il testimone non mente: ha visto un movimento reale, ma gli ha attribuito la causa sbagliata.',secondary:true},
    {id:'soundroom',cat:'sound',method:'Colpo contundente',trick:'Suono proveniente da un’altra stanza',methodDesc:'un trofeo è stato usato come arma',trickDesc:'un condotto acustico ha fatto sembrare che la voce provenisse dalla stanza del delitto',decisive:'vent_test',clueTitle:'Condotto di aerazione',clueIcon:'≋',clueText:'Parlando nella stanza adiacente la voce è chiaramente udibile vicino alla griglia della biblioteca.',methodClue:'Trofeo',methodIcon:'◆',methodText:'Una piccola ammaccatura recente coincide con il profilo della ferita.',offset:-12,timelineHint:'Il luogo da cui un suono sembra provenire può essere diverso dalla sua origine reale.',secondary:true},
    {id:'unwitting',cat:'alibi',method:'Avvelenamento',trick:'Complice inconsapevole',methodDesc:'una sostanza è stata inserita in una tazza preparata in precedenza',trickDesc:'un innocente ha consegnato l’oggetto preparato dal colpevole senza conoscerne il contenuto',decisive:'tray_sequence',clueTitle:'Sequenza del vassoio',clueIcon:'▤',clueText:'Il registro di cucina mostra che il vassoio è rimasto incustodito per quattro minuti prima di essere consegnato da un’altra persona.',methodClue:'Tazza contaminata',methodIcon:'◌',methodText:'La sostanza è presente nella tazza ma non nella teiera comune.',offset:-18,timelineHint:'Chi ha materialmente consegnato l’oggetto non è necessariamente chi lo ha preparato.',secondary:true},
    {id:'routine',cat:'automation',method:'Colpo contundente',trick:'Routine automatica sfruttata come alibi',methodDesc:'un oggetto pesante è stato usato prima dell’avvio di una routine domestica',trickDesc:'luci e tende programmate hanno fatto sembrare occupata una stanza vuota',decisive:'automation_log',clueTitle:'Registro dell’automazione',clueIcon:'⚙',clueText:'Luci e tende si sono attivate automaticamente all’orario consueto senza alcun comando manuale.',methodClue:'Oggetto della scrivania',methodIcon:'◆',methodText:'Sul bordo c’è una traccia ripulita solo parzialmente.',offset:-15,timelineHint:'Una stanza che si illumina o cambia aspetto non prova che qualcuno sia presente.',secondary:true},
    {id:'earlier',cat:'time',method:'Soffocamento',trick:'Delitto precedente all’ora presunta',methodDesc:'il delitto è avvenuto prima della finestra temporale considerata da tutti',trickDesc:'un evento successivo è stato interpretato come prova di vita',decisive:'temperature',clueTitle:'Temperatura della bevanda',clueIcon:'♨',clueText:'La bevanda appena “servita” è già a temperatura ambiente: è stata versata molto prima dell’orario dichiarato.',methodClue:'Cuscino',methodIcon:'□',methodText:'Una cucitura presenta fibre recenti compatibili con i vestiti della vittima.',offset:-28,timelineHint:'Tutti stanno cercando il colpevole nella finestra temporale sbagliata.',secondary:true},
    {id:'later',cat:'time',method:'Dispositivo temporizzato',trick:'Delitto successivo all’ora presunta',methodDesc:'un dispositivo predisposto prima ha agito dopo che tutti credevano il pericolo passato',trickDesc:'un falso segnale ha anticipato l’ora che tutti associano alla morte',decisive:'fresh_stop',clueTitle:'Orologio arrestato troppo presto',clueIcon:'◷',clueText:'L’orologio è fermo, ma un dispositivo nella stanza registra attività elettrica per altri diciassette minuti.',methodClue:'Dispositivo nascosto',methodIcon:'⚙',methodText:'Un meccanismo dietro la tenda conserva un timer ancora impostato.',offset:17,timelineHint:'L’evento che sembrava segnare la morte è avvenuto prima dell’azione realmente letale.',secondary:true},
    {id:'victimtrigger',cat:'remote',method:'Reazione chimica',trick:'La vittima attiva inconsapevolmente il meccanismo',methodDesc:'due sostanze innocue separatamente diventano pericolose quando vengono mescolate dalla vittima',trickDesc:'il colpevole prepara la situazione ma l’ultima azione viene compiuta dalla vittima stessa',decisive:'two_residues',clueTitle:'Due residui separati',clueIcon:'✚',clueText:'Una sostanza è sul cucchiaino e l’altra nella bevanda: nessuna delle due, da sola, spiega l’esito.',methodClue:'Preparazione del bicchiere',methodIcon:'◌',methodText:'Il bicchiere è stato predisposto molto prima che la vittima aggiungesse l’ultimo ingrediente.',offset:0,timelineHint:'L’ultima azione materiale può essere stata compiuta dalla vittima senza eliminare la responsabilità di chi ha preparato il meccanismo.',secondary:false},
    {id:'stagedfall',cat:'scene',method:'Colpo alla nuca',trick:'Caduta simulata',methodDesc:'la vittima è stata colpita e poi collocata ai piedi della scala',trickDesc:'la scena è stata costruita per far sembrare accidentale una lesione precedente',decisive:'blood_direction',clueTitle:'Direzione della traccia',clueIcon:'⌁',clueText:'La traccia sulla ringhiera scende nella direzione opposta a quella prevista da una caduta dall’alto.',methodClue:'Fermaporta',methodIcon:'◆',methodText:'Il bordo reca una microtraccia compatibile con la ferita.',offset:-10,timelineHint:'La posizione finale del corpo è compatibile con una caduta, ma la dinamica delle tracce no.',secondary:true},
  ];
  const LA_COMPLICATIONS=[
    {id:'planted',title:'Oggetto piazzato',icon:'◆',text:ctx=>`Un oggetto appartenente a ${ctx.other.name} è in posizione troppo evidente e privo della normale polvere: sembra collocato apposta.`,summary:'un oggetto è stato piazzato per indirizzare i sospetti verso un innocente'},
    {id:'partial',title:'Alibi solo parziale',icon:'◷',text:ctx=>`L’alibi di ${ctx.c.name} è verificato alle ${ctx.apparent}, ma nessuno lo colloca con certezza nei quindici minuti precedenti.`,summary:'l’alibi copre l’ora apparente, non tutta la finestra utile'},
    {id:'witness',title:'Riconoscimento incerto',icon:'⌕',text:ctx=>`Un testimone riconosce un cappotto, non un volto: lo stesso capo era stato lasciato nell’ingresso comune.`,summary:'un riconoscimento sincero si basa su un dettaglio non esclusivo'},
    {id:'blackout',title:'Interruzione di corrente',icon:'⚡',text:ctx=>`Per quattro minuti le luci e parte delle telecamere non hanno funzionato. Il registro tecnico conferma l’intervallo.`,summary:'un breve blackout interrompe alcune osservazioni'},
    {id:'sharedmotive',title:'Movente condiviso',icon:'✎',text:ctx=>`${ctx.other.name} aveva un motivo quasi altrettanto forte: la vittima aveva preso una decisione che danneggiava entrambi.`,summary:'un secondo sospetto possiede un movente credibile'},
    {id:'handled',title:'Oggetto toccato da un innocente',icon:'◇',text:ctx=>`${ctx.other.name} ammette di aver spostato l’oggetto nel pomeriggio: le sue impronte quindi non indicano necessariamente il delitto.`,summary:'una traccia autentica appartiene a un innocente per un motivo precedente'},
    {id:'delivery',title:'Consegna inconsapevole',icon:'▤',text:ctx=>`Un domestico ha portato il vassoio senza prepararlo: la consegna e la preparazione sono state compiute da persone diverse.`,summary:'un innocente compie l’ultima azione visibile senza conoscere il piano'},
    {id:'thunder',title:'Rumore coperto dal temporale',icon:'≋',text:ctx=>`Un tuono molto forte è registrato alle ${laTime(ctx.apparent,-9)}: avrebbe coperto un rumore proveniente dal corridoio.`,summary:'un rumore ambientale rende incompleta una testimonianza acustica'},
    {id:'camera',title:'Buco nella registrazione',icon:'▣',text:ctx=>`La telecamera del corridoio salta esattamente sette minuti per un riavvio automatico, poi riprende senza anomalie.`,summary:'una registrazione apparentemente continua contiene un intervallo mancante'},
    {id:'cleaning',title:'Pulizia fuori orario',icon:'◇',text:ctx=>`Una zona del pavimento è stata lavata dopo l’orario abituale; il registro delle pulizie non prevede interventi in quella stanza.`,summary:'una pulizia anomala ha cancellato parte delle tracce'}
  ];
  function laPick(arr){return arr[Math.floor(activeRng()*arr.length)]}
  function laTime(base,delta){const [h,m]=base.split(':').map(Number),n=h*60+m+delta;return `${String((Math.floor(n/60)+24)%24).padStart(2,'0')}:${String((n%60+60)%60).padStart(2,'0')}`}
  function laShuffle(arr){return shuffle(arr,activeRng)}
  function laUniqueOptions(correct, pool, max=5){const seen=new Set([correct.id]),unique=[];for(const x of pool){if(!seen.has(x.id)){seen.add(x.id);unique.push(x)}}const out=[correct,...laShuffle(unique)].slice(0,max);return laShuffle(out)}
  function laGenerate(level){
    const cfg=LA_CONFIG[level],setting=laPick(LA_SETTINGS),arch=laPick(LA_ARCHETYPES),names=laShuffle(LA_NAMES).slice(0,cfg.suspects),roles=laShuffle(LA_ROLES).slice(0,cfg.suspects),motives=laShuffle(LA_MOTIVES).slice(0,cfg.suspects),culprit=Math.floor(activeRng()*cfg.suspects),victim=laPick(['Edoardo Valli','Alberto Rinaldi','Vittorio Malaspina','Cesare Bellini','Livia Montorsi','Adele Corsini','Renato Valeri']);
    const baseHour=21+Math.floor(activeRng()*2),baseMin=[5,10,15,20,25,30][Math.floor(activeRng()*6)],apparent=`${String(baseHour).padStart(2,'0')}:${String(baseMin).padStart(2,'0')}`,realOffset=arch.offset||0,real=laTime(apparent,realOffset),crimeRoom=setting.rooms[1],findDelta=Math.max(12,realOffset+8),findTime=laTime(apparent,findDelta),culpritMotive=motives[culprit];
    const rooms=laShuffle(setting.rooms.filter(r=>r!==crimeRoom));
    const suspects=names.map((name,i)=>{
      const room=rooms[i%rooms.length],witness=names[(i+1)%names.length],isC=i===culprit;
      let alibi=`Alle ${apparent} ero in ${room}. ${i%2===0?`${witness} può confermare di avermi visto poco dopo.`:`Un dettaglio della stanza conferma che vi sono passato.`}`;
      let obs=`Ho visto ${names[(i+2)%names.length]} dirigersi verso ${setting.rooms[(i+3)%setting.rooms.length]} prima che trovassero il corpo.`;
      if(isC){alibi=`Alle ${apparent} ero in ${room}; il mio alibi per quell’ora è verificabile.`;obs=`Non ho più parlato con ${victim} dopo l’incontro precedente. Ho saputo del delitto insieme agli altri.`}
      return {id:`s${i}`,name,role:roles[i],motive:motives[i],room,isC,initials:name.split(' ').map(x=>x[0]).join('').slice(0,2),relation:`${name} è ${roles[i]}. Tra i due c’erano tensioni: ${motives[i].text}.`,alibi,obs};
    });
    const c=suspects[culprit],other=suspects[(culprit+1)%suspects.length];
    const secondaryCandidates=LA_ARCHETYPES.filter(x=>x.secondary&&x.id!==arch.id&&x.cat!==arch.cat);
    const useSecondary=cfg.secondary===1 || (cfg.secondary>0&&activeRng()<cfg.secondary);
    const secondary=useSecondary?laPick(secondaryCandidates):null;
    const complications=laShuffle(LA_COMPLICATIONS).slice(0,cfg.complications);
    const ctx={c,other,victim,apparent,real,findTime,crimeRoom,setting};
    const tracePool=[
      ['trace_fiber','Fibra sul bordo','⌁',`Una fibra nel punto rilevante corrisponde al tessuto dell’abito indossato da ${c.name}.`],
      ['trace_print','Impronta incompleta','⌕',`Una porzione d’impronta compatibile con ${c.name} compare in un punto che non aveva motivo di toccare.`],
      ['trace_note','Annotazione privata','✎',`La vittima aveva scritto: “Parlerò con ${c.name.split(' ')[0]} prima di tutti”.`],
      ['trace_access','Registro di accesso','≡',`Un passaggio associato a ${c.name} è registrato vicino a ${crimeRoom} durante la finestra utile.`],
      ['trace_thread','Filo strappato','⌁',`Un filo del colore dell’abito di ${c.name} è rimasto impigliato in un punto collegato al meccanismo.`]
    ];
    const culpritTrace=laPick(tracePool);
    let evidence=[
      [arch.decisive,arch.clueTitle,arch.clueIcon,arch.clueText],
      [`method_${arch.id}`,arch.methodClue,arch.methodIcon,arch.methodText],
      culpritTrace,
      ['motive_doc','Documento della vittima','✎',`Il documento riguarda direttamente ${c.name}: ${culpritMotive.text}.`]
    ];
    if(secondary){evidence.push([`secondary_${secondary.id}`,`Seconda anomalia: ${secondary.trick}`,secondary.clueIcon,`${secondary.clueText} Questo dettaglio non spiega il metodo principale, ma altera la lettura dell’alibi.`])}
    for(const comp of complications)evidence.push([`comp_${comp.id}`,comp.title,comp.icon,comp.text(ctx)]);
    const neutral=[
      ['neutral_window','Finestra','▯','Nessun segno di effrazione evidente; il telaio non mostra danni recenti.'],
      ['neutral_glass','Bicchiere comune','◌','Non contiene sostanze utili alla ricostruzione.'],
      ['neutral_book','Libro aperto','▤','La pagina segnata riguarda un argomento estraneo al caso.'],
      ['neutral_ash','Cenere nel camino','≈','I frammenti bruciati sono troppo incompleti per attribuire un nome.'],
      ['neutral_clock','Orologio del corridoio','◷',`Segna correttamente le ${laTime(apparent,-6)} quando viene controllato.`],
      ['neutral_key','Chiave di servizio','◆','Apre solo un armadio della biancheria e non la stanza del delitto.']
    ];
    evidence.push(...laShuffle(neutral));
    evidence=evidence.slice(0,cfg.evidence).map((e,i)=>({id:e[0],title:e[1],icon:e[2],text:e[3],essential:true,index:i}));
    const prepDelta=Math.min(realOffset-12,-18),midDelta=realOffset-5;
    let timedEvents=[
      {d:prepDelta,label:`${laTime(apparent,prepDelta)} · preparazione`,text:'Un gesto apparentemente secondario crea le condizioni perché il piano funzioni.'},
      {d:midDelta,label:`${laTime(apparent,midDelta)} · ultimo incontro utile`,text:`${victim} viene visto o sentito durante la finestra che precede il momento decisivo.`},
      {d:realOffset,label:`${real} · momento decisivo`,text:arch.methodDesc+'.'},
      {d:0,label:`${apparent} · ora che inganna`,text:arch.trickDesc+'.'},
      {d:findDelta,label:`${findTime} · scoperta del corpo`,text:'La scena viene interpretata inizialmente secondo l’ora apparente.'}
    ];
    if(secondary)timedEvents.push({d:-4,label:`${laTime(apparent,-4)} · seconda anomalia`,text:secondary.trickDesc+'.'});
    while(timedEvents.length<cfg.events){const d=-2-timedEvents.length;timedEvents.push({d,label:`${laTime(apparent,d)} · movimento registrato`,text:'Un passaggio secondario aiuta a fissare la sequenza senza identificare da solo il colpevole.'})}
    timedEvents.sort((a,b)=>a.d-b.d);
    let events=timedEvents.slice(0,cfg.events).map((e,i)=>({id:`e${i}`,label:e.label,text:e.text,order:i}));
    const allMethods=LA_ARCHETYPES.map(x=>({id:x.method,label:x.method}));
    const allTricks=LA_ARCHETYPES.map(x=>({id:x.trick,label:x.trick}));
    const accusationOptions={
      culprit:laShuffle(suspects.map(x=>({id:x.id,label:x.name}))),
      motive:laUniqueOptions({id:culpritMotive.id,label:culpritMotive.label},LA_MOTIVES.map(x=>({id:x.id,label:x.label})),5),
      method:laUniqueOptions({id:arch.method,label:arch.method},allMethods,5),
      trick:laUniqueOptions({id:arch.trick,label:arch.trick},allTricks,5),
      clue:laUniqueOptions({id:arch.decisive,label:arch.clueTitle},evidence.map(x=>({id:x.id,label:x.title})),Math.min(6,evidence.length))
    };
    const secondarySummary=secondary?` Il caso contiene anche un secondo depistaggio: ${secondary.trick.toLowerCase()}.`:'';
    const complicationSummary=complications.length?` Complicazioni: ${complications.map(x=>x.summary).join('; ')}.`:'';
    return {cfg,setting,arch,secondary,complications,secondarySummary,complicationSummary,timelineHint:arch.timelineHint,victim,apparent,real,findTime,suspects,culprit,culpritMotive,crimeRoom,evidence,events,accusationOptions,solution:{culprit:`s${culprit}`,motive:culpritMotive.id,method:arch.method,trick:arch.trick,clue:arch.decisive},title:`Il caso di ${setting.name}`,intro:`${victim} viene trovato senza vita in ${crimeRoom.toLowerCase()} a ${setting.name}, ${setting.place}. Tutti i presenti hanno un motivo. Quasi tutti hanno anche un alibi.`};
  }
  function laPortrait(s){return `<span class="la-avatar">${s.initials}</span>`}
  function laSelect(name,options,placeholder){return `<div class="la-acc-group"><label>${name}</label><div class="la-choice-grid" data-accgroup="${name}">${options.map(o=>`<button type="button" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join('')}</div><small>${placeholder}</small></div>`}
  function startAlibi(level){
    setSG2Mode('sg2-alibi-play');
    setHeader("L'ULTIMO ALIBI",LEVEL_NAMES[level]);
    const g=laGenerate(level),session=sessionState('alibi',level),seenEvidence=new Set(),seenSuspects=new Set(),acc={culprit:null,motive:null,method:null,trick:null,clue:null};
    let phase='scene',timeline=laShuffle(g.events.map(e=>({...e}))),timelineSolved=false,challenge=false,attempts=0,finished=false;if(timeline.every((e,i)=>e.order===i)&&timeline.length>1)[timeline[0],timeline[1]]=[timeline[1],timeline[0]];
    app.innerHTML=gameShell('alibi',level,`
      <div class="la-case-head"><div><span>CASO ${String(session.session).padStart(2,'0')}</span><b>${esc(g.title)}</b><small>${esc(g.intro)}</small></div><div class="la-case-time"><small>ORA APPARENTE</small><strong>${g.apparent}</strong></div></div>
      <nav class="la-tabs">
        <button class="active" data-latab="scene"><span>1</span><b>Scena</b></button>
        <button data-latab="suspects"><span>2</span><b>Sospetti</b></button>
        <button data-latab="timeline"><span>3</span><b>Timeline</b></button>
        <button data-latab="accuse" disabled><span>4</span><b>Accusa</b></button>
      </nav>
      <section class="la-panel active" data-lapanel="scene">
        <div class="la-crime-visual"><div class="la-room-name">${esc(g.crimeRoom)}</div><span class="la-body-mark">×</span><span class="la-clock-mark">${g.apparent}</span><span class="la-paper-mark"></span><span class="la-glass-mark">◌</span><div class="la-scene-copy"><b>${esc(g.victim)}</b><small>Corpo scoperto alle ${g.findTime}</small></div></div>
        <div class="la-section-title"><span>01</span><div><b>Indizi sulla scena</b><small>Tocca ogni elemento per esaminarlo. Non tutti pesano allo stesso modo.</small></div></div>
        <div class="la-evidence-grid">${g.evidence.map(e=>`<button data-evidence="${e.id}"><span>${e.icon}</span><div><b>${esc(e.title)}</b><small>Da esaminare</small></div><i>›</i></button>`).join('')}</div>
        <div id="laEvidenceDetail" class="la-detail-box"><b>Scegli un indizio</b><span>I dettagli appariranno qui.</span></div>
        <button class="la-next" data-lago="suspects">Interroga i sospetti <span>→</span></button>
      </section>
      <section class="la-panel" data-lapanel="suspects">
        <div class="la-section-title"><span>02</span><div><b>Cerchia dei sospetti</b><small>Motivo, alibi e osservazione: ascolta tutti prima di decidere chi credere.</small></div></div>
        <div class="la-suspects">${g.suspects.map(s=>`<button data-suspect="${s.id}">${laPortrait(s)}<div><b>${esc(s.name)}</b><small>${esc(s.role)}</small></div><i>›</i></button>`).join('')}</div>
        <div id="laSuspectDetail" class="la-suspect-detail"><div class="la-empty-person">?</div><p>Scegli un sospetto per aprire il suo fascicolo.</p></div>
        <button class="la-next" data-lago="timeline">Ricostruisci la timeline <span>→</span></button>
      </section>
      <section class="la-panel" data-lapanel="timeline">
        <div class="la-section-title"><span>03</span><div><b>Ordina gli eventi</b><small>Usa ↑ e ↓. Non ti diremo quali eventi sono sbagliati, solo quanti sono fuori posto.</small></div></div>
        <div id="laTimeline" class="la-timeline"></div>
        <div id="laTimelineFeedback" class="la-feedback"><b>Ricostruzione non verificata</b><span>L’ordine corretto può cambiare completamente il valore di un alibi.</span></div>
        <div class="actions"><button id="laTimelineReset" class="secondary">Rimescola</button><button id="laTimelineCheck" class="primary">Verifica ordine</button></div>
      </section>
      <section class="la-panel" data-lapanel="accuse">
        <div class="la-challenge"><span>LA SFIDA</span><h3>Hai tutto ciò che serve per risolvere il caso.</h3><p>Nessun nuovo indizio essenziale verrà introdotto. Costruisci un’accusa completa.</p></div>
        <div class="la-accusation">
          ${laSelect('Colpevole',g.accusationOptions.culprit,'Chi ha commesso il delitto?')}
          ${laSelect('Movente',g.accusationOptions.motive,'Perché?')}
          ${laSelect('Metodo',g.accusationOptions.method,'Come?')}
          ${laSelect('Alibi',g.accusationOptions.trick,'Qual era il trucco?')}
          ${laSelect('Prova',g.accusationOptions.clue,'Quale indizio fa crollare la ricostruzione alternativa?')}
        </div>
        <div id="laAccFeedback" class="la-feedback"><b>La sala aspetta.</b><span>Quando sei pronto, formula l’accusa.</span></div>
        <div class="actions"><button id="laAccuse" class="primary wide">⚖ Formula l’accusa</button></div>
      </section>
    `);
    const tabs=[...document.querySelectorAll('.la-tabs button')],panels=[...document.querySelectorAll('.la-panel')];
    function setPhase(name){phase=name;tabs.forEach(b=>b.classList.toggle('active',b.dataset.latab===name));panels.forEach(p=>p.classList.toggle('active',p.dataset.lapanel===name));document.querySelector('.game-alibi')?.scrollIntoView({behavior:'smooth',block:'start'})}
    tabs.forEach(b=>b.onclick=()=>{if(!b.disabled)setPhase(b.dataset.latab)});document.querySelectorAll('[data-lago]').forEach(b=>b.onclick=()=>setPhase(b.dataset.lago));
    const evDetail=document.getElementById('laEvidenceDetail');
    document.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=()=>{const e=g.evidence.find(x=>x.id===b.dataset.evidence);seenEvidence.add(e.id);b.classList.add('seen');b.querySelector('small').textContent='Esaminato';evDetail.innerHTML=`<div class="la-detail-icon">${e.icon}</div><div><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>`;checkChallenge()});
    const susDetail=document.getElementById('laSuspectDetail');
    document.querySelectorAll('[data-suspect]').forEach(b=>b.onclick=()=>{const s=g.suspects.find(x=>x.id===b.dataset.suspect);seenSuspects.add(s.id);document.querySelectorAll('[data-suspect]').forEach(x=>x.classList.toggle('active',x===b));b.classList.add('seen');susDetail.innerHTML=`<div class="la-person-head">${laPortrait(s)}<div><b>${esc(s.name)}</b><small>${esc(s.role)}</small></div></div><div class="la-person-grid"><article><span>RAPPORTO / MOVENTE</span><p>${esc(s.relation)}</p></article><article><span>ALIBI</span><p>${esc(s.alibi)}</p></article><article><span>OSSERVAZIONE</span><p>${esc(s.obs)}</p></article></div>`;checkChallenge()});
    const tl=document.getElementById('laTimeline'),tlFb=document.getElementById('laTimelineFeedback');
    function renderTimeline(){tl.innerHTML=timeline.map((e,i)=>`<article data-event="${e.id}"><div class="la-time-index">${String(i+1).padStart(2,'0')}</div><div><b>${esc(e.label)}</b><small>${esc(e.text)}</small></div><div class="la-order-btns"><button data-up="${i}" ${i===0?'disabled':''}>↑</button><button data-down="${i}" ${i===timeline.length-1?'disabled':''}>↓</button></div></article>`).join('');tl.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const i=+b.dataset.up;[timeline[i-1],timeline[i]]=[timeline[i],timeline[i-1]];renderTimeline()});tl.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>{const i=+b.dataset.down;[timeline[i+1],timeline[i]]=[timeline[i],timeline[i+1]];renderTimeline()})}
    renderTimeline();
    document.getElementById('laTimelineReset').onclick=()=>{timeline=laShuffle(g.events.map(e=>({...e})));timelineSolved=false;renderTimeline();tlFb.className='la-feedback';tlFb.innerHTML='<b>Timeline rimescolata.</b><span>Ricostruisci nuovamente la sequenza.</span>'};
    document.getElementById('laTimelineCheck').onclick=()=>{const misplaced=timeline.filter((e,i)=>e.order!==i).length;if(!misplaced){timelineSolved=true;tlFb.className='la-feedback success';tlFb.innerHTML=`<b>Sequenza coerente.</b><span>${esc(g.timelineHint)}</span>`}else{tlFb.className='la-feedback bad';tlFb.innerHTML=`<b>La sequenza non regge.</b><span>${misplaced} evento${misplaced>1?'i':''} ${misplaced>1?'sono':'è'} ancora fuori posizione.</span>`}checkChallenge()};
    function checkChallenge(){if(challenge)return;const complete=seenEvidence.size===g.evidence.length&&seenSuspects.size===g.suspects.length;if(complete){challenge=true;const accTab=tabs.find(x=>x.dataset.latab==='accuse');accTab.disabled=false;const flash=document.createElement('div');flash.className='la-challenge-flash';flash.innerHTML='<small>LA SFIDA</small><b>Hai tutto ciò che serve.</b><span>Nessun nuovo indizio decisivo verrà introdotto.</span>';document.body.appendChild(flash);setTimeout(()=>flash.remove(),2400)}}
    document.querySelectorAll('.la-choice-grid').forEach(grid=>grid.querySelectorAll('button').forEach(b=>b.onclick=()=>{grid.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));const label=grid.dataset.accgroup,key={Colpevole:'culprit',Movente:'motive',Metodo:'method',Alibi:'trick',Prova:'clue'}[label];acc[key]=b.dataset.id}));
    const accFb=document.getElementById('laAccFeedback');
    document.getElementById('laAccuse').onclick=()=>{if(finished)return;if(Object.values(acc).some(x=>!x))return toast('Completa tutti i cinque elementi dell’accusa');attempts++;const keys=['culprit','motive','method','trick','clue'],correct=keys.filter(k=>acc[k]===g.solution[k]);if(correct.length===keys.length){finished=true;const sec=Math.floor((Date.now()-activeStart)/1000),score=Math.max(200,3000-attempts*140-sec*2+(timelineSolved?250:0));const culprit=g.suspects[g.culprit];accFb.className='la-feedback success';accFb.innerHTML=`<b>Accusa dimostrata.</b><span><strong>${esc(culprit.name)}</strong> ha agito per ${esc(g.culpritMotive.label.toLowerCase())}. ${esc(g.arch.methodDesc)}; ${esc(g.arch.trickDesc)}. La prova decisiva è “${esc(g.accusationOptions.clue.find(x=>x.id===g.solution.clue)?.label||g.solution.clue)}”.${esc(g.secondarySummary)}${esc(g.complicationSummary)}</span>`;setTimeout(()=>concludeSession('alibi',level,score,true,`Caso risolto: <b>${esc(culprit.name)}</b>. Tentativi d’accusa: <b>${attempts}</b>.`),1100);return}accFb.className='la-feedback bad';if(g.cfg.attemptInfo==='detail'){const wrong=keys.filter(k=>!correct.includes(k)).map(k=>({culprit:'colpevole',motive:'movente',method:'metodo',trick:'alibi',clue:'prova'}[k]));accFb.innerHTML=`<b>L’accusa non regge.</b><span>Rivedi: ${wrong.join(', ')}.</span>`}else if(g.cfg.attemptInfo==='count'){accFb.innerHTML=`<b>L’accusa non regge.</b><span>${correct.length}/5 elementi sono coerenti, ma la teoria complessiva ha ancora una falla.</span>`}else accFb.innerHTML='<b>L’accusa non regge.</b><span>Una o più parti della teoria contraddicono gli indizi. Il gioco non indica quali.</span>'};
    startTimer();
    if(!localStorage.getItem('sala_giochi_alibi_help_v1')){localStorage.setItem('sala_giochi_alibi_help_v1','1');setTimeout(()=>openHelp(),260)}
  }

})();
