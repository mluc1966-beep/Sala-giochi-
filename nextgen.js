'use strict';

/* Sala Giochi 2.0 — navigazione a famiglie + SHIFTLINE
   v2.5.0: grafica aderente ai mockup approvati + LUMINA giocabile. */

(() => {
  const NEXTGEN_VERSION = '2.5.0';

  GAME_NAMES.shiftline = 'SHIFTLINE';
  GAME_NAMES.lumina = 'LUMINA';
  ICONS.shiftline = '⚡';
  ICONS.lumina = '✦';
  SESSION_GAMES.add('shiftline');
  SESSION_GAMES.add('lumina');
  DEFAULT_GAME_PALETTES.shiftline = 'ocean';
  DEFAULT_GAME_PALETTES.lumina = 'violet';

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

  const CLASSIC_GAMES = [
    ['mixed','Partita Mista','Sei prove diverse in una sola sessione','mix'],
    ['sudoku','Sudoku','Completa la griglia 9×9','sudoku'],
    ['wordsearch','Cerca-parole','Trova tutte le parole nascoste','word'],
    ['anagram','Anagrammi','Ricomponi le lettere','anagram'],
    ['quiz','Quiz','Cultura generale e curiosità','quiz'],
    ['logic','Logica','Sequenze, deduzioni e codici','logic'],
    ['escape','Escape Room','Esplora, collega gli indizi, esci','escape']
  ];

  const NEXTGEN_GAMES = [
    ['shiftline','SHIFTLINE','Collega. Trasforma. Risolvi.','Puzzle logico','live'],
    ['lumina','LUMINA','Crea. Esplora. Rilassati.','Passatempo creativo','live'],
    ['everybody','EVERYBODY IS RIGHT','Tutti hanno ragione. Qual è la realtà?','Logica e deduzione','soon'],
    ['another','ANHOTHER WORLD','Scopri le leggi di un mondo impossibile.','Esplorazione e logica','soon'],
    ['alibi','THE LAST ALIBI','Un giallo da risolvere.','Investigazione','soon']
  ];

  function clearSG2Mode(){
    document.body.classList.remove('sg2-home','sg2-family','sg2-nextgen','sg2-classic','sg2-detail','sg2-lumina-play');
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
          <span class="sg2-eyebrow">SALA GIOCHI 2.0</span>
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
        <label class="sg2-desc-toggle">Descrizioni <input id="classicDescToggle" type="checkbox"><span></span></label>
      </header>
      <div class="sg2-classic-grid">
        ${CLASSIC_GAMES.map(([id,name,desc,art])=>`<button class="sg2-classic-card art-${art}" onclick="chooseDifficulty('${id}')"><span class="sg2-classic-icon">${ICONS[id]}</span><strong>${name}</strong><small>${desc}</small></button>`).join('')}
      </div>
      <button class="sg2-daily-strip" onclick="sg2OpenDaily()"><span>★</span><div><b>Sfida del giorno</b><small>Una prova diversa ogni giorno</small></div><i>›</i></button>
      ${bottomNav()}
    </div>`;
    const toggle=document.getElementById('classicDescToggle');
    toggle.onchange=()=>document.querySelector('.sg2-classic-grid')?.classList.toggle('show-desc',toggle.checked);
  };

  function ngCard([id,name,payoff,category,status]){
    const liveHandlers={shiftline:'renderShiftlineDetail()',lumina:'renderLuminaDetail()'};
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

  startGame = function startGameV25(game, level, opts = {}) {
    clearSG2Mode();
    if (game !== 'shiftline' && game !== 'lumina') return legacyStartGame(game, level, opts);
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
    else startLumina(level);
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


  // ---------- LUMINA ----------
  function startLumina(level){
    setSG2Mode('sg2-lumina-play');
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

  // Ridisegna la Home già caricata da app.js includendo la nuova sezione.
  renderHome();
})();
