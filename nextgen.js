'use strict';

/* Sala Giochi 2.0 — navigazione a famiglie + SHIFTLINE
   v2.4.0: Home a due mondi, pagine famiglia dedicate e dettaglio SHIFTLINE. */

(() => {
  const NEXTGEN_VERSION = '2.4.0';

  GAME_NAMES.shiftline = 'SHIFTLINE';
  ICONS.shiftline = '⚡';
  SESSION_GAMES.add('shiftline');
  DEFAULT_GAME_PALETTES.shiftline = 'ocean';

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
    ['lumina','LUMINA','Crea. Esplora. Rilassati.','Passatempo creativo','soon'],
    ['everybody','EVERYBODY IS RIGHT','Tutti hanno ragione. Qual è la realtà?','Logica e deduzione','soon'],
    ['another','ANHOTHER WORLD','Scopri le leggi di un mondo impossibile.','Esplorazione e logica','soon'],
    ['alibi','THE LAST ALIBI','Un giallo da risolvere.','Investigazione','soon']
  ];

  function clearSG2Mode(){
    document.body.classList.remove('sg2-home','sg2-family','sg2-nextgen','sg2-classic','sg2-detail');
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
    const click=status==='live' ? `renderShiftlineDetail()` : `showNextGenSoon('${name.replace(/'/g,"\\'")}')`;
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

  startGame = function startGameV24(game, level, opts = {}) {
    clearSG2Mode();
    if (game !== 'shiftline') return legacyStartGame(game, level, opts);
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
    startShiftline(level);
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

  // Ridisegna la Home già caricata da app.js includendo la nuova sezione.
  renderHome();
})();
