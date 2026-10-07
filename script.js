/* ROJSTNODNEVNI AI PROTOKOL - v0.5 */
const GAME_URL = location.href.split('?')[0];
const app = document.getElementById('app');
let session = new URLSearchParams(location.search).get('session') || makeSession();
let audioCtx;
const state = {mush:null, fish:{vaba:null,globina:null,vodenje:null}, py:false, scores:0};

function makeSession(){ return 'M53-' + Math.random().toString(36).slice(2,5).toUpperCase(); }
function sound(type='click'){
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const now=audioCtx.currentTime;
    const presets={
      click:[[520,.055,.045,'sine']],
      ok:[[660,.10,.055,'sine'],[880,.16,.045,'sine']],
      error:[[180,.16,.07,'sawtooth'],[120,.20,.05,'sawtooth']],
      cast:[[180,.08,.035,'triangle'],[310,.16,.045,'triangle']],
      splash:[[120,.08,.045,'triangle'],[70,.20,.035,'sine']],
      bite:[[85,.20,.10,'sawtooth'],[120,.30,.07,'square'],[62,.38,.05,'sawtooth']],
      reel:[[430,.10,.035,'triangle'],[560,.10,.03,'triangle'],[700,.14,.025,'triangle']],
      scan:[[420,.08,.025,'sine'],[620,.08,.025,'sine'],[840,.11,.02,'sine']],
      terminal:[[300,.07,.025,'square'],[430,.07,.022,'square'],[560,.07,.018,'square']],
      alarm:[[180,.18,.06,'square'],[110,.22,.045,'square']],
      unlock:[[260,.16,.04,'sine'],[390,.18,.045,'sine'],[580,.24,.05,'sine'],[820,.40,.055,'sine']]
    };
    (presets[type]||presets.click).forEach((x,i)=>{
      const [f,d,v,w]=x,o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.type=w;o.frequency.setValueAtTime(f,now+i*.045);g.gain.setValueAtTime(.001,now+i*.045);g.gain.exponentialRampToValueAtTime(v,now+i*.045+.012);g.gain.exponentialRampToValueAtTime(.001,now+i*.045+d);o.connect(g);g.connect(audioCtx.destination);o.start(now+i*.045);o.stop(now+i*.045+d+.03);
    });
  }catch(e){}
}
function shell(inner, title='ROJSTNODNEVNI AI PROTOKOL'){ app.innerHTML=`<div class="wrap"><section class="terminal"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>${title}</span></div><div class="content">${inner}</div></section></div>`; requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'smooth'})); }
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function intro(){
 shell(`<div class="eyebrow">SISTEMSKA INICIALIZACIJA</div><div class="terminal-lines" id="term"></div><div id="introAction"></div>`);
 const lines=[
 'ZAČETEK SISTEMSKE DIAGNOSTIKE ...',
 'Vzpostavljam povezavo z rojstnodnevnim protokolom ...',
 'Preverjam uporabniško identiteto ...',
 'UPORABNIK ZAZNAN',
 'IME: MITJA',
 'STAROST: 53',
 'ANALIZA UPORABNIKA:',
 'UMETNA INTELIGENCA ............. POTRJENO',
 'PROGRAMIRANJE ................... POTRJENO',
 'RIBOLOV .......................... POTRJENO',
 'GOBARENJE ........................ POTRJENO',
 'GLASBA ........................... POTRJENO',
 'STATUS ROJSTNEGA DNE: POTRJEN',
 'PREVERJAM DOSTOP DO DARILA ...',
 'DOSTOP DO DARILA: ZAKLENJEN',
 'RAZLOG: uporabnik še ni opravil zahtevanih preizkusov.'
 ];
 const term=document.getElementById('term'); let i=0;
 const add=()=>{ if(i>=lines.length){setTimeout(()=>introEnd(),500);return;} const d=document.createElement('div');d.className='line';term.appendChild(d);let text=lines[i++],j=0; const tick=()=>{d.textContent=text.slice(0,j++);if(j<=text.length){setTimeout(tick,8+Math.random()*20)}else{d.innerHTML=esc(text)+' <span class="cursor"></span>';sound(i%4===0?'click':'click');setTimeout(add,90)}};tick();};add();
}
function introEnd(){
 const action=document.getElementById('introAction');
 if(innerWidth<760){
  action.innerHTML=`<div class="notice"><b>MOBILNA FAZA ZAKLJUČENA</b><br><br>Za naslednjo fazo je potreben večji zaslon.<br>Kopiraj povezavo in si jo pošlji v Teams.<br>Nato odpri sporočilo na računalniku in nadaljuj protokol.</div><br><button class="btn" id="teamsBtn">📋 KOPIRAJ IN POŠLJI V TEAMS</button><div class="status" id="copyStatus"></div>`;
  document.getElementById('teamsBtn').onclick=copyTeams;
 }else{
  action.innerHTML=`<div class="notice">Računalniški terminal zaznan. Inicializacija lahko nadaljuje.</div><br><button class="btn" id="startBtn">▶ ZAŽENI PROTOKOL</button>`;
  document.getElementById('startBtn').onclick=()=>{sound('ok');mission1()};
 }
}
async function copyTeams(){
 const msg=`🤖 ROJSTNODNEVNI AI PROTOKOL\n\nMitja, sistem zahteva tvojo prisotnost na računalniku.\nMobilna inicializacija je uspešno zaključena.\n\nNadaljuj tukaj: ${GAME_URL}?session=${session}\n\nSejni ključ: ${session}`;
 try{await navigator.clipboard.writeText(msg);document.getElementById('copyStatus').textContent='✓ SPOROČILO KOPIRANO. Prilepi ga v Teams na računalniku.';sound('ok')}catch(e){document.getElementById('copyStatus').textContent='Kopiraj povezavo ročno: '+GAME_URL+'?session='+session;}
}
function head(n,title,desc){return `<div class="mission-head"><div><div class="mission-number">PREIZKUS ${String(n).padStart(2,'0')}</div><div class="mission-title">${title}</div><div class="subtitle">${desc}</div></div></div><div class="progress"><i style="width:${(n-1)*20}%"></i></div>`}

function mission1(){
 shell(head(1,'🍄 AI ALI REAL?','Tri fotografije prikazujejo jurčke. Dve sta pravi. Ena je umetno ustvarjena. Identificiraj sintetični primerek.')+`<div class="mushrooms" id="mushrooms"></div><div id="mushMsg"></div>`);
 const imgs=[
  ['A','https://upload.wikimedia.org/wikipedia/commons/1/18/Boletus_edulis.jpg','Pravi vzorec'],
  ['B','https://upload.wikimedia.org/wikipedia/commons/6/69/Boletus_edulis_-_Note%C4%87_Forest.jpg','Pravi vzorec'],
  ['C','assets/musnica_ai.png','Analiziraj vzorec']
 ];
 // We use three mushroom photos; the AI image is a porcini-style generated image. Labels deliberately avoid revealing which is synthetic.
 imgs.sort(()=>Math.random()-.5);
 const box=document.getElementById('mushrooms');box.innerHTML=imgs.map((x,i)=>`<button class="mush-card" data-index="${i}" data-ai="${x[2]==='Analiziraj vzorec'}"><img src="${x[1]}" alt="Vzorec ${i+1}"><div class="mush-label">VZOREC ${i+1}</div></button>`).join('');
 box.querySelectorAll('.mush-card').forEach(c=>c.onclick=()=>{sound('click');box.querySelectorAll('.mush-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');checkMush(c)});
}
function checkMush(card){
 const msg=document.getElementById('mushMsg');
 if(card.dataset.ai==='true'){state.scores++;sound('ok');msg.innerHTML=`<div class="notice success fade"><b>ANALIZA ZAKLJUČENA ✓</b><br>Sintetični primerek pravilno identificiran.<br><br>Umetna inteligenca priznava poraz. Zaenkrat.<br><br><button class="btn" onclick="mission2()">NADALJUJ →</button></div>`}
 else{sound('error');const count=card.dataset.wrong||'0';card.dataset.wrong=+count+1;const responses={0:'Vzorec je avtentičen. Sistem zaznava prekomerno samozavest. Ponovna analiza dovoljena.',1:'Ta jurček je bil preverjen. Je pravi. Tvoja analiza pa trenutno nekoliko manj.',2:'Sistem potrjuje: organski primerek. AI se ti tokrat samo smeji.'}; const text=responses[card.dataset.index]||responses[0];msg.innerHTML=`<div class="notice error fade"><b>❌ IDENTIFIKACIJA NEUSPEŠNA</b><br>${text}</div>`}
}

function mission2(){
 shell(head(2,'🎣 RIBOLOVNI PROTOKOL','Sestavi najprimernejši pristop za ščuko. Izberi vabo, globino in način vodenja.')+`<div class="panel"><b>CILJNA VRSTA:</b> ŠČUKA &nbsp; | &nbsp; <b>ČAS:</b> 06:17 &nbsp; | &nbsp; <b>VODA:</b> 14 °C &nbsp; | &nbsp; <b>VREME:</b> oblačno &nbsp; | &nbsp; <b>VETER:</b> 4 km/h &nbsp; | &nbsp; <b>GLOBINA:</b> 4,5 m</div><div id="fishChoices"></div>`);
 const groups=[['vaba',[['deževnik',false],['umetna ribica',true],['koruza',false]]],['globina',[['pri dnu',false],['srednji sloj',true],['tik pod gladino',false]]],['vodenje',[['počasno vlečenje po dnu',false],['neenakomerno vodenje z občasnimi pospeški',true],['popolnoma mirujoča vaba',false]]]];
 const fc=document.getElementById('fishChoices');
 fc.innerHTML=groups.map(([g,opts])=>`<div class="panel"><div class="mission-number">${g.toUpperCase()}</div><div class="options">${opts.map(([t,ok])=>`<button class="choice" data-group="${g}" data-ok="${ok}">${t}</button>`).join('')}</div></div>`).join('')+
 `<button class="btn" id="castBtn" disabled>🎣 VRZI VABO</button><div id="fishMsg"></div>
 <div class="fish-overlay" id="fishOverlay"><div class="fish-cinematic"><div class="cinematic-label">RIBOLOVNI PROTOKOL / LIVE ANALIZA</div><img class="fishing-gif" id="fishingGif" src="assets/fishing_miss.gif" alt="Ribolovna animacija"><div class="cinematic-status" id="fishCinematicStatus">PRIPRAVA META ...</div></div></div>`;
 fc.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{sound('click');fc.querySelectorAll(`[data-group="${b.dataset.group}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.fish[b.dataset.group]=b.dataset.ok==='true';document.getElementById('castBtn').disabled=!(state.fish.vaba!==null&&state.fish.globina!==null&&state.fish.vodenje!==null)});
 document.getElementById('castBtn').onclick=cast;
}
function cast(){
 const msg=document.getElementById('fishMsg'),overlay=document.getElementById('fishOverlay'),status=document.getElementById('fishCinematicStatus'),gif=document.getElementById('fishingGif');
 const ok=state.fish.vaba&&state.fish.globina&&state.fish.vodenje;
 document.getElementById('castBtn').disabled=true; msg.innerHTML=''; overlay.classList.add('show');
 gif.src=(ok?'assets/fishing_catch.gif':'assets/fishing_miss.gif')+'?t='+Date.now();
 status.textContent='META ...'; sound('cast');
 setTimeout(()=>{sound('splash');status.textContent='VABA V VODI · 06:17';},650);
 setTimeout(()=>{status.textContent='ANALIZA VODENJA ...';},1350);
 setTimeout(()=>{if(ok){sound('bite');status.textContent='ZAZNAN UGRIZ';setTimeout(()=>sound('reel'),250);setTimeout(()=>{status.textContent='ŠČUKA JE PRIJELA';},700)}else{sound('reel');status.textContent='BREZ UGRIZA · VABA VRNJENA';}},1900);
 setTimeout(()=>{
   overlay.classList.remove('show');
   if(ok){state.scores++;sound('ok');msg.innerHTML=`<div class="notice success fade"><b>ZAZNAN UGRIZ ✓</b><br><br>Analiza tehnike: POTRJENA<br>Izbira vabe: POTRJENA<br>Ciljna vrsta: ŠČUKA<br><br><b>ŠČUKA JE PRIJELA.</b><br><br><button class="btn" onclick="mission3()">NADALJUJ →</button></div>`;}
   else{sound('error');msg.innerHTML=`<div class="notice error fade"><b>RIBOLOVNI PROTOKOL: NEUSPEŠEN</b><br><br>Tokrat ni prijela.<br><br>Ščuka je trenutno boljša od tebe.<br><br><button class="btn" onclick="mission2()">POSKUSI ZNOVA</button></div>`;}
 },3400);
}

const brokenPython=`ime = "Mitja"\nstarost = 53\n\ngoba = "jurček"\nriba = "ščuka"\nrouter = "AI chatbot"\n\nprint("=== ROJSTNODNEVNA ANALIZA ===")\nprint(f"Uporabnik: {ime}")\nprint(f"Starost: {starost} let"\nprint(f"AI DETEKCIJA: {goba}")\nprint(f"RIBOLOVNI MODUL: {riba}")\nprint(f"AI ROUTER: {router}")\n\nif starost >= 50\n    print("STATUS: LEGENDARNA GENERACIJA")\nelse:\n    print("STATUS: ŠE VEDNO FUNKCIONALEN")\n\nprint("ROJSTNODNEVNI PROTOKOL: USPEŠEN")`;
function mission3(){
 shell(head(3,'🤖 AI CHATBOT ROUTER','AI je prejel pet zahtev. Popravi eno sintaktično napako v Python kodi in preveri usmerjanje.')+`<div class="code-wrap"><div class="code-head">router.py</div><textarea class="code" id="routerCode" spellcheck="false"></textarea></div><br><button class="btn" id="runRouter">▶ ZAŽENI ROUTER</button><div class="console" id="routerConsole">Čakanje na izvedbo ...</div>`);
 document.getElementById('routerCode').value=`zahteve = [\n    "Ne morem se prijaviti.",\n    "Želim prijaviti škodo.",\n    "Koliko stane zavarovanje?",\n    "Potrebujem kopijo police.",\n    "Kdaj mi poteče polica?"\n]\n\ndef usmeri(zahteva):\n    if "škodo" in zahteva:\n        return "ŠKODE"\n    elif "zavarovanje" in zahteva:\n        return "PRODAJA"\n    elif "police" in zahteva:\n        return "DOKUMENTI"\n    elif "poteče" in zahteva:\n        return "POLICE"\n    else:\n        return "PODPORA"\n\nfor zahteva in zahteve:\n    print(usmeri(zahteva), "←", zahteva)`;
 // Mission 3 is the agreed Python router; the visible starter is valid so we introduce a single controlled syntax error for the challenge.
 let v=document.getElementById('routerCode').value; v=v.replace('elif "zavarovanje" in zahteva:', 'elif "zavarovanje" in zahteva'); document.getElementById('routerCode').value=v;
 document.getElementById('runRouter').onclick=runRouter;
}
function runRouter(){
 const ta=document.getElementById('routerCode'),out=document.getElementById('routerConsole'),code=ta.value; sound('terminal');
 const missingColon=/elif\s+"zavarovanje"\s+in\s+zahteva\s*\n/.test(code); const badBirthday=false;
 if(missingColon){sound('alarm');out.className='console error';out.textContent='  File "router.py", line 10\n    elif "zavarovanje" in zahteva\n                                  ^\nSyntaxError: expected \':\'';return;}
 // lightweight validation for the intended fix
 if(code.includes('elif "zavarovanje" in zahteva:')){sound('ok');state.scores++;out.className='console success';out.textContent='PODPORA ← Ne morem se prijaviti.\nŠKODE ← Želim prijaviti škodo.\nPRODAJA ← Koliko stane zavarovanje?\nDOKUMENTI ← Potrebujem kopijo police.\nPOLICE ← Kdaj mi poteče polica?\n\nROUTER: 5 / 5 ✓';setTimeout(()=>{out.insertAdjacentHTML('afterend','<br><button class="btn fade" id="routerContinue">NADALJUJ →</button>');document.getElementById('routerContinue').onclick=()=>{sound('ok');mission4()}},250)}
}

const birthdayBroken=`ime = "Mitja"\nstarost = 53\n\ngoba = "jurček"\nriba = "ščuka"\nrouter = "AI chatbot"\n\nprint("=== ROJSTNODNEVNA ANALIZA ===")\nprint(f"Uporabnik: {ime}")\nprint(f"Starost: {starost} let"\nprint(f"AI DETEKCIJA: {goba}")\nprint(f"RIBOLOVNI MODUL: {riba}")\nprint(f"AI ROUTER: {router}")\n\nif starost >= 50\n    print("STATUS: LEGENDARNA GENERACIJA")\nelse:\n    print("STATUS: ŠE VEDNO FUNKCIONALEN")\n\nprint("ROJSTNODNEVNI PROTOKOL: USPEŠEN")`;
function mission4(){
 shell(head(4,'🐍🎂 ROJSTNODNEVNI PYTHON','Zadnja diagnostika poveže podatke iz prejšnjih preizkusov. V skripti sta dve sintaktični napaki.')+`<div class="code-wrap"><div class="code-head">birthday.py</div><textarea class="code" id="birthdayCode" spellcheck="false"></textarea></div><br><button class="btn" id="runBirthday">▶ ZAŽENI KODO</button><div class="console" id="birthdayConsole">Čakanje na izvedbo ...</div>`);
 document.getElementById('birthdayCode').value=birthdayBroken;document.getElementById('runBirthday').onclick=runBirthday;
}
function runBirthday(){
 const ta=document.getElementById('birthdayCode'),out=document.getElementById('birthdayConsole'),code=ta.value;sound('terminal');
 const e1=/print\(f"Starost: \{starost\} let"\n/.test(code); const e2=/if starost >= 50\n/.test(code);
 if(e1){sound('alarm');out.className='console error';out.textContent='  File "birthday.py", line 9\n    print(f"Starost: {starost} let"\n                                  ^\nSyntaxError: \'(\' was never closed';return;}
 if(e2){sound('alarm');out.className='console error';out.textContent='  File "birthday.py", line 16\n    if starost >= 50\n                    ^\nSyntaxError: expected \':\'';return;}
 if(code.includes('print(f"Starost: {starost} let")')&&code.includes('if starost >= 50:')){sound('ok');state.scores++;out.className='console success';out.textContent='=== ROJSTNODNEVNA ANALIZA ===\n\nUporabnik: Mitja\nStarost: 53\n\nAI DETEKCIJA: jurček\nRIBOLOVNI MODUL: ščuka\nAI ROUTER: AI chatbot\n\nSTATUS: LEGENDARNA GENERACIJA\n\nROJSTNODNEVNI PROTOKOL: USPEŠEN ✓';setTimeout(()=>{out.insertAdjacentHTML('afterend','<br><button class="btn fade" id="birthdayContinue">NADALJUJ →</button>');document.getElementById('birthdayContinue').onclick=()=>{sound('ok');mission5()}},250)}
}
function mission5(){
 shell(head(5,'🧭 LABIRINT DO DARILA','Zadnji preizkus. Vodi malega Mitjo skozi labirint do darila. Ne zgreši izhoda.')+`<div class="maze-wrap"><canvas id="mazeCanvas" width="720" height="480"></canvas><div class="maze-help">PUŠČICE / WASD = premik &nbsp; · &nbsp; Na računalniku je življenje še vedno nekoliko lažje.</div></div><div id="mazeMsg"></div>`);
 const canvas=document.getElementById('mazeCanvas'),ctx=canvas.getContext('2d');
 const grid=[
  '#################',
  '#S#       #     #',
  '# # ##### # ### #',
  '# #     # #   # #',
  '# ##### # ### # #',
  '#     # # #   # #',
  '##### # # # ### #',
  '#   # #   #     #',
  '# # # ####### # #',
  '# # #       # # #',
  '# # ####### # # #',
  '# #       #   # #',
  '# ####### ##### #',
  '#             G #',
  '#################'
 ];
 const rows=grid.length,cols=grid[0].length,cell=32; canvas.width=cols*cell;canvas.height=rows*cell;
 let p={r:1,c:1}; let won=false;
 function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#050807';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const ch=grid[r][c],x=c*cell,y=r*cell;
   if(ch==='#'){ctx.fillStyle='#102219';ctx.fillRect(x,y,cell,cell);ctx.strokeStyle='#1d3929';ctx.strokeRect(x+.5,y+.5,cell-1,cell-1)}
   else {ctx.fillStyle='#07100b';ctx.fillRect(x,y,cell,cell)}
   if(ch==='G'){ctx.fillStyle='#18351f';ctx.fillRect(x+3,y+3,cell-6,cell-6);ctx.font='22px sans-serif';ctx.textAlign='center';ctx.fillText('🎁',x+cell/2,y+23)}
   if(ch==='S'){ctx.fillStyle='#0c2416';ctx.fillRect(x+3,y+3,cell-6,cell-6)}
  }
  ctx.font='23px sans-serif';ctx.textAlign='center';ctx.fillText('🧍',p.c*cell+cell/2,p.r*cell+24);
 }
 function move(dr,dc){if(won)return;const nr=p.r+dr,nc=p.c+dc;if(nr<0||nc<0||nr>=rows||nc>=cols||grid[nr][nc]==='#'){sound('error');return}p={r:nr,c:nc};sound('click');draw();if(grid[nr][nc]==='G'){won=true;state.scores++;sound('unlock');document.getElementById('mazeMsg').innerHTML=`<div class="notice success fade"><b>LABIRINT PREHODEN ✓</b><br><br>Mitja je našel pot do darila.<br>Končni dostop je pripravljen.<br><br><button class="btn" onclick="finale()">🎁 ODKLENI DARILO</button></div>`;}}
 document.addEventListener('keydown',e=>{const m={ArrowUp:[-1,0],w:[-1,0],W:[-1,0],ArrowDown:[1,0],s:[1,0],S:[1,0],ArrowLeft:[0,-1],a:[0,-1],A:[0,-1],ArrowRight:[0,1],d:[0,1],D:[0,1]}[e.key];if(m){e.preventDefault();move(...m)}});
 const controls=document.createElement('div');controls.className='maze-controls';controls.innerHTML='<button class="btn" data-m="up">▲</button><div><button class="btn" data-m="left">◀</button><button class="btn" data-m="down">▼</button><button class="btn" data-m="right">▶</button></div>';canvas.parentElement.appendChild(controls);
 const dirs={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};controls.querySelectorAll('button').forEach(b=>b.onclick=()=>move(...dirs[b.dataset.m]));draw();
}

function finale(){
 sound('unlock');shell(`<div class="final"><div><div class="eyebrow">KONČNA SISTEMSKA DIAGNOSTIKA</div><div class="unlock">DARILO ODKLENJENO</div><p class="subtitle">Vsi preizkusi uspešno zaključeni.</p><div class="scoregrid"><div>Vizualna analiza <b>✓</b></div><div>Ribolovni protokol <b>✓</b></div><div>AI chatbot router <b>✓</b></div><div>Python diagnostika <b>✓</b></div><div>Labirint do darila <b>✓</b></div></div><div class="status">PREVERJANJE KONČNEGA DOSTOPA ... 100 %</div><div class="location">🎁 LOKACIJA DARILA:<br><br><b>NEKJE V OMARICI</b></div><div class="notice">Protokol je zaključen.<br><br>Sistem potrjuje, da je Mitja pri 53 letih še vedno sprejemljiva različica človeka.<br><br><small>Sistem se bo zdaj deaktiviral. Razlog: Mitja je našel darilo.<br>...verjetno.</small></div></div></div>`);
}

// Desktop continuation: any session URL starts at the protocol after the mobile handoff.
if(location.search.includes('session=')){setTimeout(()=>{shell(`<div class="center"><div class="eyebrow">SEJA ${esc(session)}</div><div class="title">ROJSTNODNEVNI AI PROTOKOL</div><p class="subtitle">Mobilna inicializacija potrjena.<br>Računalniški terminal pripravljen za nadaljevanje.</p><br><button class="btn" id="continueBtn">▶ NADALJUJ PROTOKOL</button></div>`);document.getElementById('continueBtn').onclick=()=>{sound('ok');mission1()}},150)}else intro();
