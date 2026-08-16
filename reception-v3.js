// راجعنا باچر — Inspection Desk Gameplay Layer v1.2.0
// Adds a tactile inspection-station flow while keeping the game's own setting and rules.

(function(){
  const VERSION='v1.2.0';
  let caseStartedAt=Date.now();
  let timerHandle=null;
  let decisionPending=false;

  function q(s){return document.querySelector(s)}
  function qa(s){return [...document.querySelectorAll(s)]}
  function esc3(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

  function injectInspectionStyle(){
    if(q('#inspectionV3Style'))return;
    const st=document.createElement('style');
    st.id='inspectionV3Style';
    st.textContent=`
      #intakeScreen .gameBody{grid-template-columns:minmax(0,1.55fr) minmax(300px,.72fr);gap:10px}
      #intakeScreen .scene{position:relative;background:linear-gradient(#b7b09a 0 42%,#66513d 42% 100%);overflow:hidden}
      #intakeScreen .visitorZone{min-height:235px;display:flex;align-items:flex-end;justify-content:center;padding-top:18px}
      #intakeScreen .speech{position:relative;z-index:5;margin:0 18px 8px;border-width:4px;box-shadow:7px 7px 0 rgba(0,0,0,.25)}
      #intakeScreen .deskArea{position:relative;z-index:4;margin:0 14px 14px;background:#73553c;border:5px solid #2b2118;box-shadow:inset 0 0 0 3px #957155,7px 8px 0 rgba(0,0,0,.22);min-height:230px}
      #intakeScreen .docsGrid{align-items:start}
      #intakeScreen .docCard{transform:rotate(-.35deg);box-shadow:4px 5px 0 rgba(0,0,0,.18);transition:.1s transform,.1s box-shadow}
      #intakeScreen .docCard:nth-child(even){transform:rotate(.55deg)}
      #intakeScreen .docCard:hover{transform:translateY(-5px) rotate(0deg)!important;box-shadow:7px 9px 0 rgba(0,0,0,.2)}
      #intakeScreen .sidePanel{background:#202820;border-left:5px solid #101510;padding-top:8px}
      #inspectionHud{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:6px;padding:6px 8px;background:#111713;border-bottom:4px solid #050806;color:#f0e6c7;font:900 10px monospace}
      #inspectionHud>div{background:#263228;border:2px solid #4b5d4c;padding:7px;text-align:center}
      #inspectionHud b{color:#e0b64d}
      #inspectionRail{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:6px 8px;background:#172019;border-bottom:3px solid #0c110d}
      .inspectStep{padding:6px 4px;border:2px solid #465047;text-align:center;font-size:9px;font-weight:900;color:#879289;background:#222b24}
      .inspectStep.active{background:#d5a644;color:#171b17;border-color:#171b17}
      .inspectStep.done{background:#6f8d67;color:#101510;border-color:#101510}
      #nextVisitorBtn{width:100%;margin-top:8px;background:#d5a644;color:#171b17;border:4px solid #0d110e;padding:11px 8px;font-size:12px;font-weight:1000;box-shadow:4px 4px 0 #0d110e}
      #nextVisitorBtn:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 #0d110e}
      #nextVisitorBtn.hidden{display:none}
      #inspectionTip{margin:7px 0 2px;background:#101510;border:3px solid #39463b;padding:7px;color:#d8cfaa;font-size:9px;line-height:1.6}
      #inspectionTip b{color:#e0b64d}
      .v2Tools{grid-template-columns:repeat(2,1fr)!important}
      .v2Tool{min-height:42px;box-shadow:3px 3px 0 #0c110d;cursor:pointer}
      .v2Question{min-height:42px;box-shadow:3px 3px 0 #0c110d;cursor:pointer}
      .v2Conversation{max-height:145px!important;margin:0 18px 8px!important;position:relative;z-index:5;box-shadow:5px 5px 0 rgba(0,0,0,.2)}
      #documentViewer{position:fixed;inset:0;z-index:2000;background:rgba(7,9,7,.78);display:flex;align-items:center;justify-content:center;padding:22px}
      #documentViewer.hidden{display:none}
      .documentSheet{width:min(610px,92vw);min-height:430px;background:#efe4bd;color:#171b17;border:7px solid #27231b;box-shadow:18px 20px 0 rgba(0,0,0,.35);padding:28px;position:relative;transform:rotate(-.4deg)}
      .documentSheet:before{content:'جمهورية النوران';display:block;text-align:center;font-weight:1000;font-size:11px;letter-spacing:.5px;border-bottom:2px solid #81785e;padding-bottom:10px;margin-bottom:18px}
      .documentSheet h2{font-size:22px;margin:0 0 24px;text-align:center}
      .documentSheet .docBody{font-size:15px;line-height:2;border:2px dashed #8c8268;padding:18px;min-height:160px;white-space:pre-wrap}
      .documentSheet .docFoot{display:flex;justify-content:space-between;margin-top:22px;font-size:10px;opacity:.7}
      #closeDocumentBtn{position:absolute;left:16px;top:14px;background:#9d4a42;color:white;border:3px solid #171b17;padding:8px 12px;font-weight:1000}
      #deskPrompt{position:absolute;bottom:7px;left:10px;background:#141a15;color:#e8dcb8;border:2px solid #384139;padding:5px 7px;font-size:8px;z-index:8;pointer-events:none}
      @media(max-width:900px){#intakeScreen .gameBody{grid-template-columns:1fr}#inspectionHud{grid-template-columns:1fr 1fr 1fr}.documentSheet{min-height:360px}}
    `;
    document.head.appendChild(st);
  }

  function injectInspectionUI(){
    injectInspectionStyle();
    const screen=q('#intakeScreen');
    if(!screen)return;

    const top=q('#intakeScreen .topbar');
    if(top&&!q('#inspectionHud')){
      const hud=document.createElement('div');
      hud.id='inspectionHud';
      hud.innerHTML='<div>الطابور <b id="queueRemain">--</b></div><div>وقت المعاملة <b id="caseTimer">00:00</b></div><div>الحالة <b id="stationState">مقابلة</b></div>';
      top.insertAdjacentElement('afterend',hud);
      const rail=document.createElement('div');
      rail.id='inspectionRail';
      rail.innerHTML='<div class="inspectStep" data-step="talk">1 مقابلة</div><div class="inspectStep" data-step="file">2 الملف</div><div class="inspectStep" data-step="inspect">3 الفحص</div><div class="inspectStep" data-step="decision">4 القرار</div><div class="inspectStep" data-step="next">5 التالي</div>';
      hud.insertAdjacentElement('afterend',rail);
    }

    const side=q('#intakeScreen .sidePanel');
    if(side&&!q('#nextVisitorBtn')){
      const tip=document.createElement('div');
      tip.id='inspectionTip';
      tip.innerHTML='<b>طريقة الشغل:</b> لا تستعيل بالختم. اسأل، استلم الملف، افتح الأوراق، استخدم أداة إذا احتجت، وبعد القرار إنت اللي تنادي التالي.';
      side.insertAdjacentElement('afterbegin',tip);
      const next=document.createElement('button');
      next.id='nextVisitorBtn';next.className='hidden';next.textContent='نادي المراجع اللي بعده';
      side.appendChild(next);
      next.onclick=goNextVisitor;
    }

    const scene=q('#intakeScreen .scene');
    if(scene&&!q('#deskPrompt')){
      const prompt=document.createElement('div');prompt.id='deskPrompt';prompt.textContent='اضغط أي ورقة عشان ترفعها وتفحصها';scene.appendChild(prompt);
    }

    if(!q('#documentViewer')){
      const viewer=document.createElement('div');viewer.id='documentViewer';viewer.className='hidden';
      viewer.innerHTML='<div class="documentSheet"><button id="closeDocumentBtn">رجّع الورقة</button><h2 id="viewerTitle">مستند</h2><div class="docBody" id="viewerBody"></div><div class="docFoot"><span>نسخة معاينة</span><span>شباك الاستقبال</span></div></div>';
      document.body.appendChild(viewer);
      q('#closeDocumentBtn').onclick=()=>viewer.classList.add('hidden');
      viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.classList.add('hidden')});
    }
  }

  function setRail(step){
    const order=['talk','file','inspect','decision','next'];
    const idx=order.indexOf(step);
    qa('.inspectStep').forEach((el,i)=>{
      el.classList.toggle('done',i<idx);
      el.classList.toggle('active',i===idx);
    });
    const labels={talk:'مقابلة',file:'استلام الملف',inspect:'فحص',decision:'قرار',next:'جاهز للتالي'};
    if(q('#stationState'))q('#stationState').textContent=labels[step]||'';
  }

  function inferStep(){
    if(decisionPending)return 'next';
    const hand=q('#handoverBtn');
    if(hand&&!hand.disabled)return 'talk';
    if(q('#intakeDocs .v2Doc.inspected'))return 'inspect';
    if(hand&&hand.disabled)return 'file';
    return 'talk';
  }

  function syncInspectionHud(){
    injectInspectionUI();
    try{
      if(q('#queueRemain')&&typeof currentBatch!=='undefined'&&typeof caseIndex!=='undefined'){
        q('#queueRemain').textContent=Math.max(0,currentBatch.length-caseIndex)+' باقي';
      }
    }catch(e){}
    if(!decisionPending)setRail(inferStep());
  }

  function startCaseTimer(){
    caseStartedAt=Date.now();
    if(timerHandle)clearInterval(timerHandle);
    const tick=()=>{
      const el=q('#caseTimer');if(!el)return;
      const sec=Math.floor((Date.now()-caseStartedAt)/1000);
      const m=String(Math.floor(sec/60)).padStart(2,'0');
      const s=String(sec%60).padStart(2,'0');
      el.textContent=m+':'+s;
    };
    tick();timerHandle=setInterval(tick,1000);
  }

  function showNextVisitorControl(){
    decisionPending=true;
    setRail('next');
    const btn=q('#nextVisitorBtn');
    if(btn){
      btn.classList.remove('hidden');
      try{btn.textContent=(caseIndex+1>=currentBatch.length)?'أنهِ دوام الاستقبال':'نادي المراجع اللي بعده';}catch(e){btn.textContent='نادي المراجع اللي بعده'}
    }
    const notice=q('#intakeNotice');if(notice)notice.textContent='انتهت المعاملة. خلي المراجع يمشي، وبعدها نادي الرقم اللي بعده.';
    const a=q('#approveRouteBtn'),r=q('#rejectReasonBtn'),w=q('#passWastaBtn');
    if(a)a.disabled=true;if(r)r.disabled=true;if(w)w.disabled=true;
  }

  function goNextVisitor(){
    if(!decisionPending)return;
    decisionPending=false;
    const btn=q('#nextVisitorBtn');if(btn)btn.classList.add('hidden');
    try{
      if(salary<=0)return;
      caseIndex++;
      if(caseIndex>=currentBatch.length){
        if(timerHandle)clearInterval(timerHandle);
        finishDay('intake');
        return;
      }
      loadIntake();
    }catch(e){console.error('next visitor error',e)}
  }

  function openDocumentFromCard(card){
    if(!card)return;
    setTimeout(()=>{
      const title=card.querySelector('h4')?.textContent||'مستند';
      const body=card.querySelector('p')?.textContent||'';
      if(body==='اضغط للتفحص')return;
      const viewer=q('#documentViewer');if(!viewer)return;
      q('#viewerTitle').textContent=title;
      q('#viewerBody').textContent=body;
      viewer.classList.remove('hidden');
      setRail('inspect');
    },20);
  }

  // Document interaction: click once to inspect using v2 logic, then lift the sheet into a full viewer.
  document.addEventListener('click',e=>{
    const card=e.target.closest?.('#intakeDocs .v2Doc');
    if(card)openDocumentFromCard(card);
    if(e.target.closest?.('.v2Question'))setRail('talk');
    if(e.target.closest?.('#handoverBtn'))setTimeout(()=>setRail('file'),30);
    if(e.target.closest?.('.v2Tool'))setTimeout(()=>setRail('inspect'),30);
    if(e.target.closest?.('#approveRouteBtn,#rejectReasonBtn'))setRail('decision');
  });

  // Mutation observer keeps the HUD in sync with the existing prototype without duplicating its rules.
  const observer=new MutationObserver(()=>syncInspectionHud());
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled']});

  injectInspectionUI();

  // Keep the existing case loader, but reset the inspection station each time a new visitor arrives.
  if(typeof loadIntake==='function'){
    const originalLoadIntake=loadIntake;
    loadIntake=function(){
      decisionPending=false;
      const next=q('#nextVisitorBtn');if(next)next.classList.add('hidden');
      originalLoadIntake();
      startCaseTimer();
      setTimeout(()=>{setRail('talk');syncInspectionHud()},0);
    };
  }

  // Stop automatic case advancement. The employee must physically call the next visitor.
  afterCase=function(){
    try{if(salary<=0)return;}catch(e){}
    showNextVisitorControl();
  };

  document.title='راجعنا باچر — Inspection Desk '+VERSION;
  const subtitle=q('.subtitle');if(subtitle)subtitle.textContent='INSPECTION DESK';
  const version=q('.version');if(version)version.textContent=VERSION+' // INSPECTION FLOW';
  const desc=q('.desc');if(desc)desc.textContent='قابل المراجع، اسأله، استلم الملف، ارفع الأوراق وافحصها، استخدم أدوات المكتب، اختم القرار، وبعدها إنت بنفسك نادي المراجع اللي بعده.';

  syncInspectionHud();
})();
