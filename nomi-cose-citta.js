'use strict';

/* Sala Giochi 2.0 — Nomi, Cose, Città
   v2.11.2: sfida Tu vs AVVERSARIO, 5 categorie scelte + 1 categoria difficile automatica a rotazione, foglio orizzontale tablet-first. */
(() => {
  const NCC_VERSION='2.11.2';
  const GAME_ID='nomicosacitta';
  const PREF_KEY='sala_giochi_ncc_prefs_v1';
  const AUTO_HARD_KEY='sala_giochi_ncc_auto_hard_v1';

  GAME_NAMES[GAME_ID]='Nomi, Cose, Città';
  ICONS[GAME_ID]='ABC';
  SESSION_GAMES.add(GAME_ID);
  DEFAULT_GAME_PALETTES[GAME_ID]='sunset';

  const NCC_GROUPS={
    classic:{label:'Categorie classiche',kind:'classic',items:[
      ['nome','Nome'],['cosa','Cosa'],['citta','Città'],['animale','Animale'],['mestiere','Mestiere'],['colore','Colore']
    ]},
    easy:{label:'Categorie facili',kind:'easy',items:[
      ['cibo','Cibo'],['sport','Sport'],['film','Film'],['marca','Marca'],['cantante','Cantante'],['pianta','Pianta'],['paese','Paese'],['frutto','Frutto'],['oggettocasa','Oggetto di casa'],['trasporto','Mezzo di trasporto']
    ]},
    hard:{label:'Categorie difficili',kind:'hard',items:[
      ['storico','Personaggio storico'],['libro','Libro'],['fiume','Fiume'],['capitale','Capitale'],['strumento','Strumento musicale'],['invenzione','Invenzione'],['lingua','Lingua'],['professionemoderna','Professione moderna'],['tecnologico','Oggetto tecnologico'],['elemento','Elemento chimico']
    ]}
  };

  const NCC_META={};
  Object.entries(NCC_GROUPS).forEach(([group,g])=>g.items.forEach(([id,label])=>NCC_META[id]={id,label,group,kind:g.kind}));

  // Lessico usato esclusivamente dall'AVVERSARIO automatico.
  // Le risposte dell'utente non sono limitate a questo elenco.
  const W={
    nome:['Andrea','Alessandro','Alice','Bruno','Beatrice','Carlo','Chiara','Claudio','Davide','Daniela','Elena','Emanuele','Federico','Francesca','Giorgio','Giulia','Irene','Ilaria','Luca','Laura','Marco','Marta','Nicola','Nadia','Olga','Paolo','Patrizia','Roberto','Rita','Sara','Stefano','Teresa','Tommaso','Valentina','Vittorio'],
    cosa:['Ago','Anello','Bottiglia','Borsa','Cucchiaio','Candela','Dado','Elastico','Forchetta','Giornale','Imbuto','Libro','Matita','Nastro','Ombrello','Penna','Quaderno','Righello','Scatola','Telefono','Vaso'],
    citta:['Ancona','Aosta','Bari','Bologna','Catania','Como','Domodossola','Enna','Firenze','Ferrara','Genova','Imola','Lecce','Livorno','Milano','Modena','Napoli','Novara','Orvieto','Palermo','Parma','Roma','Ravenna','Siena','Siracusa','Torino','Trieste','Venezia','Verona'],
    animale:['Aquila','Asino','Balena','Bisonte','Cane','Cavallo','Daino','Delfino','Elefante','Falco','Foca','Gatto','Giraffa','Iena','Leone','Lupo','Mucca','Narvalo','Orso','Panda','Pecora','Rana','Riccio','Serpente','Tigre','Volpe'],
    mestiere:['Avvocato','Architetto','Barista','Bibliotecario','Cuoco','Carpentiere','Dentista','Elettricista','Falegname','Farmacista','Geometra','Giornalista','Infermiere','Ingegnere','Meccanico','Notaio','Ottico','Panettiere','Pasticcere','Radiologo','Sarto','Tassista','Veterinario'],
    colore:['Ambra','Arancione','Beige','Bianco','Celeste','Ciano','Dorato','Ecrù','Fucsia','Giallo','Indaco','Lilla','Marrone','Nero','Ocra','Porpora','Rosa','Rosso','Senape','Turchese','Verde','Viola'],
    cibo:['Arancino','Arrosto','Bistecca','Biscotto','Carbonara','Cannolo','Dolma','Empanada','Focaccia','Frittata','Gnocchi','Insalata','Lasagna','Minestrone','Noodles','Ossobuco','Pizza','Polenta','Risotto','Sushi','Tiramisù','Vellutata'],
    sport:['Atletica','Arrampicata','Basket','Boxe','Calcio','Ciclismo','Danza','Equitazione','Football','Golf','Hockey','Judo','Karate','Lotta','Motociclismo','Nuoto','Pallavolo','Pattinaggio','Rugby','Scherma','Tennis','Vela'],
    film:['Avatar','Amélie','Barbie','Ben Hur','Casablanca','Cars','Dune','Dumbo','E.T.','Excalibur','Forrest Gump','Frozen','Gladiator','Grease','Inception','Interstellar','La vita è bella','Matrix','Notting Hill','Oppenheimer','Pulp Fiction','Rocky','Shining','Titanic','Vertigo'],
    marca:['Adidas','Armani','Barilla','Bosch','Coca-Cola','Canon','Ducati','Dyson','Epson','Ferrari','Fiat','Google','Gucci','Ikea','Lego','Microsoft','Nike','Nikon','Opel','Philips','Renault','Samsung','Sony','Toyota','Vileda'],
    cantante:['Adele','Alessandra Amoroso','Beyoncé','Bruno Mars','Cesare Cremonini','Claudio Baglioni','Dua Lipa','Elisa','Eros Ramazzotti','Fedez','Fiorella Mannoia','Giorgia','Irama','Laura Pausini','Mahmood','Mina','Nek','Ornella Vanoni','Pino Daniele','Rihanna','Sting','Tiziano Ferro','Vasco Rossi'],
    pianta:['Azalea','Aloe','Begonia','Basilico','Cactus','Camelia','Dalia','Edera','Ficus','Felce','Geranio','Iris','Lavanda','Mimosa','Narciso','Oleandro','Pothos','Rosa','Salvia','Tulipano','Violetta'],
    paese:['Argentina','Australia','Brasile','Belgio','Canada','Cile','Danimarca','Egitto','Francia','Finlandia','Grecia','India','Irlanda','Libano','Messico','Norvegia','Oman','Portogallo','Romania','Spagna','Svezia','Turchia','Vietnam'],
    frutto:['Albicocca','Ananas','Banana','Ciliegia','Cocco','Dattero','Fico','Fragola','Guava','Kiwi','Limone','Mela','Mirtillo','Nespola','Oliva','Pera','Pesca','Ribes','Susina','Uva'],
    oggettocasa:['Armadio','Asciugamano','Bicchiere','Bilancia','Cuscino','Comodino','Divano','Frigorifero','Forno','Grattugia','Lampada','Materasso','Orologio','Pentola','Radio','Sedia','Specchio','Tavolo','Vaso'],
    trasporto:['Autobus','Aereo','Bicicletta','Barca','Camion','Dirigibile','Elicottero','Furgone','Gondola','Locomotiva','Metropolitana','Moto','Nave','Monopattino','Pullman','Razzo','Scooter','Tram','Vespa'],
    storico:['Alessandro Magno','Augusto','Bismarck','Cesare','Carlo Magno','Dante Alighieri','Elisabetta I','Federico II','Garibaldi','Galileo Galilei','Leonardo da Vinci','Marco Polo','Napoleone','Pericle','Roosevelt','Socrate','Turing','Vittorio Emanuele II'],
    libro:['Amleto','Anna Karenina','Bibbia','Cuore','Decameron','Eneide','Frankenstein','Gattopardo','Iliade','Lolita','Moby Dick','Nome della rosa','Odissea','Pinocchio','Robinson Crusoe','Se questo è un uomo','Tre moschettieri','Ventimila leghe sotto i mari'],
    fiume:['Adda','Adige','Brenta','Colorado','Danubio','Dora Baltea','Ebro','Fiume Giallo','Gange','Isonzo','Loira','Mississippi','Nilo','Oglio','Po','Reno','Senna','Tevere','Volga'],
    capitale:['Amsterdam','Atene','Berlino','Bruxelles','Cairo','Copenaghen','Dublino','Erevan','Freetown','Georgetown','Islamabad','Lisbona','Londra','Madrid','Nairobi','Oslo','Parigi','Praga','Roma','Sofia','Tokyo','Vienna'],
    strumento:['Arpa','Armonica','Batteria','Banjo','Chitarra','Clarinetto','Didgeridoo','Eufonio','Flauto','Gong','Liuto','Mandolino','Oboe','Pianoforte','Sassofono','Tromba','Tamburo','Violino','Viola'],
    invenzione:['Aeroplano','Bicicletta','Calcolatrice','Dinamite','Elicottero','Fotografia','Grammofono','Internet','Lampadina','Microscopio','Orologio','Paracadute','Radio','Stampa','Telefono','Velcro'],
    lingua:['Arabo','Bulgaro','Cinese','Danese','Estone','Francese','Greco','Italiano','Latino','Mandarino','Norvegese','Olandese','Portoghese','Russo','Spagnolo','Tedesco','Vietnamita'],
    professionemoderna:['Analista dati','Biotecnologo','Content creator','Cybersecurity specialist','Data scientist','E-commerce manager','Front-end developer','Growth hacker','Influencer','Machine learning engineer','Product manager','Social media manager','Software tester','UX designer','Videomaker','Web designer'],
    tecnologico:['Auricolare','Action cam','Computer','Console','Drone','E-reader','Fotocamera','GPS','Laptop','Modem','Notebook','Power bank','Router','Smartphone','Tablet','Visore'],
    elemento:['Argon','Alluminio','Boro','Bromo','Carbonio','Calcio','Dubnio','Erbio','Ferro','Fluoro','Gallio','Iodio','Litio','Magnesio','Neon','Ossigeno','Piombo','Rame','Sodio','Titanio','Vanadio','Zinco']
  };

  const USER_CATEGORY_COUNT=5;
  const HARD_CATEGORY_IDS=NCC_GROUPS.hard.items.map(([id])=>id);

  function autoState(){
    try{
      const raw=JSON.parse(localStorage.getItem(AUTO_HARD_KEY)||'{}');
      if(Array.isArray(raw))return{used:raw.filter(id=>HARD_CATEGORY_IDS.includes(id)),last:raw.at(-1)||''};
      return{used:Array.isArray(raw.used)?raw.used.filter(id=>HARD_CATEGORY_IDS.includes(id)):[],last:HARD_CATEGORY_IDS.includes(raw.last)?raw.last:''};
    }catch{return{used:[],last:''}}
  }
  function saveAutoState(state){localStorage.setItem(AUTO_HARD_KEY,JSON.stringify(state))}
  function rememberAutoCategory(id){
    const state=autoState();
    if(!state.used.includes(id))state.used.push(id);
    state.last=id;
    saveAutoState(state);
  }
  function chooseAutoCategory(userCategories){
    const selected=new Set(userCategories);
    let eligible=HARD_CATEGORY_IDS.filter(id=>!selected.has(id));
    if(!eligible.length)eligible=[...HARD_CATEGORY_IDS];
    const state=autoState();
    let pool=eligible.filter(id=>!state.used.includes(id));
    if(!pool.length){
      // Nuovo giro: tutte le categorie difficili disponibili sono già passate.
      // Riparte il ciclo, ma non può uscire subito la stessa dell'ultima partita.
      state.used=[];
      saveAutoState(state);
      pool=eligible.filter(id=>id!==state.last);
      if(!pool.length)pool=eligible;
    }
    return pool[Math.floor(activeRng()*pool.length)]||eligible[0];
  }

  GAME_HELP[GAME_ID]={
    title:'Nomi, Cose, Città',
    goal:'Trova parole che iniziano con la lettera estratta e prova a battere l’AVVERSARIO.',
    steps:[
      'Prima della partita scegli esattamente 5 categorie. La sesta è una categoria difficile scelta automaticamente dal gioco e cambia da una partita all’altra.',
      'A ogni round viene estratta una lettera. Il foglio mantiene tutti i round uno sotto l’altro, come nel gioco su carta.',
      'In ogni casella la tua risposta è sopra; dopo STOP compare subito sotto la risposta dell’AVVERSARIO.',
      'Quando hai finito premi “STOP · Consegna”: anche l’AVVERSARIO viene fermato in quel momento. Se non premi STOP, il round termina allo scadere del tempo.',
      'Una risposta valida e unica vale 10 punti; se TU e AVVERSARIO scrivete la stessa risposta vale 5; risposta vuota o non valida vale 0.'
    ],
    tips:[
      'L’AVVERSARIO non è infallibile e può lasciare vuoto, soprattutto nelle categorie difficili.',
      'Se una tua risposta non è realmente valida per la categoria, dopo la rivelazione puoi annullarla e il punteggio viene ricalcolato.',
      'La categoria automatica ruota tra quelle difficili disponibili e non viene riproposta finché ce ne sono altre non usate.',
      'I punteggi compaiono accanto a ogni risposta; sotto il foglio trovi soltanto il totale TU vs AVVERSARIO.',
      'La difficoltà modifica tempo disponibile e abilità dell’AVVERSARIO.'
    ]
  };

  const LEVEL_CFG={
    easy:{rounds:3,seconds:105,skill:.58,label:'Più tempo · avversario tranquillo'},
    medium:{rounds:4,seconds:85,skill:.70,label:'Ritmo medio · avversario competitivo'},
    hard:{rounds:5,seconds:70,skill:.82,label:'Poco tempo · avversario preparato'},
    extreme:{rounds:5,seconds:55,skill:.91,label:'Tempo stretto · avversario molto forte'}
  };

  function h(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function n(s){return String(s??'').trim().toLocaleUpperCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ')}
  function prefs(){
    try{
      const p=JSON.parse(localStorage.getItem(PREF_KEY)||'{}');
      const cats=Array.isArray(p.categories)?p.categories.filter(x=>NCC_META[x]).slice(0,USER_CATEGORY_COUNT):[];
      if(cats.length===USER_CATEGORY_COUNT)return{categories:cats};
    }catch{}
    return{categories:['nome','cosa','citta','animale','mestiere']};
  }
  function savePrefs(categories){localStorage.setItem(PREF_KEY,JSON.stringify({categories:categories.filter(x=>NCC_META[x]).slice(0,USER_CATEGORY_COUNT)}))}
  function timeFor(level){return LEVEL_CFG[level].seconds}
  function matching(cat,letter){return (W[cat]||[]).filter(x=>n(x).startsWith(letter))}
  function tierPenalty(cat){const g=NCC_META[cat]?.group;return g==='hard'?.12:g==='easy'?.04:0}

  function chooseLetter(categories,used){
    const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const recent=new Set(used);
    const scored=letters.map(letter=>{
      let cover=0,hardCover=0,totalWords=0;
      for(const cat of categories){const len=matching(cat,letter).length;if(len){cover++;totalWords+=len;if(NCC_META[cat].group==='hard')hardCover++}}
      const ratio=cover/Math.max(1,categories.length);
      const score=ratio*100+Math.min(totalWords,20)+(hardCover?18:-30)-(recent.has(letter)?60:0);
      return{letter,cover,hardCover,score};
    }).filter(x=>x.hardCover>0&&x.cover>=Math.max(4,Math.ceil(categories.length*.60)));
    const pool=(scored.length?scored:letters.map(letter=>({letter,score:matching(categories[0]||'nome',letter).length})))
      .sort((a,b)=>b.score-a.score).slice(0,Math.max(5,Math.ceil(scored.length*.55)||5));
    return pool[Math.floor(activeRng()*pool.length)]?.letter||'M';
  }

  function botAnswer(cat,letter,baseSkill,timeFraction){
    const pool=matching(cat,letter);
    if(!pool.length)return'';
    const skill=Math.max(.10,Math.min(.96,baseSkill-tierPenalty(cat)));
    const timeFactor=.48+.52*Math.max(0,Math.min(1,timeFraction));
    const richness=Math.min(.08,(pool.length-1)*.018);
    if(activeRng()>Math.min(.97,skill*timeFactor+richness))return'';
    return pool[Math.floor(activeRng()*pool.length)];
  }

  function scoreRow(answers,valid){
    const normed=answers.map((x,i)=>valid[i]?n(x):'');
    return answers.map((x,i)=>{
      if(!valid[i]||!normed[i])return 0;
      const duplicate=normed.some((v,j)=>j!==i&&valid[j]&&v===normed[i]);
      return duplicate?5:10;
    });
  }

  function clearPlayModes(){
    document.body.classList.remove('sg2-home','sg2-family','sg2-nextgen','sg2-classic','sg2-detail','sg2-lumina-play','sg2-everybody-play','sg2-another-play','sg2-alibi-play');
    document.body.classList.add('ncc-play');
    stopTimer();
  }

  const oldStartGame=startGame;
  startGame=function(game,level,opts={}){
    if(game!==GAME_ID)return oldStartGame(game,level,opts);
    clearPlayModes();
    activeSaved=false;activeGame=game;activeLevel=level;
    activeSessionTracked=opts.trackSession!==false&&SESSION_GAMES.has(game);
    if(activeSessionTracked){
      const s=sessionState(game,level);
      if(s.cycleComplete){renderCycleComplete(game,level);return}
      activeRng=makeRng(sessionSeed(game,level));
    }else activeRng=Math.random;
    activeNoteKey=noteKeyFor(game,level);
    setHeader(GAME_NAMES[game],LEVEL_NAMES[level]);
    renderSetup(level);
  };

  function renderSetup(level){
    const p=prefs();
    const selected=new Set(p.categories.slice(0,USER_CATEGORY_COUNT));
    const autoCategory=chooseAutoCategory([...selected]);
    selected.delete(autoCategory);
    while(selected.size<USER_CATEGORY_COUNT){
      const fallback=['nome','cosa','citta','animale','mestiere','colore','cibo','sport','film','marca'].find(id=>id!==autoCategory&&!selected.has(id));
      if(!fallback)break;selected.add(fallback);
    }
    const cfg=LEVEL_CFG[level];
    app.innerHTML=gameShell(GAME_ID,level,`
      <section class="ncc-setup">
        <div class="ncc-setup-hero">
          <div><span class="ncc-kicker">SFIDA A 2 GIOCATORI</span><h2>Nomi, Cose, Città</h2><p>Scegli <b>5 categorie</b>. La sesta viene scelta automaticamente dal gioco tra le categorie difficili e cambia a ogni partita.</p></div>
          <div class="ncc-players-mini"><span><b>Tu</b><small>giocatore reale</small></span><span><b>AVVERSARIO</b><small>automatico</small></span></div>
        </div>
        <div class="ncc-fixed-category"><span>★ CATEGORIA AUTOMATICA</span><b>${h(NCC_META[autoCategory].label)}</b><small>Scelta dal gioco per questa partita · alla prossima cambierà.</small></div>
        <div class="ncc-config-summary"><span id="nccSelectedCount"></span><span>${cfg.rounds} round</span><span>${cfg.seconds} s/round</span><span>${h(cfg.label)}</span></div>
        <div class="ncc-category-groups">
          ${Object.entries(NCC_GROUPS).map(([key,g])=>`
            <section class="ncc-cat-group ${key}"><div class="ncc-cat-title"><h3>${h(g.label)}</h3>${key==='hard'?`<span>${h(NCC_META[autoCategory].label)} scelta dal gioco</span>`:''}</div>
            <div class="ncc-cat-chips">${g.items.map(([id,label])=>id===autoCategory
              ?`<span class="ncc-cat-chip fixed selected" aria-disabled="true">${h(label)} <small>AUTO</small></span>`
              :`<button type="button" class="ncc-cat-chip ${selected.has(id)?'selected':''}" data-cat="${id}">${h(label)}</button>`).join('')}</div></section>
          `).join('')}
        </div>
        <div id="nccSetupError" class="ncc-setup-error" aria-live="polite"></div>
        <div class="ncc-setup-actions"><button id="nccDefault" class="secondary" type="button">Selezione classica</button><button id="nccClear" class="secondary" type="button">Azzera</button><button id="nccStart" class="primary" type="button">Inizia la partita</button></div>
      </section>`);

    const chips=[...document.querySelectorAll('.ncc-cat-chip[data-cat]')];
    const error=document.getElementById('nccSetupError');
    function selectedCats(){return chips.filter(b=>b.classList.contains('selected')).map(b=>b.dataset.cat)}
    function sync(message=''){
      const cats=selectedCats();
      document.getElementById('nccSelectedCount').textContent=`${cats.length}/5 scelte + 1 automatica`;
      error.textContent=message||(cats.length<USER_CATEGORY_COUNT?`Scegli ancora ${USER_CATEGORY_COUNT-cats.length} ${USER_CATEGORY_COUNT-cats.length===1?'categoria':'categorie'}.`:'Selezione completa: 6 categorie totali.');
      error.classList.toggle('ok',cats.length===USER_CATEGORY_COUNT);
      document.getElementById('nccStart').disabled=cats.length!==USER_CATEGORY_COUNT;
      return cats;
    }
    chips.forEach(b=>b.onclick=()=>{
      const isSelected=b.classList.contains('selected');
      if(!isSelected&&selectedCats().length>=USER_CATEGORY_COUNT){sync(`Puoi scegliere al massimo 5 categorie: la sesta è già ${NCC_META[autoCategory].label}.`);return}
      b.classList.toggle('selected');sync();
    });
    document.getElementById('nccDefault').onclick=()=>{const d=new Set(['nome','cosa','citta','animale','mestiere']);chips.forEach(b=>b.classList.toggle('selected',d.has(b.dataset.cat)));sync()};
    document.getElementById('nccClear').onclick=()=>{chips.forEach(b=>b.classList.remove('selected'));sync()};
    document.getElementById('nccStart').onclick=()=>{const cats=sync();if(cats.length!==USER_CATEGORY_COUNT)return;savePrefs(cats);rememberAutoCategory(autoCategory);startMatch(level,[...cats,autoCategory],autoCategory)};
    sync();
  }

  function startMatch(level,categories,autoCategory){
    const cfg=LEVEL_CFG[level];
    let round=1;
    const usedLetters=[];
    const history=[];
    let roundSeconds=cfg.seconds,deadline=0,submitted=false,currentLetter='',userInvalid=new Set();
    activeStart=Date.now();

    const totalScores=()=>history.reduce((acc,r)=>{acc[0]+=r.points[0].reduce((a,b)=>a+b,0);acc[1]+=r.points[1].reduce((a,b)=>a+b,0);return acc},[0,0]);
    const categoryClass=(cat,i)=>`cat-${i} ${NCC_META[cat].group==='hard'?'hard':''} ${cat===autoCategory?'fixed':''}`;

    function scorePair(user,opponent,invalid){
      const userValid=!invalid&&!!user;
      const oppValid=!!opponent;
      return scoreRow([user,opponent],[userValid,oppValid]);
    }

    function roundPoints(user,opponent,invalidSet){
      const u=[],o=[];
      categories.forEach((cat,i)=>{const p=scorePair(user[i],opponent[i],invalidSet.has(i));u.push(p[0]);o.push(p[1])});
      return [u,o];
    }

    function blankCells(r){
      return categories.map((cat,i)=>`<td class="ncc-paper-cell ${categoryClass(cat,i)}"><div class="ncc-cell-player you"><span>TU</span><input data-cat="${cat}" data-i="${i}" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="${currentLetter}…"></div><div class="ncc-cell-player opponent waiting"><span>AVVERSARIO</span><b>sta scrivendo…</b></div></td>`).join('');
    }

    function completedCells(item){
      return categories.map((cat,i)=>{
        const invalid=item.invalid.has(i);const up=item.points[0][i],op=item.points[1][i];
        return `<td class="ncc-paper-cell ${categoryClass(cat,i)}"><div class="ncc-cell-player you ${invalid?'invalid':''}"><span>TU</span><b>${item.user[i]?h(item.user[i]):'—'}</b><strong>${invalid?0:up} pt</strong>${item.user[i]?`<button class="ncc-valid-toggle" data-round="${item.round}" data-i="${i}" type="button">${invalid?'Ripristina':'Annulla'}</button>`:''}</div><div class="ncc-cell-player opponent"><span>AVVERSARIO</span><b>${item.opponent[i]?h(item.opponent[i]):'—'}</b><strong>${op} pt</strong></div></td>`;
      }).join('');
    }

    function futureCells(){return categories.map((cat,i)=>`<td class="ncc-paper-cell ${categoryClass(cat,i)} future"><span>—</span></td>`).join('')}

    function sheetRows(){
      let out='';
      for(let r=1;r<=cfg.rounds;r++){
        const item=history.find(x=>x.round===r);
        const isCurrent=r===round&&!submitted;
        const letter=item?.letter||(isCurrent?currentLetter:'');
        out+=`<tr class="${isCurrent?'current':''} ${item?'done':''}"><th class="ncc-round-cell"><b>${r}</b><span>${letter||'—'}</span></th>${item?completedCells(item):isCurrent?blankCells(r):futureCells()}</tr>`;
      }
      return out;
    }

    function scoreboard(){const [you,opp]=totalScores();return `<div class="ncc-total-score"><div class="you"><small>TU</small><strong>${you}</strong></div><span class="vs">VS</span><div class="opp"><small>AVVERSARIO</small><strong>${opp}</strong></div></div>`}

    function renderRound(){
      app.innerHTML=gameShell(GAME_ID,level,`
        <div class="ncc-round-banner"><div class="ncc-letter-panel"><small>LETTERA</small><strong>${currentLetter}</strong></div><div class="ncc-round-progress"><span class="ncc-kicker">ROUND ${round}/${cfg.rounds}</span><h2>Compila la riga ${round}</h2><div class="ncc-time-line"><span>Tempo rimanente</span><div><i id="nccTimeBar"></i></div><b id="nccTimeText">${fmtTime(roundSeconds)}</b></div></div><button id="nccStop" class="ncc-stop" type="button">STOP<br><small>Consegna</small></button></div>
        <div class="ncc-paper-wrap"><table class="ncc-paper"><thead><tr><th class="round-head">#</th>${categories.map((cat,i)=>`<th class="${categoryClass(cat,i)}">${h(NCC_META[cat].label)}${cat===autoCategory?'<small>★ AUTO</small>':''}</th>`).join('')}</tr></thead><tbody>${sheetRows()}</tbody></table></div>
        <div class="ncc-paper-help"><span>10 = unica</span><span>5 = uguale all’avversario</span><span>0 = vuota/non valida</span></div>
        ${scoreboard()}`);
      const first=document.querySelector('.ncc-paper tr.current input');if(first)setTimeout(()=>first.focus(),80);
      document.getElementById('nccStop').onclick=()=>submitRound(false);
      document.querySelectorAll('.ncc-paper tr.current input').forEach((inp,idx,arr)=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();(arr[idx+1]||document.getElementById('nccStop')).focus()}}));
      startCountdown();
    }

    function startCountdown(){
      if(activeTimer)clearInterval(activeTimer);
      deadline=Date.now()+roundSeconds*1000;
      const tick=()=>{
        const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));
        const text=document.getElementById('nccTimeText'),timer=document.getElementById('timer'),bar=document.getElementById('nccTimeBar');
        if(text)text.textContent=fmtTime(left);if(timer)timer.textContent=fmtTime(left);if(bar)bar.style.width=`${Math.max(0,left/roundSeconds*100)}%`;
        if(left<=0){clearInterval(activeTimer);activeTimer=null;submitRound(true)}
      };
      tick();activeTimer=setInterval(tick,250);
    }

    function submitRound(timeout){
      if(submitted)return;submitted=true;
      if(activeTimer){clearInterval(activeTimer);activeTimer=null}
      const remaining=Math.max(0,(deadline-Date.now())/1000);
      const fraction=Math.max(.05,Math.min(1,1-remaining/roundSeconds));
      const user=categories.map(cat=>document.querySelector(`input[data-cat="${cat}"]`)?.value.trim()||'');
      const opponent=categories.map(cat=>botAnswer(cat,currentLetter,cfg.skill,fraction));
      userInvalid=new Set();user.forEach((ans,i)=>{if(!ans||!n(ans).startsWith(currentLetter))userInvalid.add(i)});
      const points=roundPoints(user,opponent,userInvalid);
      history.push({round,letter:currentLetter,user,opponent,invalid:new Set(userInvalid),points,timeout});
      renderReveal();
    }

    function renderReveal(){
      const item=history[history.length-1];
      app.innerHTML=gameShell(GAME_ID,level,`
        <div class="ncc-round-banner result"><div class="ncc-letter-panel"><small>LETTERA</small><strong>${item.letter}</strong></div><div class="ncc-round-progress"><span class="ncc-kicker">ROUND ${item.round}/${cfg.rounds} · RISULTATI</span><h2>${item.timeout?'Tempo scaduto':'Hai chiamato STOP'}</h2><p>Le risposte dell’AVVERSARIO sono subito sotto le tue.</p></div><button id="nccNextRound" class="ncc-next" type="button">${item.round<cfg.rounds?'Prossimo round →':'Risultato finale →'}</button></div>
        <div class="ncc-paper-wrap"><table class="ncc-paper"><thead><tr><th class="round-head">#</th>${categories.map((cat,i)=>`<th class="${categoryClass(cat,i)}">${h(NCC_META[cat].label)}${cat===autoCategory?'<small>★ AUTO</small>':''}</th>`).join('')}</tr></thead><tbody>${sheetRows()}</tbody></table></div>
        <div class="ncc-paper-help"><span>Puoi annullare una tua risposta se non è valida.</span><span>Il punteggio viene ricalcolato subito.</span></div>
        ${scoreboard()}`);
      attachInvalidButtons();
      document.getElementById('nccNextRound').onclick=()=>{if(round<cfg.rounds){round++;beginRound()}else finishMatch()};
    }

    function attachInvalidButtons(){
      document.querySelectorAll('.ncc-valid-toggle').forEach(b=>b.onclick=()=>{
        const r=+b.dataset.round,i=+b.dataset.i;const item=history.find(x=>x.round===r);if(!item)return;
        if(item.invalid.has(i)){const ans=item.user[i];if(ans&&n(ans).startsWith(item.letter))item.invalid.delete(i)}else item.invalid.add(i);
        item.points=roundPoints(item.user,item.opponent,item.invalid);renderReveal();
      });
    }

    function beginRound(){
      submitted=false;userInvalid=new Set();roundSeconds=cfg.seconds;
      currentLetter=chooseLetter(categories,usedLetters);usedLetters.push(currentLetter);
      renderRound();
    }

    function finishMatch(){
      const [you,opp]=totalScores();
      const success=you>=opp;
      const message=`<b>Tu: ${you}</b> · AVVERSARIO: ${opp}. ${you>opp?'Hai vinto la partita.':you===opp?'Partita pareggiata.':'Ha vinto l’AVVERSARIO.'}`;
      concludeSession(GAME_ID,level,you,success,message);
    }

    beginRound();
  }

  // Inserimento nella famiglia dei giochi classici senza modificare il motore già funzionante.
  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');if(!grid||grid.querySelector('.art-nomicosacitta'))return;
    const btn=document.createElement('button');
    btn.className='sg2-classic-card art-nomicosacitta';
    btn.onclick=()=>chooseDifficulty(GAME_ID);
    btn.innerHTML=`<span class="sg2-classic-icon">ABC</span><strong>Nomi, Cose, Città</strong><small>Tu vs AVVERSARIO · 6 categorie</small>`;
    const puzzle=grid.querySelector('.art-picturepuzzle');
    if(puzzle)puzzle.after(btn);else grid.appendChild(btn);
  };

  // Mostra la versione dell'app in Home senza cambiare altre parti già funzionanti.
  const oldHome=renderHome;
  renderHome=function(){
    document.body.classList.remove('ncc-play');
    oldHome();
    const v=document.querySelector('.sg2-home-copy .sg2-eyebrow b');if(v)v.textContent=`v${NCC_VERSION}`;
  };

  const oldClue=typeof currentClueText==='function'?currentClueText:null;
  if(oldClue)currentClueText=function(){
    if(activeGame===GAME_ID){
      const letter=document.querySelector('.ncc-letter-big')?.textContent||document.querySelector('.ncc-round-head h2 b')?.textContent||'';
      const cats=[...document.querySelectorAll('.ncc-paper thead th:not(.round-head)')].map(x=>x.childNodes[0]?.textContent?.trim()).filter(Boolean);
      return `Nomi, Cose, Città · Lettera ${letter}${cats.length?` · ${cats.join(', ')}`:''}`;
    }
    return oldClue();
  };

  // Al caricamento mostra subito la Home con il numero di versione aggiornato.
  renderHome();
})();
