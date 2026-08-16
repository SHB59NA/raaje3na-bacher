// راجعنا باچر — Reception Graphics Prototype v1.3.1
// Lightweight mobile-safe graphics layer using the user's prototype assets.
(function(){
  const GFX_VERSION='v1.3.1';
  const A='assets/prototype/';
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  let lastCase='';

  function addStyle(){
    if(q('#receptionGraphicsStyle')) return;
    const st=document.createElement('style');
    st.id='receptionGraphicsStyle';
    st.textContent=`
      #intakeScreen .scene{
        position:relative;
        min-height:650px;
        overflow:hidden;
        background:#b9ae8c url('${A}reception_scene_bg.webp') center/cover no-repeat!important;
      }
      #intakeScreen .sceneFluor,#intakeScreen .wallPoster{display:none!important}
      #intakeScreen .visitorZone{position:relative;z-index:3;min-height:250px;padding-top:18px;pointer-events:none}
      #intakeScreen #intakeAvatar{filter:drop-shadow(0 8px 4px rgba(0,0,0,.28));transform-origin:50% 100%}
      #intakeScreen #intakeAvatar.gfxArrive{animation:gfxArrive .35s ease-out}
      #intakeScreen #intakeAvatar.gfxIdle{animation:gfxIdle 3.2s ease-in-out infinite}
      #intakeScreen .speech,#intakeScreen .v2Conversation{position:relative;z-index:35!important}
      #intakeScreen .deskArea{
        position:relative;z-index:25!important;
        margin:8px 155px 16px!important;
        min-height:195px!important;
        background:rgba(71,46,29,.88)!important;
        border-color:#2c1c12!important;
      }
      #intakeScreen .fileHeader{background:rgba(29,34,26,.94)!important}
      #intakeScreen .docsGrid{position:relative;z-index:27;max-height:140px;overflow:auto;padding:4px}
      #intakeScreen .docCard{background:rgba(242,230,192,.98)!important}

      #graphicsDeskLayer{position:absolute;inset:0;z-index:29;pointer-events:none;overflow:hidden}
      .gfxProp{
        position:absolute;display:block;height:auto;object-fit:contain;
        filter:drop-shadow(0 6px 4px rgba(0,0,0,.30));
        pointer-events:auto;cursor:pointer;user-select:none;-webkit-user-drag:none;
        transform-origin:50% 85%;transition:transform .12s ease,filter .12s ease,opacity .15s ease;
      }
      .gfxProp:hover{transform:translateY(-5px) scale(1.04);filter:drop-shadow(0 10px 5px rgba(0,0,0,.34))}
      .gfxProp[data-action="monitor"]{width:18%;left:1.5%;bottom:13%}
      .gfxProp[data-action="tray"]{width:13%;left:19%;bottom:7%}
      .gfxProp[data-action="id"]{width:17%;left:39%;bottom:6%;opacity:.18;pointer-events:none;transform:rotate(-2deg)}
      .gfxProp[data-action="id"].ready{opacity:1;pointer-events:auto}
      .gfxProp[data-action="approve"]{width:8%;right:28%;bottom:7%;transform:rotate(-2deg)}
      .gfxProp[data-action="reject"]{width:8%;right:20%;bottom:7%;transform:rotate(2deg)}
      .gfxProp[data-action="phone"]{width:15%;right:1.4%;bottom:13%}
      .gfxProp[data-action="tea"]{width:7%;right:13.5%;bottom:3%}
      .gfxProp.gfxPress{animation:gfxPress .22s ease}
      .gfxProp.gfxRing{animation:gfxRing .48s ease}
      .gfxProp.gfxSip{animation:gfxSip .5s ease}
      .gfxProp.gfxStamp{animation:gfxStamp .3s ease}

      #gfxStampFlash{position:absolute;z-index:42;left:50%;bottom:21%;transform:translateX(-50%);opacity:0;padding:8px 14px;border:5px double currentColor;font:1000 22px monospace;background:#efe0b8;pointer-events:none}
      #gfxStampFlash.approve{color:#255f40}#gfxStampFlash.reject{color:#8c302d}
      #gfxStampFlash.show{animation:gfxSeal .6s ease forwards}

      #gfxImagePreview{position:fixed;inset:0;z-index:2600;display:flex;align-items:center;justify-content:center;background:rgba(5,8,6,.84);padding:18px}
      #gfxImagePreview.hidden{display:none}
      #gfxPreviewCard{position:relative;max-width:min(760px,92vw);max-height:84vh;background:#34291b;border:6px solid #15110e;padding:14px;box-shadow:16px 18px 0 rgba(0,0,0,.35)}
      #gfxPreviewCard img{display:block;max-width:100%;max-height:72vh;object-fit:contain}
      #gfxPreviewClose{position:absolute;left:-7px;top:-7px;background:#9b473f;color:#fff;border:4px solid #14110d;padding:7px 10px;font-weight:1000;cursor:pointer}
      #gfxAssetHint{position:absolute;right:8px;bottom:4px;z-index:38;background:rgba(12,16,13,.9);border:2px solid #596454;color:#eadfba;padding:5px 7px;font-size:8px;pointer-events:none}

      @keyframes gfxArrive{from{transform:translateX(90px) scale(.95);opacity:0}to{transform:none;opacity:1}}
      @keyframes gfxIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      @keyframes gfxPress{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(4px) scale(.96)}}
      @keyframes gfxRing{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}75%{transform:rotate(-3deg)}}
      @keyframes gfxSip{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px) rotate(-4deg)}}
      @keyframes gfxStamp{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(10px) scale(.92)}}
      @keyframes gfxSeal{0%{opacity:0;transform:translateX(-50%) scale(1.5) rotate(-4deg)}30%,75%{opacity:1;transform:translateX(-50%) scale(1) rotate(-4deg)}100%{opacity:0;transform:translateX(-50%) scale(1) rotate(-4deg)}}

      @media(max-width:900px){
        #intakeScreen .scene{min-height:590px;background-position:center top!important}
        #intakeScreen .deskArea{margin:6px 8px 12px!important;min-height:180px!important}
        .gfxProp[data-action="monitor"]{width:21%;left:1%;bottom:2%}
        .gfxProp[data-action="tray"]{width:15%;left:20%;bottom:1%}
        .gfxProp[data-action="id"]{width:20%;left:39%;bottom:1%}
        .gfxProp[data-action="approve"]{width:10%;right:29%;bottom:1%}
        .gfxProp[data-action="reject"]{width:10%;right:19%;bottom:1%}
        .gfxProp[data-action="phone"]{width:18%;right:1%;bottom:2%}
        .gfxProp[data-action="tea"]{display:none}
        #gfxAssetHint{display:none}
      }
    `;
    document.head.appendChild(st);
  }

  function makeProp(action,file,label){
    const img=document.createElement('img');
    img.className='gfxProp';
    img.dataset.action=action;
    img.src=A+file;
    img.alt=label;
    img.title=label;
    img.draggable=false;
    return img;
  }

  function injectGraphics(){
    addStyle();
    const scene=q('#intakeScreen .scene');
    if(!scene) return;
    if(!q('#graphicsDeskLayer')){
      const layer=document.createElement('div');
      layer.id='graphicsDeskLayer';
      layer.append(
        makeProp('monitor','crt_monitor.webp','كمبيوتر الاستقبال'),
        makeProp('tray','document_tray.webp','ملف المراجع'),
        makeProp('id','alnouran_id_card.webp','بطاقة تجريبية'),
        makeProp('approve','approval_stamp.webp','ختم معتمد'),
        makeProp('reject','rejection_stamp.webp','ختم مرفوض'),
        makeProp('phone','desk_phone.webp','تلفون المكتب'),
        makeProp('tea','tea_glass.webp','استكانة الشاي')
      );
      scene.appendChild(layer);
      const seal=document.createElement('div');seal.id='gfxStampFlash';scene.appendChild(seal);
      const hint=document.createElement('div');hint.id='gfxAssetHint';hint.textContent='اضغطي أدوات المكتب للتجربة';scene.appendChild(hint);
    }
    if(!q('#gfxImagePreview')){
      const p=document.createElement('div');
      p.id='gfxImagePreview';p.className='hidden';
      p.innerHTML=`<div id="gfxPreviewCard"><button id="gfxPreviewClose">رجّع البطاقة</button><img src="${A}alnouran_id_card.webp" alt="بطاقة تجريبية"></div>`;
      document.body.appendChild(p);
      q('#gfxPreviewClose').onclick=()=>p.classList.add('hidden');
      p.addEventListener('click',e=>{if(e.target===p)p.classList.add('hidden')});
    }
  }

  function notice(t){const n=q('#intakeNotice');if(n)n.textContent=t}
  function animate(el,cls,ms){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms)}
  function findTool(words){return qa('#intakeScreen .v2Tool,#intakeScreen button').find(el=>words.some(w=>(el.textContent||'').includes(w)))}

  function stampFlash(kind){
    const s=q('#gfxStampFlash');if(!s)return;
    s.textContent=kind==='approve'?'معتمد':'مرفوض';
    s.className=kind+' show';
    setTimeout(()=>s.className='',650);
  }

  function handleProp(el){
    const a=el.dataset.action;
    if(a==='monitor'){
      animate(el,'gfxPress',250);
      const b=findTool(['كمبيوتر','النظام','استعلام']);
      if(b){b.click();notice('فتحتي نظام الاستقبال.')}else notice('الكمبيوتر جاهز.');
    }else if(a==='phone'){
      animate(el,'gfxRing',520);
      const b=findTool(['تلفون','هاتف','اتصال']);
      if(b)setTimeout(()=>b.click(),120);else notice('التلفون ساكت حالياً.');
    }else if(a==='tray'){
      animate(el,'gfxPress',250);
      const h=q('#handoverBtn');
      if(h&&!h.disabled){h.click();notice('استلمتي الملف.');}
      else {const d=q('#intakeDocs .v2Doc,#intakeDocs .docCard');if(d)d.click();else notice('التراي فاضي للحين.');}
    }else if(a==='id'){
      animate(el,'gfxPress',250);q('#gfxImagePreview')?.classList.remove('hidden');
    }else if(a==='approve'){
      animate(el,'gfxStamp',350);stampFlash('approve');
      const b=q('#approveRouteBtn');if(b&&!b.disabled)setTimeout(()=>b.click(),100);else notice('كملي الفحص أول.');
    }else if(a==='reject'){
      animate(el,'gfxStamp',350);stampFlash('reject');
      const b=q('#rejectReasonBtn');if(b&&!b.disabled)setTimeout(()=>b.click(),100);else notice('كملي الفحص أول.');
    }else if(a==='tea'){
      animate(el,'gfxSip',550);notice('رشفة سريعة...');
    }
    setTimeout(sync,80);
  }

  function sync(){
    injectGraphics();
    const id=q('.gfxProp[data-action="id"]');
    if(id){
      const ready=!!q('#intakeDocs .v2Doc,#intakeDocs .docCard') || !!(q('#handoverBtn')&&q('#handoverBtn').disabled);
      id.classList.toggle('ready',ready);
    }
    const label=q('#intakeCaseTop')?.textContent||'';
    if(label&&label!==lastCase){
      lastCase=label;
      const av=q('#intakeAvatar');
      if(av){av.classList.remove('gfxArrive','gfxIdle');void av.offsetWidth;av.classList.add('gfxArrive');setTimeout(()=>av.classList.add('gfxIdle'),370);}
    }
  }

  document.addEventListener('click',e=>{
    const prop=e.target.closest&&e.target.closest('.gfxProp');
    if(prop){e.preventDefault();e.stopPropagation();handleProp(prop);return;}
    setTimeout(sync,80);
  },true);
  window.addEventListener('resize',()=>requestAnimationFrame(sync));

  if(typeof loadIntake==='function'){
    const previousLoadIntake=loadIntake;
    loadIntake=function(){previousLoadIntake();setTimeout(sync,0)};
  }

  addStyle();injectGraphics();sync();
  document.title='راجعنا باچر — Graphics Prototype '+GFX_VERSION;
  const v=q('.version');if(v)v.textContent=GFX_VERSION+' // GRAPHICS PROTOTYPE';
})();