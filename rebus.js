'use strict';

/* Sala Giochi 2.0 — Rebus
   v2.12.0: rebus classici originali, tavola illustrata a tratto, 4 livelli, 100 sessioni per livello. */
(() => {
  const REBUS_VERSION='2.12.0';
  const GAME_ID='rebus';

  GAME_NAMES[GAME_ID]='Rebus';
  ICONS[GAME_ID]='✒';
  SESSION_GAMES.add(GAME_ID);
  DEFAULT_GAME_PALETTES[GAME_ID]='gold';

  GAME_HELP[GAME_ID]={
    title:'Rebus',
    goal:'Ricostruisci la frase finale interpretando i disegni, le lettere e le trasformazioni indicate.',
    steps:[
      'Osserva la tavola da sinistra a destra. Ogni disegno rappresenta una parola.',
      'Le sigle come “M→V”, “+S” o “−R” modificano la parola suggerita dal disegno.',
      'Le parole stampate nella tavola fanno parte direttamente della lettura.',
      'La lunghezza della soluzione è indicata sopra la tavola, come nei rebus classici.',
      'Scrivi la frase completa e premi “Controlla”.'
    ],
    tips:[
      'Se una figura non è chiara, puoi usare “Nome figura”: costa 12 punti.',
      '“Aiuto” dà un suggerimento ulteriore e costa 18 punti.',
      'Ogni risposta errata costa 8 punti. La soluzione rivelata assegna 0 punti.',
      'Dopo la soluzione viene mostrata anche la lettura del rebus, così puoi capire esattamente il meccanismo.'
    ]
  };

  const P={
    easy:[
      ['VELA LATINA','4, 6',[I('mela','MELA','M → V'),T('LATINA')],'Una vela tradizionale può avere questo tipo di armamento.','MELA con M→V = VELA; poi LATINA.'],
      ['PANE FRESCO','4, 6',[I('cane','CANE','C → P'),T('FRESCO')],'È qualcosa che profuma appena uscito dal forno.','CANE con C→P = PANE; poi FRESCO.'],
      ['VISO SERENO','4, 6',[I('riso','RISO','R → V'),T('SERENO')],'Descrive un’espressione tranquilla.','RISO con R→V = VISO; poi SERENO.'],
      ['LENTE SCURA','5, 5',[I('dente','DENTE','D → L'),T('SCURA')],'Può proteggere l’occhio dalla luce.','DENTE con D→L = LENTE; poi SCURA.'],
      ['SETE ARDENTE','4, 7',[I('rete','RETE','R → S'),T('ARDENTE')],'Un bisogno fortissimo di bere.','RETE con R→S = SETE; poi ARDENTE.'],
      ['PONTE SOSPESO','5, 7',[I('monte','MONTE','M → P'),T('SOSPESO')],'Attraversa un vuoto sostenuto da cavi.','MONTE con M→P = PONTE; poi SOSPESO.'],
      ['RENNA POLARE','5, 6',[I('penna','PENNA','P → R'),T('POLARE')],'Animale tipico delle regioni fredde.','PENNA con P→R = RENNA; poi POLARE.'],
      ['CORO ALPINO','4, 6',[I('toro','TORO','T → C'),T('ALPINO')],'Canta spesso brani della tradizione di montagna.','TORO con T→C = CORO; poi ALPINO.'],
      ['MAGO FAMOSO','4, 6',[I('lago','LAGO','L → M'),T('FAMOSO')],'Un prestigiatore molto conosciuto.','LAGO con L→M = MAGO; poi FAMOSO.'],
      ['DUNA MOBILE','4, 6',[I('luna','LUNA','L → D'),T('MOBILE')],'Il vento può spostarla nel deserto.','LUNA con L→D = DUNA; poi MOBILE.'],
      ['PINO MARITTIMO','4, 9',[I('vino','VINO','V → P'),T('MARITTIMO')],'Albero frequente lungo le coste.','VINO con V→P = PINO; poi MARITTIMO.'],
      ['TORTA SALATA','5, 6',[I('porta','PORTA','P → T'),T('SALATA')],'Preparazione da forno non dolce.','PORTA con P→T = TORTA; poi SALATA.']
    ],
    medium:[
      ['MOLE ANTONELLIANA','4, 12',[I('sole','SOLE','S → M'),T('ANTONELLIANA')],'È uno dei simboli di Torino.','SOLE con S→M = MOLE; poi ANTONELLIANA.'],
      ['MONTE BIANCO','5, 6',[I('ponte','PONTE','P → M'),T('BIANCO')],'È una celebre cima alpina.','PONTE con P→M = MONTE; poi BIANCO.'],
      ['FATTO COMPIUTO','5, 8',[I('gatto','GATTO','G → F'),T('COMPIUTO')],'Indica una situazione ormai realizzata.','GATTO con G→F = FATTO; poi COMPIUTO.'],
      ['VANO MOTORE','4, 6',[I('mano','MANO','M → V'),T('MOTORE')],'Si trova sotto il cofano di un’auto.','MANO con M→V = VANO; poi MOTORE.'],
      ['RASO TERRA','4, 5',[I('naso','NASO','N → R'),T('TERRA')],'Molto vicino al suolo.','NASO con N→R = RASO; poi TERRA.'],
      ['COSA NOSTRA','4, 6',[I('rosa','ROSA','R → C'),T('NOSTRA')],'La soluzione nasce cambiando una sola lettera della figura.','ROSA con R→C = COSA; poi NOSTRA.'],
      ['SERA ESTIVA','4, 6',[I('pera','PERA','P → S'),T('ESTIVA')],'Una serata della stagione più calda.','PERA con P→S = SERA; poi ESTIVA.'],
      ['MALE MINORE','4, 6',[I('sale','SALE','S → M'),T('MINORE')],'Espressione usata per scegliere l’opzione meno negativa.','SALE con S→M = MALE; poi MINORE.'],
      ['AMO DA PESCA','3, 2, 5',[I('ramo','RAMO','− R'),T('DA'),T('PESCA')],'Un piccolo attrezzo del pescatore.','RAMO senza R = AMO; poi DA PESCA.'],
      ['ALTO MARE','4, 4',[I('auto','AUTO','U → L'),I('mare','MARE','')],'Lontano dalla costa.','AUTO con U→L = ALTO; poi MARE.'],
      ['NEVE FRESCA','4, 6',[I('nave','NAVE','A → E'),T('FRESCA')],'È appena caduta.','NAVE con A→E = NEVE; poi FRESCA.'],
      ['CASSA FORTE','5, 5',[I('casa','CASA','+ S'),T('FORTE')],'Contiene denaro o oggetti preziosi.','CASA con una S aggiunta = CASSA; poi FORTE.']
    ],
    hard:[
      ['SALA GIOCHI','4, 6',[I('ala','ALA','+ S'),T('GIOCHI')],'È anche il nome del luogo in cui stai giocando.','ALA con S aggiunta davanti = SALA; poi GIOCHI.'],
      ['LAGO MAGGIORE','4, 8',[I('ago','AGO','+ L'),T('MAGGIORE')],'Grande lago prealpino italiano.','AGO con L aggiunta davanti = LAGO; poi MAGGIORE.'],
      ['PARCO GIOCHI','5, 6',[I('arco','ARCO','+ P'),T('GIOCHI')],'Luogo attrezzato per il divertimento dei bambini.','ARCO con P aggiunta davanti = PARCO; poi GIOCHI.'],
      ['UOVA SODE','4, 4',[I('uva','UVA','+ O'),T('SODE')],'Si preparano cuocendole con il guscio.','UVA con O inserita dopo U = UOVA; poi SODE.'],
      ['GRANA PADANO','5, 6',[I('rana','RANA','+ G'),T('PADANO')],'Formaggio italiano a pasta dura.','RANA con G aggiunta davanti = GRANA; poi PADANO.'],
      ['CORTO CIRCUITO','5, 8',[I('orto','ORTO','+ C'),T('CIRCUITO')],'Guasto elettrico causato da un collegamento anomalo.','ORTO con C aggiunta davanti = CORTO; poi CIRCUITO.'],
      ['TRE RE','3, 2',[I('re','RE','+ T'),I('re','RE','')],'La prima parola indica un numero.','RE con T aggiunta davanti = TRE; poi RE.'],
      ['MORE SELVATICHE','4, 10',[I('ore','ORE','+ M'),T('SELVATICHE')],'Frutti di rovo.','ORE con M aggiunta davanti = MORE; poi SELVATICHE.'],
      ['MALA FEDE','4, 4',[I('ala','ALA','+ M'),T('FEDE')],'Comportamento intenzionalmente scorretto.','ALA con M aggiunta davanti = MALA; poi FEDE.'],
      ['FORO ROMANO','4, 6',[I('toro','TORO','T → F'),T('ROMANO')],'Celebre area archeologica di Roma.','TORO con T→F = FORO; poi ROMANO.'],
      ['PASTA MADRE','5, 5',[I('asta','ASTA','+ P'),T('MADRE')],'Lievito naturale usato per pane e grandi lievitati.','ASTA con P aggiunta davanti = PASTA; poi MADRE.'],
      ['PANE E VINO','4, 1, 4',[I('cane','CANE','C → P'),T('E'),I('vino','VINO','')],'Due alimenti simbolici della tavola.','CANE con C→P = PANE; poi E VINO.']
    ],
    extreme:[
      ['MONTE ROSA','5, 4',[I('ponte','PONTE','P → M'),I('rosa','ROSA','')],'Massiccio alpino al confine tra Italia e Svizzera.','PONTE con P→M = MONTE; poi ROSA.'],
      ['PONTE SUL MARE','5, 3, 4',[I('monte','MONTE','M → P'),T('SUL'),I('mare','MARE','')],'Una struttura che attraversa l’acqua.','MONTE con M→P = PONTE; poi SUL MARE.'],
      ['VELA SUL LAGO','4, 3, 4',[I('mela','MELA','M → V'),T('SUL'),I('lago','LAGO','')],'Immagina una barca su acqua interna.','MELA con M→V = VELA; poi SUL LAGO.'],
      ['PANE E SALE','4, 1, 4',[I('cane','CANE','C → P'),T('E'),I('sale','SALE','')],'Due elementi semplicissimi della tavola.','CANE con C→P = PANE; poi E SALE.'],
      ['LENTE A CONTATTO','5, 1, 8',[I('dente','DENTE','D → L'),T('A'),T('CONTATTO')],'Si applica direttamente sull’occhio.','DENTE con D→L = LENTE; poi A CONTATTO.'],
      ['CORO DI VOCI','4, 2, 4',[I('toro','TORO','T → C'),T('DI'),T('VOCI')],'Molte persone che cantano insieme.','TORO con T→C = CORO; poi DI VOCI.'],
      ['PINO DI MONTAGNA','4, 2, 8',[I('vino','VINO','V → P'),T('DI'),T('MONTAGNA')],'Conifera associata all’ambiente alpino.','VINO con V→P = PINO; poi DI MONTAGNA.'],
      ['FATTO A MANO','5, 1, 4',[I('gatto','GATTO','G → F'),T('A'),I('mano','MANO','')],'Indica una lavorazione artigianale.','GATTO con G→F = FATTO; poi A MANO.'],
      ['LENTE DI INGRANDIMENTO','5, 2, 14',[I('dente','DENTE','D → L'),T('DI'),T('INGRANDIMENTO')],'Serve a vedere più grandi i dettagli.','DENTE con D→L = LENTE; poi DI INGRANDIMENTO.'],
      ['FORO NEL MURO','4, 3, 4',[I('toro','TORO','T → F'),T('NEL'),T('MURO')],'Un’apertura praticata in una parete.','TORO con T→F = FORO; poi NEL MURO.'],
      ['DUNA DI SABBIA','4, 2, 6',[I('luna','LUNA','L → D'),T('DI'),T('SABBIA')],'Forma tipica di un deserto.','LUNA con L→D = DUNA; poi DI SABBIA.'],
      ['CASSA DI RISPARMIO','5, 2, 9',[I('casa','CASA','+ S'),T('DI'),T('RISPARMIO')],'Denominazione tradizionale di un istituto bancario.','CASA con una S aggiunta = CASSA; poi DI RISPARMIO.']
    ]
  };

  function I(key,word,op){return {type:'image',key,word,op};}
  function T(text){return {type:'text',text};}

  const DRAW={
    mela:`<path d="M80 38c-18-16-41 0-36 26 7 34 36 42 36 42s29-8 36-42c5-26-18-42-36-26z"/><path d="M80 39c0-12 5-21 15-28"/><path d="M84 22c10-5 19-3 26 5-10 6-19 5-26-5z"/>`,
    cane:`<path d="M38 75c8-22 25-31 45-27l17-18 17 6-3 23c9 9 12 20 7 33-4 10-13 15-25 15H59c-18 0-28-12-21-32z"/><path d="M45 61 25 49l-7 12 22 17M92 47l11 12M77 103v14M108 102v15"/><circle cx="105" cy="46" r="2" fill="currentColor"/>`,
    riso:`<path d="M30 68q50 22 100 0-6 38-50 39T30 68z"/><path d="M42 66q38-18 76 0M51 58q5-9 10 0M70 55q5-10 10 0M92 56q5-10 10 0M108 60q4-8 8 0"/>`,
    dente:`<path d="M55 23c-20 7-17 34-7 49 8 12 7 32 14 39 8 8 14-19 18-19s10 27 18 19c7-7 6-27 14-39 10-15 13-42-7-49-12-4-17 5-25 5s-13-9-25-5z"/>`,
    rete:`<path d="M25 28v76M135 28v76M25 36h110M25 56h110M25 76h110M25 96h110M47 36v60M69 36v60M91 36v60M113 36v60"/><path d="M18 104h124"/>`,
    monte:`<path d="M18 101 61 41l18 24 16-28 47 64z"/><path d="m52 54 10 8 8-10 9 13 7-12 11 8"/>`,
    sedia:`<path d="M48 24v49h61V24M48 55h61M55 73v39M102 73v39"/><path d="M48 24h61"/>`,
    penna:`<path d="M37 100c30-8 57-32 77-76 8 35-1 63-36 76-15 5-28 5-41 0z"/><path d="M39 101 104 39M58 88l2-23M74 77l5-26M90 62l10-20"/>`,
    toro:`<path d="M45 37c-13-17-27-17-34-4 10 2 18 8 26 18M115 37c13-17 27-17 34-4-10 2-18 8-26 18"/><path d="M43 46q37-26 74 0l-7 45q-30 27-60 0z"/><circle cx="62" cy="62" r="3" fill="currentColor"/><circle cx="98" cy="62" r="3" fill="currentColor"/><path d="M70 84q10 8 20 0"/>`,
    lago:`<path d="M18 79q18-9 36 0t36 0 36 0 18 0M18 92q18-9 36 0t36 0 36 0 18 0"/><path d="m24 68 25-29 18 19 15-24 28 34"/>`,
    luna:`<path d="M98 24c-25 5-39 32-27 55 11 22 39 29 59 14-13 4-30-2-39-17-11-19-7-40 7-52z"/>`,
    vino:`<path d="M58 18h20v18l-8 12v54c0 8-5 12-12 12H47c-7 0-12-4-12-12V48l-8-12V18h20"/><path d="M35 72h35M95 55h32l-5 36q-11 13-22 0z"/><path d="M100 105h21M110 91v14"/>`,
    sole:`<circle cx="80" cy="60" r="24"/><path d="M80 10v16M80 94v16M30 60h16M114 60h16M45 25l11 12M104 83l11 12M45 95l11-12M104 37l11-12"/>`,
    ponte:`<path d="M18 94h124M28 94V67M132 94V67M28 67q26-35 52 0 26-35 52 0M28 67h104"/><path d="M52 67v27M80 67v27M108 67v27"/>`,
    gatto:`<path d="m49 44 6-22 17 14q8-4 16 0l17-14 6 22c12 12 12 35 1 48-15 18-49 18-64 0-11-13-11-36 1-48z"/><circle cx="66" cy="61" r="3" fill="currentColor"/><circle cx="94" cy="61" r="3" fill="currentColor"/><path d="M74 76q6 5 12 0M39 71h27M94 71h27M40 80h28M92 80h28"/>`,
    mano:`<path d="M48 102V54c0-8 10-8 10 0V34c0-9 11-9 11 0v18-27c0-9 11-9 11 0v27-23c0-9 11-9 11 0v25-16c0-9 11-9 11 0v33c0 28-13 40-32 40-10 0-17-3-22-9z"/>`,
    naso:`<path d="M80 20c-4 23-9 44-18 65-4 11 4 18 18 14 10 8 24 3 22-8-1-8-8-11-17-10"/><path d="M80 99q8 6 16 0"/>`,
    rosa:`<circle cx="80" cy="48" r="12"/><path d="M80 36c-16-22-31-3-18 9-21-2-20 20-3 21-12 16 9 28 20 12 11 16 32 4 20-12 17-1 18-23-3-21 13-12-2-31-16-9z"/><path d="M80 78v37M80 91c-14-12-25-5-27 5 12 6 22 5 27-5zM80 101c13-11 24-4 26 6-11 5-20 4-26-6z"/>`,
    pera:`<path d="M80 35c-4 14-20 20-25 38-8 27 12 39 25 39s33-12 25-39c-5-18-21-24-25-38z"/><path d="M80 36c0-10 3-17 10-23M84 21c9-4 17-1 22 6-9 5-16 3-22-6z"/>`,
    sale:`<path d="M53 45h54l8 59H45z"/><path d="M58 45V29h44v16M66 29v-9h28v9"/><circle cx="70" cy="37" r="2" fill="currentColor"/><circle cx="80" cy="36" r="2" fill="currentColor"/><circle cx="90" cy="37" r="2" fill="currentColor"/>`,
    ramo:`<path d="M29 104c29-24 55-52 87-90M56 79 38 55M72 64 95 44M87 49 74 27M101 34 124 25"/><path d="M35 58c-10-12-20-8-23 1 9 8 17 9 23-1zM94 45c11-10 21-5 22 4-10 6-18 5-22-4zM74 28c-7-12-18-10-22-1 8 8 16 9 22 1zM123 25c9-9 18-5 20 3-8 6-15 5-20-3z"/>`,
    auto:`<path d="M30 76 42 51h73l15 25v24H30z"/><path d="M50 51l11-19h36l13 19"/><circle cx="53" cy="99" r="12"/><circle cx="108" cy="99" r="12"/><path d="M39 76h82"/>`,
    porta:`<path d="M48 18h67v97H48z"/><circle cx="101" cy="68" r="3" fill="currentColor"/><path d="M48 18 37 28v87h78"/>`,
    ala:`<path d="M30 91c27-57 55-74 97-67-14 12-23 23-27 34 10-2 19-1 27 3-15 11-29 18-42 21 7 4 12 9 16 15-29 5-52 3-71-6z"/><path d="M42 85c23-17 43-32 60-50"/>`,
    ago:`<path d="M31 96 126 23M36 91l-8 8M118 24l11-7"/><ellipse cx="121" cy="27" rx="7" ry="4" transform="rotate(-37 121 27)"/>`,
    arco:`<path d="M39 103q41-83 82 0M45 94l69-67M38 103l84 0"/><path d="M113 27l6 9-10-2"/>`,
    uva:`<path d="M82 19c9 5 15 13 18 23M82 19c-10 2-18 7-24 14"/><circle cx="63" cy="48" r="12"/><circle cx="82" cy="45" r="12"/><circle cx="101" cy="51" r="12"/><circle cx="72" cy="66" r="12"/><circle cx="93" cy="68" r="12"/><circle cx="82" cy="86" r="12"/><path d="M84 20c15-10 26-6 31 3-13 8-23 7-31-3z"/>`,
    nave:`<path d="M23 76h114l-16 29H42z"/><path d="M57 76V42h52v34M67 42V25h26v17"/><path d="M18 110q16-7 32 0t32 0 32 0 32 0"/>`,
    casa:`<path d="M26 61 80 18l54 43v54H26z"/><path d="M50 115V77h26v38M95 74h20v20H95z"/>`,
    rana:`<ellipse cx="80" cy="74" rx="34" ry="25"/><circle cx="58" cy="49" r="13"/><circle cx="102" cy="49" r="13"/><circle cx="58" cy="47" r="3" fill="currentColor"/><circle cx="102" cy="47" r="3" fill="currentColor"/><path d="M63 79q17 12 34 0M47 89 27 105M113 89l20 16"/>`,
    re:`<path d="M39 71 31 33l24 19 25-31 25 31 24-19-8 38z"/><path d="M39 71h82l-8 31H47z"/><circle cx="80" cy="20" r="4" fill="currentColor"/>`,
    ore:`<circle cx="80" cy="63" r="42"/><path d="M80 63V37M80 63l22 13"/><path d="M53 18h54M58 108h44"/>`,
    orto:`<path d="M20 93h120M32 93V52h96v41M48 93V52M64 93V52M80 93V52M96 93V52M112 93V52"/><path d="M48 52c-8-15-18-13-23-4 8 8 15 9 23 4zM80 52c-7-18-18-16-23-6 8 9 16 10 23 6zM112 52c-8-15-18-13-23-4 8 8 15 9 23 4z"/>`,
    asta:`<path d="M80 16v94M67 16h26M70 110h20"/><path d="M80 35l22 10M80 52l-21 10"/>`,
    mare:`<path d="M14 54q18-12 36 0t36 0 36 0 36 0M14 75q18-12 36 0t36 0 36 0 36 0M14 96q18-12 36 0t36 0 36 0 36 0"/>`
  };

  function art(key){
    const body=DRAW[key]||`<rect x="35" y="25" width="90" height="70" rx="10"/><path d="M50 80 72 58l16 15 15-20 17 27"/>`;
    return `<svg viewBox="0 0 160 120" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  }

  const oldStartGame=startGame;
  startGame=function(game,level,opts={}){
    if(game!==GAME_ID)return oldStartGame(game,level,opts);
    activeSaved=false;activeGame=game;activeLevel=level;
    activeSessionTracked=opts.trackSession!==false&&SESSION_GAMES.has(game);
    if(activeSessionTracked){
      const s=sessionState(game,level);
      if(s.cycleComplete){renderCycleComplete(game,level);return}
      activeRng=makeRng(sessionSeed(game,level));
    }else activeRng=Math.random;
    activeNoteKey=noteKeyFor(game,level);
    setHeader(GAME_NAMES[game],LEVEL_NAMES[level]);
    startRebus(level);
  };

  function selectPuzzle(level){
    const pool=P[level]||P.easy;
    if(activeSessionTracked){
      const s=sessionState(GAME_ID,level);
      return pool[(Math.max(1,s.session)-1+(Math.max(1,s.cycle)-1)*5)%pool.length];
    }
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function normalize(s){
    return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toUpperCase().replace(/[’']/g,' ').replace(/[^A-Z0-9 ]/g,' ')
      .replace(/\s+/g,' ').trim();
  }

  function panelHtml(p,i){
    if(p.type==='text')return `<div class="rebus-token rebus-word" aria-label="Parola ${p.text}"><span>${p.text}</span></div>`;
    return `<div class="rebus-token rebus-figure" data-fig="${i}">
      <div class="rebus-art">${art(p.key)}</div>
      ${p.op?`<div class="rebus-op">${p.op}</div>`:''}
      <div class="rebus-fig-name" id="rebusName${i}" hidden>${p.word}</div>
    </div>`;
  }

  function startRebus(level){
    stopTimer(); activeStart=Date.now(); startTimer();
    const puzzle=selectPuzzle(level);
    let score=100, mistakes=0, hints=0, solved=false, revealed=false;
    const figIndexes=puzzle[2].map((p,i)=>p.type==='image'?i:null).filter(i=>i!==null);

    const body=`<div class="rebus-layout">
      <section class="rebus-paper">
        <div class="rebus-paper-head">
          <div><span class="rebus-kicker">REBUS</span><h2>Risolvi la frase</h2></div>
          <div class="rebus-enum" title="Lunghezza delle parole">${puzzle[1]}</div>
        </div>
        <div class="rebus-rule"></div>
        <div class="rebus-strip">${puzzle[2].map(panelHtml).join('')}</div>
        <div class="rebus-caption">La tavola si legge da sinistra a destra.</div>
      </section>

      <aside class="rebus-console">
        <div class="rebus-score"><span>Punti disponibili</span><strong id="rebusScore">100</strong></div>
        <label class="rebus-answer-label" for="rebusAnswer">Soluzione</label>
        <input id="rebusAnswer" class="rebus-answer" autocomplete="off" autocapitalize="characters" placeholder="Scrivi la frase completa">
        <div class="rebus-actions">
          <button id="rebusCheck" class="primary" type="button">Controlla</button>
          <button id="rebusFigureHint" class="secondary" type="button">Nome figura −12</button>
          <button id="rebusHint" class="secondary" type="button">Aiuto −18</button>
        </div>
        <div id="rebusFeedback" class="rebus-feedback" aria-live="polite">Osserva bene immagini, lettere e trasformazioni.</div>
        <button id="rebusReveal" class="rebus-reveal" type="button">Rivela soluzione</button>
      </aside>
    </div>`;

    app.innerHTML=gameShell(GAME_ID,level,body);
    const answer=document.getElementById('rebusAnswer');
    const feedback=document.getElementById('rebusFeedback');
    const scoreEl=document.getElementById('rebusScore');
    let nextFig=0;

    function refresh(){scoreEl.textContent=Math.max(0,score);}
    function lock(){
      ['rebusCheck','rebusFigureHint','rebusHint','rebusReveal'].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=true});
      answer.disabled=true;
    }
    function showSolved(ok){
      lock(); stopTimer();
      feedback.className=`rebus-feedback ${ok?'ok':'revealed'}`;
      feedback.innerHTML=`<div class="rebus-solution-title">${ok?'✓ Soluzione corretta':'Soluzione'}</div>
        <div class="rebus-solution">${puzzle[0]}</div>
        <div class="rebus-reading"><b>Lettura:</b> ${puzzle[4]}</div>`;
      setTimeout(()=>concludeSession(GAME_ID,level,ok?Math.max(0,score):0,ok,
        `${ok?'Rebus risolto':'Soluzione rivelata'} · ${puzzle[0]} · ${ok?Math.max(0,score):0} punti`),900);
    }

    function check(){
      if(solved||revealed)return;
      const val=normalize(answer.value);
      if(!val){feedback.textContent='Scrivi prima una soluzione.';answer.focus();return}
      if(val===normalize(puzzle[0])){
        solved=true;showSolved(true);return;
      }
      mistakes++;score=Math.max(10,score-8);refresh();
      feedback.className='rebus-feedback wrong';
      feedback.textContent=mistakes===1?'Non ancora. Controlla la trasformazione delle figure.':mistakes===2?'Ci sei quasi: verifica anche la lunghezza delle parole.':'Risposta non corretta. Puoi usare un aiuto senza rivelare la soluzione.';
      answer.select();
    }

    document.getElementById('rebusCheck').onclick=check;
    answer.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check()}});

    document.getElementById('rebusFigureHint').onclick=()=>{
      if(!figIndexes.length||solved||revealed)return;
      const idx=figIndexes[nextFig%figIndexes.length];nextFig++;
      const el=document.getElementById(`rebusName${idx}`);
      if(el&&!el.hidden){ if(nextFig>=figIndexes.length){feedback.textContent='Hai già identificato tutte le figure.';return} }
      if(el){el.hidden=false;score=Math.max(10,score-12);hints++;refresh();feedback.className='rebus-feedback';feedback.textContent=`Figura: ${puzzle[2][idx].word}. Ora applica l’eventuale trasformazione indicata.`}
    };

    document.getElementById('rebusHint').onclick=()=>{
      if(solved||revealed)return;
      score=Math.max(10,score-18);hints++;refresh();
      feedback.className='rebus-feedback hint';
      feedback.textContent=puzzle[3];
      document.getElementById('rebusHint').disabled=true;
    };

    document.getElementById('rebusReveal').onclick=()=>{
      if(solved||revealed)return;
      if(!confirm('Rivelare la soluzione? La sessione terminerà con 0 punti.'))return;
      revealed=true;score=0;refresh();showSolved(false);
    };

    answer.focus();
  }

  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');
    if(!grid||grid.querySelector('.art-rebus'))return;
    const btn=document.createElement('button');
    btn.className='sg2-classic-card art-rebus';
    btn.onclick=()=>chooseDifficulty(GAME_ID);
    btn.innerHTML=`<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Tavole illustrate · 4 livelli</small>`;
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
    if(activeGame===GAME_ID){
      const e=document.querySelector('.rebus-enum')?.textContent?.trim()||'';
      return `Rebus · schema ${e}`;
    }
    return oldClue();
  };

  renderHome();
})();