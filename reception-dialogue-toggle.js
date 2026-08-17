// راجعنا باچر — Optional dialogue history v1.4.1
// Keeps the active speech visible and makes the full conversation history opt-in.
(function(){
  const VERSION='v1.4.1';
  const q=s=>document.querySelector(s);

  function addStyle(){
    if(q('#dialogueToggleStyle'))return;
    const st=document.createElement('style');
    st.id='dialogueToggleStyle';
    st.textContent=`
      #dialogueLogToggle{
        position:relative;z-index:38;display:block;
        margin:4px 18px 7px auto;padding:6px 10px;
        background:#202b23;color:#efe5c5;border:2px solid #0e130f;
        box-shadow:3px 3px 0 rgba(0,0,0,.28);font-size:9px;font-weight:1000;
        cursor:pointer;touch-action:manipulation;
      }
      #dialogueLogToggle[aria-expanded="true"]{background:#d8b458;color:#171b17}
      #conversationLog.dialogueLogCollapsed{display:none!important}
      @media(max-width:900px){
        #dialogueLogToggle{margin:3px 10px 6px auto;padding:7px 10px;font-size:9px}
      }
    `;
    document.head.appendChild(st);
  }

  function ensureToggle(){
    addStyle();
    const log=q('#conversationLog');
    const speech=q('#intakeScreen .speech');
    if(!log||!speech)return;

    let btn=q('#dialogueLogToggle');
    if(!btn){
      btn=document.createElement('button');
      btn.id='dialogueLogToggle';
      btn.type='button';
      btn.textContent='سجل الحوار';
      btn.setAttribute('aria-expanded','false');
      btn.onclick=()=>{
        const hidden=log.classList.toggle('dialogueLogCollapsed');
        btn.setAttribute('aria-expanded',hidden?'false':'true');
        btn.textContent=hidden?'سجل الحوار':'إخفاء سجل الحوار';
        if(!hidden)log.scrollTop=log.scrollHeight;
      };
      speech.insertAdjacentElement('afterend',btn);
    }

    if(btn.getAttribute('aria-expanded')!=='true'){
      log.classList.add('dialogueLogCollapsed');
      btn.textContent='سجل الحوار';
      btn.setAttribute('aria-expanded','false');
    }
  }

  if(typeof loadIntake==='function'){
    const previousLoadIntake=loadIntake;
    loadIntake=function(){
      previousLoadIntake();
      setTimeout(ensureToggle,0);
    };
  }

  document.addEventListener('click',e=>{
    if(e.target?.id==='startCareerBtn'||e.target?.id==='briefGoBtn'||e.target?.id==='nextVisitorBtn'){
      setTimeout(ensureToggle,0);
    }
  });

  ensureToggle();
  const v=q('.version');
  if(v&&v.textContent.includes('v1.4.0'))v.textContent='v1.4.1 // DRAG DESK';
  document.title=document.title.replace('v1.4.0','v1.4.1');
})();
