// راجعنا باچر — char_01 visual + layout preview v1.5.1
(function(){
  const VERSION='v1.5.1';
  const enabled=new URLSearchParams(location.search).get('char01')==='1';
  if(!enabled) return;
  const q=s=>document.querySelector(s);

  function style(){
    if(q('#char01PreviewStyle')) return;
    const s=document.createElement('style');
    s.id='char01PreviewStyle';
    s.textContent=`
      body.char01Preview{background:#0b100c!important}
      body.char01Preview #app{display:block!important;background:#0b100c!important;padding:14px!important}
      body.char01Preview .screen{
        width:calc(100vw - 28px)!important;
        height:calc(100vh - 28px)!important;
        max-width:none!important;max-height:none!important;
        border:4px solid #080b08!important;
        box-shadow:0 0 0 3px #3f4d41,0 18px 55px #000!important;
      }

      body.char01Preview #intakeScreen{position:relative!important;display:block!important;height:100%!important;overflow:hidden!important;background:#111712!important}
      body.char01Preview #intakeScreen.gameStage{grid-template-rows:none!important}
      body.char01Preview #intakeScreen .gameBody{display:block!important;height:100%!important;min-height:0!important}
      body.char01Preview #intakeScreen .scene{
        position:absolute!important;inset:0!important;min-height:0!important;margin:0!important;
        background-position:center center!important;background-size:cover!important;
      }

      body.char01Preview #inspectionHud,
      body.char01Preview #inspectionRail,
      body.char01Preview #inspectionTip,
      body.char01Preview #deskPrompt,
      body.char01Preview #gfxAssetHint{display:none!important}

      body.char01Preview #intakeScreen .topbar{
        position:absolute!important;left:18px!important;top:18px!important;right:auto!important;
        z-index:120!important;width:260px!important;height:auto!important;min-height:94px!important;
        padding:10px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;
        border:4px solid #171b17!important;background:rgba(29,35,29,.96)!important;
        box-shadow:6px 7px 0 rgba(0,0,0,.28)!important;color:#f1e6c7!important;
        direction:rtl!important;font:900 11px Tahoma,Arial,sans-serif!important;
      }
      body.char01Preview #intakeScreen .topbar .grow{display:none!important}
      body.char01Preview #intakeScreen .topbar span{
        display:block!important;padding:8px 7px!important;background:#263128!important;border:2px solid #4a594c!important;text-align:center!important;
      }
      body.char01Preview #intakeScreen .topbar .salary{color:#f0cf68!important}
      body.char01Preview #intakeScreen .topbar .heat{color:#e3ae76!important}

      body.char01Preview #intakeScreen .visitorZone{
        position:absolute!important;left:0!important;right:0!important;top:0!important;height:56%!important;
        min-height:0!important;padding:0!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;
        overflow:hidden!important;z-index:18!important;pointer-events:none!important;
      }
      body.char01Preview #intakeScreen .visitorZone .avatar{display:none!important}
      body.char01Preview .char01GamePreview{
        position:absolute!important;left:50%!important;bottom:-92px!important;top:auto!important;
        transform:translateX(-50%)!important;height:clamp(330px,45vh,470px)!important;width:auto!important;
        z-index:20!important;image-rendering:pixelated!important;
        filter:drop-shadow(5px 8px 0 rgba(0,0,0,.22))!important;pointer-events:none!important;
      }

      body.char01Preview #intakeScreen .speech{
        position:absolute!important;right:28px!important;left:auto!important;top:70px!important;bottom:auto!important;
        width:min(500px,37vw)!important;min-height:110px!important;margin:0!important;padding:17px 20px!important;
        z-index:110!important;border:5px solid #2a241a!important;background:#efe4bf!important;
        box-shadow:8px 9px 0 rgba(0,0,0,.28)!important;font-size:15px!important;line-height:1.7!important;
      }
      body.char01Preview #intakeScreen .speech .speaker{font-size:11px!important;margin-bottom:6px!important;color:#6f5b3d!important}
      body.char01Preview #dialogueLogToggle{
        position:absolute!important;right:28px!important;top:196px!important;z-index:121!important;margin:0!important;
        background:#2a342b!important;border:3px solid #111611!important;padding:8px 12px!important;font-size:10px!important;
      }
      body.char01Preview #conversationLog{position:absolute!important;right:28px!important;top:238px!important;width:min(500px,37vw)!important;z-index:120!important;max-height:180px!important;margin:0!important}

      body.char01Preview #intakeScreen .sidePanel{
        position:absolute!important;left:18px!important;top:160px!important;bottom:22px!important;width:min(330px,31vw)!important;
        z-index:130!important;margin:0!important;padding:12px!important;overflow:auto!important;
        border:4px solid #111711!important;background:rgba(31,40,32,.97)!important;
        box-shadow:8px 10px 0 rgba(0,0,0,.30)!important;
        transform:translateX(calc(-100% - 36px))!important;opacity:0!important;pointer-events:none!important;
        transition:transform .18s ease,opacity .18s ease!important;
      }
      body.char01Preview.char01PanelOpen #intakeScreen .sidePanel{transform:translateX(0)!important;opacity:1!important;pointer-events:auto!important}
      body.char01Preview #intakeScreen .sidePanel>h3,
      body.char01Preview #intakeScreen .caseMeta,
      body.char01Preview #intakeScreen .rulebox,
      body.char01Preview #intakeScreen .routePreview{display:none!important}
      body.char01Preview #intakeScreen .sidePanel .notice{font-size:10px!important;margin-top:7px!important}

      #char01PanelToggle{
        position:absolute;left:18px;top:118px;z-index:145;
        border:4px solid #111711;background:#d3a748;color:#171b17;padding:10px 14px;
        font-weight:1000;font-size:11px;box-shadow:5px 6px 0 rgba(0,0,0,.28);cursor:pointer;
      }
      body.char01Preview.char01PanelOpen #char01PanelToggle{background:#e9d7a2}

      body.char01Preview #fileDropZone{left:34%!important;top:58%!important;width:32%!important;height:31%!important}
      body.char01Preview #ddFolder{left:20%!important;top:73%!important}
      body.char01Preview #ddFileBadge{left:17%!important;top:68%!important}
      body.char01Preview #dragDeskHint{bottom:8px!important;max-width:500px!important;font-size:9px!important}

      body.char01Preview .gfxProp[data-action="monitor"]{width:17%!important;left:2%!important;bottom:4%!important}
      body.char01Preview .gfxProp[data-action="tray"]{width:12%!important;left:20%!important;bottom:3%!important}
      body.char01Preview .gfxProp[data-action="approve"]{width:7.5%!important;right:25%!important;bottom:4%!important}
      body.char01Preview .gfxProp[data-action="reject"]{width:7.5%!important;right:17%!important;bottom:4%!important}
      body.char01Preview .gfxProp[data-action="phone"]{width:14%!important;right:2%!important;bottom:5%!important}
      body.char01Preview .gfxProp[data-action="tea"]{width:6%!important;right:12%!important;bottom:2.5%!important}

      @media(max-width:900px){
        body.char01Preview #app{padding:0!important}
        body.char01Preview .screen{width:100vw!important;height:100vh!important;border-width:0!important}
        body.char01Preview #intakeScreen .topbar{left:10px!important;top:10px!important;width:220px!important;min-height:80px!important;font-size:9px!important}
        body.char01Preview #intakeScreen .speech{right:10px!important;top:96px!important;width:58vw!important;min-height:92px!important;font-size:12px!important;padding:12px!important}
        body.char01Preview #dialogueLogToggle{right:10px!important;top:196px!important}
        body.char01Preview #conversationLog{right:10px!important;top:236px!important;width:58vw!important}
        body.char01Preview .char01GamePreview{height:clamp(280px,42vh,390px)!important;bottom:-72px!important}
        #char01PanelToggle{left:10px!important;top:100px!important;padding:8px 10px!important;font-size:9px!important}
        body.char01Preview #intakeScreen .sidePanel{left:10px!important;top:138px!important;bottom:10px!important;width:min(330px,82vw)!important}
        body.char01Preview #fileDropZone{left:31%!important;top:59%!important;width:39%!important;height:29%!important}
      }
    `;
    document.head.appendChild(s);
    document.body.classList.add('char01Preview');
  }

  function ensurePanelToggle(){
    const screen=q('#intakeScreen');
    if(!screen||q('#char01PanelToggle')) return;
    const b=document.createElement('button');
    b.id='char01PanelToggle';b.type='button';b.textContent='الأسئلة والأدوات';
    b.onclick=()=>{
      document.body.classList.toggle('char01PanelOpen');
      b.textContent=document.body.classList.contains('char01PanelOpen')?'سكر اللوحة':'الأسئلة والأدوات';
    };
    screen.appendChild(b);
  }

  function mount(){
    style();ensurePanelToggle();
    const zone=q('#intakeScreen .visitorZone');
    if(!zone) return;
    let img=q('#char01GamePreview');
    if(!img){
      img=document.createElement('img');
      img.id='char01GamePreview';img.className='char01GamePreview';img.alt='char_01 preview';
      img.src='assets/characters/char_01/preview.png?v=1.5.1';
      zone.appendChild(img);
    }
  }

  function boot(){
    mount();
    if(typeof window.loadIntake==='function'&&!window.loadIntake.__char01Preview){
      const prev=window.loadIntake;
      const wrapped=function(...args){const out=prev.apply(this,args);document.body.classList.remove('char01PanelOpen');setTimeout(mount,0);return out;};
      wrapped.__char01Preview=true;window.loadIntake=wrapped;
    }
    document.addEventListener('click',e=>{
      if(e.target?.id==='startCareerBtn'||e.target?.id==='briefGoBtn'||e.target?.id==='nextVisitorBtn') setTimeout(mount,30);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
