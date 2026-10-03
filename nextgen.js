'use strict';

/* Sala Giochi 2.0 — modulo Nuova Generazione
   Prima release: SHIFTLINE. Gli altri concept sono esposti in Home come roadmap,
   senza alterare il codice dei giochi classici. */

(() => {
  const NEXTGEN_VERSION = '2.3.0';

  // Estende i registri esistenti senza cambiare app.js.
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
      'Il puzzle viene creato partendo da una configurazione risolta e poi mescolato con mosse legali: quindi ogni schema generato è risolvibile.'
    ]
  };

  const legacyRenderHome = renderHome;
  const legacyStartGame = startGame;

  window.showNextGenSoon = (name) => {
    toast(`${name}: concept approvato · sviluppo previsto nelle prossime fasi`);
  };

  function roadmapCard(name, icon, desc, key) {
    return `<button class="game-card nextgen-card nextgen-soon" onclick="showNextGenSoon('${key}')">
      <span class="game-icon">${icon}</span>
      <strong>${name}</strong>
      <small>${desc}</small>
      <span class="nextgen-tag">IN SVILUPPO</span>
    </button>`;
  }

  renderHome = function renderHomeV23() {
    legacyRenderHome();
    setHeader('Sala Giochi', `Un solo giocatore · archivio locale · v${NEXTGEN_VERSION}`);

    const theme = app.querySelector('.home-theme');
    if (!theme) return;

    const hero = theme.querySelector('.hero');
    if (hero && !hero.querySelector('.nextgen-hero-chip')) {
      const chip = document.createElement('div');
      chip.className = 'nextgen-hero-chip';
      chip.innerHTML = '<span>✦</span> SALA GIOCHI 2.0';
      hero.querySelector('.hero-note')?.before(chip);
    }

    const classicTitle = theme.querySelector('.section-title');
    if (!classicTitle) return;
    const classicHeading = classicTitle.querySelector('h3');
    if (classicHeading) classicHeading.textContent = 'Giochi classici';

    const ngTitle = document.createElement('div');
    ngTitle.className = 'section-title nextgen-title';
    ngTitle.innerHTML = '<div><span class="section-kicker">NUOVA GENERAZIONE</span><h3>Nuovi mondi di gioco</h3></div><small>Meccaniche originali · sviluppo modulare</small>';

    const ngGrid = document.createElement('div');
    ngGrid.className = 'grid nextgen-grid';
    ngGrid.innerHTML = `
      <button class="game-card nextgen-card game-shiftline nextgen-live" onclick="chooseDifficulty('shiftline')">
        <span class="game-icon">⚡</span>
        <strong>SHIFTLINE</strong>
        <small>Ruota la rete: ogni mossa cambia anche le altre tessere</small>
        <span class="nextgen-tag live">GIOCABILE</span>
        <span class="mini-arrow">›</span>
      </button>
      ${roadmapCard('ANHOTHER WORLD','◉','Scopri le leggi nascoste di una realtà impossibile','ANHOTHER WORLD')}
      ${roadmapCard('EVERYBODY IS RIGHT','◎','Costruisci una realtà in cui tutte le testimonianze siano vere','EVERYBODY IS RIGHT')}
      ${roadmapCard('LUMINA','✧','Un ecosistema grafico rilassante che reagisce ai tuoi gesti','LUMINA')}
      ${roadmapCard('THE LAST ALIBI','♟','Un giallo fair-play con alibi, timeline e ricostruzione finale','THE LAST ALIBI')}
    `;

    classicTitle.before(ngTitle, ngGrid);
  };

  startGame = function startGameV23(game, level, opts = {}) {
    if (game !== 'shiftline') return legacyStartGame(game, level, opts);

    activeSaved = false;
    activeGame = game;
    activeLevel = level;
    activeSessionTracked = opts.trackSession !== false && SESSION_GAMES.has(game);

    if (activeSessionTracked) {
      const s = sessionState(game, level);
      if (s.cycleComplete) {
        renderCycleComplete(game, level);
        return;
      }
      activeRng = makeRng(sessionSeed(game, level));
    } else {
      activeRng = Math.random;
    }

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
