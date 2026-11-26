/* ---------- 연습 모드 + 코치 마크 ---------- */
{
const PR=ROOM.startsWith('p-');
const BASE=location.origin+location.pathname.replace(/ops(\.html)?$/,'');
const partUrl=BASE+'?room='+encodeURIComponent(ROOM);
const css=`#cm-hole{position:fixed;z-index:9000;border-radius:10px;box-shadow:0 0 0 9999px rgba(10,16,28,.55);pointer-events:none;transition:all .2s;outline:3px solid #ffd54a}
#cm-tip{position:fixed;z-index:9002;width:min(360px,calc(100vw - 24px));background:#fff;color:#18202e;border-radius:14px;padding:16px 16px 12px;box-shadow:0 12px 32px rgba(0,0,0,.3);font:15px/1.55 "Noto Sans KR",system-ui,sans-serif}
#cm-tip .k{font-size:12px;font-weight:700;color:#2350a8;margin:0 0 4px}
#cm-tip h3{margin:0 0 6px;font-size:18px;letter-spacing:-.01em}
#cm-tip p{margin:0 0 8px}
#cm-tip .do{background:#fff6d6;border-radius:8px;padding:8px 10px;font-weight:700;margin:6px 0 8px}
#cm-tip .ok{color:#1f7a4d;font-weight:700}
#cm-tip .row{display:flex;gap:6px;justify-content:flex-end;align-items:center;margin-top:6px}
#cm-tip .row .sp{margin-right:auto;font-size:12px;color:#7a8190}
#cm-tip button{border:1px solid #dde2e8;background:#fff;border-radius:10px;padding:7px 12px;font:inherit;font-size:14px;cursor:pointer;min-height:36px}
#cm-tip button.pri{background:#2350a8;border-color:#2350a8;color:#fff}
#cm-tip button:disabled{opacity:.4;cursor:default}
#cm-tip .qr{display:flex;gap:12px;align-items:center;margin:8px 0}
#cm-tip .qr div{background:#fff;line-height:0}
#cm-tip .qr img,#cm-tip .qr canvas{width:120px!important;height:120px!important}
#cm-tip a{color:#2350a8;word-break:break-all;font-size:13px}
#cm-bar{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:9003;background:#7a3cc2;color:#fff;border-radius:999px;padding:6px 8px 6px 16px;display:flex;gap:10px;align-items:center;font:700 13px system-ui;box-shadow:0 6px 18px rgba(0,0,0,.25);white-space:nowrap}
#cm-bar button{border:0;border-radius:999px;padding:6px 12px;font:700 13px system-ui;cursor:pointer;background:#fff;color:#7a3cc2}
#cm-bar button.g{background:rgba(255,255,255,.2);color:#fff}
.cm-start{border:1px solid #7a3cc2!important;color:#7a3cc2!important;background:#fff!important;font-weight:700}
.cm-start:hover{background:#f4eefc!important}
#cm-log{position:fixed;inset:0;z-index:9500;background:rgba(10,16,28,.45);display:flex;align-items:flex-start;justify-content:center;padding:60px 12px}
#cm-log .cm-lg{background:#fff;border-radius:14px;padding:16px;width:min(820px,100%);max-height:calc(100vh - 120px);overflow:auto;font:14px/1.5 system-ui,sans-serif;color:#18202e}
#cm-log table{width:100%;border-collapse:collapse}#cm-log th,#cm-log td{text-align:left;padding:7px 8px;border-bottom:1px solid #eceff3;white-space:nowrap}#cm-log th{font-size:12px;color:#7a8190;font-weight:700}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');

/* ---- 실제 운영 화면: 연습 버튼 ---- */
if(!PR){
  try{sb.rpc('ut_cleanup').then(()=>{},()=>{})}catch(e){}
  const go=()=>{const r='p-'+Math.random().toString(36).slice(2,8);location.href=location.pathname+'?room='+r};
  const b=document.createElement('button');b.className='btn cm-start';b.textContent='연습하기';b.title='실제 UT 데이터와 상관없는 연습창을 열어요';b.onclick=go;
  const sw=document.getElementById('swop');sw.parentNode.insertBefore(b,sw);
  const lg=document.getElementById('login');
  if(lg){const p=document.createElement('div');p.style.cssText='margin:0 0 16px;padding:12px 14px;border-radius:12px;background:#f4eefc;color:#4b2580;font-size:14px';
    p.innerHTML='처음이면 먼저 <b>연습하기</b>로 흐름을 직접 해 보세요. 연습은 실제 UT 데이터와 섞이지 않고, 끝내면 연습 내용은 사라져요. <button class="btn cm-start" style="margin-left:6px;min-height:34px;padding:4px 12px">연습하기</button>';
    p.querySelector('button').onclick=go;lg.insertBefore(p,lg.querySelector('label'))}
}


/* ---- 연습창 ---- */
if(PR){
  // 실제 운영에서 쓰던 입장 정보는 잠시 보관했다가 연습을 끝내면 되돌림
  try{if(sessionStorage.getItem('cm_prev')===null)sessionStorage.setItem('cm_prev',localStorage.getItem('ut_op')??'__none__');localStorage.removeItem('ut_op')}catch(e){}
  const restore=()=>{try{const v=sessionStorage.getItem('cm_prev');if(v!==null){if(v==='__none__')localStorage.removeItem('ut_op');else localStorage.setItem('ut_op',v)}sessionStorage.removeItem('cm_prev')}catch(e){}};
  const drop=()=>{try{fetch(`${UT_CONFIG.url}/rest/v1/rpc/ut_drop_room`,{method:'POST',keepalive:true,headers:{apikey:UT_CONFIG.key,Authorization:`Bearer ${UT_CONFIG.key}`,'Content-Type':'application/json'},body:JSON.stringify({r:ROOM})})}catch(e){}};
  let leaving=false;
  // 연습 기록(누가 · 언제 · 어디까지) — 연습 데이터와 따로 남음
  const plog=o=>{try{sb.rpc('ut_plog',Object.assign({r:ROOM,o:S.op||null,ro:S.role||null,s:typeof i==='number'?i:0,j:!!(S.ready&&joined().length)},o||{})).then(()=>{},()=>{})}catch(e){}};
  const plogKeep=o=>{try{fetch(`${UT_CONFIG.url}/rest/v1/rpc/ut_plog`,{method:'POST',keepalive:true,headers:{apikey:UT_CONFIG.key,Authorization:`Bearer ${UT_CONFIG.key}`,'Content-Type':'application/json'},body:JSON.stringify(Object.assign({r:ROOM,o:S.op||null,ro:S.role||null,s:typeof i==='number'?i:0,j:!!(S.ready&&joined().length)},o||{}))})}catch(e){}};
  const exit=fin=>{leaving=true;plogKeep({e:true,fin:fin===true});drop();restore();setTimeout(()=>{location.href=location.pathname},300)};
  addEventListener('pagehide',()=>{if(!leaving){plogKeep({e:true});drop();restore()}});
  let plSig='';setInterval(()=>{if(S.ready)plog()},60000);
  // net.js 의 연습방 배지는 코치 바로 대체
  setTimeout(()=>{[...document.body.children].forEach(e=>{if(e.textContent&&e.textContent.startsWith('연습방 ·')&&e.id!=='cm-bar')e.remove()})},50);

  const bar=document.createElement('div');bar.id='cm-bar';
  bar.innerHTML='<span>연습 중 · 실제 UT 데이터와 분리</span><button class="g" id="cm-again">설명 다시 보기</button><button id="cm-exit">연습 끝내기</button>';
  document.body.appendChild(bar);
  bar.querySelector('#cm-exit').onclick=()=>exit(false);

  const hole=document.createElement('div');hole.id='cm-hole';
  const tip=document.createElement('div');tip.id='cm-tip';tip.setAttribute('role','dialog');
  document.body.append(hole,tip);

  const F={};document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-pv],#copy,[data-ans-edit],.otab');if(!t)return;if(t.dataset.pv)F['pv'+t.dataset.pv]=1;if(t.id==='copy')F.copy=1},true);
  const startCur=()=>S.cur;let cur0=null;
  const q1=()=>joined().some(p=>{const a=p.ans.q1;return a&&a.v!=null});
  const notes=()=>Object.values(R().notes).some(o=>Object.keys(o||{}).length);
  const asks=()=>R().asks.length>0;
  const answered=()=>R().asks.some(a=>a.ans);
  const misDone=()=>joined().some(p=>p.ans['q'+MQ]&&p.ans['q'+MQ].v);
  const firstMemo=()=>[...document.querySelectorAll('#opbody td.tdk')].find(t=>(t.dataset.key||'').startsWith('q:1:'));
  const askBtn=()=>{const t=firstMemo();return t&&t.querySelector('[data-ask]')};
  const ansBtn=()=>document.querySelector('#opbody [data-ans],#status [data-ans]');
  const firstAns=()=>[...document.querySelectorAll('#opbody td.ans')].find(t=>!t.querySelector('.empty'));

  const STEPS_C=[
   {k:'시작',t:'연습창에 들어왔어요',p:'여기서는 실제처럼 마음껏 눌러도 돼요. 실제 UT 데이터와 완전히 분리돼 있고, <b>연습 끝내기</b>를 누르면 연습 내용은 모두 사라져요.<br>노트북은 운영진, 폰은 참가자 역할이에요.'},
   {k:'운영진 입장',t:'먼저 운영진으로 입장해요',el:()=>document.getElementById('login'),p:'연습에서는 모든 기능을 써 봐야 해서 역할이 <b>진행</b>으로 골라져 있어요.',do:'이름을 적고 <b>입장하기</b>',done:()=>!!S.op&&S.role==='진행',hint:()=>S.op&&S.role!=='진행'?'연습에서는 단계를 직접 넘겨 봐야 해서 <b>진행</b>으로 들어와야 해요. 위쪽 운영진 바꾸기로 다시 입장해 주세요.':''},
   {k:'참가자 입장',t:'폰으로 참가자가 되어 들어와요',el:()=>document.querySelector('.stat'),qr:true,do:'폰 카메라로 QR을 찍어 이름 · 파트를 넣고 입장하기',done:()=>joined().length>0,skip:'폰이 없으면 이 노트북 새 탭으로',skipAct:()=>window.open(partUrl,'_blank')},
   {k:'참가자 현황',t:'참가자가 들어오면 여기에 떠요',el:()=>document.querySelector('.stat'),p:'이름 옆에 지금 어느 단계에 있는지, 답을 몇 개 했는지가 보여요. 빨간색이면 진행 단계와 다른 곳에 있다는 뜻이에요.'},
   {k:'단계 넘기기',t:'단계를 넘기면 폰 화면도 같이 넘어가요',el:()=>document.querySelector('#steps [data-s="1"]'),do:'<b>1. 평소 행동</b> 버튼 누르기',done:()=>R().step===1,after:'폰 화면이 질문으로 바뀌었는지 보세요'},
   {k:'미리보기',t:'참가자 화면은 여기서도 보여요',el:()=>document.querySelector('.pvwrap'),p:'지금 참가자 폰에 뜬 화면이에요. 다음에 나올 화면을 미리 볼 수도 있어요.',do:'<b>›</b> 를 눌러 다음 단계 화면을 보고, <b>현재 단계로</b>를 눌러 돌아오기',done:()=>F['pv1']&&F['pvcur']},
   {k:'답 받기',t:'폰에서 답하면 결과표에 바로 들어와요',el:()=>document.querySelector('#opbody .rt')||document.getElementById('opbody'),do:'폰에서 Q1 선택지를 고르고, 아래 칸에 아무 말이나 적기',done:q1},
   {k:'참가자 답',t:'방금 적은 답이 떴어요',el:firstAns,p:'제출 버튼 없이 적는 대로 실시간으로 들어와요.',do:'폰에서 Q1 선택지를 다른 걸로 바꿔 보고 여기도 바뀌는지 보기',done:()=>{const p=joined().find(p=>p.ans.q1&&p.ans.q1.v!=null);if(!p)return false;const v=JSON.stringify(p.ans.q1.v);if(window.__cmV===undefined)window.__cmV=v;return v!==window.__cmV}},
   {k:'메모',t:'관찰한 걸 메모해 봐요',el:firstMemo,do:'노란 칸(Q1 메모 · 질문)을 누르고 아래 입력칸에 적은 뒤 Enter',done:notes},
   {k:'추가 질문',t:'더 물어볼 게 있으면 질문을 남겨요',el:askBtn,do:'<b>질문</b> 버튼을 누르고, 물어볼 말을 적은 뒤 Enter',done:asks,after:'다른 운영진 화면에도 \'남은 질문\'으로 떠요'},
   {k:'답변',t:'참가자 답을 들으면 답변을 달아요',el:ansBtn,do:'빨간 <b>답변</b> 버튼을 누르고, 들은 답을 적은 뒤 Enter',done:answered},
   {k:'자유 사용',t:'2단계에서는 진행용 타이머를 써요',el:()=>R().step===2?document.getElementById('mctl'):document.querySelector('#steps [data-s="2"]'),do:'<b>2. 서비스 자유 사용</b>으로 넘기고 <b>시작</b> 누르기',done:()=>R().step===2&&R().fRun!=null,after:'타이머는 진행 참고용이라 결과에 남지 않아요. 폰에서 시안 화면을 눌러 보면 결과표 \'누른 순서\'에 쌓여요'},
   {k:'색깔 미션',t:'미션 시간은 진행자가 시작해요',el:()=>R().step===8?document.getElementById('mctl'):document.querySelector('#steps [data-s="8"]'),do:'<b>8. 색깔 미션</b>으로 넘기고 <b>미션 시간 시작</b> → 폰에서 \'카메라로 찍었어요\' 누르기',done:misDone,after:'결과표에 걸린 시간이 초 단위로 기록돼요'},
   {k:'요약',t:'선택형 답은 요약에서 한눈에',el:()=>document.querySelector('.otab[data-tab="sum"]'),do:'<b>요약</b> 탭 누르기',done:()=>S.tab==='sum'},
   {k:'정리',t:'UT가 끝나면 노션용 복사',el:()=>{if(S.tab!=='res')return document.querySelector('.otab[data-tab="res"]');return document.getElementById('copy')},p:'회차 결과표가 표로 복사돼서 회의 문서에 그대로 붙여 넣으면 돼요.',do:'<b>결과표</b> 탭에서 <b>노션용 복사</b> 누르기',done:()=>!!F.copy},
   {k:'새 회차',t:'회차가 끝나면 새 회차',el:()=>document.getElementById('newr'),p:'진행자만 보이는 버튼이에요. 실수 방지로 두 번 눌러야 시작되고, 이전 회차 결과는 그대로 남아요.',do:'<b>새 회차 시작</b>을 두 번 눌러 2회차 만들기 (연습이라 괜찮아요)',done:()=>{if(cur0===null)cur0=S.cur;return S.cur>cur0},after:'참가자 폰도 새 회차 처음 화면으로 돌아가요'},
   {k:'역할 차이',t:'기록 역할은 여기까지만 달라요',el:()=>document.getElementById('steps'),p:'지금은 <b>진행</b>으로 모든 기능을 써 봤어요. 실제 UT에서 <b>기록</b>으로 들어오면:<br>· 단계 버튼, 자유 사용 타이머, 미션 시간, 새 회차 시작은 <b>누를 수 없고 보기만</b> 돼요. 화면은 진행자가 넘기는 대로 같이 넘어가요.<br>· 메모, 질문, 답변, 요약, 노션용 복사는 <b>진행과 똑같이</b> 쓸 수 있어요.<br>· <b>리뷰</b>는 UT가 끝난 뒤 결과표를 보며 메모만 남기는 역할이에요.'},
   {k:'끝',t:'연습 끝!',p:'이제 실제 UT에서도 똑같이 하면 돼요. <b>연습 끝내기</b>를 누르면 연습 내용이 지워지고 실제 운영 화면으로 돌아가요.<br>참가자 폰도 실제 UT 링크(QR)로 다시 들어오면 돼요.',end:true}
  ];
  let i=0;try{i=Number(sessionStorage.getItem('cm_i@'+ROOM))||0}catch(e){}
  let hidden=false,lastEl=null;
  const setI=n=>{i=Math.max(0,Math.min(STEPS_C.length-1,n));try{sessionStorage.setItem('cm_i@'+ROOM,i)}catch(e){}lastEl=null;draw(true)};
  bar.querySelector('#cm-again').onclick=()=>{hidden=false;draw(true)};
  function place(el){
    const vw=innerWidth,vh=innerHeight;let r=el?el.getBoundingClientRect():null;
    if(r&&(r.width<2||r.height<2))r=null;
    if(r){const pad=6;Object.assign(hole.style,{display:'block',left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+pad*2)+'px',height:(r.height+pad*2)+'px'})}
    else Object.assign(hole.style,{display:'block',left:(vw/2)+'px',top:(vh/2)+'px',width:'0px',height:'0px'});
    const tw=tip.offsetWidth,th=tip.offsetHeight;let x,y;
    if(r){x=Math.min(Math.max(12,r.left),vw-tw-12);y=r.bottom+14;if(y+th>vh-60){y=r.top-th-14;if(y<12){y=Math.max(12,Math.min(vh-th-60,r.top+12));x=r.right+14+tw<vw?r.right+14:Math.max(12,r.left-tw-14)}}}
    else{x=(vw-tw)/2;y=(vh-th)/2}
    tip.style.left=x+'px';tip.style.top=y+'px';
  }
  function draw(force){
    const s=STEPS_C[i];
    if(hidden){hole.style.display='none';tip.style.display='none';return}
    tip.style.display='block';
    const ok=s.done?s.done():true;
    const html=`<p class="k">${i}/${STEPS_C.length-1} · ${s.k}</p><h3>${s.t}</h3>${s.p?`<p>${s.p}</p>`:''}${s.qr?`<div class="qr"><div id="cm-qr"></div><div><a href="${partUrl}" target="_blank" rel="noopener">${decodeURI(partUrl)}</a></div></div>`:''}${s.do?(ok?`<p class="ok">✓ 잘했어요${s.after?' · '+s.after:''}</p>`:`<p class="do">해 보기 · ${s.do}</p>${s.hint&&s.hint()?`<p>${s.hint()}</p>`:''}`):''}
     <div class="row"><span class="sp">${s.skip&&!ok?`<button id="cm-skip">${s.skip}</button>`:''}</span>${i>0?'<button id="cm-prev">이전</button>':''}<button id="cm-hide">잠깐 닫기</button>${s.end?'<button class="pri" id="cm-end">연습 끝내기</button>':`<button class="pri" id="cm-next" ${ok?'':'disabled'}>${s.do&&!ok?'해 보면 넘어가요':'다음'}</button>`}</div>`;
    if(force||tip.dataset.h!==html){tip.innerHTML=html;tip.dataset.h=html;
      if(s.qr&&window.QRCode){try{new QRCode(document.getElementById('cm-qr'),{text:partUrl,width:240,height:240,correctLevel:QRCode.CorrectLevel.M})}catch(e){}}
      const b=id=>tip.querySelector('#'+id);
      b('cm-next')&&(b('cm-next').onclick=()=>setI(i+1));b('cm-prev')&&(b('cm-prev').onclick=()=>setI(i-1));
      b('cm-hide').onclick=()=>{hidden=true;draw()};b('cm-end')&&(b('cm-end').onclick=()=>exit(true));b('cm-skip')&&(b('cm-skip').onclick=s.skipAct)}
    const el=s.el?s.el():null;
    if(el&&el!==lastEl){lastEl=el;try{el.scrollIntoView({block:'nearest',inline:'nearest'})}catch(e){}}
    place(el);
  }
  const tick=()=>{if(!S.ready){setTimeout(tick,300);return}
    if(S.op==null&&L_.role!=='진행'){L_.role='진행';renderLogin()}
    const s=STEPS_C[i];if(s.k==='운영진 입장'&&S.op&&S.role==='진행'&&i===1){/* auto next after login */setI(2)}
    const sig=[S.op,S.role,i,joined().length>0].join('|');if(sig!==plSig){plSig=sig;plog()}
    draw(false)};
  setInterval(tick,400);addEventListener('resize',()=>draw(false));
}
}
