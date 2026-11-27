let OFF=0;const now=()=>Date.now()+OFF;

const CARDS=['귤도 시기가 있다','우리 동네 엉뚱한 트리','천 원 스케이트','겨울잠 30분','팥붕 vs 슈붕','별똥별 많은 밤','내 물건 겨울 옷','오늘의 포근한 촉감','귤껍질 차','하루 한 문장 연말 문답','겨울에 볼·들을 것 하나','실내 겨울 아지트','고마운 사람에게 한 줄','눈으로 장미 만들기','동지는 작은 설'];
const IDEAS=['친구 단지','연속 기록','계절 스탬프','다양한 반응','계절 돌아보기','따라 해 봤어요 알림'];
const PARTS=['기획','디자인','프론트','백엔드'];
let OPS=[];
const opName=b=>b||'?';
const lead=()=>ROLE()==='진행';
const STEPS=[
 {t:'입장',show:'',qs:[]},
 {t:'평소 행동',show:'',qs:[
  {q:'지난 일주일 동안 찍은 사진을 어딘가에 올리거나 보낸 적 있어요?',type:'single',opts:['0번','1~2번','3번 이상'],note:'어디에'},
  {q:'기록 · 습관 앱(스티커 · 연속 기록 같은 것 포함)을 써 본 적 있어요?',type:'single',opts:['지금도 씀','써 봤다 그만둠','써 본 적 없음'],note:'어떤 앱, 그 이유'},
  {q:'올해 가을 · 겨울에 계절 때문에 일부러 한 일이 있어요?',type:'single',opts:['없음','1~2개','3개 이상'],note:'무엇을, 왜 했는지'},
  {q:"요즘 '이번 주에 뭐 하지'는 주로 어디서 찾아요? (2개까지)",more:true,type:'multi',max:2,opts:['인스타','유튜브','네이버 · 지도','친구 · 지인','잘 안 찾아요'],note:'어떻게 찾는지, 그 이유'}]},
 {t:'서비스 자유 사용',proto:'free',show:'',qs:[]},
 {t:'첫인상',show:'',qs:[
  {q:'써 보니 어떤 앱 같고, 누구한테 좋을 것 같아요?',type:'text'}]},
 {t:'추천 카드',show:'추천 카드 15장 (5×3 배치)',qs:[
  {q:'실제로 해 볼 것 같은 카드 2개',more:true,type:'multi',max:2,opts:CARDS,grid:5,note:'고른 이유'},
  {q:'별로인 카드 1개',more:true,type:'single',opts:CARDS,grid:5,note:'이유'},
  {q:'고른 카드를 실제로 하려면 무엇이 더 있어야 할 것 같아요? (2개까지)',type:'multi',max:2,opts:['방법 · 순서','장소 · 위치','비용 · 걸리는 시간','다른 사람 후기 · 사진','같이 할 사람','지금도 충분해요','기타'],more:true,note:'이유, 기타 내용'}]},
 {t:'피드 구성',show:'추천 콘텐츠 · 사람들 사진 배치 5안',qs:[
  {q:'추천 콘텐츠와 사람들 사진이 어떻게 놓이면 제일 잘 볼 것 같아요?',more:true,type:'single',opts:['탭 분리','위에 캐러셀','피드 사이에 섞기','피드 사이 배너','활동 눌러서 보기'],grid:5,kw:true,note:'이유'}]},
 {t:'추천 받는 방식',show:'추천 운영 방식 3안',qs:[
  {q:'어떤 운영 방식이면 실제로 하나라도 해 볼 것 같아요?',more:true,type:'single',opts:['매일 바뀌는 추천','일주일 묶음','묶음 + 오늘의 하나'],grid:3,kw:true,note:'이유'},
  {q:'새 추천이 나온 걸 어떻게 알게 되면 좋겠어요?',type:'single',opts:['토스 알림','앱에 들어왔을 때만','인스타 · 카톡 같은 다른 채널','알려 주는 건 귀찮아요'],note:'이유'}]},
 {t:'다시 올 이유',show:'보상 3안 → 다시 오게 할 안 6개',qs:[
  {q:'보상 3안 중 다음 주 미션을 하고 싶게 만드는 것은?',more:true,type:'single',opts:['색깔 스티커','색깔 + 활동 스티커','보상 없이 사진만'],grid:3,kw:true,note:'이유'},
  {q:'있으면 다시 들어올 것 같은 것 1개',more:true,type:'single',opts:IDEAS,grid:3,kw:true,note:'이유'},
  {q:'있어도 다시 들어올 이유는 안 될 것 같은 것 1개',more:true,type:'single',opts:IDEAS,grid:3,kw:true,note:'이유'}]},
 {t:'색깔 미션',show:'',qs:[
  {q:'이번 주 색은 흰색이에요. 흰색을 찾아 폰 카메라로 찍거나 갤러리에서 찾아 보세요.',type:'mission',opts:['카메라로 찍었어요','갤러리에서 찾았어요','못 찾았어요']},
  {q:'찾은 사진, 다른 사람에게 보여 줄 수 있어요?',help:'보여 줄 수 있다면 진행자에게 보여 주세요',type:'single',opts:['폰으로 보여 줬어요','말로 설명할게요','찾은 사진이 없어요'],noteBy:[null,'어떤 사진인지',null]},
  {q:'다른 사람 사진을 보니 어땠어요?',type:'text'}]},
 {t:'마지막 한마디',show:'',qs:[
  {q:'이 앱을 계속 쓸 것 같아요?',type:'single',opts:['계속 쓸 것 같아요','모르겠어요','안 쓸 것 같아요'],noteBy:['왜 계속 쓸 것 같은지','왜 그런지','왜 안 쓸 것 같은지']},
  {q:'써 보면서 아쉬웠던 점이나 하고 싶은 말',type:'text'}]},
 {t:'끝',show:'',qs:[]}
];
{let n=1;STEPS.forEach(s=>s.qs.forEach(q=>{q.id=n++}))}
const QS=STEPS.flatMap(s=>s.qs);
const qr=s=>!s.qs.length?'':s.qs.length===1?` · Q${s.qs[0].id}`:` · Q${s.qs[0].id}~${s.qs[s.qs.length-1].id}`;
const MQ=QS.find(q=>q.type==='mission').id,SQ=MQ+1;
const LAST=STEPS.length-1;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hm=t=>new Date(t).toTimeString().slice(0,5);
const person=(o={})=>Object.assign({id:null,joined:false,name:'',part:'',ans:{},draft:{},staps:[],manual:false,pstep:0,taps:[],tab:'today'},o);
const newRound=n=>({n,step:0,stepAt:now(),mAcc:0,mRun:null,fAcc:0,fRun:null,people:[],notes:{},asks:[]});
const S={open:{},closed:new Set(),mode:null,key:null,aid:null,rn:null,op:null,role:null,cur:1,rounds:{1:newRound(1)},tab:'res',view:'1',arm:false,ready:false};
const R=()=>S.rounds[S.cur];
const P=()=>MODE==='part'?(S.mine||S.tmp):null;
const joined=()=>R().people.filter(p=>p.joined);
const eff=p=>{const r=S.rounds[p.round]||R();return p.manual?p.pstep:r.step};
const qdef=id=>QS.find(q=>q.id===id);
const fmt=(q,a)=>{
  if(!a)return '';
  if(q.type==='text')return a.t||'';
  if(q.type==='mission')return a.v==null?'':q.opts[a.v.how]+(a.v.how<2?(a.v.sec==null?' · 시간 미측정':` · ${a.v.sec}초`):'');
  const lab=i=>(q.num||q.grid)?`${i+1}. ${q.opts[i]}`:q.opts[i];
  let s=q.type==='multi'?(a.v||[]).map(lab).join(', '):(a.v==null?'':lab(a.v));
  if(a.t)s+=(s?' · ':'')+a.t;
  return s;
};
const pname=(r,pid)=>{const p=r.people.find(x=>x.id===pid);return p?p.name:'?'};

/* ---------- phone ---------- */
const scr=document.getElementById('scr')||document.createElement('div');
const qHTML=(p,q)=>{
  const a=p.draft['q'+q.id]||{};
  let body='';
  if(q.type==='text')body=`<textarea data-a="${q.id}" data-k="t" placeholder="자유롭게 적어 주세요">${esc(a.t)}</textarea>`;
  else if(q.type==='mission'){
    body=`<div class="chips">${q.opts.map((o,i)=>`<button class="chip ${a.v&&a.v.how===i?'on':''}" data-mis="${i}">${o}</button>`).join('')}</div><p class="small" style="margin:8px 0 0">진행자 안내에 따라 시작해요. 다 하면 이 화면으로 돌아와 어떻게 했는지 눌러 주세요. 사진은 올리지 않아요.</p>`;
  }else{
    const on=i=>q.type==='multi'?(a.v||[]).includes(i):a.v===i;
    body=q.grid?`<div class="gpick" style="grid-template-columns:repeat(${q.grid},1fr)">${q.opts.map((o,i)=>`<button class="gb ${on(i)?'on':''}" data-pick="${q.id}:${i}" aria-label="${i+1}번 ${esc(o)}">${i+1}${q.kw?`<small>${esc(o)}</small>`:''}</button>`).join('')}</div>`
      :`<div class="chips">${q.opts.map((o,i)=>`<button class="chip ${on(i)?'on':''}" data-pick="${q.id}:${i}">${q.num?(i+1)+'. ':''}${esc(o)}</button>`).join('')}</div>`;
    if(q.more)body+=`<p class="small" style="margin:2px 0 0">더 고르고 싶은 건 아래 칸에 같이 적어 주세요</p>`;
    {const ph=q.noteIf?((q.type==='multi'?(a.v||[]).includes(q.noteIf[0]):a.v===q.noteIf[0])?q.noteIf[1]:null):q.noteBy?(a.v==null?null:q.noteBy[a.v]):q.note;if(ph)body+=`<input class="note" data-a="${q.id}" data-k="t" value="${esc(a.t)}" placeholder="${esc(ph)}">`;}
  }
  return `<div class="qc"><div class="qt"><span class="qn">Q${q.id}</span>${esc(q.q)}</div>${q.help?`<p class="small" style="margin:0 0 8px">${esc(q.help)}</p>`:''}${body}</div>`;
};
const stepScreen=(p,e)=>{
  const s=STEPS[e];let head='',body='';
  head=`<div class="shead"><span class="small">${esc(p.name)} · ${esc(p.part)}</span><b>${e===0?'입장 완료':esc(s.t)}</b><div class="dots">${STEPS.slice(1).map((_,i)=>`<i class="${i<e?'d':''}"></i>`).join('')}</div></div>`;
  if(e===0)body=`<div class="big">곧 시작해요</div><p>진행자가 시작하면 화면이 자동으로 넘어가요.</p>`;
  else if(e===LAST)body=`<div class="big">참여해 주셔서<br>고마워요</div><p>다음 팀으로 이동해 주세요.</p>`;
  else{
    if(s.show)body+=`<div class="info">진행자가 보여 주는 <b>${esc(s.show)}</b>을(를) 보며 답해 주세요.</div>`;
    if(s.proto==='free')body+=`<div class="info">${esc(UT_PROTO.guide||'처음 들어왔다고 생각하고 마음대로 써 보세요.')}</div>`+UT_PROTO.render(p,{preview:p===PVP,esc});
    body+=s.qs.map(q=>qHTML(p,q)).join('');
  }
  return [head,body];
};
const renderPhone=()=>{
  if(MODE!=='part')return;
  const p=P(),r=S.mine?S.rounds[S.mine.round]||R():R();
  {const o=UT_PROTO.openFor?UT_PROTO.openFor():null;if(o!=null&&(!S.mine||o!==p.id||STEPS[eff(p)].proto!=='free')){UT_PROTO.close(false);return}}
  let head='',body='',foot='';
  const bar=`<div class="sbar"><span>${hm(now())}</span><span>${r.n}회차</span></div>`;
  if(!p.joined){
    body=`<div class="big">사계단지 UT에<br>오신 걸 환영해요</div><p class="small">답변은 사계단지 팀의 서비스 개선에만 쓰고, 외부에 공유하지 않아요.</p>
    <label class="field" for="jn">이름</label><input class="inp" id="jn" value="${esc(p.name)}" placeholder="이름" autocomplete="off">
    <span class="field">파트</span><div class="chips">${PARTS.map(x=>`<button class="chip ${p.part===x?'on':''}" data-part="${x}">${x}</button>`).join('')}</div>
    <button class="go" id="join" ${p.name.trim()&&p.part&&!S.joining?'':'disabled'}>${S.joining?'입장 중…':'입장하기'}</button>${S.joinErr?`<p class="small" style="color:#d9432a;margin-top:8px">${esc(S.joinErr)}</p>`:''}`;
    scr.innerHTML=bar+`<div class="sbody">${body}</div>`;return;
  }
  const e=eff(p),s=STEPS[e];
  [head,body]=stepScreen(p,e);
  if(p.manual&&p.pstep!==r.step)foot+=`<div class="sync">진행자는 '${esc(STEPS[r.step].t)}' 진행 중<button data-follow>따라가기</button></div>`;
  if(s.qs.length||s.proto==='free'){foot+=`<p class="small" style="margin:0 0 6px;text-align:center">답은 적는 대로 바로 전달돼요</p>`}
  foot+=`<div class="nav"><button data-nav="-1" ${e<=0?'disabled':''}>‹ 이전</button><button data-nav="1" ${e>=LAST?'disabled':''}>다음 ›</button></div>`;
  const ae=document.activeElement,fk=ae&&scr.contains(ae)&&ae.dataset&&ae.dataset.a?[ae.tagName,ae.dataset.a,ae.selectionStart,ae.selectionEnd]:null;
  const ob=scr.querySelector('.sbody'),keep=ob&&S.lastPE===p.id+':'+e?ob.scrollTop:0;
  scr.innerHTML=bar+head+`<div class="sbody">${body}</div><div class="sfoot">${foot}</div>`;
  const samePE=S.lastPE===p.id+':'+e;S.lastPE=p.id+':'+e;const nb=scr.querySelector('.sbody');if(nb)nb.scrollTop=keep;
  if(fk&&samePE){const el=scr.querySelector(`${fk[0]}[data-a="${fk[1]}"]`);if(el){el.focus({preventScroll:true});try{el.setSelectionRange(fk[2],fk[3])}catch(_){}}}
};
let opT=null;const opSoon=()=>{clearTimeout(opT);opT=setTimeout(renderOp,250)};
const markDirty=(p,k)=>{if(k&&p.draft[k])p.ans[k]=JSON.parse(JSON.stringify(p.draft[k]));if(STEPS[eff(p)].proto==='free')p.staps=[...p.taps];savePerson(p)};
scr.addEventListener('input',ev=>{
  const p=P(),el=ev.target;
  if(el.id==='jn'){p.name=el.value;document.getElementById('join').disabled=!(p.name.trim()&&p.part);return}
  if(!S.mine)return;
  if(el.dataset.a){const k='q'+el.dataset.a;p.draft[k]=Object.assign(p.draft[k]||{},{t:el.value});markDirty(p,k)}
});
scr.addEventListener('click',ev=>{
  const p=P(),b=ev.target.closest('button');if(!b)return;
  if(b.dataset.part){p.part=b.dataset.part;renderPhone();return}
  if(b.id==='join'){joinRound();return}
  if(!S.mine)return;
  if(b.hasAttribute('data-proto-open')){UT_PROTO.open(p,{tap:n=>{p.taps.push({n,at:now()});markDirty(p)},close:()=>renderPhone()});return}
  if(b.dataset.tap&&b.closest('[data-proto]')){p.taps.push({n:b.dataset.tap,at:now()});if(UT_PROTO.onTap)UT_PROTO.onTap(p,b);markDirty(p);renderPhone();return}
    if(b.dataset.pick){
    const [id,i]=b.dataset.pick.split(':').map(Number),q=qdef(id),k='q'+id,a=p.draft[k]=p.draft[k]||{};
    if(q.type==='multi'){a.v=a.v||[];a.v=a.v.includes(i)?a.v.filter(x=>x!==i):a.v.length<q.max?[...a.v,i]:[...a.v.slice(1),i]}
    else a.v=a.v===i?null:i;
    markDirty(p,k);renderPhone();return;
  }
  if(b.dataset.mis){const r=S.rounds[p.round]||R(),i=Number(b.dataset.mis),a=p.draft['q'+MQ]=p.draft['q'+MQ]||{};
    a.v=a.v&&a.v.how===i?null:{how:i,sec:mOn(r)?Math.round(mEl(r)/1000):null};
    p.ans['q'+MQ]=JSON.parse(JSON.stringify(a));savePerson(p);
    renderPhone();return}
  if(b.dataset.nav){p.pstep=Math.max(0,Math.min(LAST,eff(p)+Number(b.dataset.nav)));p.manual=true;savePerson(p);renderPhone();return}
  if(b.hasAttribute('data-follow')){p.manual=false;savePerson(p);renderPhone()}
});
const clock=t=>{const s=Math.max(0,Math.round(t/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const mOn=r=>r.mRun!=null||r.mAcc>0;
const mEl=r=>(r.mAcc||0)+(r.mRun!=null?now()-r.mRun:0);
setInterval(()=>{if(MODE!=='ops')return;const m=document.getElementById('mclock'),f=document.getElementById('fclock'),r=R();if(m&&r.mRun!=null)m.textContent=clock(mEl(r));if(f&&r.fRun!=null)f.textContent=clock(fEl(r))},1000);
const fEl=r=>(r.fAcc||0)+(r.fRun!=null?now()-r.fRun:0);

/* ---------- operator ---------- */
const ROLE=()=>S.op?S.role:null;
const canAsk=()=>ROLE()==='진행'||ROLE()==='기록';
const opbody=document.getElementById('opbody')||document.createElement('div');
const on$=(id,ev,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener(ev,fn)};
const setStep=n=>{if(!lead())return;const r=R();S.pv=null;r.step=Math.max(0,Math.min(LAST,n));r.stepAt=now();saveRound(r);renderAll()};
on$('mctl','click',ev=>{const b=ev.target.closest('button');if(!b||!lead())return;
  const r=R();
  if(b.id==='fstart'||b.id==='frestart'){r.fAcc=0;r.fRun=now();saveRound(r);renderOp();return}
  if(b.id==='ftoggle'){if(r.fRun!=null){r.fAcc=fEl(r);r.fRun=null}else r.fRun=now();saveRound(r);renderOp();return}
  if(b.id==='mstart'){r.mAcc=0;r.mRun=now();saveRound(r);renderOp();return}
  if(b.id==='mtoggle'){if(r.mRun!=null){r.mAcc=mEl(r);r.mRun=null}else r.mRun=now();saveRound(r);renderOp();return}
  if(b.id==='mrestart'){if(!S.mArm){S.mArm=true;renderOp();setTimeout(()=>{S.mArm=false;renderOp()},3000);return}S.mArm=false;r.mAcc=0;r.mRun=now();saveRound(r);renderOp()}});
on$('steps','click',ev=>{const b=ev.target.closest('[data-s]');if(b)setStep(Number(b.dataset.s))});
document.querySelector('.otabs')?.addEventListener('click',ev=>{const b=ev.target.closest('[data-tab]');if(!b)return;S.tab=b.dataset.tab;document.querySelectorAll('.otab').forEach(x=>x.classList.toggle('on',x===b));renderOp()});
const roundsSel=()=>Object.keys(S.rounds).map(Number).sort((a,b)=>a-b);
const VR=()=>S.rounds[S.view==='all'?S.cur:Number(S.view)]||R();
/* keys: q:<qid>:<pid> | s:<step>:<pid|all> | etc */
const keyLabel=(r,k)=>{if(k==='etc')return `${r.n}회차 기타`;const [t,a,b]=k.split(':');
  if(t==='q'){const st=STEPS.findIndex(s=>s.qs.some(q=>q.id===Number(a)));return `${r.n}회차 · ${st}. ${STEPS[st].t} · ${pname(r,b)} · Q${a}`}
  return `${r.n}회차 · ${a}. ${STEPS[a].t} · ${b==='all'?'단계 전체':pname(r,b)}`};
const notesOf=(r,k)=>Object.entries(r.notes[k]||{}).map(([by,n])=>({by,...n}));
const asksOf=(r,k)=>r.asks.filter(a=>a.key===k);
const cellHTML=(r,k,askLabel='질문')=>{
  const me=S.op,ask=canAsk();
  const ns=notesOf(r,k).map(n=>`<div class="it ${n.by===me?'mine':''}" ${n.by===me?`data-myn="${esc(k)}" title="눌러서 메모 수정"`:''}><span class="ob">${esc(opName(n.by))}</span>${esc(n.txt)}${n.ed?'<span class="lab"> · 수정됨</span>':''}</div>`).join('');
  const as=asksOf(r,k).map(a=>{const mq=a.by===me&&ask,ma=a.ans&&a.ans.by===me&&ask;
    return `<div class="it"><div class="${mq?'mine':''}" ${mq?`data-myq="${a.id}" title="눌러서 질문 수정"`:''}><span class="q">질문</span> ${esc(a.txt)} <span class="lab">${esc(opName(a.by))}${a.ed?' · 수정됨':''}</span></div>${a.ans?`<div class="${ma?'mine':''}" ${ma?`data-mya="${a.id}" title="눌러서 답변 수정"`:''}><span class="a">답변</span> ${esc(a.ans.txt)} <span class="lab">${esc(opName(a.ans.by))}${a.ans.ed?' · 수정됨':''}</span></div>`:ask?`<button class="mb hot" data-ans="${a.id}">답변</button>`:'<span class="w">답변 대기</span>'}</div>`}).join('');
  return `${ns}${as}${ask?`<button class="mb" data-ask="${esc(k)}">${askLabel}</button>`:''}`;
};
const td=(r,k,extra='',lab)=>`<td class="tdk ${S.key===k&&S.mode==='memo'?'sel':''}" data-key="${esc(k)}" ${extra}>${cellHTML(r,k,lab)}</td>`;
const isOpen=(r,i)=>{const o=S.open[r.n]=S.open[r.n]||new Set();return o.has(i)||(r===R()&&i===r.step&&!S.closed.has(r.n+':'+i))};
const resHTML=()=>{
  const r=VR(),cur=r===R(),ppl=r.people.filter(p=>p.joined);
  let h='';
  if(!ppl.length)return h+`<p class="empty">아직 입장한 참가자가 없어요. 참가자가 링크로 들어와 입장하면 여기에 보여요.</p>`;
  const cs=ppl.length+1;
  h+=`<table class="rt"><thead><tr><th>단계 · 질문</th>${ppl.map(p=>`<th>${esc(p.name)} · ${esc(p.part)}</th>`).join('')}</tr></thead><tbody>`;
  STEPS.forEach((s,i)=>{
    if(i===0||i===LAST)return;
    const now=cur&&i===r.step,op=isOpen(r,i),cnt=Object.keys(r.notes).filter(k=>k.startsWith(`s:${i}:`)||s.qs.some(q=>k.startsWith(`q:${q.id}:`))).reduce((n,k)=>n+Object.keys(r.notes[k]).length,0)+r.asks.filter(a=>a.key.startsWith(`s:${i}:`)||s.qs.some(q=>a.key.startsWith(`q:${q.id}:`))).length;
    h+=`<tr class="sth ${now?'now':''}" id="st-${i}"><th colspan="${cs}" class="togg ${op?'open':''}" data-tog="${i}">${i}. ${esc(s.t)}${qr(s)}${now?' · 진행 중':''}${cnt?` <span class="lab" style="color:inherit">· 메모 · 질문 ${cnt}</span>`:''}</th></tr>`;
    if(!op)return;
    if(s.proto==='free')h+=`<tr><td class="lbl">누른 순서</td>${ppl.map(p=>`<td class="ans">${esc(p.staps.map(t=>t.n).join(' → '))}</td>`).join('')}</tr>`;
    s.qs.forEach(q=>{
      h+=`<tr><td><b>Q${q.id}</b> ${esc(q.q)}</td>${ppl.map(p=>`<td class="ans">${esc(fmt(q,p.ans['q'+q.id]))||'<span class="empty">—</span>'}</td>`).join('')}</tr>`;
      h+=`<tr class="qmemo"><td class="lbl">↳ Q${q.id} 메모 · 질문</td>${ppl.map(p=>td(r,`q:${q.id}:${p.id}`)).join('')}</tr>`;
    });
    h+=`<tr class="qask"><td class="tdk ${S.key===`s:${i}:all`&&S.mode==='memo'?'sel':''}" data-key="s:${i}:all"><span class="lbl">↳ 단계 전체</span><br>${cellHTML(r,`s:${i}:all`,'전체 질문')}</td>${ppl.map(p=>td(r,`s:${i}:${p.id}`)).join('')}</tr>`;
  });
  h+=`<tr class="sth"><th colspan="${cs}">회차 기타</th></tr><tr class="qmemo">${td(r,'etc',`colspan="${cs}"`,'기타 질문')}</tr></tbody></table>`;
  return h;
};
const toolsHTML=()=>{
  if(S.tab==='sum')return `<span class="lab">회차</span><button class="mb ${S.view==='all'?'on':''}" data-v="all">전체</button>${roundsSel().map(n=>`<button class="mb ${S.view==n?'on':''}" data-v="${n}">${n}회차</button>`).join('')}`;
  const r=VR(),cur=r===R();
  return `<span class="lab">회차</span>${roundsSel().map(n=>`<button class="mb ${r.n===n?'on':''}" data-v="${n}">${n}회차${n===S.cur?' · 진행 중':''}</button>`).join('')}<span class="lab" style="margin-left:6px">단계</span>${cur?`<button class="mb" data-goto>현재 단계로</button>`:''}<button class="mb" data-all="1">모두 펼치기</button><button class="mb" data-all="0">모두 접기</button><button class="mb" id="copy" style="margin-left:auto">노션용 복사</button>`;
};
const sumHTML=()=>{
  const ns=S.view==='all'?roundsSel():[Number(S.view)];
  const ppl=ns.filter(n=>S.rounds[n]).flatMap(n=>S.rounds[n].people.filter(p=>p.joined).map(p=>({p,n})));
  let h=`<p class="lab">응답자 ${ppl.length}명 기준. 이름 옆 숫자는 회차.</p>`;
  QS.filter(q=>q.type!=='text').forEach(q=>{
    h+=`<div class="sumq"><h3>Q${q.id} ${esc(q.q)}</h3>`;
    if(q.type==='mission'){
      const done=ppl.filter(x=>x.p.ans['q'+MQ]&&x.p.ans['q'+MQ].v),ok=done.filter(x=>x.p.ans['q'+MQ].v.how<2),tm=ok.filter(x=>x.p.ans['q'+MQ].v.sec!=null),avg=tm.length?Math.round(tm.reduce((s,x)=>s+x.p.ans['q'+MQ].v.sec,0)/tm.length):0;
      const how=q.opts.map((o,i)=>`${o} ${done.filter(x=>x.p.ans['q'+MQ].v.how===i).length}`).join(' · ');
      const shown=ppl.filter(x=>x.p.ans['q'+SQ]&&x.p.ans['q'+SQ].v===0).length;
      h+=`<p>${esc(how)}</p><p>성공 <b>${ok.length}/${done.length}</b> · 평균 <b>${avg}초</b> (시간 측정된 ${tm.length}명) · 폰으로 보여 줌(공개) <b>${shown}명</b></p></div>`;return;
    }
    const cnt=q.opts.map((_,i)=>ppl.filter(x=>{const a=x.p.ans['q'+q.id];return a&&(q.type==='multi'?(a.v||[]).includes(i):a.v===i)}));
    const max=Math.max(1,...cnt.map(c=>c.length));
    h+=q.opts.map((o,i)=>`<div class="bar"><span>${(q.num||q.grid)?(i+1)+'. ':''}${esc(o)}</span><i style="width:${cnt[i].length/max*100}%"></i><b>${cnt[i].length}</b>${cnt[i].length?`<span class="nm">${esc(cnt[i].map(x=>x.p.name+' '+x.n).join(', '))}</span>`:''}</div>`).join('')+`</div>`;
  });
  return h;
};
const PVP=person({joined:true,name:'참가자',part:'미리보기'});
const renderPV=()=>{
  if(!document.getElementById('pv'))return;
  const r=R(),pv=S.pv??r.step,away=pv!==r.step,[head,body]=stepScreen(PVP,pv);
  document.getElementById('pvlab').textContent=`${pv}. ${STEPS[pv].t}${away?'':' · 진행 중'}`;
  document.getElementById('pvcur').style.display=away?'':'none';
  document.querySelector('.pvwrap').classList.toggle('away',away);
  document.getElementById('pv').innerHTML=`<div>${head}<div class="sbody" style="overflow:visible">${body}</div></div>`;
};
document.querySelector('.pvbar')?.addEventListener('click',ev=>{const b=ev.target.closest('[data-pv]');if(!b)return;const r=R();
  S.pv=b.dataset.pv==='cur'?null:Math.max(0,Math.min(LAST,(S.pv??r.step)+Number(b.dataset.pv)));if(S.pv===r.step)S.pv=null;renderPV()});
const renderStatus=()=>{
  const r=R(),ppl=joined(),open=Object.values(S.rounds).flatMap(x=>x.asks.filter(a=>!a.ans).map(a=>({a,x})));
  let h=`<div class="stat"><span class="lab">참가자 현황${(STEPS[r.step].qs.length||STEPS[r.step].proto==='free')&&ppl.length?'':''}</span>${ppl.length?ppl.map(p=>{const e=eff(p),inp=STEPS[r.step].qs.length||STEPS[r.step].proto==='free',st=!inp?'':(()=>{const qs=STEPS[r.step].qs;if(!qs.length)return '';const n=qs.filter(q=>{const a=p.ans['q'+q.id];return a&&((a.v!=null&&!(Array.isArray(a.v)&&!a.v.length))||(a.t&&a.t.trim()))}).length;return ` · 답 ${n}/${qs.length}`})();return e===r.step?`<span class="pchip">${esc(p.name)} · 진행 중${st}</span>`:`<span class="pchip off">${esc(p.name)} · ${e}. ${esc(STEPS[e].t)}에 있음</span>`}).join(''):'<span class="lab">아직 입장한 참가자 없음</span>'}</div>`;
  if(open.length)h+=`<div class="oq"><b>남은 질문 ${open.length}</b><ul style="list-style:none;padding:0;margin:4px 0 0">${open.map(({a,x})=>`<li><span class="lab">${esc(keyLabel(x,a.key))}</span><span style="flex:1">${esc(a.txt)} <span class="lab">${esc(opName(a.by))}</span></span>${canAsk()?`<button class="mb hot" data-ans="${a.id}" data-r="${x.n}">답변</button>`:''}</li>`).join('')}</ul></div>`;
  const st=document.getElementById('status');if(st)st.innerHTML=h;
};
/* ---------- input bar ---------- */
const findAsk=id=>{for(const x of Object.values(S.rounds)){const a=x.asks.find(y=>y.id===id);if(a)return {a,r:x}}return {}};
const setInput=(mode,o={})=>{S.mode=mode;S.key=o.key??null;S.aid=o.aid??null;S.rn=o.rn??null;renderOp();
  const t=document.getElementById('itxt');t.value=o.val||'';if(mode)t.focus()};
const renderInput=()=>{
  const it=document.getElementById('itag'),t=document.getElementById('itxt'),del=document.getElementById('idel'),hint=document.getElementById('ihint'),bar=document.getElementById('inbar');
  const r=S.rn?S.rounds[S.rn]:null,{a}=S.aid?findAsk(S.aid):{};
  const L={memo:'메모',ask:'질문',ans:'답변',qedit:'질문 수정',aedit:'답변 수정'};
  if(!S.mode){it.textContent='입력할 곳을 고르세요';t.disabled=true;t.placeholder='표의 칸을 누르면 메모, "질문"을 누르면 질문을 남길 수 있어요. 내가 쓴 메모 · 질문 · 답변을 누르면 고칠 수 있어요';del.style.display='none';hint.textContent='';return}
  t.disabled=false;
  it.textContent=`${L[S.mode]} → ${S.key?keyLabel(r,S.key):keyLabel(r,a.key)}${(S.mode==='ans'||S.mode==='aedit')&&a?` · "${a.txt}"`:''}`;
  t.placeholder={memo:'떠오른 생각, 관찰한 것 (비우고 저장하면 내 메모가 지워져요)',ask:'물어볼 질문. 다른 운영진에게도 남은 질문으로 보여요',ans:'참가자가 한 답',qedit:'질문',aedit:'답변'}[S.mode];
  const own=S.mode==='qedit'||S.mode==='aedit'||(S.mode==='memo'&&r.notes[S.key]&&r.notes[S.key][S.op]);
  del.style.display=own?'':'none';
  hint.textContent=S.mode==='memo'?'칸마다 내 메모는 하나. 다시 누르면 이어서 고쳐요':'';
};
const save=()=>{
  const v=document.getElementById('itxt').value.trim(),r=S.rn?S.rounds[S.rn]:null,{a}=S.aid?findAsk(S.aid):{};
  if(S.mode==='memo'){const n=r.notes[S.key]=r.notes[S.key]||{};if(v){const ed=!!n[S.op]&&n[S.op].txt!==v||!!(n[S.op]&&n[S.op].ed);n[S.op]={txt:v,ed};dbNote(r.n,S.key,S.op,v,ed)}else if(n[S.op]){delete n[S.op];dbNoteDel(r.n,S.key,S.op)}}
  else if(!v)return;
  else if(S.mode==='ask')dbAsk(r.n,S.key,S.op,v);
  else if(S.mode==='ans'&&a&&!a.ans){a.ans={by:S.op,txt:v};dbAskUpd(a)}
  else if(S.mode==='qedit'&&a){if(v!==a.txt){a.txt=v;a.ed=true;dbAskUpd(a)}}
  else if(S.mode==='aedit'&&a&&a.ans){if(v!==a.ans.txt){a.ans.txt=v;a.ans.ed=true;dbAskUpd(a)}}
  setInput(null)};
on$('isave','click',save);
on$('icancel','click',()=>setInput(null));
on$('itxt','keydown',ev=>{if(ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();save()}if(ev.key==='Escape')setInput(null)});
const modal=(msg,yes)=>{const md=document.getElementById('modal');document.getElementById('mdtxt').textContent=msg;md.style.display='flex';
  document.getElementById('mdno').onclick=()=>{md.style.display='none'};document.getElementById('mdyes').onclick=()=>{md.style.display='none';yes()};document.getElementById('mdyes').focus()};
on$('idel','click',()=>{
  const r=S.rn?S.rounds[S.rn]:null,{a,r:ar}=S.aid?findAsk(S.aid):{};
  if(S.mode==='memo'){delete r.notes[S.key][S.op];dbNoteDel(r.n,S.key,S.op);setInput(null)}
  else if(S.mode==='qedit'&&a){const go=()=>{ar.asks=ar.asks.filter(x=>x!==a);dbAskDel(a.id);setInput(null)};a.ans?modal('답변이 달린 질문이에요. 질문을 지우면 답변도 함께 지워져요. 삭제할까요?',go):go()}
  else if(S.mode==='aedit'&&a){a.ans=null;dbAskUpd(a);setInput(null)}
});
const onPick=ev=>{
  const el=ev.target.closest('[data-ans],[data-ask],[data-myq],[data-mya],[data-myn],[data-key],[data-v],[data-goto],[data-tog],[data-all],#copy');if(!el)return;
  const vr=VR();
  if(el.dataset.tog){const i=Number(el.dataset.tog),o=S.open[vr.n]=S.open[vr.n]||new Set();if(isOpen(vr,i)){o.delete(i);S.closed.add(vr.n+':'+i)}else{o.add(i);S.closed.delete(vr.n+':'+i)}return renderOp()}
  if(el.dataset.all){const o=S.open[vr.n]=new Set();STEPS.forEach((_,i)=>{if(el.dataset.all==='1'){o.add(i);S.closed.delete(vr.n+':'+i)}else S.closed.add(vr.n+':'+i)});return renderOp()}
  if(el.dataset.ans){if(!canAsk())return;const {r}=findAsk(Number(el.dataset.ans));return setInput('ans',{aid:Number(el.dataset.ans),rn:r.n})}
  if(el.dataset.ask){if(!canAsk())return;return setInput('ask',{key:el.dataset.ask,rn:vr.n})}
  if(el.dataset.myq){const id=Number(el.dataset.myq),{a,r}=findAsk(id);const go=()=>setInput('qedit',{aid:id,rn:r.n,val:a.txt});return a.ans?modal('답변이 달린 질문이에요. 질문을 고쳐도 답변은 그대로 남아요. 수정할까요?',go):go()}
  if(el.dataset.mya){const id=Number(el.dataset.mya),{a,r}=findAsk(id);return setInput('aedit',{aid:id,rn:r.n,val:a.ans.txt})}
  if(el.dataset.myn||el.dataset.key){const k=el.dataset.myn||el.dataset.key,n=(vr.notes[k]||{})[S.op];return setInput('memo',{key:k,rn:vr.n,val:n?n.txt:''})}
  if(el.dataset.v){S.view=el.dataset.v;return renderOp()}
  if(el.hasAttribute('data-goto')){S.closed.delete(R().n+':'+R().step);renderOp();const t=document.getElementById('st-'+R().step);t&&t.scrollIntoView({block:'start',behavior:'smooth'});return}
  if(el.id==='copy')copyMD(el);
};
opbody.addEventListener('click',onPick);
on$('status','click',onPick);
on$('itools','click',onPick);
const itemTxt=(r,k)=>[...notesOf(r,k).map(n=>`${n.txt} (${opName(n.by)})`),...asksOf(r,k).map(a=>`Q. ${a.txt} (${opName(a.by)}) → ${a.ans?`A. ${a.ans.txt} (${opName(a.ans.by)})`:'답변 대기'}`)].join(' / ');
const copyMD=b=>{
  const r=VR(),ppl=r.people.filter(p=>p.joined),cl=t=>String(t??'').replace(/\|/g,'/').replace(/\n/g,' ');
  let md=`## ${r.n}회차\n\n| 단계 · 질문 | ${ppl.map(p=>cl(p.name+' · '+p.part)).join(' | ')} |\n|${' --- |'.repeat(ppl.length+1)}\n`;const bl=' |'.repeat(ppl.length);
  STEPS.forEach((s,i)=>{if(i===0||i===LAST)return;md+=`| **${i}. ${cl(s.t)}** |${bl}\n`;
    if(s.proto==='free')md+=`| 누른 순서 | ${ppl.map(p=>cl(p.staps.map(t=>t.n).join(' → '))).join(' | ')} |\n`;
    s.qs.forEach(q=>{md+=`| Q${q.id} ${cl(q.q)} | ${ppl.map(p=>cl(fmt(q,p.ans['q'+q.id]))).join(' | ')} |\n`;
      const c=ppl.map(p=>itemTxt(r,`q:${q.id}:${p.id}`));if(c.some(Boolean))md+=`| ↳ Q${q.id} 메모 · 질문 | ${c.map(cl).join(' | ')} |\n`});
    const g=itemTxt(r,`s:${i}:all`),c=ppl.map(p=>itemTxt(r,`s:${i}:${p.id}`));
    if(g||c.some(Boolean))md+=`| ↳ 단계 전체${g?': '+cl(g):''} | ${c.map(cl).join(' | ')} |\n`});
  const e=itemTxt(r,'etc');md+=`\n### 회차 기타\n${e?'- '+e.split(' / ').join('\n- '):'- 없음'}`;
  const cp=document.getElementById('cp');
  navigator.clipboard?.writeText(md).then(()=>{b.textContent='복사했어요'},()=>{cp.style.display='block';cp.value=md;cp.select()}) ?? (cp.style.display='block',cp.value=md);
};
const renderOp=()=>{
  if(MODE!=='ops'||!S.op)return;
  const r=R(),s=STEPS[r.step],L=lead();
  document.getElementById('rlab').textContent=`${r.n}회차 진행 중 · 참가자 ${joined().length}명`;
  renderPV();
  document.getElementById('steps').innerHTML=STEPS.map((x,i)=>L?`<button class="st ${i===r.step?'on':i<r.step?'past':''}" data-s="${i}">${i}. ${esc(x.t)}${qr(x)}</button>`:`<span class="st ${i===r.step?'on':i<r.step?'past':''}">${i}. ${esc(x.t)}${qr(x)}</span>`).join('');
  document.getElementById('newr').style.display=L?'':'none';
  const mc=document.getElementById('mctl'),isM=s.qs.some(q=>q.type==='mission');
  const isF=s.proto==='free';mc.style.display=isM||isF?'':'none';
  if(isF){const on=r.fRun!=null||r.fAcc>0;mc.innerHTML=`<div class="mrow"><span class="lab">자유 사용 시간 (기록 안 됨)</span><b id="fclock" style="font-size:26px;font-variant-numeric:tabular-nums">${clock(fEl(r))}</b>${on&&r.fRun==null?'<span class="tagp m">일시 중지</span>':''}${L?(on?`<button class="btn ${r.fRun==null?'pri':''}" id="ftoggle">${r.fRun==null?'시작':'일시 중지'}</button><button class="btn" id="frestart">새로 시작</button>`:`<button class="btn hot" id="fstart">시작</button>`):''}</div>`}
  if(isM){const ppl=joined(),dn=ppl.filter(p=>p.ans['q'+MQ]&&p.ans['q'+MQ].v).length;
    mc.innerHTML=mOn(r)?`<div class="mrow"><span class="lab">미션 경과</span><b id="mclock" style="font-size:26px;font-variant-numeric:tabular-nums">${clock(mEl(r))}</b>${r.mRun==null?'<span class="tagp m">일시 정지</span>':''}<span class="tagp">완료 ${dn}/${ppl.length}</span>${L?`<button class="btn ${r.mRun==null?'pri':''}" id="mtoggle">${r.mRun==null?'시작':'중지'}</button><button class="btn" id="mrestart">${S.mArm?'한 번 더 누르면 다시 시작':'다시 시작'}</button>`:''}</div>`
      :L?`<div class="mrow"><span>안내가 끝나면 눌러 주세요. 참가자가 완료를 누른 시점까지 걸린 시간이 기록돼요.</span><button class="btn hot" id="mstart">미션 시간 시작</button></div>`:`<span class="lab">진행자가 미션 시간을 시작하면 여기에 경과 시간이 보여요.</span>`}
  renderStatus();
  const st=opbody.scrollTop,sl=opbody.scrollLeft;
  opbody.innerHTML=S.tab==='res'?resHTML():sumHTML();
  opbody.scrollTop=st;opbody.scrollLeft=sl;
  document.getElementById('itools').innerHTML=toolsHTML();
  document.getElementById('inbar').classList.toggle('sumonly',S.tab!=='res');
  renderInput();
};
const meEl=document.getElementById('me');
const L_={role:null};
const renderLogin=()=>{
  if(MODE!=='ops')return;
  const out=S.op==null;
  document.getElementById('login').style.display=out?'':'none';
  document.getElementById('opmain').style.display=out?'none':'';
  meEl.textContent=out?'운영진 입장 전':`${S.op} · ${S.role}`;
  document.getElementById('swop').style.display=out?'none':'';
  document.querySelectorAll('#lrole [data-role]').forEach(b=>b.classList.toggle('pri',b.dataset.role===L_.role));
  document.getElementById('lgo').disabled=!(document.getElementById('lname').value.trim()&&L_.role);
  document.getElementById('lexist').innerHTML=OPS.length?`<span class="lab">전에 입장한 이름으로 다시 들어가기</span><div class="mrow" style="margin-top:6px">${OPS.map((o,i)=>`<button class="btn" data-ex="${i}">${esc(o.name)} · ${o.role}</button>`).join('')}</div>`:'';
};
on$('lname','input',renderLogin);
on$('lrole','click',ev=>{const b=ev.target.closest('[data-role]');if(b){L_.role=b.dataset.role;renderLogin()}});
const enter=(name,role)=>{S.op=name;S.role=role;S.mode=null;S.key=null;S.aid=null;try{localStorage.setItem('ut_op',JSON.stringify({name,role}))}catch(e){}dbOp(name,role);if(!OPS.some(o=>o.name===name))OPS.push({name,role});else OPS.find(o=>o.name===name).role=role;renderLogin();renderOp()};
on$('lgo','click',()=>{const n=document.getElementById('lname').value.trim();if(!n||!L_.role)return;
  document.getElementById('lname').value='';const role=L_.role;L_.role=null;enter(n,role)});
on$('lexist','click',ev=>{const b=ev.target.closest('[data-ex]');if(b){const o=OPS[Number(b.dataset.ex)];enter(o.name,o.role)}});
on$('swop','click',()=>{S.op=null;try{localStorage.removeItem('ut_op')}catch(e){}renderLogin()});
/* ---------- rounds ---------- */
const newr=document.getElementById('newr')||document.createElement('button');
newr.onclick=()=>{
  if(!lead())return;
  if(!S.arm){S.arm=true;newr.textContent='한 번 더 누르면 시작';setTimeout(()=>{S.arm=false;newr.textContent='새 회차 시작'},3000);return}
  S.arm=false;newr.textContent='새 회차 시작';
  const n=Math.max(...roundsSel())+1;S.rounds[n]=newRound(n);S.cur=n;S.view=String(n);S.mode=null;dbNewRound(n);renderAll();
};
const renderAll=()=>{renderPhone();renderLogin();if(S.op!=null)renderOp()};
