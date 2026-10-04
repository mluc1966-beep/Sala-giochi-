'use strict';

/* Sala Giochi 2.0 — Nomi, Cose, Città
   v2.11.0: tre giocatori, categorie configurabili, almeno una difficile, tablet-first. */
(() => {
  const NCC_VERSION='2.11.0';
  const GAME_ID='nomicosacitta';
  const PREF_KEY='sala_giochi_ncc_prefs_v1';

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

  // Lessico usato esclusivamente dai due giocatori automatici.
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

  GAME_HELP[GAME_ID]={
    title:'Nomi, Cose, Città',
    goal:'Trova parole che iniziano con la lettera estratta e prova a battere due avversari automatici.',
    steps:[
      'Prima della partita scegli liberamente le categorie. Deve esserci almeno una categoria del gruppo “difficili”.',
      'A ogni round viene estratta una lettera. Compila una risposta per ogni categoria selezionata.',
      'Quando hai finito premi “STOP · Consegna”: anche Giocatore 1 e Giocatore 2 vengono fermati in quel momento. Se non premi STOP, il round termina allo scadere del tempo.',
      'Dopo la consegna vengono rivelate tutte e tre le schede e calcolati i punti categoria per categoria.',
      'Una risposta valida e unica vale 10 punti; una risposta valida uguale a quella di un altro giocatore vale 5; risposta vuota o non valida vale 0.'
    ],
    tips:[
      'I due avversari non sono infallibili: possono lasciare caselle vuote, soprattutto nelle categorie difficili.',
      'Se una tua risposta non è realmente valida per la categoria, dopo la rivelazione puoi annullarla con un tocco: il punteggio viene ricalcolato.',
      'La difficoltà modifica tempo disponibile e abilità dei due avversari. Il numero di categorie resta una tua scelta.',
      'Una sessione comprende più lettere e i punteggi si sommano fino alla classifica finale.'
    ]
  };

  const LEVEL_CFG={
    easy:{rounds:3,perCat:12,base:20,skills:[.55,.48],label:'Più tempo · avversari tranquilli'},
    medium:{rounds:4,perCat:10,base:15,skills:[.68,.62],label:'Ritmo medio · avversari competitivi'},
    hard:{rounds:5,perCat:8,base:10,skills:[.80,.75],label:'Poco tempo · avversari preparati'},
    extreme:{rounds:5,perCat:7,base:5,skills:[.90,.86],label:'Tempo stretto · avversari molto forti'}
  };

  function h(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function n(s){return String(s??'').trim().toLocaleUpperCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ')}
  function prefs(){
    try{
      const p=JSON.parse(localStorage.getItem(PREF_KEY)||'{}');
      const cats=Array.isArray(p.categories)?p.categories.filter(x=>NCC_META[x]):[];
      if(cats.length&&cats.some(x=>NCC_META[x].group==='hard'))return{categories:cats};
    }catch{}
    return{categories:['nome','cosa','citta','animale','mestiere','colore','capitale']};
  }
  function savePrefs(categories){localStorage.setItem(PREF_KEY,JSON.stringify({categories}))}
  function timeFor(level,count){const c=LEVEL_CFG[level];return Math.max(35,Math.min(210,c.base+c.perCat*count))}
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
    }).filter(x=>x.hardCover>0&&x.cover>=Math.max(2,Math.ceil(categories.length*.52)));
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
    const selected=new Set(p.categories);
    const cfg=LEVEL_CFG[level];
    app.innerHTML=gameShell(GAME_ID,level,`
      <section class="ncc-setup">
        <div class="ncc-setup-hero">
          <div><span class="ncc-kicker">PARTITA A 3 GIOCATORI</span><h2>Nomi, Cose, Città</h2><p>Scegli le categorie della partita. <b>Almeno una deve essere difficile.</b></p></div>
          <div class="ncc-players-mini"><span><b>Tu</b><small>umano</small></span><span><b>Giocatore 1</b><small>automatico</small></span><span><b>Giocatore 2</b><small>automatico</small></span></div>
        </div>
        <div class="ncc-config-summary"><span id="nccSelectedCount"></span><span>${cfg.rounds} round</span><span id="nccTimeInfo"></span><span>${h(cfg.label)}</span></div>
        <div class="ncc-category-groups">
          ${Object.entries(NCC_GROUPS).map(([key,g])=>`
            <section class="ncc-cat-group ${key}"><div class="ncc-cat-title"><h3>${h(g.label)}</h3>${key==='hard'?'<span>★ almeno 1</span>':''}</div>
            <div class="ncc-cat-chips">${g.items.map(([id,label])=>`<button type="button" class="ncc-cat-chip ${selected.has(id)?'selected':''}" data-cat="${id}">${h(label)}</button>`).join('')}</div></section>
          `).join('')}
        </div>
        <div id="nccSetupError" class="ncc-setup-error" aria-live="polite"></div>
        <div class="ncc-setup-actions"><button id="nccDefault" class="secondary" type="button">Selezione classica</button><button id="nccClear" class="secondary" type="button">Azzera</button><button id="nccStart" class="primary" type="button">Inizia la partita</button></div>
      </section>`);

    const chips=[...document.querySelectorAll('.ncc-cat-chip')];
    const error=document.getElementById('nccSetupError');
    function sync(){
      const cats=chips.filter(b=>b.classList.contains('selected')).map(b=>b.dataset.cat);
      const hard=cats.filter(x=>NCC_META[x].group==='hard').length;
      document.getElementById('nccSelectedCount').textContent=`${cats.length} categorie`;
      document.getElementById('nccTimeInfo').textContent=`${timeFor(level,cats.length)} s/round`;
      error.textContent=hard?'':'Seleziona almeno una categoria difficile.';
      document.getElementById('nccStart').disabled=!hard||!cats.length;
      return cats;
    }
    chips.forEach(b=>b.onclick=()=>{b.classList.toggle('selected');sync()});
    document.getElementById('nccDefault').onclick=()=>{const d=new Set(['nome','cosa','citta','animale','mestiere','colore','capitale']);chips.forEach(b=>b.classList.toggle('selected',d.has(b.dataset.cat)));sync()};
    document.getElementById('nccClear').onclick=()=>{chips.forEach(b=>b.classList.remove('selected'));sync()};
    document.getElementById('nccStart').onclick=()=>{const cats=sync();if(!cats.some(x=>NCC_META[x].group==='hard'))return;savePrefs(cats);startMatch(level,cats)};
    sync();
  }

  function startMatch(level,categories){
    const cfg=LEVEL_CFG[level];
    let round=0;
    const totals=[0,0,0];
    const usedLetters=[];
    let roundSeconds=0,deadline=0,submitted=false,currentAnswers=null,userInvalid=new Set();
    activeStart=Date.now();

    function scoreboard(){return `<div class="ncc-scorebar"><span class="you"><b>Tu</b><strong>${totals[0]}</strong></span><span><b>Giocatore 1</b><strong>${totals[1]}</strong></span><span><b>Giocatore 2</b><strong>${totals[2]}</strong></span></div>`}

    function nextRound(){
      round++;
      submitted=false;userInvalid=new Set();
      const letter=chooseLetter(categories,usedLetters);usedLetters.push(letter);
      roundSeconds=timeFor(level,categories.length);
      deadline=Date.now()+roundSeconds*1000;
      app.innerHTML=gameShell(GAME_ID,level,`
        <div class="ncc-round-head"><div><span class="ncc-kicker">ROUND ${round}/${cfg.rounds}</span><h2>Lettera <b>${letter}</b></h2></div>${scoreboard()}</div>
        <div class="ncc-play-grid">
          <main class="ncc-answer-panel">
            <div class="ncc-round-note">Scrivi una risposta per categoria che inizi con <b>${letter}</b>. Quando hai finito, premi STOP.</div>
            <div class="ncc-answer-grid">
              ${categories.map((cat,i)=>`<label class="ncc-answer-card"><span>${h(NCC_META[cat].label)}${NCC_META[cat].group==='hard'?'<em>★ difficile</em>':''}</span><input data-cat="${cat}" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="${letter}…" ${i===0?'autofocus':''}></label>`).join('')}
            </div>
            <div class="ncc-stop-row"><button id="nccStop" class="primary ncc-stop" type="button">STOP · Consegna</button><small>Anche gli altri due giocatori si fermano quando consegni.</small></div>
          </main>
          <aside class="ncc-side-panel"><h3>Partita</h3><div class="ncc-letter-big">${letter}</div><p>${categories.length} categorie</p><p>${cfg.rounds-round} round dopo questo</p><div class="ncc-bot-status"><span>● Giocatore 1 sta scrivendo…</span><span>● Giocatore 2 sta scrivendo…</span></div></aside>
        </div>`);
      const first=document.querySelector('.ncc-answer-card input');if(first)setTimeout(()=>first.focus(),80);
      startCountdown(letter);
      document.getElementById('nccStop').onclick=()=>submitRound(letter,false);
      document.querySelectorAll('.ncc-answer-card input').forEach((inp,idx,arr)=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();(arr[idx+1]||document.getElementById('nccStop')).focus()}}));
    }

    function startCountdown(letter){
      if(activeTimer)clearInterval(activeTimer);
      const el=document.getElementById('timer');
      const tick=()=>{
        const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));
        if(el)el.textContent=fmtTime(left);
        if(left<=0){clearInterval(activeTimer);activeTimer=null;submitRound(letter,true)}
      };
      tick();activeTimer=setInterval(tick,250);
    }

    function submitRound(letter,timeout){
      if(submitted)return;submitted=true;
      if(activeTimer){clearInterval(activeTimer);activeTimer=null}
      const remaining=Math.max(0,(deadline-Date.now())/1000);
      const fraction=Math.max(.05,Math.min(1,1-remaining/roundSeconds));
      const user=categories.map(cat=>document.querySelector(`input[data-cat="${cat}"]`)?.value.trim()||'');
      const bot1=categories.map(cat=>botAnswer(cat,letter,cfg.skills[0],fraction));
      const bot2=categories.map(cat=>botAnswer(cat,letter,cfg.skills[1],fraction));
      currentAnswers=[user,bot1,bot2];
      user.forEach((ans,i)=>{if(!ans||!n(ans).startsWith(letter))userInvalid.add(i)});
      renderReveal(letter,timeout);
    }

    function computePoints(){
      const pts=[0,0,0];
      categories.forEach((cat,i)=>{
        const answers=currentAnswers.map(a=>a[i]);
        const valid=[!userInvalid.has(i)&&!!answers[0],!!answers[1],!!answers[2]];
        const row=scoreRow(answers,valid);
        row.forEach((v,p)=>pts[p]+=v);
      });
      return pts;
    }

    function renderReveal(letter,timeout){
      const before=[...totals];
      const roundPts=computePoints();
      // totals vengono mostrati come base + punteggio corrente; il commit avviene passando al round successivo.
      function html(){
        return gameShell(GAME_ID,level,`
          <div class="ncc-round-head reveal"><div><span class="ncc-kicker">ROUND ${round}/${cfg.rounds} · RISULTATI</span><h2>Lettera <b>${letter}</b></h2><p>${timeout?'Tempo scaduto.':'Hai chiamato STOP.'}</p></div>
          <div class="ncc-scorebar"><span class="you"><b>Tu</b><strong>${before[0]+roundPts[0]}</strong><small>+${roundPts[0]}</small></span><span><b>Giocatore 1</b><strong>${before[1]+roundPts[1]}</strong><small>+${roundPts[1]}</small></span><span><b>Giocatore 2</b><strong>${before[2]+roundPts[2]}</strong><small>+${roundPts[2]}</small></span></div></div>
          <div class="ncc-scoring-note"><b>10</b> risposta unica · <b>5</b> risposta uguale a un altro giocatore · <b>0</b> vuota/non valida. Tocca “Annulla” su una tua risposta se non è valida.</div>
          <div id="nccResults" class="ncc-results">
            ${categories.map((cat,i)=>resultCard(cat,i,roundPts)).join('')}
          </div>
          <div class="ncc-reveal-actions"><button id="nccNextRound" class="primary" type="button">${round<cfg.rounds?'Round successivo':'Classifica finale'}</button></div>`);
      }
      app.innerHTML=html();
      attachInvalidButtons();

      function resultCard(cat,i,pts){
        const labels=['Tu','Giocatore 1','Giocatore 2'];
        const answers=currentAnswers.map(a=>a[i]);
        return `<article class="ncc-result-card"><div class="ncc-result-cat"><span>${h(NCC_META[cat].label)}</span>${NCC_META[cat].group==='hard'?'<em>★ difficile</em>':''}</div><div class="ncc-result-players">
          ${answers.map((ans,p)=>{const invalid=p===0&&userInvalid.has(i);return `<div class="ncc-result-player ${p===0?'you':''} ${invalid?'invalid':''}"><small>${labels[p]}</small><b>${ans?h(ans):'—'}</b><strong>${invalid?0:pts[p]} pt</strong>${p===0&&ans?`<button class="ncc-valid-toggle" data-i="${i}" type="button">${invalid?'Ripristina':'Annulla'}</button>`:''}</div>`}).join('')}
        </div></article>`;
      }

      function attachInvalidButtons(){
        document.querySelectorAll('.ncc-valid-toggle').forEach(b=>b.onclick=()=>{
          const i=+b.dataset.i;
          if(userInvalid.has(i)){
            const ans=currentAnswers[0][i];
            if(ans&&n(ans).startsWith(letter))userInvalid.delete(i);
          }else userInvalid.add(i);
          const newPts=computePoints();roundPts.splice(0,3,...newPts);app.innerHTML=html();attachInvalidButtons();
        });
        document.getElementById('nccNextRound').onclick=()=>{
          roundPts.forEach((v,i)=>totals[i]+=v);
          if(round<cfg.rounds)nextRound();else finishMatch();
        };
      }
    }

    function finishMatch(){
      const ranking=[{name:'Tu',score:totals[0],idx:0},{name:'Giocatore 1',score:totals[1],idx:1},{name:'Giocatore 2',score:totals[2],idx:2}].sort((a,b)=>b.score-a.score);
      const top=ranking[0].score;
      const success=totals[0]===top;
      const place=ranking.findIndex(x=>x.idx===0)+1;
      const message=`<b>Tu: ${totals[0]}</b> · Giocatore 1: ${totals[1]} · Giocatore 2: ${totals[2]}. ${place===1?'Hai vinto la partita.':`Hai concluso al ${place}° posto.`}`;
      concludeSession(GAME_ID,level,totals[0],success,message);
    }

    nextRound();
  }

  // Inserimento nella famiglia dei giochi classici senza modificare il motore già funzionante.
  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){
    oldClassicFamily();
    const grid=document.querySelector('.sg2-classic-grid');if(!grid||grid.querySelector('.art-nomicosacitta'))return;
    const btn=document.createElement('button');
    btn.className='sg2-classic-card art-nomicosacitta';
    btn.onclick=()=>chooseDifficulty(GAME_ID);
    btn.innerHTML=`<span class="sg2-classic-icon">ABC</span><strong>Nomi, Cose, Città</strong><small>Tre giocatori · categorie a scelta</small>`;
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
      const cats=[...document.querySelectorAll('.ncc-answer-card>span')].map(x=>x.childNodes[0]?.textContent?.trim()).filter(Boolean);
      return `Nomi, Cose, Città · Lettera ${letter}${cats.length?` · ${cats.join(', ')}`:''}`;
    }
    return oldClue();
  };

  // Al caricamento mostra subito la Home con il numero di versione aggiornato.
  renderHome();
})();
