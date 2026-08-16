// راجعنا باچر — Reception Gameplay Prototype v1.1.0
// Gameplay-first prototype. Graphics remain placeholders until the loop is approved.

(function(){
  const VERSION='v1.1.0';
  const INIT_KEY='raaje3na_reception_v110_initialized';
  const QUESTIONS_PER_CASE=3;

  const profiles={
    'سالم محمد':{
      minDay:1,
      system:'السجل: لا يوجد ملف إسكاني قائم. الحالة الاجتماعية مثبتة. أفراد الأسرة: 3.',
      rule:'فتح ملف إسكاني جديد يحتاج بطاقة أصلية، إثبات الحالة الاجتماعية، مستندات الأسرة المطلوبة، ونموذج فتح ملف موقع.',
      questions:[
        {q:'شنو تبي تسوي بالضبط؟',a:'أبي أفتح ملف إسكان جديد، أول مرة أفتح ملف.'},
        {q:'في ملف قديم باسم الأسرة؟',a:'لا. إذا لقيت واحد بالنظام تعال حاسبني.'},
        {q:'كل مستندات الأسرة معاك؟',a:'إي داخل الملف. لا تقول ناقص قبل لا تفتحه.'},
        {q:'ليش مستعيل؟',a:'لأن صارلي من الصبح هني، مو لأن معاملتي ناقصة.'}
      ],
      marker:['ماكو تناقض واضح','قال عنده ملف قديم','قال إن مستندات الأسرة ناقصة'],markerCorrect:0,
      markerResult:'كلامه متوافق مع الملف والسجل. المشكلة الوحيدة لسانه.'
    },
    'أم بدر':{
      minDay:1,
      system:'السجل: البطاقة مفقودة. لا يوجد إثبات رسمي بديل مسجل مع الطلب.',
      rule:'بدل فاقد يحتاج إثبات رسمي ساري مع الصور وحضور صاحب العلاقة.',
      questions:[
        {q:'عندج إثبات رسمي غير صورة البطاقة؟',a:'لا. عندي صورة البطاقة القديمة، شتبي أكثر من جذي؟'},
        {q:'الصور الحديثة موجودة؟',a:'موجودة. لا تدور شي ثاني.'},
        {q:'إنتِ صاحبة البطاقة؟',a:'إي أنا. تبي شهادة من الجيران بعد؟'},
        {q:'في مستند ثاني داخل الجنطة؟',a:'لا، لا تضيع وقتي.'}
      ],
      marker:['الهوية البديلة ناقصة','صاحبة العلاقة مو حاضرة','الصور ناقصة'],markerCorrect:0,
      markerResult:'المشكلة الفعلية: ماكو إثبات رسمي ساري.'
    },
    'مشعل بدر':{
      minDay:2,
      system:'الاستحقاق: مبدئي. عقد الإيجار: موجود. المستند المؤيد للحالة: غير مرفق.',
      rule:'طلب بدل الإيجار ما يعتمد إذا المستند المؤيد للحالة ناقص، حتى لو وصل اتصال أو ملاحظة من شخص مهم.',
      phone:'يرد عليك صوت هادي: «إي مشعل عندك... خلصها إذا تقدر.» ثم يسكر.',
      questions:[
        {q:'شنو الورقة الناقصة؟',a:'ورقة بسيطة. مو لازم نوقف المعاملة عليها.'},
        {q:'منو كاتب ملاحظة الواسطة؟',a:'مو مهم الاسم. المهم إنك تفهم الإشارة.'},
        {q:'المستند المؤيد للحالة وينه؟',a:'مو معاي الحين. بس أقدر أييبه باچر.'},
        {q:'العقد ساري؟',a:'إي، العقد ساري.'}
      ],
      marker:['المستند المؤيد للحالة ناقص','العقد منتهي','صاحب العلاقة مو حاضر'],markerCorrect:0,
      markerResult:'الواسطة ما غيرت الحقيقة: مستند أساسي ناقص.'
    },
    'نوال عبدالله':{
      minDay:1,
      system:'السجل العائلي: 3 أفراد. المشمولون بالطلب الحالي: فرد واحد فقط.',
      rule:'تغيير عنوان الأسرة لازم يشمل أفراد الأسرة المطلوب تغيير عنوانهم مع بطاقاتهم الأصلية.',
      questions:[
        {q:'وين بطاقات باقي الأسرة؟',a:'بالبيت. قلت أبي أغير عنواني أنا بس.'},
        {q:'الطلب للأسرة كلها ولا لج بس؟',a:'لي أنا بس. العيال خليهم بعدين.'},
        {q:'عقد السكن موجود؟',a:'إي موجود وموقع.'},
        {q:'إقرار السكن موجود؟',a:'موجود، تكفى لا تردني.'}
      ],
      marker:['الطلب ما يشمل كل الأسرة','العقد ناقص','إقرار السكن ناقص'],markerCorrect:0,
      markerResult:'السجل يقول الأسرة 3، والطلب يشمل شخص واحد.'
    },
    'عبدالله راشد':{
      minDay:2,
      system:'الحالة المدنية: متوفى بتاريخ 14/06/1991. ملف المركبة مرتبط بحصر ورثة ووكالة سارية.',
      rule:'في جمهورية النوران، ملف مالك متوفى ممكن يستكمل إذا مستندات الوفاة والورثة والوكالة والتأمين كلها سليمة. الحالة الغريبة بروحها مو سبب رفض.',
      questions:[
        {q:'إنت صاحب المعاملة؟',a:'إي... بطريقة إدارية معقدة شوي.'},
        {q:'شهادة الوفاة لمنو؟',a:'لي أنا. لا تركز وايد على هالنقطة.'},
        {q:'الورثة والوكالة موجودين؟',a:'إي، كلهم مرفقين. دقق الورق مو وجهي.'},
        {q:'من متى وإنت... جذي؟',a:'من 1991. بس المعاملة توها تحركت.'}
      ],
      marker:['المراجع متوفى لكن الملف مستوفي','التأمين ناقص','الوكالة منتهية'],markerCorrect:0,
      markerResult:'الغريب هنا هو المراجع، مو المعاملة. المستندات كاملة.'
    },
    'فهد أحمد':{
      minDay:1,
      system:'الاسم والرقم المدني مطابقان. المستند المؤيد للتصحيح أصلي وساري.',
      rule:'تصحيح البيانات يعتمد إذا الهوية والمستند المؤيد والرقم المدني متطابقين.',
      questions:[
        {q:'شنو الخطأ اللي تبي تصححه؟',a:'خطأ بسيط بالبيانات. وأنا قاري التعميم على فكرة.'},
        {q:'المستند المؤيد أصلي؟',a:'أصلي وساري. قلت لك أنا مجهز.'},
        {q:'الرقم المدني مطابق؟',a:'مطابق. لا تضيع وقتك على الواضحات.'},
        {q:'أي تعميم تقصد؟',a:'التعميم المعروف... لا تسألني رقمه.'}
      ],
      marker:['ماكو تناقض فعلي','المستند المؤيد منتهي','الرقم المدني مختلف'],markerCorrect:0,
      markerResult:'هو متفلسف، بس أوراقه فعلاً سليمة.'
    },
    'عادل يوسف':{
      minDay:1,
      system:'المركبة: لا حجز. التأمين: ساري. دفتر المركبة: ساري. الأطراف: موجودة.',
      rule:'نقل ملكية المركبة يعتمد إذا التأمين والدفتر والبطاقات سليمة وماكو حجز.',
      questions:[
        {q:'التأمين ساري؟',a:'ساري. شوفه بالملف وخلصنا.'},
        {q:'في حجز على المركبة؟',a:'لا. دق بالنظام إذا مو مصدق.'},
        {q:'كل الأطراف حاضرين؟',a:'إي موجودين.'},
        {q:'ليش معصب؟',a:'لأني كل مرة يعيدون نفس الأسئلة.'}
      ],
      marker:['ماكو تناقض واضح','المركبة عليها حجز','التأمين منتهي'],markerCorrect:0,
      markerResult:'العصبية ما تعني إن المعاملة غلط.'
    },
    'غانم يوسف':{
      minDay:1,
      system:'طلب بدل فاقد مفتوح. لا يوجد إثبات رسمي بديل. الصورة المرفوعة قديمة.',
      rule:'بدل فاقد يحتاج إثبات رسمي ساري وصورتين حديثتين وحضور صاحب العلاقة.',
      questions:[
        {q:'شنو معاملتك؟',a:'أظن بدل فاقد... إي إي البطاقة ضايعة.'},
        {q:'عندك إثبات رسمي ثاني؟',a:'يمكن بالبيت. الحين لا.'},
        {q:'عندك صورتين حديثات؟',a:'عندي وحدة... مو متأكد متى مصورها.'},
        {q:'هذا ملفك إنت؟',a:'إي أعتقد. اسمي مكتوب عليه صح؟'}
      ],
      marker:['الإثبات الرسمي ناقص','الحضور ناقص','كل المتطلبات مكتملة'],markerCorrect:0,
      markerResult:'المراجع سرحان، والملف فعلاً ناقص.'
    },
    'راشد سالم':{
      minDay:3,
      system:'الهوية: فعالة. العنوان: قابل للتحديث. المطابقة الحيوية: غير مصنفة. المسار المطلوب: الحالات الخاصة.',
      rule:'إذا الأوراق كاملة لكن النظام يعطي «غير مصنف»، ما ينرفض الطلب؛ يتحول للحالات الخاصة.',
      questions:[
        {q:'شنو تقصد مواطن طبيعي جداً؟',a:'وصف بشري اعتيادي لا يحتاج تفسير.'},
        {q:'ليش النظام مصنفك غير مصنف؟',a:'خلل تقني بشري بسيط جداً.'},
        {q:'كل أوراق السكن موجودة؟',a:'نعم. عقد، إقرار، بطاقات. كلها بشرية.'},
        {q:'كم إصبع عندك؟',a:'العدد القانوني المطلوب.'}
      ],
      marker:['الأوراق كاملة والحالة تحتاج تصنيف خاص','عقد السكن ناقص','لازم ينرفض لأنه غريب'],markerCorrect:0,
      markerResult:'لا تستخدم الشكل كسبب رفض. النظام نفسه يطلب الحالات الخاصة.'
    },
    'منيرة يوسف':{
      minDay:1,
      system:'البطاقة: منيرة يوسف. طلب التصحيح: منيرة يونس. الرقم المدني في الطلب يختلف بخانة واحدة.',
      rule:'تصحيح البيانات ما يتنفذ إذا الاسم أو الرقم المدني في المستندات مو متطابق.',
      questions:[
        {q:'تأكدتي من الاسم بكل الأوراق؟',a:'إي... تقريباً. يمكن كتبت بسرعة.'},
        {q:'الرقم المدني نسختيه من البطاقة؟',a:'كتبته من الذاكرة.'},
        {q:'عندج مستند مؤيد؟',a:'إي موجود.'},
        {q:'مستعيلة؟',a:'لا خذ راحتك، أهم شي يكون صح.'}
      ],
      marker:['الاسم والرقم المدني غير متطابقين','المستند المؤيد ناقص','المعاملة كاملة'],markerCorrect:0,
      markerResult:'في تناقضين: الاسم والرقم المدني.'
    },
    'لولوة سالم':{
      minDay:1,
      system:'البطاقة: سليمة. عقد السكن: الرقم الآلي 44321. السجل: الرقم الآلي 44312.',
      rule:'إثبات السكن يحتاج تطابق بيانات العقد مع السجل. الكلام الحلو مو مستند.',
      questions:[
        {q:'الرقم الآلي بالعقد متأكد منه؟',a:'إي حبيبي... أقصد إي، أكيد.'},
        {q:'العقد باسمج؟',a:'إي باسمي.'},
        {q:'الإقرار موقع؟',a:'موقع وكل شي مرتب.'},
        {q:'ليش تبينها تمشي بسرعة؟',a:'لأنك واضح متعاون وما تحب تعقد الأمور.'}
      ],
      marker:['الرقم الآلي غير مطابق','الإقرار غير موقع','البطاقة منتهية'],markerCorrect:0,
      markerResult:'التناقض بين رقم العقد ورقم السجل.'
    },
    'دانة بدر':{
      minDay:1,
      system:'طلب بدل فاقد. المرفق كإثبات هو Screenshot من البطاقة القديمة. لا يوجد إثبات رسمي ساري.',
      rule:'Screenshot أو صورة من ألبوم الهاتف مو إثبات رسمي ساري لبدل الفاقد.',
      phone:'ترد أمها: «حبيبتي دانة عندكم؟ كل أوراقها أنا مرتبتها، لا تتعبونها.»',
      questions:[
        {q:'عندج جواز أو إثبات رسمي؟',a:'لا، ماما قالت الـScreenshot يكفي.'},
        {q:'من رتب الملف؟',a:'ماما. أنا بس ييت.'},
        {q:'الصور الحديثة موجودة؟',a:'إي موجودة.'},
        {q:'تبين أدق على أحد؟',a:'إي دق على ماما، هي تعرف كل شي.'}
      ],
      marker:['الـScreenshot مو إثبات رسمي','الصور ناقصة','صاحبة العلاقة مو حاضرة'],markerCorrect:0,
      markerResult:'المشكلة مو بالدلع؛ المشكلة إن ماكو إثبات رسمي.'
    },
    'نورة محمد':{
      minDay:1,
      system:'البطاقة الحالية: سارية. الصورة: حديثة. طلب التجديد: موقع.',
      rule:'تجديد البطاقة يعتمد إذا البطاقة الحالية والصورة والطلب الموقع موجودين.',
      questions:[
        {q:'البطاقة الحالية معاج؟',a:'إي قدامك. لا تخليني أعيد.'},
        {q:'الصورة حديثة؟',a:'إي، أمس مصورتها.'},
        {q:'الطلب موقع؟',a:'إي موقع. شوف بنفسك.'},
        {q:'ممكن تهدين شوي؟',a:'لا. خلص المعاملة أول.'}
      ],
      marker:['ماكو تناقض واضح','البطاقة منتهية','الطلب مو موقع'],markerCorrect:0,
      markerResult:'لسانها طويل، لكن المعاملة كاملة.'
    }
  };

  const events=[
    {minDay:1,text:'الطابعة طبعت ورقة فاضية وعليها ختم «ناقص»... من غير ما أحد يطبع.'},
    {minDay:1,text:'رقم الطابور يعلق ثانيتين، بعدها يكمل كأن ما صار شي.'},
    {minDay:2,text:'التلفون يرن. لمن ترفعه ماكو صوت، بس تسمع طابعة بعيدة.'},
    {minDay:2,text:'الساعة فوق الشباك توقف دقيقة كاملة. ساعة الكمبيوتر تكمل عادي.'},
    {minDay:3,text:'رقم الطابور يظهر 666 لحظة، بعدها يرجع للرقم الطبيعي.'},
    {minDay:3,text:'تطلع ورقة من الطابعة مكتوب فيها اسمك... ما فيها أي معاملة.'}
  ];

  let receptionState=null;
  let dayQuestions=0;
  let dayDocsInspected=0;
  let dayNotes=0;

  function profileFor(c){return profiles[c.name]||{minDay:1,system:'لا توجد ملاحظات إضافية في النظام.',rule:'دقق المستندات وحدد الإجراء الصحيح.',questions:[],marker:['ماكو تناقض واضح'],markerCorrect:0,markerResult:'ماكو ملاحظة إضافية.'}}
  function currentCase(){return currentBatch[caseIndex]}
  function currentProfile(){return profileFor(currentCase())}
  function uniqueServices(){return [...new Set(intakePool.map(c=>c.service))]}
  function setNotice(text){const el=$('#intakeNotice');if(el)el.textContent=text}

  function injectStyle(){
    if(document.getElementById('receptionV2Style'))return;
    const style=document.createElement('style');
    style.id='receptionV2Style';
    style.textContent=`
      .v2Box{margin-top:8px;background:#1b271e;border:3px solid #0d120e;padding:8px;font-size:10px;line-height:1.55}
      .v2Box h4{margin:0 0 6px;color:#efcf69;font-size:11px}
      .v2Grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .v2Question{background:#d8cfaa;border:3px solid #171b17;padding:7px;font-weight:900;text-align:right;color:#171b17}
      .v2Question:disabled,.btn:disabled{opacity:.45;cursor:not-allowed;filter:grayscale(.8)}
      .v2Tools{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .v2Tool{background:#8faeb0;border:3px solid #171b17;padding:7px;font-weight:900;color:#171b17}
      .v2Phase{background:#d8aa4c;color:#171b17;border:3px solid #171b17;padding:6px;font-weight:900;margin-bottom:8px}
      .docCard.v2Doc{cursor:pointer;transition:transform .08s}.docCard.v2Doc:hover{transform:translateY(-2px)}
      .docCard.v2Doc .v2Hidden{opacity:.55}.docCard.v2Doc.inspected{outline:4px solid #91b173;background:#e9dfbc}
      .v2Notes{min-height:34px;background:#efe4bd;color:#171b17;border:3px solid #171b17;padding:6px}
      .v2Notes div{border-bottom:1px dashed #7c745e;padding:3px 0}.v2Notes div:last-child{border-bottom:0}
      .v2Counter{font:900 10px monospace;color:#d5aa4f;margin-bottom:6px}
    `;
    document.head.appendChild(style);
  }

  function injectUI(){
    injectStyle();
    const side=$('#intakeScreen .sidePanel');
    if(!side||$('#casePhase'))return;

    const phase=document.createElement('div');
    phase.id='casePhase';phase.className='v2Phase';phase.textContent='1 — اسمع المراجع';
    side.insertBefore(phase, side.firstChild.nextSibling);

    const hand=document.createElement('button');
    hand.id='handoverBtn';hand.className='btn amber wide';hand.style.marginTop='8px';hand.textContent='استلم الملف من المراجع';
    const req=side.querySelector('.rulebox');
    req.insertAdjacentElement('afterend',hand);

    const qbox=document.createElement('div');
    qbox.id='questionBox';qbox.className='v2Box';
    qbox.innerHTML='<h4>اسأل المراجع</h4><div class="v2Counter" id="questionCounter">3 أسئلة متبقية</div><div class="v2Grid" id="questionButtons"></div>';
    hand.insertAdjacentElement('afterend',qbox);

    const tools=document.createElement('div');
    tools.id='toolBox';tools.className='v2Box';
    tools.innerHTML='<h4>أدوات المكتب</h4><div class="v2Tools"><button class="v2Tool" id="toolComputer">الكمبيوتر</button><button class="v2Tool" id="toolPhone">التلفون</button><button class="v2Tool" id="toolCircular">دفتر التعاميم</button><button class="v2Tool" id="toolMarker">ملاحظة / تناقض</button></div>';
    qbox.insertAdjacentElement('afterend',tools);

    const notes=document.createElement('div');
    notes.className='v2Box';notes.innerHTML='<h4>ملاحظات الموظف</h4><div class="v2Notes" id="employeeNotes">ما سجلت شي للحين.</div>';
    tools.insertAdjacentElement('afterend',notes);

    hand.onclick=receiveFile;
    $('#toolComputer').onclick=useComputer;
    $('#toolPhone').onclick=usePhone;
    $('#toolCircular').onclick=useCircular;
    $('#toolMarker').onclick=useMarker;
  }

  function startState(c){
    receptionState={fileReceived:false,questionsLeft:QUESTIONS_PER_CASE,extraDocs:[],inspected:new Set(),notes:[],systemChecked:false,markerUsed:false};
    renderQuestions();
    renderNotes();
    updatePhase();
    $('#handoverBtn').disabled=false;
    $('#handoverBtn').textContent='استلم الملف من المراجع';
    $('#approveRouteBtn').disabled=true;
    $('#rejectReasonBtn').disabled=true;
  }

  function updatePhase(){
    if(!receptionState)return;
    const p=$('#casePhase');
    if(!p)return;
    if(!receptionState.fileReceived)p.textContent='1 — اسمع واسأل المراجع';
    else if(receptionState.inspected.size===0)p.textContent='2 — افتح الملف ودقق المستندات';
    else p.textContent='3 — استخدم الأدوات وخذ القرار';
  }

  function renderQuestions(){
    const p=currentProfile(),wrap=$('#questionButtons'),counter=$('#questionCounter');
    if(!wrap||!counter||!receptionState)return;
    counter.textContent=receptionState.questionsLeft+' أسئلة متبقية';
    wrap.innerHTML='';
    p.questions.forEach((item,i)=>{
      const b=document.createElement('button');b.className='v2Question';b.textContent=item.q;b.disabled=receptionState.questionsLeft<=0;
      b.onclick=()=>askQuestion(i,b);wrap.appendChild(b);
    });
  }

  function askQuestion(i,button){
    if(!receptionState||receptionState.questionsLeft<=0)return;
    const item=currentProfile().questions[i];
    receptionState.questionsLeft--;dayQuestions++;
    $('#intakeDialogue').textContent=item.a;
    button.disabled=true;
    addNote('سألت: '+item.q);
    if(item.revealDoc){receptionState.extraDocs.push(item.revealDoc);if(receptionState.fileReceived)renderDocs();}
    renderQuestions();
    setNotice(receptionState.questionsLeft?`باقي ${receptionState.questionsLeft} سؤال. تقدر تستلم الملف بأي وقت.`:'خلصت أسئلتك. الحين اعتمد على الملف والأدوات.');
  }

  function receiveFile(){
    if(!receptionState||receptionState.fileReceived)return;
    receptionState.fileReceived=true;
    const c=currentCase();
    $('#handoverBtn').disabled=true;
    $('#handoverBtn').textContent='الملف مستلم';
    $('#approveRouteBtn').disabled=false;
    $('#rejectReasonBtn').disabled=false;
    $('#intakeServiceTag').textContent='ملف مستلم';
    $('#wastaTag').classList.toggle('hidden',!c.wasta);
    $('#intakeWastaBox').classList.toggle('hidden',!c.wasta);
    $('#passWastaBtn').classList.toggle('hidden',!c.wasta);
    if(c.wasta)$('#intakeWastaBox').innerHTML='<b>ملاحظة مشبوهة داخل الملف:</b><br>'+esc(c.wasta);
    renderDocs();
    updatePhase();
    setNotice('اضغط على كل مستند عشان تفتحه وتقرأه. بعدها استخدم الكمبيوتر أو التعميم إذا احتجت.');
  }

  function renderDocs(){
    const c=currentCase();
    if(!receptionState.fileReceived){
      $('#intakeDocs').innerHTML='<div class="docCard"><h4>الملف للحين عند المراجع</h4><p>اسأله إذا تبي، وبعدها اضغط «استلم الملف».</p></div>';
      return;
    }
    const docs=[...c.docs,...receptionState.extraDocs];
    $('#intakeDocs').innerHTML=docs.map((d,i)=>`<div class="docCard v2Doc${receptionState.inspected.has(i)?' inspected':''}" data-v2doc="${i}"><h4>${esc(d[0])}</h4><p class="${receptionState.inspected.has(i)?'':'v2Hidden'}">${receptionState.inspected.has(i)?esc(d[1]):'اضغط للتفحص'}</p></div>`).join('');
    $$('#intakeDocs [data-v2doc]').forEach(el=>el.onclick=()=>inspectDoc(Number(el.dataset.v2doc)));
  }

  function inspectDoc(i){
    if(!receptionState.fileReceived)return;
    if(!receptionState.inspected.has(i)){receptionState.inspected.add(i);dayDocsInspected++;}
    renderDocs();updatePhase();
  }

  function addNote(text){
    if(!receptionState)return;
    if(!receptionState.notes.includes(text)){receptionState.notes.push(text);dayNotes++;}
    renderNotes();
  }

  function renderNotes(){
    const box=$('#employeeNotes');if(!box||!receptionState)return;
    box.innerHTML=receptionState.notes.length?receptionState.notes.map(n=>`<div>• ${esc(n)}</div>`).join(''):'ما سجلت شي للحين.';
  }

  function useComputer(){
    if(!receptionState||!receptionState.fileReceived){setNotice('استلم الملف أول عشان يكون عندك بيانات الاستعلام.');return;}
    receptionState.systemChecked=true;
    const c=currentCase(),p=currentProfile();
    $('#modalBody').innerHTML=`<h2>النظام المركزي</h2><div class="crtLine"><b>${esc(c.name)}</b></div><p style="line-height:1.8">${esc(p.system)}</p><button class="btn green wide" id="v2SaveSystem">سجل المعلومة</button>`;
    $('#modal').classList.remove('hidden');
    $('#v2SaveSystem').onclick=()=>{addNote('النظام: '+p.system);$('#modal').classList.add('hidden')};
  }

  function usePhone(){
    const c=currentCase(),p=currentProfile();
    let msg=p.phone||c.wasta||'السنترال يرد: «ماكو اتصال مسجل لهالمعاملة.»';
    if(c.wasta&&!p.phone)msg='تدق الرقم المكتوب بالملاحظة. يرد شخص ويقول: «مشّها وخلاص.»';
    $('#modalBody').innerHTML=`<h2>تلفون المكتب</h2><p style="line-height:1.9">${esc(msg)}</p>`;
    $('#modal').classList.remove('hidden');
    if(c.wasta&&receptionState.fileReceived)addNote('في ضغط/واسطة على المعاملة.');
  }

  function useCircular(){
    const p=currentProfile();
    $('#modalBody').innerHTML=`<h2>دفتر التعاميم</h2><p style="line-height:1.9">${esc(p.rule)}</p><button class="btn blue wide" id="v2SaveRule">سجل القاعدة</button>`;
    $('#modal').classList.remove('hidden');
    $('#v2SaveRule').onclick=()=>{addNote('التعميم: '+p.rule);$('#modal').classList.add('hidden')};
  }

  function useMarker(){
    if(!receptionState||!receptionState.fileReceived){setNotice('استلم الملف وافحصه قبل لا تسجل تناقض.');return;}
    const p=currentProfile();
    $('#modalBody').innerHTML=`<h2>ملاحظة / تناقض</h2><p>شنو الشي اللي تبي تثبته بملاحظاتك؟</p><div class="choiceGrid">${p.marker.map((m,i)=>`<button class="btn blue v2MarkerChoice" data-i="${i}">${esc(m)}</button>`).join('')}</div>`;
    $('#modal').classList.remove('hidden');
    $$('.v2MarkerChoice').forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.i);$('#modal').classList.add('hidden');
      if(i===p.markerCorrect){receptionState.markerUsed=true;addNote('ملاحظة مثبتة: '+p.marker[i]);setNotice(p.markerResult)}
      else setNotice('ما عندك دليل كافي يثبت هالملاحظة من الملف الحالي.');
    });
  }

  function serviceOptions(selected=''){
    return uniqueServices().map(s=>`<option value="${esc(s)}"${s===selected?' selected':''}>${esc(s)}</option>`).join('');
  }

  function openApproveDecision(){
    if(!receptionState.fileReceived){setNotice('استلم الملف أول.');return;}
    const options=Object.entries(ministries).map(([k,m])=>`<option value="${k}">${esc(m.name)}</option>`).join('');
    $('#modalBody').innerHTML=`<h2>اعتماد وتوجيه المعاملة</h2><div class="fieldRow"><b>نوع المعاملة</b><select id="v2ServiceType"><option value="">— اختار —</option>${serviceOptions()}</select></div><div class="fieldRow"><b>الجهة</b><select id="routeMinistry">${options}</select></div><div class="fieldRow"><b>الدور</b><select id="routeFloor">${floorOptions.map(f=>`<option>${esc(f)}</option>`).join('')}</select></div><button class="btn green wide" id="confirmRoute">اختم معتمد ووجّه</button>`;
    $('#modal').classList.remove('hidden');
    $('#confirmRoute').onclick=()=>{
      const type=$('#v2ServiceType').value,m=$('#routeMinistry').value,f=$('#routeFloor').value;
      if(!type){setNotice('لازم تحدد نوع المعاملة قبل القرار.');return;}
      $('#modal').classList.add('hidden');resolveIntakeApproveV2(type,m,f);
    };
  }

  function openRejectDecision(){
    if(!receptionState.fileReceived){setNotice('استلم الملف أول.');return;}
    const c=currentCase();
    $('#modalBody').innerHTML=`<h2>رفض المعاملة</h2><div class="fieldRow"><b>نوع المعاملة</b><select id="v2RejectService"><option value="">— اختار —</option>${serviceOptions()}</select></div><div class="fieldRow"><b>سبب الرفض</b><select id="v2RejectReason"><option value="">— اختار —</option>${rejectReasons.map(r=>`<option>${esc(r)}</option>`).join('')}</select></div><button class="btn red wide" id="v2ConfirmReject">اختم مرفوض</button>`;
    $('#modal').classList.remove('hidden');
    $('#v2ConfirmReject').onclick=()=>{
      const type=$('#v2RejectService').value,r=$('#v2RejectReason').value;
      if(!type||!r){setNotice('حدد نوع المعاملة وسبب الرفض.');return;}
      $('#modal').classList.add('hidden');
      const typeOk=type===c.service,ok=!c.valid&&typeOk&&r===c.reason;
      let why;
      if(!typeOk)why=`نوع المعاملة غلط. الصحيح: ${c.service}.`;
      else if(c.valid)why='الملف كان كامل وما يحتاج رفض.';
      else if(r!==c.reason)why=`سبب الرفض مو دقيق. السبب الصحيح: ${c.reason}.`;
      else why='صح: فهمت نوع المعاملة وحددت سبب الرفض الحقيقي.';
      finishDecision(ok,why,'intake','reject');
    };
  }

  function resolveIntakeApproveV2(type,m,f){
    const c=currentCase();
    const typeOk=type===c.service;
    const ok=c.valid&&typeOk&&m===c.dest&&f===c.floor;
    let why;
    if(!typeOk)why=`نوع المعاملة غلط. الصحيح: ${c.service}.`;
    else if(!c.valid)why=`المعاملة فيها مشكلة وما تنعتمد: ${c.reason}.`;
    else if(m!==c.dest||f!==c.floor)why=`التوجيه غلط. الصحيح: ${ministries[c.dest].name} — ${c.floor}.`;
    else why=`صح: فهمت الطلب، دققت الملف، واعتمدته إلى ${ministries[c.dest].name} — ${c.floor}.`;
    finishDecision(ok,why,'intake','approve');
  }

  function maybeEvent(){
    if(caseIndex===0||Math.random()>.30)return;
    const pool=events.filter(e=>day>=e.minDay);if(!pool.length)return;
    const e=pool[Math.floor(Math.random()*pool.length)];
    setTimeout(()=>feedback('حدث بالمكتب<br><span class="tiny">'+esc(e.text)+'</span>','wastaFb',1900),350);
  }

  // New reception-only fresh start: 100 dinar once when v1.1.0 is first loaded.
  if(!localStorage.getItem(INIT_KEY)){
    salary=100;day=1;wastaHeat=0;rank=1;selectedMinistry='';selectedCoworker='';
    save();localStorage.setItem(INIT_KEY,'1');
  }

  document.title='راجعنا باچر — Reception Prototype '+VERSION;
  const subtitle=document.querySelector('.subtitle');if(subtitle)subtitle.textContent='RECEPTION PROTOTYPE';
  const version=document.querySelector('.version');if(version)version.textContent=VERSION+' // GAMEPLAY TEST';
  const desc=document.querySelector('.desc');if(desc)desc.textContent='اسمع المراجع، اسأله، استلم الملف، دقق المستندات، استخدم أدوات المكتب، وبعدها صنّف المعاملة وخذ القرار الصح.';
  const reset=$('#resetBtn');if(reset)reset.textContent='مسح الحفظ — بداية من 100 دينار';
  const fireSalary=document.querySelector('#fireScreen .fireCopy > div');if(fireSalary)fireSalary.textContent='الرصيد: 0 دينار';
  const fireReset=$('#fireResetBtn');if(fireReset)fireReset.textContent='ابدأ من جديد — 100 دينار';

  updateTitle=function(){
    $('#titleRank').textContent='موظف استقبال';
    $('#titleSalary').textContent=salary+' دينار';
    if($('#titleDay'))$('#titleDay').textContent='DAY '+day;
    $('#titleHeat').textContent=wastaHeat+'%';
    if($('#step1'))$('#step1').classList.add('unlocked');
    $('#startCareerBtn').textContent='ابدأ دوام الاستقبال';
  };

  updateBars=function(){
    if($('#intakeSalary'))$('#intakeSalary').textContent='الرصيد '+salary+' دينار';
    if($('#intakeHeat'))$('#intakeHeat').textContent='WASTA '+wastaHeat+'%';
  };

  moneyPop=function(delta){
    const el=document.createElement('div');el.className='floatMoney '+(delta>=0?'plus':'minus');el.textContent=(delta>0?'+':'')+delta+' دينار';$('.screen').appendChild(el);setTimeout(()=>el.remove(),1150);
  };

  startIntakeDay=function(){
    injectUI();
    dayStartSalary=salary;dayScore=0;dayWrong=0;dayQuestions=0;dayDocsInspected=0;dayNotes=0;caseIndex=0;
    const available=intakePool.filter(c=>day>=profileFor(c).minDay);
    currentBatch=shuffle(available).slice(0,Math.min(6,available.length));
    show('intakeScreen');loadIntake();
  };

  loadIntake=function(){
    busy=false;
    const c=currentCase();if(!c){finishDay('intake');return;}
    startState(c);updateBars();
    $('#intakeCaseTop').textContent=`CASE ${caseIndex+1}/${currentBatch.length} • DAY ${day}`;
    $('#intakeClock').textContent=`${String(7+Math.floor((caseIndex*42+30)/60)).padStart(2,'0')}:${String((caseIndex*42+30)%60).padStart(2,'0')}`;
    $('#intakeSpeaker').textContent=c.name;
    $('#intakeDialogue').textContent=randLine(c.introLines)||'السلام عليكم.';
    $('#intakeAvatar').className='avatar '+(c.avatar||'');
    $('#intakeAvatar').title='اضغط لسماع تعليق ثاني';
    $('#intakeAvatar').onclick=()=>{const line=randLine(c.idleLines);if(line)$('#intakeDialogue').textContent=line};
    $('#intakeFileTitle').textContent=c.name+' — الملف بيد المراجع';
    $('#intakeServiceTag').textContent='طلب شفهي';
    $('#intakeDocs').innerHTML='<div class="docCard"><h4>الملف للحين عند المراجع</h4><p>اسأله أول أو استلم الملف مباشرة.</p></div>';
    $('#intakeRequirements').innerHTML='المتطلبات ما تظهر لك كإجابة جاهزة. استخدم «دفتر التعاميم» إذا احتجت القاعدة الرسمية.';
    $('#intakeMeta').innerHTML=`<b>${esc(c.name)}</b><br><span class="tag">الشخصية: ${esc(c.personality||'عادي')}</span><br><br>المراجع قاعد يشرح طلبه. إنت لازم تحدد نوع المعاملة من كلامه والملف.`;
    $('#wastaTag').classList.add('hidden');
    $('#intakeWastaBox').classList.add('hidden');
    $('#passWastaBtn').classList.add('hidden');
    $('#approveRouteBtn').onclick=()=>{if(busy)return;openApproveDecision()};
    $('#rejectReasonBtn').onclick=()=>{if(busy)return;openRejectDecision()};
    $('#passWastaBtn').onclick=()=>{if(busy)return;if(!receptionState.fileReceived){setNotice('استلم الملف أول.');return}resolveWasta('intake')};
    window.setTimeout(maybeEvent,80);
  };

  finishDecision=function(ok,why,stage,reactionType=''){
    if(busy)return;busy=true;
    let reaction='';
    if(stage==='intake'){
      const c=currentCase();
      const lines=reactionType==='approve'?c.approveLines:reactionType==='reject'?c.rejectLines:null;
      reaction=randLine(lines);if(reaction)$('#intakeDialogue').textContent=reaction;
    }
    const quote=reaction?'<br><span class="tiny">«'+esc(reaction)+'»</span>':'';
    if(ok){dayScore++;adjustSalary(REWARD);feedback('✓ صح<br><span class="tiny">'+esc(why)+'</span>'+quote,'goodFb',1850)}
    else{dayWrong++;if(!adjustSalary(-PENALTY))return;feedback('✕ غلط<br><span class="tiny">'+esc(why)+'</span>'+quote,'badFb',1850)}
    setTimeout(()=>afterCase('intake'),2050);
  };

  resolveWasta=function(){
    if(busy)return;busy=true;
    const c=currentCase();const line=randLine(c.wastaLines||c.idleLines);if(line)$('#intakeDialogue').textContent=line;
    const chance=Math.min(80,25+wastaHeat);const caught=Math.random()*100<chance;
    if(caught){wastaHeat=0;save();feedback(`التفتيش مسك المعاملة.<br><b>-50 دينار</b><br><span class="tiny">نسبة الانكشاف كانت ${chance}%</span>`,'badFb',1700);if(!adjustSalary(-WASTA_PENALTY))return;dayWrong++}
    else{wastaHeat=Math.min(55,wastaHeat+10);save();feedback(`عدّت هالمرة.<br><span class="tiny">ما أخذت +5، وWasta Heat صار ${wastaHeat}%.</span>`,'wastaFb',1700)}
    setTimeout(()=>afterCase('intake'),1850);
  };

  afterCase=function(){
    if(salary<=0)return;
    caseIndex++;
    if(caseIndex>=currentBatch.length){finishDay('intake');return;}
    loadIntake();
  };

  finishDay=function(){
    const gain=salary-dayStartSalary;
    $('#dayEndTitle').textContent='نهاية دوام الاستقبال — اليوم '+day;
    $('#dayStats').innerHTML=`<div class="infoCard"><b>${dayScore}</b>قرارات صحيحة</div><div class="infoCard"><b>${dayWrong}</b>أخطاء / انكشاف</div><div class="infoCard"><b>${gain>=0?'+':''}${gain} دينار</b>صافي اليوم</div>`;
    $('#dayMessage').innerHTML=`الرصيد الحالي: <b>${salary} دينار</b><br>سألت <b>${dayQuestions}</b> سؤال، وفحصت <b>${dayDocsInspected}</b> مستند، وسجلت <b>${dayNotes}</b> ملاحظة.<br><br>اليوم الياي ممكن يدخلون حالات أغرب وتعاميم جديدة.`;
    $('#nextDayBtn').dataset.stage='intake';show('dayEndScreen');
  };

  $('#nextDayBtn').onclick=()=>{day++;save();startIntakeDay()};
  $('#dayBackTitleBtn').onclick=()=>{day++;save();updateTitle();show('titleScreen')};

  showBriefAndStart=function(){
    $('#briefTitle').textContent='تعميم الاستقبال — لا تعتمد على كلام المراجع بروحه';
    $('#briefContent').innerHTML=`<div class="grid3"><div class="infoCard"><b>1. اسمع واسأل</b>عندك 3 أسئلة لكل مراجع. كلامه ممكن يساعدك أو يضيعك.</div><div class="infoCard"><b>2. استلم ودقق</b>افتح المستندات بنفسك، واستخدم الكمبيوتر والتعاميم والملاحظات عند الحاجة.</div><div class="infoCard"><b>3. صنّف وقرر</b>حدد نوع المعاملة أول. إذا كاملة اعتمد ووجّه. إذا ناقصة ارفض بالسبب الدقيق.</div></div><p style="line-height:1.9;margin-top:14px"><b>قاعدة مهمة:</b> الغريب مو معناته مرفوض. ممكن الميت معاملته سليمة، وممكن الشخص الطبيعي يكون ملفه غلط.<br><br><b>الرصيد:</b> تبدأ بـ100 دينار. القرار الصح +5، الغلط -10، وإذا مشيت واسطة وانمسكت -50.</p>`;
    show('briefScreen');
  };
  $('#briefGoBtn').onclick=()=>startIntakeDay();
  $('#startCareerBtn').onclick=()=>showBriefAndStart();

  injectUI();updateTitle();updateBars();save();
})();
