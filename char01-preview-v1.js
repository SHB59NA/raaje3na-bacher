// راجعنا باچر — char_01 visual preview v1.5.0
(function(){
  const enabled=new URLSearchParams(location.search).get('char01')==='1';
  if(!enabled) return;
  function style(){
    if(document.getElementById('char01PreviewStyle')) return;
    const s=document.createElement('style');
    s.id='char01PreviewStyle';
    s.textContent=`body.char01Preview .visitorZone .avatar{display:none!important}.char01GamePreview{position:absolute;left:50%;top:-8px;transform:translateX(-50%);height:235px;width:auto;z-index:20;image-rendering:pixelated;filter:drop-shadow(5px 7px 0 rgba(0,0,0,.22));pointer-events:none}@media(max-width:700px){.char01GamePreview{height:195px;top:4px}}`;
    document.head.appendChild(s);
    document.body.classList.add('char01Preview');
  }
  function mount(){
    style();
    const zone=document.querySelector('.visitorZone');
    if(!zone) return;
    let img=document.getElementById('char01GamePreview');
    if(!img){
      img=document.createElement('img');
      img.id='char01GamePreview';
      img.className='char01GamePreview';
      img.alt='char_01 preview';
      img.src='assets/characters/char_01/preview.png?v=1.5.0';
      zone.appendChild(img);
    }
  }
  function boot(){
    mount();
    if(typeof window.loadIntake==='function'&&!window.loadIntake.__char01Preview){
      const prev=window.loadIntake;
      const wrapped=function(...args){const out=prev.apply(this,args);setTimeout(mount,0);return out;};
      wrapped.__char01Preview=true;
      window.loadIntake=wrapped;
    }
    document.addEventListener('click',e=>{
      if(e.target?.id==='startBtn'||e.target?.id==='briefStartBtn'||e.target?.id==='nextVisitorBtn') setTimeout(mount,30);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
