"use strict";
/* Sala Giochi — Rebus Archivio v2.14.0 */
(() => {
  const GAME_ID='rebus', REBUS_VERSION='2.14.0';
  const SAMPLE={id:'eureka-1869-rpc-001',diagram:'3, 2, 4, 10, 1, 1, 5, 7',solution:"NON VI SONO DIFFICOLTÀ A L'AMORE SINCERO",accepted:["NON VI SONO DIFFICOLTA A L AMORE SINCERO","NON VI SONO DIFFICOLTA ALL AMORE SINCERO"],firstReading:'N O N - viso - nodi - F fico - L T A A L - amo RE - S in cero',hint:'NON',magazine:'RPC',year:'1869',image:'rebus_archivio_001.png'};
  const API=(window.SALA_GIOCHI_REBUS_API_URL||'').trim();
  let catalog=[],index=0,record=null,loadSequence=0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[’']/g,' ').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const urlOk=()=>/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec(?:\?.*)?$/.test(API);
  // JSONP avoids browser CORS problems with Google Apps Script ContentService redirects.
  function request(action,id){return new Promise((resolve,reject)=>{
    if(!urlOk()){reject(new Error('URL Apps Script non configurato o non valido.'));return;}
    const key='__sgRebus'+Date.now()+'_'+Math.floor(Math.random()*1e7);
    const tag=document.createElement('script');let finished=false;
    const cleanup=()=>{if(finished)return;finished=true;clearTimeout(timer);delete window[key];tag.remove();};
    window[key]=data=>{cleanup();data&&data.ok?resolve(data):reject(new Error(data?.error||'Errore archivio.'));};
    tag.onerror=()=>{cleanup();reject(new Error('Impossibile raggiungere Apps Script.'));};
    const u=new URL(API);u.searchParams.set('action',action);u.searchParams.set('callback',key);
    if(id)u.searchParams.set('id',id);
    tag.src=u.toString();document.head.appendChild(tag);
    const timer=setTimeout(()=>{cleanup();reject(new Error('Timeout collegamento archivio.'));},20000);
  });}
  GAME_NAMES[GAME_ID]='Rebus';ICONS[GAME_ID]='✒';DEFAULT_GAME_PALETTES[GAME_ID]='gold';LEVEL_NAMES.archive='Archivio';
  GAME_HELP[GAME_ID]={title:'Rebus · Archivio',goal:'Ricostruisci la frase indicata dallo schema numerico, osservando la tavola.',steps:['Osserva l’immagine e lo schema numerico.','Inserisci la frase completa e premi Verifica.','Puoi chiedere un solo aiuto: la prima parola della soluzione.','Prima lettura e Soluzione rivelano rispettivamente la trascrizione e la risposta.','Usa Precedente, Successivo o Casuale per cambiare rebus.'],tips:['I rebus non sono suddivisi in livelli.','Il taccuino conserva gli appunti per ciascun rebus sul dispositivo.']};
  window.startRebusArchive=async function(){
    activeSaved=false;activeGame=GAME_ID;activeLevel='archive';activeSessionTracked=false;setHeader('Rebus','Archivio');
    if(!API){catalog=[{id:SAMPLE.id,diagram:SAMPLE.diagram,magazine:SAMPLE.magazine,year:SAMPLE.year}];index=0;record=SAMPLE;render();return;}
    renderLoading('Collegamento all’archivio…');
    try{const data=await request('list');if(!Array.isArray(data.records)||!data.records.length)throw new Error('L’archivio non contiene rebus.');catalog=data.records;index=0;await load(0);}
    catch(e){renderLoading('Archivio non disponibile: '+e.message+' Puoi riprovare tornando alla schermata iniziale.');}
  };
  function renderLoading(msg){app.innerHTML=`<div class="screen-theme game-theme" style="${paletteVars(getGamePalette(GAME_ID))}"><section class="game-shell game-rebus"><h2>Rebus · Archivio</h2><p role="status">${esc(msg)}</p></section></div>`;}
  async function load(next){if(!catalog.length)return;index=(next+catalog.length)%catalog.length;const seq=++loadSequence;
    if(!API){record=SAMPLE;render();return;}
    renderLoading(`Caricamento rebus ${index+1} di ${catalog.length}…`);
    try{const data=await request('get',catalog[index].id);if(seq!==loadSequence)return;record=data.record;render();}
    catch(e){if(seq===loadSequence)renderLoading('Errore nel caricamento: '+e.message);}
  }
  function render(){if(!record)return;activeNoteKey=`rebus|archive|${record.id}`;
    const r=record;const image=String(r.image||'');const safeImage=image.startsWith('data:image/')||/^(?:\.\/)?[\w.-]+\.(png|jpg|jpeg|webp)$/i.test(image)?image:'';
    const body=`<div class="rebus-db-layout"><section class="rebus-db-main"><div class="rebus-db-card"><div class="rebus-db-head"><div><span class="rebus-db-kicker">REBUS D’ARCHIVIO</span><h2>Record ${index+1} di ${catalog.length}</h2><p>${esc([r.magazine,r.year].filter(Boolean).join(' · '))}</p></div><div class="rebus-db-diagram">(${esc(r.diagram)})</div></div><button id="rebusDbZoomBtn" class="rebus-db-image-button" type="button" aria-label="Ingrandisci tavola"><img src="${esc(safeImage)}" alt="Tavola del rebus"><span>🔍 Ingrandisci</span></button><div class="rebus-db-navigation"><button id="rebusPrev" class="secondary" type="button">← Precedente</button><button id="rebusRandom" class="secondary" type="button">Casuale</button><button id="rebusNext" class="secondary" type="button">Successivo →</button></div><div class="rebus-db-status">${API?'Archivio Google Drive':'Prova locale: un solo rebus'}</div></div></section><aside class="rebus-db-side"><div class="rebus-db-panel"><div class="rebus-db-score"><span>Punti disponibili</span><strong id="rebusDbScore">100</strong></div><label for="rebusDbAnswer">La tua soluzione</label><textarea id="rebusDbAnswer" rows="3" autocomplete="off" spellcheck="false" placeholder="Scrivi la frase completa..."></textarea><div class="rebus-db-actions"><button id="rebusDbCheck" class="primary" type="button">✓ Verifica</button><button id="rebusDbHint" class="secondary" type="button">Aiuto: prima parola</button><button id="rebusDbReading" class="secondary" type="button">Prima lettura</button><button id="rebusDbSolution" class="secondary" type="button">Soluzione</button></div><div id="rebusDbFeedback" class="rebus-db-feedback" aria-live="polite">Osserva la tavola e prova a ricostruire la frase.</div></div></aside></div><dialog id="rebusDbZoom" class="rebus-db-zoom"><div><button id="rebusDbZoomClose" type="button" aria-label="Chiudi">×</button><img src="${esc(safeImage)}" alt="Tavola ingrandita"></div></dialog>`;
    app.innerHTML=`<div class="screen-theme game-theme" style="${paletteVars(getGamePalette(GAME_ID))}"><section class="game-shell game-rebus"><div class="game-head"><div><span class="badge">✒ Rebus · Archivio</span></div></div><div class="game-utility-bar"><button class="utility-btn" onclick="openHelp()">ⓘ Come si gioca</button><button class="utility-btn notes-btn" onclick="openNotes()">📝 Taccuino</button></div>${body}</section></div>`;
    let score=100,solved=false,hinted=false,reading=false;
    const feedback=document.getElementById('rebusDbFeedback'),answer=document.getElementById('rebusDbAnswer'),zoom=document.getElementById('rebusDbZoom');
    const refresh=()=>document.getElementById('rebusDbScore').textContent=score;
    const setFeedback=(html,cls='')=>{feedback.className='rebus-db-feedback'+(cls?' '+cls:'');feedback.innerHTML=html;};
    const finish=()=>{solved=true;document.querySelectorAll('.rebus-db-actions button').forEach(b=>b.disabled=true);answer.disabled=true;};
    document.getElementById('rebusDbZoomBtn').onclick=()=>zoom.showModal();document.getElementById('rebusDbZoomClose').onclick=()=>zoom.close();zoom.addEventListener('click',e=>{if(e.target===zoom)zoom.close();});
    document.getElementById('rebusPrev').onclick=()=>load(index-1);document.getElementById('rebusNext').onclick=()=>load(index+1);
    document.getElementById('rebusRandom').onclick=()=>{if(catalog.length<2)return;let j=index;while(j===index)j=Math.floor(Math.random()*catalog.length);load(j);};
    document.getElementById('rebusDbCheck').onclick=()=>{if(solved)return;const a=norm(answer.value);if(!a){setFeedback('Scrivi prima una soluzione.');answer.focus();return;}const accepted=[r.solution,...(Array.isArray(r.accepted)?r.accepted:String(r.accepted||'').split('|'))];if(accepted.some(x=>norm(x)===a)){setFeedback(`<b>✓ Esatto</b><div class="rebus-db-solution">${esc(r.solution)}</div>`,'ok');finish();}else{score=Math.max(10,score-8);refresh();setFeedback('Non corrisponde alla soluzione registrata. Riprova.','wrong');}};
    answer.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('rebusDbCheck').click();}});
    document.getElementById('rebusDbHint').onclick=()=>{if(!hinted){hinted=true;score=Math.max(10,score-10);refresh();}const first=String(r.hint||String(r.solution||'').split(/\s+/)[0]);setFeedback(`<b>Prima parola:</b> ${esc(first)}`,'hint');};
    document.getElementById('rebusDbReading').onclick=()=>{if(!reading){reading=true;score=Math.max(10,score-25);refresh();}setFeedback(`<b>Prima lettura</b><div class="rebus-db-reading">${esc(r.firstReading||'Non disponibile nell’archivio.')}</div>`,'reading');};
    document.getElementById('rebusDbSolution').onclick=()=>{if(!confirm('Rivelare la soluzione?'))return;score=0;refresh();setFeedback(`<b>Soluzione</b><div class="rebus-db-solution">${esc(r.solution)}</div><div class="rebus-db-reading"><b>Prima lettura:</b> ${esc(r.firstReading||'Non disponibile')}</div>`,'solution');finish();};
  }
  const oldClassicFamily=window.renderClassicFamily;
  window.renderClassicFamily=function(){oldClassicFamily();const grid=document.querySelector('.sg2-classic-grid');if(!grid)return;let btn=grid.querySelector('.art-rebus');if(btn){btn.onclick=()=>window.startRebusArchive();btn.innerHTML='<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Archivio italiano · senza livelli</small>';return;}btn=document.createElement('button');btn.className='sg2-classic-card art-rebus';btn.onclick=()=>window.startRebusArchive();btn.innerHTML='<span class="sg2-classic-icon">✒</span><strong>Rebus</strong><small>Archivio italiano · senza livelli</small>';const ncc=grid.querySelector('.art-nomicosacitta');if(ncc)ncc.after(btn);else grid.appendChild(btn);};
  const oldHome=renderHome;renderHome=function(){oldHome();const v=document.querySelector('.sg2-home-copy .sg2-eyebrow b');if(v)v.textContent=`v${REBUS_VERSION}`;};
  const oldClue=typeof currentClueText==='function'?currentClueText:null;
  if(oldClue)currentClueText=function(){if(activeGame===GAME_ID)return `Rebus archivio · (${record?.diagram||''})`;return oldClue();};
  renderHome();
})();
