/* ---------- sync layer (Supabase) ---------- */
const sb=supabase.createClient(UT_CONFIG.url,UT_CONFIG.key,{auth:{persistSession:false},realtime:{params:{eventsPerSecond:20}}});
const ROOM=((new URLSearchParams(location.search).get('room')||'').trim().slice(0,40))||'main';
const MEK=ROOM==='main'?'ut_me':'ut_me@'+ROOM;
const mine=ev=>{const x=ev.new&&Object.keys(ev.new).length?ev.new:ev.old;return !!x&&x.room===ROOM};
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const netEl=()=>document.getElementById('net');
let netOk=true;
const setNet=ok=>{netOk=ok;const el=netEl();if(el){el.style.display=ok?'none':'';}};

/* server clock */
async function syncClock(){
  try{let best=null;for(let i=0;i<3;i++){const t0=Date.now();const {data,error}=await sb.rpc('ut_now');const t1=Date.now();if(error)throw error;const rtt=t1-t0;if(!best||rtt<best.rtt)best={rtt,off:Number(data)-(t0+rtt/2)}}OFF=Math.round(best.off)}catch(e){}
}

/* row -> state */
const rowRound=(x,old)=>Object.assign(old||newRound(x.n),{n:x.n,step:x.step,stepAt:Number(x.step_at)||0,mAcc:Number(x.m_acc)||0,mRun:x.m_run==null?null:Number(x.m_run),fAcc:Number(x.f_acc)||0,fRun:x.f_run==null?null:Number(x.f_run)});
const ensureRound=n=>S.rounds[n]=S.rounds[n]||newRound(n);
const rowPerson=x=>{const d=x.data||{};const p=person(Object.assign({},d,{id:x.id,round:x.round_n,joined:true}));p.draft=JSON.parse(JSON.stringify(p.ans||{}));p._c=x.created_at;return p};
const putPerson=x=>{const r=ensureRound(x.round_n);const i=r.people.findIndex(p=>p.id===x.id);const p=rowPerson(x);if(i<0){r.people.push(p);r.people.sort((a,b)=>String(a._c).localeCompare(String(b._c)))}else r.people[i]=p};
const putNote=x=>{const r=ensureRound(x.round_n);(r.notes[x.key]=r.notes[x.key]||{})[x.op]={txt:x.txt,ed:!!x.ed}};
const rowAsk=x=>({id:Number(x.id),key:x.key,by:x.by_op,txt:x.txt,ans:x.ans||null,ed:!!x.ed,at:x.created_at});
const putAsk=x=>{const r=ensureRound(x.round_n);const i=r.asks.findIndex(a=>a.id===Number(x.id));if(i<0){r.asks.push(rowAsk(x));r.asks.sort((a,b)=>a.id-b.id)}else r.asks[i]=rowAsk(x)};
const dropAsk=id=>{for(const r of Object.values(S.rounds))r.asks=r.asks.filter(a=>a.id!==Number(id))};

/* ---------- writes ---------- */
let PEND=0;const retry=async(fn,label)=>{PEND++;try{return await retry0(fn,label)}finally{PEND--}};
const retry0=async(fn,label)=>{for(let i=0;;i++){try{const {error,data}=await fn();if(error)throw error;setNet(true);return data}catch(e){setNet(false);console.warn('[ut] retry',label,e&&e.message);await new Promise(r=>setTimeout(r,Math.min(8000,600*2**i)))}}};
const saveRound=r=>retry(()=>sb.from('ut_rounds').update({step:r.step,step_at:Math.round(r.stepAt),m_acc:Math.round(r.mAcc||0),m_run:r.mRun==null?null:Math.round(r.mRun),f_acc:Math.round(r.fAcc||0),f_run:r.fRun==null?null:Math.round(r.fRun),updated_at:new Date().toISOString()}).eq('room',ROOM).eq('n',r.n),'round');
const dbNote=(n,key,op,txt,ed)=>retry(()=>sb.from('ut_notes').upsert({room:ROOM,round_n:n,key,op,txt,ed,updated_at:new Date().toISOString()}),'note');
const dbNoteDel=(n,key,op)=>retry(()=>sb.from('ut_notes').delete().match({room:ROOM,round_n:n,key,op}),'notedel');
const dbAsk=async(n,key,by,txt)=>{const d=await retry(()=>sb.from('ut_asks').insert({room:ROOM,round_n:n,key,by_op:by,txt}).select().single(),'ask');putAsk(d);renderOp()};
const dbAskUpd=a=>retry(()=>sb.from('ut_asks').update({txt:a.txt,ed:!!a.ed,ans:a.ans,updated_at:new Date().toISOString()}).eq('id',a.id),'askupd');
const dbAskDel=id=>retry(()=>sb.from('ut_asks').delete().eq('id',id),'askdel');
const dbOp=(name,role)=>retry(()=>sb.from('ut_ops').upsert({room:ROOM,name,role,updated_at:new Date().toISOString()}),'op');
const dbNewRound=async n=>{await retry(()=>sb.from('ut_rounds').upsert({room:ROOM,n,step:0,step_at:Math.round(now())}),'newround');await retry(()=>sb.from('ut_meta').update({cur:n}).eq('room',ROOM),'meta')};

/* participant: single-writer, ordered, debounced saves with local backup */
const pdata=p=>({name:p.name,part:p.part,ans:p.ans,staps:p.staps,taps:p.taps,manual:p.manual,pstep:p.pstep,tab:p.tab,v:p.v||0});
let pT=null,pBusy=false,pAgain=false;
function savePerson(p){
  if(MODE!=='part'||!p||!p.id)return;
  p.v=(p.v||0)+1;LS.set(MEK,{id:p.id,round:p.round,data:pdata(p)});
  clearTimeout(pT);pT=setTimeout(flushPerson,350);
}
async function flushPerson(){
  const p=S.mine;if(!p)return;
  if(pBusy){pAgain=true;return}
  pBusy=true;const d=pdata(p);
  await retry(()=>sb.from('ut_people').update({data:d,updated_at:new Date().toISOString()}).eq('id',p.id),'person');
  pBusy=false;if(pAgain){pAgain=false;flushPerson()}
}
const keepaliveFlush=()=>{const p=S.mine;if(!p||!p.id)return;clearTimeout(pT);
  try{fetch(`${UT_CONFIG.url}/rest/v1/ut_people?id=eq.${p.id}`,{method:'PATCH',keepalive:true,headers:{apikey:UT_CONFIG.key,Authorization:`Bearer ${UT_CONFIG.key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({data:pdata(p),updated_at:new Date().toISOString()})})}catch(e){}};

async function joinRound(){
  const t=S.tmp;if(!t||!t.name.trim()||!t.part||S.joining)return;
  S.joining=true;S.joinErr='';renderPhone();
  const n=await ensureRoom();
  const p=person({name:t.name.trim(),part:t.part,joined:true,round:n});
  const d=await retry(()=>sb.from('ut_people').insert({room:ROOM,round_n:n,data:pdata(p)}).select().single(),'join');
  p.id=d.id;S.mine=p;S.cur=n;LS.set(MEK,{id:p.id,round:n,data:pdata(p)});setMeUrl(p.id);
  await loadRound(n);S.joining=false;renderPhone();
}
function setMeUrl(id){try{const u=new URL(location.href);if(id)u.searchParams.set('me',id);else u.searchParams.delete('me');history.replaceState(null,'',u)}catch(e){}}
async function ensureRoom(){const {data,error}=await sb.from('ut_meta').select('cur').eq('room',ROOM).maybeSingle();if(error)throw error;if(data)return data.cur;await sb.from('ut_meta').upsert({room:ROOM,cur:1},{onConflict:'room',ignoreDuplicates:true});await sb.from('ut_rounds').upsert({room:ROOM,n:1,step:0,step_at:Math.round(now())},{onConflict:'room,n',ignoreDuplicates:true});return 1}
async function loadRound(n){const {data}=await sb.from('ut_rounds').select('*').eq('room',ROOM).eq('n',n).single();if(data){const old=S.rounds[n];S.rounds[n]=rowRound(data,old);}}

/* ---------- participant boot ---------- */
async function bootPart(){
  await syncClock();
  const m=await retry0(async()=>{try{return {data:await ensureRoom()}}catch(e){return {error:e}}},'meta');
  S.cur=m;ensureRound(S.cur);
  // 새로고침해도 이어지도록: 주소창(me=)과 기기 저장소 둘 다에서 찾음
  const urlMe=((new URLSearchParams(location.search).get('me')||'').trim().match(/^[0-9a-f-]{36}$/i)||[''])[0];
  let me=LS.get(MEK);const fromUrl=!!urlMe&&!(me&&me.id===urlMe);
  if(fromUrl)me={id:urlMe};
  if(me&&me.id){
    const {data:row}=await retry0(async()=>{const r=await sb.from('ut_people').select('*').eq('id',me.id).eq('room',ROOM).maybeSingle();return r.error?{error:r.error}:{data:r}},'me');
    if(row&&(row.round_n===S.cur||urlMe===row.id)){setMeUrl(row.id);
      const p=rowPerson(row);
      if(me.data&&(me.data.v||0)>((row.data||{}).v||0)){Object.assign(p,me.data);p.draft=JSON.parse(JSON.stringify(p.ans||{}));S.mine=p;flushPerson()}else S.mine=p;
      S.mine.round=row.round_n;
    }else{LS.del(MEK);if(urlMe)setMeUrl(null)}
  }
  if(!S.mine)S.tmp=person();
  await loadRound(S.mine?S.mine.round:S.cur);
  S.ready=true;renderPhone();
  const ch=sb.channel('part').on('postgres_changes',{event:'*',schema:'public',table:'ut_rounds'},ev=>{const x=ev.new;if(!x||!x.n||x.room!==ROOM)return;onRoundRow(x)})
    .subscribe(st=>{if(st==='SUBSCRIBED'){setNet(true);refreshPart()}else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED')setNet(false)});
  setInterval(refreshPart,8000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){syncClock();refreshPart()}else keepaliveFlush()});
  addEventListener('pagehide',keepaliveFlush);
  addEventListener('online',refreshPart);
}
function onRoundRow(x){
  const rn=S.mine?S.mine.round:S.cur;if(x.n!==rn)return;
  const r=S.rounds[rn],before=r?r.step+':'+r.stepAt:'';rowRound(x,ensureRound(rn));const after=S.rounds[rn].step+':'+S.rounds[rn].stepAt;
  if(before!==after){if(S.mine&&S.mine.manual){S.mine.manual=false;savePerson(S.mine)}renderPhone()}
}
async function refreshPart(){
  try{const rn=S.mine?S.mine.round:S.cur;const {data,error}=await sb.from('ut_rounds').select('*').eq('room',ROOM).eq('n',rn).single();if(error)throw error;setNet(true);onRoundRow(data)}catch(e){setNet(false)}
}

/* ---------- operator boot ---------- */
let rT=null;const soon=()=>{clearTimeout(rT);rT=setTimeout(()=>{if(S.op)renderOp();else renderLogin()},120)};
async function loadAll(){
  const [m,rs,ps,ns,as,os]=await (await ensureRoom(),Promise.all([sb.from('ut_meta').select('*').eq('room',ROOM).single(),sb.from('ut_rounds').select('*').eq('room',ROOM).order('n'),sb.from('ut_people').select('*').eq('room',ROOM).order('created_at'),sb.from('ut_notes').select('*').eq('room',ROOM),sb.from('ut_asks').select('*').eq('room',ROOM).order('id'),sb.from('ut_ops').select('*').eq('room',ROOM).order('updated_at')]));
  for(const x of [m,rs,ps,ns,as,os])if(x.error)throw x.error;
  const rounds={};rs.data.forEach(x=>{rounds[x.n]=rowRound(x,null)});
  ps.data.forEach(x=>{const r=rounds[x.round_n];if(r)r.people.push(rowPerson(x))});
  ns.data.forEach(x=>{const r=rounds[x.round_n];if(r)(r.notes[x.key]=r.notes[x.key]||{})[x.op]={txt:x.txt,ed:!!x.ed}});
  as.data.forEach(x=>{const r=rounds[x.round_n];if(r)r.asks.push(rowAsk(x))});
  const prevCur=S.cur;S.rounds=rounds;S.cur=m.data.cur;if(!S.rounds[S.cur])S.rounds[S.cur]=newRound(S.cur);
  if(!S.ready||prevCur!==S.cur)S.view=String(S.cur);
  OPS=os.data.map(o=>({name:o.name,role:o.role}));
  setNet(true);
}
async function bootOps(){
  await syncClock();
  await retry0(async()=>{try{await loadAll();return {}}catch(e){return {error:e}}},'loadAll');
  S.ready=true;
  const saved=LS.get('ut_op');if(saved&&saved.name){S.op=saved.name;S.role=saved.role;}
  renderLogin();if(S.op)renderOp();
  const ch=sb.channel('ops')
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_meta'},ev=>{if(!mine(ev))return;if(ev.new&&ev.new.cur){const c=ev.new.cur;if(c!==S.cur){S.cur=c;ensureRound(c);S.view=String(c);loadRound(c).then(soon)}}soon()})
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_rounds'},ev=>{if(!mine(ev))return;if(ev.new&&ev.new.n){rowRound(ev.new,ensureRound(ev.new.n));soon()}})
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_people'},ev=>{if(!mine(ev))return;if(ev.eventType==='DELETE'){const id=ev.old.id;Object.values(S.rounds).forEach(r=>r.people=r.people.filter(p=>p.id!==id))}else putPerson(ev.new);soon()})
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_notes'},ev=>{if(!mine(ev))return;if(ev.eventType==='DELETE'){const o=ev.old,r=S.rounds[o.round_n];if(r&&r.notes[o.key])delete r.notes[o.key][o.op]}else putNote(ev.new);soon()})
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_asks'},ev=>{if(!mine(ev))return;if(ev.eventType==='DELETE')dropAsk(ev.old.id);else putAsk(ev.new);soon()})
   .on('postgres_changes',{event:'*',schema:'public',table:'ut_ops'},ev=>{if(!mine(ev))return;if(ev.new&&ev.new.name){const o=OPS.find(x=>x.name===ev.new.name);if(o)o.role=ev.new.role;else OPS.push({name:ev.new.name,role:ev.new.role});soon()}})
   .subscribe(st=>{if(st==='SUBSCRIBED'){setNet(true);refreshOps()}else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED')setNet(false)});
  setInterval(refreshOps,15000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){syncClock();refreshOps()}});
  addEventListener('online',refreshOps);
}
let refreshing=false;let lastLocal=0;document.addEventListener('click',()=>{lastLocal=Date.now()},true);
async function refreshOps(){if(refreshing||PEND>0||Date.now()-lastLocal<3000)return;refreshing=true;try{await loadAll();soon()}catch(e){setNet(false)}refreshing=false}

if(ROOM!=='main'){const b=document.createElement('div');b.textContent='연습방 · '+ROOM+' — 실제 UT 데이터와 분리돼 있어요';Object.assign(b.style,{position:'fixed',left:'50%',transform:'translateX(-50%)',background:'#7a3cc2',color:'#fff',font:'700 12px system-ui',padding:'4px 12px',borderRadius:'999px',zIndex:50,pointerEvents:'none',whiteSpace:'nowrap'});if(MODE==='part')b.style.top='30px';else b.style.bottom='8px';document.body.appendChild(b)}
(MODE==='part'?bootPart:bootOps)();
