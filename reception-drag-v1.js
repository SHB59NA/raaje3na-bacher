// راجعنا باچر — Tactile Drag Desk v1.4.0
// Pointer/touch driven inspection desk: move the file, spread papers, and physically stamp the request.
(function(){
  const VERSION='v1.4.0';
  const A='assets/prototype/';
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];

  const caseState=window.caseState={
    phase:'dialogue',
    fileReceived:false,
    filePlaced:false,
    fileOpened:false,
    documentsVisible:false,
    stamped:false,
    stampType:null,
    rejectReason:null
  };

  let paperSerial=0;
  let audioCtx=null;

  function notice(text){const n=q('#intakeNotice');if(n)n.textContent=text;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function inside(x,y,rect){return x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;}

  function tone(freq=180,duration=.055,type='square',volume=.025){
    try{
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      const o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.type=type;o.frequency.value=freq;g.gain.value=volume;
      o.connect(g);g.connect(audioCtx.destination);o.start();
      g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
      o.stop(audioCtx.currentTime+duration);
    }catch(e){}
  }
  function sound(kind){
    if(kind==='pickup')tone(170,.045,'square',.018);
    else if(kind==='drop'){tone(105,.07,'triangle',.025);setTimeout(()=>tone(75,.04,'triangle',.012),32);}
    else if(kind==='paper')tone(320,.035,'sine',.014);
    else if(kind==='stamp'){tone(82,.075,'square',.035);setTimeout(()=>tone(54,.055,'square',.02),35);}
    else if(kind==='bad')tone(115,.12,'sawtooth',.018);
  }

  function addStyle(){
    if(q('#dragDeskStyle'))return;
    const st=document.createElement('style');st.id='dragDeskStyle';
    st.textContent=`
      body.dragDeskMode #intakeScreen .deskArea{visibility:hidden!important;pointer-events:none!important}
      body.dragDeskMode #approveRouteBtn,body.dragDeskMode #rejectReasonBtn{display:none!important}
      body.dragDeskMode #toolComputer,body.dragDeskMode #toolPhone{display:none!important}
      body.dragDeskMode #toolBox .v2Tools{grid-template-columns:1fr 1fr!important}
      body.dragDeskMode .gfxProp[data-action="id"]{display:none!important}
      body.dragDeskMode #graphicsDeskLayer{z-index:32!important}
      body.dragDeskMode .gfxProp[data-action="approve"],body.dragDeskMode .gfxProp[data-action="reject"]{touch-action:none!important;cursor:grab!important;transition:filter .12s ease,opacity .15s ease!important}
      body.dragDeskMode .gfxProp[data-action="approve"].ddLocked,body.dragDeskMode .gfxProp[data-action="reject"].ddLocked{opacity:.42;filter:grayscale(.55) drop-shadow(0 4px 3px rgba(0,0,0,.22));cursor:not-allowed!important}
      body.dragDeskMode .gfxProp.ddStampDragging{cursor:grabbing!important;filter:drop-shadow(0 18px 10px rgba(0,0,0,.46)) brightness(1.08)!important;transition:none!important}

      #dragDeskLayer{position:absolute;inset:0;z-index:31;pointer-events:none;overflow:hidden}
      #fileDropZone{position:absolute;left:32%;top:53%;width:39%;height:39%;border:3px dashed rgba(238,215,151,.55);background:rgba(43,31,20,.10);display:flex;align-items:center;justify-content:center;color:rgba(255,239,194,.76);font-size:9px;font-weight:1000;text-align:center;pointer-events:none;transition:.12s background,.12s border-color,.12s transform}
      #fileDropZone.active{background:rgba(207,171,81,.22);border-color:#ebcb73;transform:scale(1.015)}
      #fileDropZone.open{border-color:rgba(238,215,151,.18);background:transparent;color:transparent}
      #ddFolder{position:absolute;left:21%;top:70%;width:clamp(118px,15%,190px);height:clamp(80px,13vw,118px);background:#b47d3f;border:4px solid #362319;box-shadow:7px 8px 0 rgba(0,0,0,.28),inset 0 0 0 3px #d7a15b;pointer-events:auto;touch-action:none;cursor:grab;user-select:none;transform:rotate(-2deg);transition:opacity .15s ease,box-shadow .12s ease,transform .18s ease;display:none}
      #ddFolder:before{content:'';position:absolute;left:8%;top:-17px;width:48%;height:19px;background:#b47d3f;border:4px solid #362319;border-bottom:0;border-radius:5px 5px 0 0}
      #ddFolder.ready{display:block;animation:ddFolderArrive .28s ease-out}
      #ddFolder.dragging{cursor:grabbing;transition:none;box-shadow:13px 17px 0 rgba(0,0,0,.30);transform:rotate(1deg) scale(1.04)}
      #ddFolder.opened{background:#c49152;transform:rotate(-6deg);box-shadow:9px 12px 0 rgba(0,0,0,.25)}
      #ddFolder.opened:after{content:'';position:absolute;left:-2%;right:-2%;top:18%;height:76%;background:#c99558;border:4px solid #362319;transform-origin:bottom;transform:skewX(-5deg) translateY(17%);z-index:-1}
      .ddFolderHead{position:absolute;inset:10px 9px auto;display:flex;gap:6px;align-items:center;font-size:10px;font-weight:1000;color:#2e2118}
      .ddFlower{display:inline-flex;width:22px;height:22px;border:2px solid #2e2118;border-radius:50%;align-items:center;justify-content:center;font-size:15px;background:#e2b569}
      #ddFolderName{position:absolute;left:9px;right:9px;bottom:10px;background:#ead6a4;border:2px solid #463020;padding:5px;text-align:center;font-size:8px;font-weight:1000;color:#37271d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

      #physicalPaperLayer{position:absolute;inset:0;pointer-events:none}
      .ddPaper{position:absolute;width:clamp(118px,14vw,185px);min-height:112px;background:#efe3bc;border:3px solid #30271d;box-shadow:6px 7px 0 rgba(0,0,0,.25);pointer-events:auto;touch-action:none;cursor:grab;user-select:none;padding:9px 8px 10px;color:#201b15;transform:rotate(var(--paper-rot,-1deg));transition:box-shadow .1s ease,transform .1s ease;overflow:hidden}
      .ddPaper:before{content:'';position:absolute;inset:5px;border:1px solid rgba(80,68,46,.34);pointer-events:none}
      .ddPaper.dragging{cursor:grabbing;z-index:18!important;transition:none;box-shadow:13px 16px 0 rgba(0,0,0,.31);transform:rotate(1deg) scale(1.035)}
      .ddPaper.justBorn{animation:ddPaperOut .32s cubic-bezier(.2,.9,.3,1) both}
      .ddPaper.mainTransaction{background:#f1dfae;border-color:#47311f}
      .ddPaper.stampReady{outline:5px solid rgba(221,184,78,.72);outline-offset:2px}
      .ddPaperHead{font-size:9px;font-weight:1000;border-bottom:2px solid #8b7959;padding:1px 2px 6px;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
      .ddPaperBody{font-size:7px;line-height:1.55;min-height:53px;padding:2px;position:relative;z-index:1}
      .ddPaperBody img{display:block;width:100%;height:65px;object-fit:cover;object-position:center;border:1px solid #5b4e38}
      .ddPaperHint{text-align:center;opacity:.62;font-size:7px;padding-top:12px}
      .ddPaperExcerpt{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
      .ddStampZone{margin:5px 2px 0;border:1px dashed #937c55;padding:3px;text-align:center;font-size:6px;opacity:.65}
      .ddImpression{position:absolute;right:8px;bottom:8px;border:3px double currentColor;padding:5px 7px;font-size:12px;font-weight:1000;transform:rotate(-8deg);opacity:.88;background:rgba(239,227,188,.76);z-index:7;animation:ddImpress .24s ease-out}
      .ddImpression.approve{color:#276243}.ddImpression.reject{color:#9a302b}

      #dragDeskHint{position:absolute;left:50%;bottom:3px;transform:translateX(-50%);z-index:34;background:rgba(16,20,16,.91);border:2px solid #596454;color:#f0e5bd;padding:5px 9px;font-size:8px;font-weight:900;pointer-events:none;max-width:55%;text-align:center}
      #dragDeskHint b{color:#e7bc55}
      #ddFileBadge{position:absolute;left:18%;top:66%;z-index:33;background:#d9ae55;color:#1c1b14;border:2px solid #16150f;padding:4px 6px;font-size:7px;font-weight:1000;display:none;pointer-events:none}
      #ddFileBadge.show{display:block;animation:ddBadge .28s ease-out}

      @keyframes ddFolderArrive{from{opacity:0;transform:translateX(-35px) rotate(-8deg) scale(.9)}to{opacity:1;transform:rotate(-2deg) scale(1)}}
      @keyframes ddPaperOut{from{opacity:0;transform:translate(-80px,28px) rotate(-12deg) scale(.75)}to{opacity:1;transform:rotate(var(--paper-rot,-1deg)) scale(1)}}
      @keyframes ddImpress{from{opacity:0;transform:rotate(-8deg) scale(1.8)}to{opacity:.88;transform:rotate(-8deg) scale(1)}}
      @keyframes ddBadge{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}

      @media(max-width:900px){
        #fileDropZone{left:30%;top:51%;width:43%;height:43%}
        #ddFolder{left:19%;top:70%;width:120px;height:82px}
        .ddPaper{width:116px;min-height:100px;padding:7px}
        .ddPaperBody img{height:54px}
        #dragDeskHint{max-width:78%;font-size:7px;bottom:2px}
      }
    `;
    document.head.appendChild(st);
  }

  function injectDesk(){
    addStyle();
    document.body.classList.add('dragDeskMode');
    const scene=q('#intakeScreen .scene');if(!scene)return;
    if(!q('#dragDeskLayer')){
      const layer=document.createElement('div');layer.id='dragDeskLayer';
      layer.innerHTML=`
        <div id="fileDropZone">حطي ملف المعاملة هني<br>عشان تفتحينه وتفردين الأوراق</div>
        <div id="ddFolder" aria-label="ملف المعاملة"><div class="ddFolderHead"><span class="ddFlower">✿</span><b>ملف المعاملة</b></div><div id="ddFolderName">ملف المراجع</div></div>
        <div id="physicalPaperLayer"></div>
        <div id="ddFileBadge">الملف وصل للوارد — اسحبيه للطاولة</div>
        <div id="dragDeskHint"><b>المكتب تفاعلي:</b> اسحبي الملف، حرّكي الأوراق، وبعدين اسحبي الختم فوق طلب المعاملة.</div>`;
      scene.appendChild(layer);
      bindFolder();
    }
    bindStamps();
  }

  function resetCase(){
    caseState.phase='dialogue';
    caseState.fileReceived=false;caseState.filePlaced=false;caseState.fileOpened=false;
    caseState.documentsVisible=false;caseState.stamped=false;caseState.stampType=null;caseState.rejectReason=null;
    paperSerial++;
    const folder=q('#ddFolder');
    if(folder){folder.classList.remove('ready','opened','dragging');folder.style.left='21%';folder.style.top='70%';}
    const layer=q('#physicalPaperLayer');if(layer)layer.innerHTML='';
    q('#fileDropZone')?.classList.remove('active','open');
    q('#ddFileBadge')?.classList.remove('show');
    qa('.gfxProp[data-action="approve"],.gfxProp[data-action="reject"]').forEach(x=>{x.classList.add('ddLocked');x.style.transform='';});
  }

  function syncFromGame(){
    injectDesk();
    const hand=q('#handoverBtn');
    const received=!!(hand&&hand.disabled);
    caseState.fileReceived=received;
    if(!received){
      caseState.phase='dialogue';
      if(hand)hand.textContent='اطلب الملف من المراجع';
      return;
    }
    if(!caseState.filePlaced){
      caseState.phase='file_ready';
      const folder=q('#ddFolder');
      if(folder){
        folder.classList.add('ready');
        const title=(q('#intakeFileTitle')?.textContent||q('#intakeSpeaker')?.textContent||'ملف المراجع').replace('— الملف بيد المراجع','').trim();
        q('#ddFolderName').textContent=title;
      }
      q('#ddFileBadge')?.classList.add('show');
      if(hand)hand.textContent='الملف في الوارد — اسحبيه للطاولة';
      notice('الملف وصل صينية الوارد. اسحبيه وحطيه داخل مساحة الفحص بالنص.');
    }else if(caseState.fileOpened){
      if(hand)hand.textContent='الملف مفتوح على الطاولة';
    }
    updateStampLock();
  }

  function updateStampLock(){
    const locked=!caseState.fileOpened||caseState.stamped;
    qa('.gfxProp[data-action="approve"],.gfxProp[data-action="reject"]').forEach(x=>x.classList.toggle('ddLocked',locked));
  }

  function bindFolder(){
    const folder=q('#ddFolder');if(!folder||folder.dataset.bound)return;
    folder.dataset.bound='1';
    let drag=null;
    folder.addEventListener('pointerdown',e=>{
      if(!caseState.fileReceived)return;
      e.preventDefault();sound('pickup');
      const scene=q('#intakeScreen .scene'),sr=scene.getBoundingClientRect(),r=folder.getBoundingClientRect();
      folder.style.left=(r.left-sr.left)+'px';folder.style.top=(r.top-sr.top)+'px';
      drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top,startX:e.clientX,startY:e.clientY};
      folder.setPointerCapture(e.pointerId);folder.classList.add('dragging');q('#fileDropZone')?.classList.add('active');
    });
    folder.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.id)return;e.preventDefault();
      const scene=q('#intakeScreen .scene'),sr=scene.getBoundingClientRect(),r=folder.getBoundingClientRect();
      const maxX=scene.clientWidth-r.width,maxY=scene.clientHeight-r.height;
      folder.style.left=clamp(e.clientX-sr.left-drag.dx,0,maxX)+'px';
      folder.style.top=clamp(e.clientY-sr.top-drag.dy,0,maxY)+'px';
    });
    folder.addEventListener('pointerup',e=>{
      if(!drag||e.pointerId!==drag.id)return;
      e.preventDefault();folder.releasePointerCapture?.(e.pointerId);folder.classList.remove('dragging');q('#fileDropZone')?.classList.remove('active');
      const zone=q('#fileDropZone').getBoundingClientRect();
      if(inside(e.clientX,e.clientY,zone))openFolderOnDesk(folder);
      else if(!caseState.filePlaced){folder.style.left='21%';folder.style.top='70%';sound('bad');notice('هني مو مساحة الفحص. اسحبي الملف للمربع اللي بالنص.');}
      drag=null;
    });
    folder.addEventListener('pointercancel',()=>{drag=null;folder.classList.remove('dragging');q('#fileDropZone')?.classList.remove('active');});
  }

  function openFolderOnDesk(folder){
    if(caseState.fileOpened)return;
    sound('drop');caseState.filePlaced=true;caseState.fileOpened=true;caseState.documentsVisible=true;caseState.phase='inspecting';
    folder.style.left='34%';folder.style.top='61%';folder.classList.add('opened');
    q('#fileDropZone')?.classList.add('open');q('#ddFileBadge')?.classList.remove('show');
    buildPapers();updateStampLock();
    const hand=q('#handoverBtn');if(hand)hand.textContent='الملف مفتوح على الطاولة';
    const station=q('#stationState');if(station)station.textContent='فحص الأوراق';
    notice('فتحتي الملف. الحين اسحبي الأوراق ورتبيهم على الطاولة، واضغطي أي ورقة عشان تقرينها.');
  }

  function originalDocs(){return qa('#intakeDocs .v2Doc[data-v2doc]');}
  function isIdTitle(t){return /بطاق|هوية|اثبات|إثبات/.test(t);}
  function chooseMainIndex(docs){
    let i=docs.findIndex(d=>/طلب|نموذج|استمارة|معاملة/.test(d.title));
    if(i<0)i=docs.findIndex(d=>!isIdTitle(d.title));
    return i<0?0:i;
  }

  function collectDocs(){
    return originalDocs().map(el=>({
      index:Number(el.dataset.v2doc),
      title:el.querySelector('h4')?.textContent?.trim()||'مستند',
      text:el.querySelector('p')?.textContent?.trim()||'اضغط للتفحص',
      inspected:el.classList.contains('inspected')
    }));
  }

  function buildPapers(){
    const holder=q('#physicalPaperLayer');if(!holder||!caseState.fileOpened)return;
    const docs=collectDocs();if(!docs.length)return;
    const mainIndex=chooseMainIndex(docs);
    const existing=new Set(qa('#physicalPaperLayer .ddPaper').map(x=>Number(x.dataset.docIndex)));
    const scene=q('#intakeScreen .scene');
    docs.forEach((d,pos)=>{
      if(existing.has(d.index)){updatePaper(d.index);return;}
      const paper=document.createElement('div');paper.className='ddPaper justBorn';
      paper.dataset.docIndex=d.index;paper.style.setProperty('--paper-rot',((pos%2?1.4:-1.3)+(pos%3)*.25)+'deg');
      if(d.index===mainIndex)paper.classList.add('mainTransaction');
      paper.style.zIndex=String(4+pos);
      paper.innerHTML=paperMarkup(d,d.index===mainIndex);
      holder.appendChild(paper);
      const w=scene.clientWidth,h=scene.clientHeight;
      const cols=w<650?2:3;
      const col=pos%cols,row=Math.floor(pos/cols);
      const pw=paper.offsetWidth||125,ph=paper.offsetHeight||108;
      const x=clamp(w*(w<650?.34:.39)+col*(pw*.88),8,w-pw-8);
      const y=clamp(h*.59+row*(ph*.62),h*.50,h-ph-8);
      paper.style.left=x+'px';paper.style.top=y+'px';
      bindPaper(paper);
      setTimeout(()=>paper.classList.remove('justBorn'),380);
    });
    caseState.documentsVisible=true;
  }

  function paperMarkup(d,isMain){
    const visual=isIdTitle(d.title)?`<img src="${A}alnouran_id_card.webp" alt="بطاقة تجريبية">`:
      (d.inspected&&d.text!=='اضغط للتفحص'?`<div class="ddPaperExcerpt">${escapeHtml(d.text)}</div>`:`<div class="ddPaperHint">اضغطي عشان تفتحين الورقة وتقرينها</div>`);
    return `<div class="ddPaperHead">${escapeHtml(d.title)}</div><div class="ddPaperBody">${visual}</div>${isMain?'<div class="ddStampZone">مكان الختم</div>':''}`;
  }

  function escapeHtml(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function updatePaper(index){
    const paper=q(`.ddPaper[data-doc-index="${index}"]`);if(!paper)return;
    const fresh=q(`#intakeDocs .v2Doc[data-v2doc="${index}"]`);if(!fresh)return;
    const d={index,title:fresh.querySelector('h4')?.textContent?.trim()||'مستند',text:fresh.querySelector('p')?.textContent?.trim()||'',inspected:fresh.classList.contains('inspected')};
    const impression=paper.querySelector('.ddImpression')?.outerHTML||'';
    paper.innerHTML=paperMarkup(d,paper.classList.contains('mainTransaction'))+impression;
  }

  function bindPaper(paper){
    if(paper.dataset.bound)return;paper.dataset.bound='1';
    let drag=null;
    paper.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      e.preventDefault();sound('paper');
      const scene=q('#intakeScreen .scene'),sr=scene.getBoundingClientRect(),r=paper.getBoundingClientRect();
      paper.style.left=(r.left-sr.left)+'px';paper.style.top=(r.top-sr.top)+'px';
      drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top,sx:e.clientX,sy:e.clientY,moved:false};
      paper.setPointerCapture(e.pointerId);paper.classList.add('dragging');
    });
    paper.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.id)return;e.preventDefault();
      if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>7)drag.moved=true;
      const scene=q('#intakeScreen .scene'),sr=scene.getBoundingClientRect(),r=paper.getBoundingClientRect();
      paper.style.left=clamp(e.clientX-sr.left-drag.dx,0,scene.clientWidth-r.width)+'px';
      paper.style.top=clamp(e.clientY-sr.top-drag.dy,scene.clientHeight*.44,scene.clientHeight-r.height)+'px';
    });
    paper.addEventListener('pointerup',e=>{
      if(!drag||e.pointerId!==drag.id)return;e.preventDefault();paper.releasePointerCapture?.(e.pointerId);paper.classList.remove('dragging');
      const moved=drag.moved;drag=null;if(!moved)inspectPhysicalPaper(Number(paper.dataset.docIndex));
    });
    paper.addEventListener('pointercancel',()=>{drag=null;paper.classList.remove('dragging');});
    paper.addEventListener('click',e=>e.preventDefault());
  }

  function inspectPhysicalPaper(index){
    let orig=q(`#intakeDocs .v2Doc[data-v2doc="${index}"]`);if(!orig)return;
    if(!orig.classList.contains('inspected'))orig.click();
    setTimeout(()=>{
      orig=q(`#intakeDocs .v2Doc[data-v2doc="${index}"]`);if(!orig)return;
      updatePaper(index);
      const title=orig.querySelector('h4')?.textContent||'مستند';
      const body=orig.querySelector('p')?.textContent||'';
      const viewer=q('#documentViewer');
      if(viewer&&body&&body!=='اضغط للتفحص'){
        const vt=q('#viewerTitle'),vb=q('#viewerBody');if(vt)vt.textContent=title;if(vb)vb.textContent=body;viewer.classList.remove('hidden');
      }
      notice('رفعتي الورقة وقريتيها. تقدرين ترجعينها وتحركينها بأي مكان على المكتب.');
    },25);
  }

  function bindStamps(){
    ['approve','reject'].forEach(kind=>{
      const stamp=q(`.gfxProp[data-action="${kind}"]`);if(!stamp||stamp.dataset.ddBound)return;
      stamp.dataset.ddBound='1';stamp.classList.add('ddLocked');
      let drag=null;
      stamp.addEventListener('pointerdown',e=>{
        if(!caseState.fileOpened||caseState.stamped){sound('bad');notice(caseState.stamped?'المعاملة انختمت خلاص.':'افتحي الملف أول قبل الختم.');return;}
        e.preventDefault();e.stopPropagation();sound('pickup');
        drag={id:e.pointerId,sx:e.clientX,sy:e.clientY};stamp.setPointerCapture(e.pointerId);stamp.classList.add('ddStampDragging');
        const main=q('.ddPaper.mainTransaction');if(main)main.classList.add('stampReady');
      });
      stamp.addEventListener('pointermove',e=>{
        if(!drag||e.pointerId!==drag.id)return;e.preventDefault();e.stopPropagation();
        stamp.style.transform=`translate3d(${e.clientX-drag.sx}px,${e.clientY-drag.sy}px,0) scale(1.08)`;
      });
      stamp.addEventListener('pointerup',e=>{
        if(!drag||e.pointerId!==drag.id)return;e.preventDefault();e.stopPropagation();stamp.releasePointerCapture?.(e.pointerId);stamp.classList.remove('ddStampDragging');
        const main=q('.ddPaper.mainTransaction');main?.classList.remove('stampReady');
        const good=main&&inside(e.clientX,e.clientY,main.getBoundingClientRect());
        stamp.style.transform='';drag=null;
        if(good)applyStamp(kind,main);else{sound('bad');notice('الختم لازم ينحط فوق ورقة طلب المعاملة، مو بأي مكان على المكتب.');}
      });
      stamp.addEventListener('pointercancel',()=>{drag=null;stamp.style.transform='';stamp.classList.remove('ddStampDragging');q('.ddPaper.mainTransaction')?.classList.remove('stampReady');});
    });
  }

  function applyStamp(kind,paper){
    if(caseState.stamped)return;
    sound('stamp');caseState.stamped=true;caseState.stampType=kind;caseState.phase='decision';updateStampLock();
    const old=paper.querySelector('.ddImpression');if(old)old.remove();
    const imp=document.createElement('div');imp.className='ddImpression '+kind;imp.textContent=kind==='approve'?'معتمد':'مرفوض';paper.appendChild(imp);
    const flash=q('#gfxStampFlash');if(flash){flash.textContent=imp.textContent;flash.className=kind+' show';setTimeout(()=>flash.className='',650);}
    notice(kind==='approve'?'ختمتي طلب المعاملة «معتمد». الحين ثبتي نوع المعاملة والتوجيه.':'ختمتي طلب المعاملة «مرفوض». الحين ثبتي نوع المعاملة وسبب الرفض.');
    const btn=q(kind==='approve'?'#approveRouteBtn':'#rejectReasonBtn');
    if(btn&&!btn.disabled){
      setTimeout(()=>{
        btn.click();
        setTimeout(()=>{
          const confirm=q(kind==='approve'?'#confirmRoute':'#v2ConfirmReject');
          if(confirm)confirm.textContent=kind==='approve'?'ثبّت الاعتماد والتوجيه':'ثبّت سبب الرفض';
        },0);
      },110);
    }else{
      caseState.stamped=false;caseState.stampType=null;imp.remove();updateStampLock();notice('النظام مو جاهز للقرار للحين. كملي الفحص أول.');
    }
  }

  // The graphics layer used clicks for these props. In drag mode, suppress those clicks
  // at window capture phase so pointer dragging is the only way to use them.
  window.addEventListener('click',e=>{
    const prop=e.target?.closest?.('.gfxProp');
    if(prop&&['tray','id','approve','reject'].includes(prop.dataset.action)){
      e.preventDefault();e.stopImmediatePropagation();
    }
  },true);

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#handoverBtn'))setTimeout(syncFromGame,0);
    if(e.target?.closest?.('.v2Question'))setTimeout(()=>{if(caseState.fileOpened)buildPapers();},560);
    if(e.target?.id==='v2ConfirmReject'){
      caseState.rejectReason=q('#v2RejectReason')?.value||null;caseState.phase='decision_made';
    }
    if(e.target?.id==='confirmRoute')caseState.phase='decision_made';
    if(e.target?.id==='nextVisitorBtn')setTimeout(syncFromGame,40);
  });

  window.addEventListener('resize',()=>{
    // Do not constantly reflow the board; only keep the folder/drop hints sane.
    requestAnimationFrame(()=>{if(caseState.fileOpened)buildPapers();});
  });

  if(typeof loadIntake==='function'){
    const previousLoadIntake=loadIntake;
    loadIntake=function(){
      resetCase();
      previousLoadIntake();
      setTimeout(syncFromGame,0);
    };
  }

  addStyle();injectDesk();resetCase();syncFromGame();
  document.title='راجعنا باچر — Drag Desk '+VERSION;
  const version=q('.version');if(version)version.textContent=VERSION+' // DRAG DESK';
  const subtitle=q('.subtitle');if(subtitle)subtitle.textContent='TACTILE RECEPTION DESK';
  const desc=q('.desc');if(desc)desc.textContent='اسألي المراجع، اطلبي الملف، اسحبيه من الوارد للطاولة، رتبي الأوراق بإيدج، افحصيها، وبعدين اسحبي الختم نفسه فوق طلب المعاملة.';
})();