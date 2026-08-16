// راجعنا باچر — Reception Graphics Prototype v1.3.0
// Uses user-created prototype assets as an interactive desk layer.
(function(){
  const GFX_VERSION='v1.3.0';
  const A='assets/prototype/';
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  let lastCaseLabel='';

  function addStyle(){
    if(q('#receptionGraphicsStyle'))return;
    const st=document.createElement('style');
    st.id='receptionGraphicsStyle';
    st.textContent=`
      #intakeScreen .scene{
        min-height:690px;
        background-image:linear-gradient(rgba(17,20,15,.04),rgba(17,20,15,.10)),url('${A}reception_scene_bg.webp')!important;
        background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;
        image-rendering:auto;isolation:isolate;
      }
      #intakeScreen .scene:after{content:'';position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,244,190,.06),transparent 32%,rgba(26,19,12,.12));animation:gfxFluor 8s infinite steps(1)}
      #intakeScreen .sceneFluor,#intakeScreen .wallPoster{display:none!important}
      #intakeScreen .visitorZone{position:relative;z-index:2;min-height:270px;padding-top:26px;pointer-events:none}
      #intakeScreen #intakeAvatar{filter:drop-shadow(0 9px 5px rgba(0,0,0,.34));transform-origin:50% 100%;transition:filter .18s ease}
      #intakeScreen #intakeAvatar.gfxArrive{animation:gfxArrive .42s cubic-bezier(.2,.9,.25,1)}
      #intakeScreen #intakeAvatar.gfxIdle{animation:gfxIdle 3.4s ease-in-out infinite}
      #intakeScreen .speech{z-index:31!important;background:rgba(239,228,189,.94)!important;backdrop-filter:blur(2px)}
      #intakeScreen .v2Conversation{z-index:31!important;background:rgba(17,25,20,.92)!important;backdrop-filter:blur(2px)}
      #intakeScreen .deskArea{position:relative;z-index:24!important;margin:8px 172px 16px!important;min-height:205px!important;background:rgba(70,45,27,.82)!important;border-color:#2b1b10!important;box-shadow:inset 0 0 0 3px rgba(194,145,81,.28),7px 8px 0 rgba(0,0,0,.22)!important;backdrop-filter:blur(1px)}
      #intakeScreen .fileHeader{background:rgba(29,34,26,.90)!important}
      #intakeScreen .docsGrid{position:relative;z-index:26;max-height:145px;overflow:auto;padding:4px}
      #intakeScreen .docCard{background:rgba(242,230,192,.97)!important}
      #deskPrompt{z-index:34!important;bottom:3px!important}

      #graphicsDeskLayer{position:absolute;inset:0;z-index:28;pointer-events:none;overflow:hidden}
      .gfxProp{position:absolute;display:block;height:auto;object-fit:contain;filter:drop-shadow(0 7px 4px rgba(0,0,0,.32));pointer-events:auto;cursor:pointer;user-select:none;-webkit-user-drag:none;transform-origin:50% 85%;transition:transform .12s ease,filter .12s ease,opacity .18s ease;outline:none}
      .gfxProp:hover,.gfxProp:focus-visible{transform:translateY(-7px) scale(1.055);filter:drop-shadow(0 13px 7px rgba(0,0,0,.38)) brightness(1.05)}
      .gfxProp.gfxPress{animation:gfxPress .22s ease}
      .gfxProp.gfxRing{animation:gfxRing .48s ease}
      .gfxProp.gfxSip{animation:gfxSip .55s ease}
      .gfxProp.gfxStamp{animation:gfxStamp .32s ease}
      .gfxProp[data-action="monitor"]{width:18%;left:1.3%;bottom:13.5%;animation:gfxMonitorGlow 3s ease-in-out infinite}
      .gfxProp[data-action="tray"]{width:13.5%;left:18.2%;bottom:7.2%}
      .gfxProp[data-action="id"]{width:17%;left:38.2%;bottom:6.5%;transform:rotate(-2deg);opacity:.18;pointer-events:none}
      .gfxProp[data-action="id"].ready{opacity:1;pointer-events:auto}
      .gfxProp[data-action="approve"]{width:8.2%;right:28.3%;bottom:7.3%;transform:rotate(-2deg)}
      .gfxProp[data-action="reject"]{width:8.2%;right:19.8%;bottom:7%;transform:rotate(2deg)}
      .gfxProp[data-action="phone"]{width:15.2%;right:1.2%;bottom:13.8%}
      .gfxProp[data-action="tea"]{width:7.4%;right:13.2%;bottom:3.1%}
      .gfxProp[data-action="approve"]:hover,.gfxProp[data-action="reject"]:hover,.gfxProp[data-action="id"]:hover{transform:translateY(-7px) scale(1.06) rotate(0deg)}

      #gfxAssetHint{position:absolute;z-index:35;right:8px;bottom:5px;background:rgba(12,16,13,.88);border:2px solid #596454;color:#eadfba;padding:5px 7px;font:800 8px/1.45 monospace;pointer-events:none}
      #gfxStampFlash{position:absolute;z-index:40;left:50%;bottom:21%;transform:translateX(-50%) rotate(-4deg) scale(.7);opacity:0;padding:9px 16px;border:5px double currentColor;font:1000 23px monospace;letter-spacing:1px;pointer-events:none;background:rgba(240,224,184,.90)}
      #gfxStampFlash.show{animation:gfxSeal .65s ease forwards}
      #gfxStampFlash.approve{color:#215b3b}#gfxStampFlash.reject{color:#8d2f2b}

      #gfxImagePreview{position:fixed;inset:0;z-index:2500;display:flex;align-items:center;justify-content:center;background:rgba(5,8,6,.82);padding:20px}
      #gfxImagePreview.hidden{display:none}
      #gfxPreviewCard{position:relative;max-width:min(760px,92vw);max-height:84vh;background:#34291b;border:7px solid #14110d;box-shadow:18px 20px 0 rgba(0,0,0,.38);padding:16px;animation:gfxPaperUp .18s ease}
      #gfxPreviewCard img{display:block;max-width:100%;max-height:72vh;object-fit:contain;image-rendering:auto}
      #gfxPreviewCard .gfxPreviewLabel{color:#efe4bd;text-align:center;font:900 10px monospace;padding:9px 44px 0}
      #gfxPreviewClose{position:absolute;left:-8px;top:-8px;z-index:2;background:#9b473f;color:#fff;border:4px solid #14110d;padding:7px 10px;font-weight:1000;cursor:pointer}

      @keyframes gfxArrive{0%{transform:translateX(120px) scale(.92);opacity:0}100%{transform:translateX(0) scale(1);opacity:1}}
      @keyframes gfxIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      @keyframes gfxPress{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(4px) scale(.96)}}
      @keyframes gfxRing{0%,100%{transform:rotate(0)}20%{transform:rotate(-4deg)}40%{transform:rotate(4deg)}60%{transform:rotate(-3deg)}80%{transform:rotate(3deg)}}
      @keyframes gfxSip{0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-16px) rotate(-5deg)}}
      @keyframes gfxStamp{0%{transform:translateY(0) scale(1)}45%{transform:translateY(11px) scale(.91)}100%{transform:translateY(0) scale(1)}}
      @keyframes gfxSeal{0%{opacity:0;transform:translateX(-50%) rotate(-4deg) scale(1.65)}34%{opacity:1;transform:translateX(-50%) rotate(-4deg) scale(.96)}75%{opacity:1}100%{opacity:0;transform:translateX(-50%) rotate(-4deg) scale(1)}}
      @keyframes gfxMonitorGlow{0%,100%{filter:drop-shadow(0 7px 4px rgba(0,0,0,.32)) drop-shadow(0 0 2px rgba(94,255,133,.12))}50%{filter:drop-shadow(0 7px 4px rgba(0,0,0,.32)) drop-shadow(0 0 8px rgba(94,255,133,.24))}}
      @keyframes gfxFluor{0%,94%,100%{opacity:1}95%{opacity:.88}96%{opacity:1}97%{opacity:.91}98%{opacity:1}}
      @keyframes gfxPaperUp{from{opacity:0;transform:translateY(22px) rotate(-1deg) scale(.96)}to{opacity:1;transform:translateY(0) rotate(0) scale(1)}}

      @media(max-width:1050px){
        #intakeScreen .deskArea{margin-left:135px!important;margin-right:135px!important}
        .gfxProp[data-action="monitor"]{width:20%;bottom:14%}.gfxProp[data-action="phone"]{width:17%;bottom:14%}
      }
      @media(max-width:760px){
        #intakeScreen .scene{min-height:620px;background-position:center top!important}
        #intakeScreen .deskArea{margin:7px 8px 12px!important;min-height:190px!important}
        #graphicsDeskLayer{opacity:.98}
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
    img.tabIndex=0;
    img.draggable=false;
    return img;
  }

  function injectGraphics(){
    addStyle();
    const scene=q('#intakeScreen .scene');
    if(!scene)return;
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

      const hint=document.createElement('div');
      hint.id='gfxAssetHint';hint.textContent='جرّبي تضغطين أدوات المكتب — الحين صارت تفاعلية';scene.appendChild(hint);
      const seal=document.createElement('div');seal.id='gfxStampFlash';scene.appendChild(seal);
    }
    if(!q('#gfxImagePreview')){
      const p=document.createElement('div');
      p.id='gfxImagePreview';p.className='hidden';
      p.innerHTML=`<div id="gfxPreviewCard"><button id="gfxPreviewClose">رجّع البطاقة</button><img src="${A}alnouran_id_card.webp" alt="بطاقة جمهورية النوران التجريبية"><div class="gfxPreviewLabel">معاينة أصل بصري — اضغطي خارج البطاقة للرجوع</div></div>`;
      document.body.appendChild(p);
      q('#gfxPreviewClose').onclick=()=>p.classList.add('hidden');
      p.addEventListener('click',e=>{if(e.target===p)p.classList.add('hidden')});
    }
  }

  function notice(text){
    const n=q('#intakeNotice');
    if(n)n.textContent=text;
  }

  function toolByWords(words){
    return qa('#intakeScreen .v2Tool, #intakeScreen button').find(el=>{
      const t=(el.textContent||'').trim();
      return words.some(w=>t.includes(w));
    });
  }

  function animate(el,cls,ms=450){
    el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);
    setTimeout(()=>el.classList.remove(cls),ms);
  }

  function stampFlash(kind){
    const s=q('#gfxStampFlash');if(!s)return;
    s.textContent=kind==='approve'?'معتمد':'مرفوض';
    s.className=kind+' show';
    setTimeout(()=>{s.className=''},680);
  }

  function openId(){
    const p=q('#gfxImagePreview');if(p)p.classList.remove('hidden');
    notice('رفعت البطاقة قدامج. قارني الاسم والبيانات مع كلام المراجع والملف.');
  }

  function handleProp(el){
    const action=el.dataset.action;
    if(action==='monitor'){
      animate(el,'gfxPress',250);
      const b=toolByWords(['كمبيوتر','النظام','استعلام']);
      if(b&&b!==el){b.click();notice('فتحت نظام الاستقبال على الكمبيوتر.');}else notice('الكمبيوتر جاهز، لكن أداة النظام مو متاحة بهالمرحلة.');
      return;
    }
    if(action==='phone'){
      animate(el,'gfxRing',520);
      const b=toolByWords(['تلفون','هاتف','اتصال']);
      if(b&&b!==el){setTimeout(()=>b.click(),120);notice('رفعت السماعة...');}else notice('التلفون ساكت حالياً.');
      return;
    }
    if(action==='tray'){
      animate(el,'gfxPress',250);
      const hand=q('#handoverBtn');
      if(hand&&!hand.disabled){hand.click();notice('استلمتي الملف وحطيتيه على المكتب.');}
      else {
        const doc=q('#intakeDocs .v2Doc, #intakeDocs .docCard');
        if(doc){doc.click();notice('فتحتي أول ورقة من الملف.');}else notice('التراي فاضي للحين — استلمي الملف أول.');
      }
      return;
    }
    if(action==='id'){
      animate(el,'gfxPress',250);openId();return;
    }
    if(action==='approve'){
      animate(el,'gfxStamp',360);stampFlash('approve');
      const b=q('#approveRouteBtn');if(b&&!b.disabled)setTimeout(()=>b.click(),120);else notice('ما تقدرين تعتمدين الحين — كملي الفحص أول.');
      return;
    }
    if(action==='reject'){
      animate(el,'gfxStamp',360);stampFlash('reject');
      const b=q('#rejectReasonBtn');if(b&&!b.disabled)setTimeout(()=>b.click(),120);else notice('ما تقدرين ترفضين الحين — كملي الفحص أول.');
      return;
    }
    if(action==='tea'){
      animate(el,'gfxSip',600);notice('رشفة سريعة... والطابور للحين موجود.');
    }
  }

  function sync(){
    injectGraphics();
    const screen=q('#intakeScreen');if(!screen||screen.classList.contains('hidden'))return;
    const caseLabel=q('#intakeCaseTop')?.textContent||'';
    if(caseLabel&&caseLabel!==lastCaseLabel){
      lastCaseLabel=caseLabel;
      const av=q('#intakeAvatar');
      if(av){av.classList.remove('gfxArrive','gfxIdle');void av.offsetWidth;av.classList.add('gfxArrive');setTimeout(()=>av.classList.add('gfxIdle'),430);}
    }
    const id=q('.gfxProp[data-action="id"]');
    if(id){
      let ready=false;
      try{ready=!!q('#intakeDocs .v2Doc, #intakeDocs .docCard') || (q('#handoverBtn')&&q('#handoverBtn').disabled);}catch(e){}
      id.classList.toggle('ready',ready);
    }
  }

  document.addEventListener('click',e=>{
    const prop=e.target.closest?.('.gfxProp');
    if(prop){e.preventDefault();e.stopPropagation();handleProp(prop);}
  },true);
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('.gfxProp')){e.preventDefault();handleProp(e.target);}
  });

  const observer=new MutationObserver(()=>requestAnimationFrame(sync));
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled']});

  addStyle();injectGraphics();sync();
  document.title='راجعنا باچر — Graphics Prototype '+GFX_VERSION;
  const version=q('.version');if(version)version.textContent=GFX_VERSION+' // GRAPHICS PROTOTYPE';
})();
