/* =====================================================================
   사계단지 프로토타입 (UT 자유 사용) — 디자이너 작업본 우선, 없는 화면은 와이어프레임
   - render(p,ctx): 참가자 폰 안의 '프로토타입 쓰기' 카드
   - open(p,{tap,close,mount,fs}): 전체 화면 앱 열기. 누른 모든 요소를 tap(이름)으로 넘김
   - close(): 닫기 (진행자가 단계를 넘기면 시뮬레이터가 호출)
   - openFor(): 지금 열려 있는 참가자 id (없으면 null)
   ===================================================================== */
(function(){
const IMG=(window.UT_PROTO_IMG||'proto/');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- icons ---------- */
const I={
 back:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.5 4.5 8 12l7.5 7.5" stroke="#191f28" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 dots:'<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.8" fill="#191f28"/><circle cx="10" cy="10" r="1.8" fill="#191f28"/><circle cx="16" cy="10" r="1.8" fill="#191f28"/></svg>',
 dotsg:'<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.7" fill="#b0b8c1"/><circle cx="12" cy="12" r="1.7" fill="#b0b8c1"/><circle cx="18" cy="12" r="1.7" fill="#b0b8c1"/></svg>',
 logo:'<svg width="18" height="18" viewBox="0 0 18 18"><rect width="18" height="18" rx="6" fill="#3182f6"/><path d="M5 10.2c0-2.6 1.8-4.6 4-4.6s4 2 4 4.6v2.3H5z" fill="#fff"/><circle cx="7.6" cy="9.4" r=".9" fill="#3182f6"/><circle cx="10.4" cy="9.4" r=".9" fill="#3182f6"/></svg>',
 cam:'<svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M8.6 4.5h6.8l1.4 2.2H20a1.6 1.6 0 0 1 1.6 1.6v10.1A1.6 1.6 0 0 1 20 20H4a1.6 1.6 0 0 1-1.6-1.6V8.3A1.6 1.6 0 0 1 4 6.7h3.2z" fill="#fff"/><circle cx="12" cy="13.2" r="3.6" fill="#5b8ef0"/><circle cx="12" cy="13.2" r="2" fill="#fff"/></svg>',
 home:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.5 10.4 12 3.6l8.5 6.8V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill="#333d4b"/></svg>',
 homeo:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.5 10.4 12 3.6l8.5 6.8V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill="#b0b8c1"/></svg>',
 jar:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8.2 3.2c1.6-1 6-1 7.6 0 .5.3.4 1-.2 1.1-2.4.5-4.8.5-7.2 0-.6-.1-.7-.8-.2-1.1z" fill="#b0b8c1"/><path d="M12 5.6c5 0 8.2 2.6 8.2 7.6 0 5.3-3.3 8.3-8.2 8.3s-8.2-3-8.2-8.3c0-5 3.2-7.6 8.2-7.6z" fill="#b0b8c1"/></svg>',
 jaron:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8.2 3.2c1.6-1 6-1 7.6 0 .5.3.4 1-.2 1.1-2.4.5-4.8.5-7.2 0-.6-.1-.7-.8-.2-1.1z" fill="#333d4b"/><path d="M12 5.6c5 0 8.2 2.6 8.2 7.6 0 5.3-3.3 8.3-8.2 8.3s-8.2-3-8.2-8.3c0-5 3.2-7.6 8.2-7.6z" fill="#333d4b"/></svg>',
 heart:(on,c='#b0b8c1',s=12)=>on?`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-8.5-5.3-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.7 12 21 12 21z" fill="#f04452"/></svg>`:`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 20s-8-5-8-10.6A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.8C20 15 12 20 12 20z" fill="none" stroke="${c}" stroke-width="2.2"/></svg>`,
 heartf:(c='#4e5968',s=16)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-8.5-5.3-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.7 12 21 12 21z" fill="${c}"/></svg>`,
 chev:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="#8b95a1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 people:(c='#8b95a1',s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 20 20"><circle cx="7.4" cy="7" r="2.9" fill="${c}"/><circle cx="13.6" cy="7.6" r="2.3" fill="${c}"/><path d="M1.8 16c.4-3 2.7-4.8 5.6-4.8s5.2 1.8 5.6 4.8z" fill="${c}"/><path d="M13.8 16c-.2-1.6-.9-3-2-3.9.6-.3 1.2-.4 1.8-.4 2.3 0 4.2 1.5 4.6 4.3z" fill="${c}"/></svg>`,
 lock:(c='#8b95a1',s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 20 20"><rect x="4" y="8.6" width="12" height="9" rx="2.2" fill="${c}"/><path d="M6.8 8.8V6.6a3.2 3.2 0 0 1 6.4 0v2.2" fill="none" stroke="${c}" stroke-width="1.9"/><circle cx="10" cy="13" r="1.3" fill="#fff"/></svg>`,
 xc:'<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#b0b8c1"/><path d="m10 10 8 8m0-8-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
 lc:'<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#b0b8c1"/><path d="M19 14H9.5m4-4.2L9.3 14l4.2 4.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 plus:'<svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 5v24M5 17h24" stroke="#b0b8c1" stroke-width="2.6" stroke-linecap="round"/></svg>',
 check:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m3 8.4 3.2 3.1L13 4.8" stroke="#1660e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 cbox:on=>on?'<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#3182f6"/><path d="m6 10.2 2.6 2.5L14 7.4" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6" fill="none" stroke="#c4cad1" stroke-width="1.5"/><path d="m6 10.2 2.6 2.5L14 7.4" fill="none" stroke="#c4cad1" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 sunrise:on=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${on?'#3182f6':'#8b95a1'}" stroke-width="1.8" stroke-linecap="round"><path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 6.5V9M5.2 10.2l1.6 1.4M18.8 10.2l-1.6 1.4M2.5 14.3h1.8M19.7 14.3h1.8"/></svg>`,
 sun:on=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${on?'#3182f6':'#8b95a1'}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2" fill="${on?'#3182f6':'#8b95a1'}"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`,
 moon:on=>`<svg width="24" height="24" viewBox="0 0 24 24"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" fill="${on?'#3182f6':'#8b95a1'}"/></svg>`,
 pcam:'<svg width="22" height="22" viewBox="0 0 24 24"><path d="M8.6 5h6.8l1.4 2.1H20a1.5 1.5 0 0 1 1.5 1.5v9.6A1.5 1.5 0 0 1 20 19.7H4a1.5 1.5 0 0 1-1.5-1.5V8.6A1.5 1.5 0 0 1 4 7.1h3.2z" fill="#b0b8c1"/><circle cx="12" cy="13" r="3.2" fill="#f2f4f6"/></svg>',
 pdoc:'<svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 2.8h8.2L19 7.6V20a1.4 1.4 0 0 1-1.4 1.4H6A1.4 1.4 0 0 1 4.6 20V4.2A1.4 1.4 0 0 1 6 2.8z" fill="#b0b8c1"/><path d="M8 11h8M8 14.5h8M8 18h5" stroke="#f2f4f6" stroke-width="1.6" stroke-linecap="round"/></svg>',
 plock:'<svg width="22" height="22" viewBox="0 0 24 24"><rect x="5" y="10.4" width="14" height="10.6" rx="2.4" fill="#b0b8c1"/><path d="M8.2 10.6V8a3.8 3.8 0 0 1 7.6 0v2.6" fill="none" stroke="#b0b8c1" stroke-width="2.2"/></svg>',
 siren:'<svg width="20" height="20" viewBox="0 0 20 20"><path d="M5.2 15V10a4.8 4.8 0 0 1 9.6 0v5z" fill="#b0b8c1"/><rect x="3.5" y="15" width="13" height="2.6" rx="1" fill="#b0b8c1"/><path d="M10 2v1.6M3.4 4.6l1.1 1.1M16.6 4.6l-1.1 1.1" stroke="#b0b8c1" stroke-width="1.5" stroke-linecap="round"/><rect x="9.2" y="9.6" width="1.6" height="3.6" rx=".8" fill="#fff"/></svg>',
 bell:'<svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 2.5a5 5 0 0 0-5 5v3.6L3.6 14h12.8L15 11.1V7.5a5 5 0 0 0-5-5z" fill="#4e5968"/><path d="M8 15.6a2 2 0 0 0 4 0z" fill="#4e5968"/></svg>',
 cpTea:'<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#3182f6"/><path d="M8 4.6v6.8M4.6 8h6.8" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>',
 cpOrg:'<span style="width:14px;height:14px;border-radius:7px;background:conic-gradient(#ff6b6b,#ffb03a,#ffe14d,#5fd17a,#4aa8ff,#9a7bff,#ff6b6b);display:inline-block;-webkit-mask:radial-gradient(circle,transparent 2.4px,#000 2.6px);mask:radial-gradient(circle,transparent 2.4px,#000 2.6px)"></span>',
 cpEtc:'<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#a58bf0"/><path d="M8 3.6v8.8M4.2 5.8l7.6 4.4M4.2 10.2l7.6-4.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>',
 saved:'<svg width="56" height="56" viewBox="0 0 56 56"><rect x="17" y="12" width="26" height="30" rx="4" transform="rotate(16 30 27)" fill="#c9dcff"/><rect x="13" y="10" width="26" height="30" rx="4" transform="rotate(8 26 25)" fill="#dfe3e8"/><path d="M22 34l4 4 9-10" fill="none" stroke="#3182f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ---------- data ---------- */
const FEED0=[
 {id:'f1',t:'생강차',by:'축하하는 라이언',img:'ginger.jpg',lab:'따뜻한 차',like:24},
 {id:'f2',t:'겨울은 핫초코의 계절',by:'티비 보는 라이언',img:'choco.jpg',lab:'따뜻한 차',like:89,liked0:1},
 {id:'f3',t:'요거꿀자몽~~',by:'으쓱으쓱 어피치',img:'grapefruit.jpg',lab:'주황',like:41,liked0:1},
 {id:'f4',t:'수제 뱅쇼',by:'행복한 춘식이',img:'vinshot.jpg',lab:'따뜻한 차',like:37},
 {id:'f5',t:'얼려 먹는 귤',by:'축하하는 라이언',img:'gyul.jpg',lab:'주황',like:89,liked0:1},
 {id:'f6',t:'첫눈',by:'티비 보는 라이언',img:'boots_s.jpg',big:'boots.jpg',lab:'그 밖의 겨울',like:15},
 {id:'f7',t:'첫눈온다',by:'티비 보는 라이언',img:'snowfall.jpg',lab:'그 밖의 겨울',like:89},
 {id:'f8',t:'홍시',by:'축하하는 라이언',img:'hongsi.jpg',lab:'주황',like:9}
];
const ME='인사하는 어피치';
const PICK=[{t:'1분만에 귤청 만들기',src:'유튜브 · 1분 요리만찬',pf:'유튜브'},{t:'서울 실내 크리스마스 명소 4곳',src:'유튜브 · 우주트래블로그',pf:'유튜브'}];
const SPECIAL=[{t:'1분만에 귤청 만들기',src:'유튜브 · 1분 요리만찬',pf:'유튜브'},{t:'겨울 집콕 귤 레시피 3가지',src:'인스타그램 · 오늘의 귤',pf:'인스타그램'},{t:'붕어빵 지도 만드는 법',src:'유튜브 · 동네탐방',pf:'유튜브'}];
const CHIPS=['주황찾기','따뜻한 차','그 밖의 겨울'];
const SCREEN={home:'홈',detail:'게시물 상세',up:'사진 올리기',done:'올리기 완료',danji:'내 단지',mine:'내 기록',edit:'기록 수정',colors:'찾은 색'};

/* ---------- css ---------- */
const CSS=`
#utp{position:fixed;inset:0;z-index:2147483000;background:#fcfcfc;color:#191f28;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard","Noto Sans KR",sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;letter-spacing:0;--sat:env(safe-area-inset-top,0px);--sab:env(safe-area-inset-bottom,0px)}
#utp.in{position:absolute;border-radius:inherit}
#utp *{box-sizing:border-box;margin:0;padding:0;font:inherit;color:inherit;border:0;background:none}
#utp button{cursor:pointer;text-align:inherit}
#utp input{user-select:text;-webkit-user-select:text;outline:none;font-size:16px}
#utp .uscr{display:block;position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#utp .uscr::-webkit-scrollbar{display:none}
#utp .grad{background:linear-gradient(180deg,#eef5ff,#fcfcfc 70%)}
/* toss nav */
#utp .tnav{position:absolute;left:0;right:0;top:0;z-index:20;height:calc(44px + var(--sat));padding-top:var(--sat);display:flex;align-items:center;pointer-events:none}
#utp .tnav>*{pointer-events:auto}
#utp .tnav.solid{background:rgba(252,252,252,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 1px 0 rgba(0,27,55,.06)}
#utp .tnav .bk{width:44px;height:44px;display:flex;align-items:center;justify-content:center;margin-right:-4px}
#utp .tnav .tt{display:flex;align-items:center;gap:6px;height:34px;padding-right:10px;font-size:15px;font-weight:600;color:#191f28;margin-right:auto}
#utp .tnav .tt svg{border-radius:6px;display:block}
#utp .upill{display:flex;align-items:center;height:34px;border-radius:99px;background:rgba(0,23,51,.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:0 2px;margin-right:10px}
#utp .upill .ib{width:40px;height:34px;display:flex;align-items:center;justify-content:center}
#utp .upill i{width:1px;height:16px;background:rgba(0,27,55,.1);border-radius:1px}
#utp .upill .end{height:34px;padding:0 12px 0 10px;font-size:14px;font-weight:600;color:#f04452}
/* tab bar */
#utp .utab{position:absolute;left:0;right:0;bottom:0;z-index:15;height:calc(84px + var(--sab));background:#fff;border:1px solid rgba(0,27,55,.1);border-bottom:0;border-radius:24px 24px 0 0;display:flex;align-items:flex-start;padding-top:10px}
#utp .utab .ti{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:500;color:rgba(3,24,50,.46)}
#utp .utab .ti.on{color:rgba(0,12,30,.8)}
#utp .utab .camb{flex:none;width:80px;height:80px;border-radius:40px;border:10px solid #fff;margin-top:-39px;display:flex;align-items:center;justify-content:center;background:linear-gradient(-30deg,#1660e8 7%,#dce1ff 92%)}
/* hero & home */
#utp .uhero{position:relative;height:326px;border-radius:0 0 16px 16px;overflow:hidden;background:radial-gradient(60% 55% at 85% 5%,rgba(201,195,255,.9),rgba(201,195,255,0)),linear-gradient(180deg,#b5d3ff 0%,#dceaff 55%,#fff 100%)}
#utp .uhero img{position:absolute;right:0;top:0;width:307px;height:326px;object-fit:cover;-webkit-mask-image:linear-gradient(90deg,transparent,#000 22%);mask-image:linear-gradient(90deg,transparent,#000 22%)}
#utp .uhero h1{position:absolute;left:26px;top:125px;font-size:26px;font-weight:700;line-height:1.35;color:#111}
#utp .utops{position:relative;margin:-49px 24px 0;display:grid;grid-template-columns:105px minmax(0,1fr);gap:8px;align-items:end}
#utp .tc{background:#fff;border-radius:16px;box-shadow:0 2px 6px rgba(0,0,0,.12);padding:20px 14px;height:100px}
#utp .tc .s{font-size:12px;line-height:1.35;color:rgba(0,19,43,.58);white-space:nowrap}
#utp .tc .b{font-size:17px;font-weight:700;line-height:1.35;color:rgba(0,12,30,.8);white-space:nowrap}
#utp .tc .x{font-size:12px;line-height:1.35;color:rgba(3,18,40,.7);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#utp .tc .sw{width:26px;height:26px;border-radius:13px;background:rgba(255,112,7,.85);flex:none}
#utp .usec{display:flex;align-items:center;justify-content:space-between;margin:32px 23px 16px}
#utp .usec h2{font-size:17px;font-weight:700;color:#1f1f1f;line-height:1.35}
#utp .usec .n{font-size:15px;font-weight:500;color:#000}
#utp .sort{display:flex;align-items:center;gap:5px;font-size:15px;font-weight:600;color:rgba(3,24,50,.46);height:30px;padding:0 4px 0 10px;border-radius:10px}
#utp .sort.op{background:#f2f4f6}
#utp .upop{position:absolute;z-index:30;background:#fff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.14);padding:10px 8px;min-width:150px}
#utp .upop .h{font-size:12px;color:rgba(0,19,43,.58);padding:4px 12px 6px}
#utp .upop button{display:flex;align-items:center;gap:6px;width:100%;padding:10px 12px;font-size:16px;font-weight:500;color:#333d4b;border-radius:10px}
#utp .upop button.on{color:#1660e8;font-weight:700}
#utp .ugrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 23px}
#utp .ucard{position:relative;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);height:206px;display:block;width:100%}
#utp .ucard .ph{position:absolute;left:0;right:0;top:0;height:144px;background:#e5e8eb center/cover no-repeat}
#utp .ucard .tx{position:absolute;left:0;right:0;top:144px;padding:10px;display:flex;flex-direction:column;gap:8px}
#utp .ucard .tx b{font-size:15px;font-weight:600;line-height:1.25;color:#191f28;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#utp .ucard .tx span{font-size:12px;line-height:1.35;color:rgba(0,19,43,.58)}
#utp .bdg{position:absolute;left:12px;top:12px;background:rgba(255,255,255,.88);backdrop-filter:blur(3.5px);-webkit-backdrop-filter:blur(3.5px);border-radius:9px;padding:3px 7px;font-size:10px;font-weight:600;line-height:1.5;color:rgba(3,18,40,.7)}
#utp .hb{position:absolute;right:12px;top:12px;width:22px;height:21px;border-radius:9px;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center}
#utp .ucar{display:flex;gap:4px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 23px;scrollbar-width:none}
#utp .ucar::-webkit-scrollbar{display:none}
#utp .upk{position:relative;flex:none;width:297px;max-width:calc(100% - 32px);height:121px;border-radius:16px;overflow:hidden;scroll-snap-align:start;scroll-margin-left:23px;background:#2b211a;color:#fff;padding:20px 12px 12px;display:flex;flex-direction:column;justify-content:space-between}
#utp .upk img{position:absolute;right:0;top:0;height:121px;width:160px;object-fit:cover}
#utp .upk::before{content:"";position:absolute;inset:0;background:linear-gradient(256deg,rgba(0,0,0,0) 17%,rgba(0,0,0,.6) 90%),linear-gradient(90deg,#1e1611 38%,rgba(30,22,17,0) 62%);z-index:1}
#utp .upk>*{position:relative;z-index:2}
#utp .upk b{font-size:15px;font-weight:400;line-height:1.35}
#utp .upk small{display:block;font-size:12px;color:#ddd;line-height:1.35;margin-top:2px}
#utp .upk .ugo{align-self:flex-start;background:rgba(222,222,255,.19);border-radius:8px;min-height:32px;padding:0 10px;font-size:13px;font-weight:600;display:flex;align-items:center}
#utp .endtx{font-size:12px;color:rgba(0,19,43,.58);text-align:center;padding:28px 24px 0}
#utp .uempty{margin:0 23px;border:1.5px dashed #c4cad1;border-radius:16px;padding:32px 16px;text-align:center}
#utp .uempty b{display:block;font-size:17px;font-weight:600;margin-bottom:8px;color:#191f28}
#utp .uempty p{font-size:13px;color:#8b95a1;line-height:1.5}
#utp .uempty button{margin-top:18px;background:#f2f4f6;border-radius:14px;padding:14px 22px;font-size:16px;font-weight:600;color:#4e5968}
/* list header */
#utp .lh{display:flex;align-items:center;gap:8px;padding:16px 24px 16px}
#utp .lh .nm{flex:1;min-width:0}
#utp .lh .nm b{display:block;font-size:17px;font-weight:700;line-height:1.25;color:rgba(0,12,30,.8)}
#utp .lh .nm span{display:block;font-size:12px;color:rgba(0,19,43,.58);line-height:1.35}
#utp .lh .mo{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}
#utp .lh .mo.op{background:#f2f4f6}
#utp .bigph{position:relative;margin:0 21px;aspect-ratio:333/380;border-radius:12px;background:#e5e8eb center/cover no-repeat}
#utp .bigph .pb{position:absolute;right:15px;top:15px;background:#dae7ff;border-radius:13px;padding:4px 8px;display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700;color:#1660e8}
#utp .umeta{padding:24px 24px 0}
#utp .umeta .l{font-size:13px;color:rgba(3,18,40,.7);line-height:1.35}
#utp .umeta .t{font-size:17px;font-weight:700;color:#1f1f1f;line-height:1.35;margin-top:6px}
#utp .ulike{display:inline-flex;align-items:center;gap:4px;margin-top:16px;font-size:14px;font-weight:500;color:rgba(3,18,40,.7);height:24px}
#utp .ulike .hi{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
/* bottom cta */
#utp .ucta{position:absolute;left:0;right:0;bottom:0;z-index:12;padding:0 20px calc(20px + var(--sab));background:#fff}
#utp .ucta::before{content:"";position:absolute;left:0;right:0;top:-36px;height:36px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff)}
#utp .bp{width:100%;min-height:56px;border-radius:16px;font-size:17px;font-weight:600;color:#fff;text-align:center!important;background:linear-gradient(-1deg,#1660e8 20%,#c4d9ff 142%)}
#utp .bp:disabled{background:#f2f4f6;color:#c4cad1}
#utp .bs{width:100%;min-height:56px;border-radius:16px;font-size:17px;font-weight:600;color:#4e5968;background:#f2f4f6;text-align:center!important}
#utp .bl{width:100%;min-height:56px;border-radius:16px;font-size:17px;font-weight:600;color:#1660e8;background:#e8f0fe;text-align:center!important}
/* upload */
#utp .uh{display:flex;align-items:center;padding:16px 20px 4px;gap:8px}
#utp .uh h3{flex:1;text-align:center;font-size:17px;font-weight:700;color:rgba(0,12,30,.8);margin-right:36px}
#utp .pbox{margin:21px 0 0 27px;width:149px;height:135px;border-radius:16px;border:1.5px dashed #d1d6db;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:12px;color:rgba(0,19,43,.58);background:#fff center/cover no-repeat;position:relative}
#utp .pbox.has{border:1px solid #d1d6db}
#utp .pbox .chg{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.45);color:#fff;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600}
#utp .fl{padding:16px 0 16px}
#utp .fl .lb{padding:0 24px;font-size:13px;font-weight:500;color:rgba(0,12,30,.8);line-height:1.35}
#utp .fl .hp{padding:4px 24px 0;font-size:13px;color:rgba(0,19,43,.58);line-height:1.5}
#utp .chr{display:flex;flex-wrap:wrap;gap:12px;padding:6px 24px 0}
#utp .bm{min-height:38px;padding:0 16px;border-radius:10px;background:#f9fafb;border:1px solid rgba(0,27,55,.1)!important;font-size:15px;font-weight:600;color:rgba(3,24,50,.46);display:inline-flex;align-items:center;justify-content:center;gap:8px}
#utp .bm.on{background:#f2f4f6;border-color:#4c87f5!important;color:#1660e8}
#utp .bm.fix{color:#1660e8;border-color:#4c87f5!important;background:#f2f4f6}
#utp .uvis{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:6px 24px 0}
#utp .tf{margin:6px 20px 0;min-height:54px;border-radius:14px;background:#f9fafb;border:1px solid rgba(0,27,55,.1)!important;display:flex;align-items:center;padding:0 16px}
#utp .tf input{width:100%;font-size:15px;font-weight:600;color:#191f28;background:transparent}
#utp .tf input::placeholder{color:rgba(3,24,50,.46)}
#utp .utip{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(104px + var(--sab));z-index:14;background:#3182f6;color:#fff;font-size:14px;font-weight:600;border-radius:12px;padding:9px 14px;white-space:nowrap;transition:opacity .3s}
#utp .utip::after{content:"";position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#3182f6}
/* done */
#utp .udone{padding:calc(140px + var(--sat)) 24px 0;text-align:center}
#utp .udone h3{font-size:18px;font-weight:700;margin-top:16px;color:#191f28}
#utp .udone p{font-size:15px;color:#4e5968;margin-top:10px}
#utp .uwf{margin:28px 24px 0;border:1px solid #e5e8eb!important;border-radius:16px;padding:16px;text-align:left;background:#fff}
#utp .uwf b{display:block;font-size:15px;font-weight:700;color:#333d4b}
#utp .uwf p{font-size:13px;color:#8b95a1;margin-top:4px;line-height:1.45}
#utp .uwf .r{display:flex;gap:8px;margin-top:12px}
#utp .uwf .r button{flex:1;min-height:40px;border-radius:10px;font-size:14px;font-weight:600;background:#f2f4f6;color:#4e5968;text-align:center}
#utp .uwf .r button.p{background:#3182f6;color:#fff}
#utp .ctaw{position:absolute;left:0;right:0;bottom:0;padding:0 20px calc(20px + var(--sab));display:flex;flex-direction:column;gap:8px;background:#fff}
/* danji */
#utp .dh{display:flex;align-items:center;justify-content:space-between;padding:8px 24px 0}
#utp .dh h2{font-size:24px;font-weight:700;color:rgba(0,12,30,.8);line-height:1.35}
#utp .alb{background:#f2f4f6;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:600;color:#4e5968}
#utp .seas{display:flex;gap:6px;padding:20px 20px 6px}
#utp .seas button{min-height:32px;min-width:52px;padding:0 11px;border-radius:999px;background:rgba(7,25,76,.05);font-size:13px;font-weight:600;color:rgba(3,18,40,.7);text-align:center}
#utp .seas button.on{background:rgba(0,12,30,.8);color:#fff}
#utp .cols{display:flex;padding:20px 27px 0;height:76px;align-items:center}
#utp .cols i{display:block;width:40px;height:40px;border-radius:20px;margin-right:-23px;border:0}
#utp .dg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px;padding:22px 27px 140px}
#utp .dc{position:relative;height:194px;border-radius:14px;overflow:hidden;background:#ddd center/cover no-repeat;box-shadow:0 2px 6px rgba(0,0,0,.06);display:block;width:100%}
#utp .dc::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.5))}
#utp .dc .bd{position:absolute;right:12px;top:12px;z-index:2;background:#dae7ff;border-radius:13px;padding:4px 8px;display:flex}
#utp .dc .dt{position:absolute;left:16px;bottom:13px;z-index:2;font-size:15px;color:#fff}
#utp .dc .lk{position:absolute;right:14px;bottom:15px;z-index:2;display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#fff}
#utp .unone{padding:60px 24px;text-align:center;font-size:14px;color:#8b95a1}
/* colors (wireframe) */
#utp .cg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 12px;padding:8px 24px 40px}
#utp .cg div{text-align:center;font-size:13px;color:#333d4b}
#utp .cg i{display:block;aspect-ratio:1;border-radius:14px;margin-bottom:8px}
#utp .cg i.nx{border:1.5px dashed #c4cad1;background:#fff}
#utp .cg small{display:block;font-size:11px;color:#8b95a1}
#utp .wfnote{margin:0 24px 8px;font-size:13px;color:#8b95a1;line-height:1.5}
/* sheet */
#utp .udim{position:absolute;inset:0;z-index:40;background:rgba(0,0,0,.2);display:flex;align-items:flex-end;padding:10px 10px calc(10px + var(--sab))}
#utp .usheet{width:100%;background:#fff;border-radius:28px;padding:16px 0 20px;animation:utpUp .22s ease-out}
@keyframes utpUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}
#utp .usheet .hd{width:48px;height:4px;border-radius:40px;background:#e5e8eb;margin:0 auto}
#utp .usheet h4{padding:21px 24px 0;font-size:20px;font-weight:700;line-height:1.35;color:rgba(0,12,30,.8)}
#utp .usheet .sb{padding:8px 24px 13px;font-size:15px;line-height:22.5px;color:#6b7684}
#utp .usheet .ba{display:flex;gap:8px;padding:34px 20px 0}
#utp .usheet .ba button{flex:1}
#utp .usheet .bv{display:flex;flex-direction:column;gap:8px;padding:34px 20px 0}
#utp .pr{display:flex;gap:14px;align-items:center;padding:10px 24px}
#utp .pr .ic{width:36px;height:36px;border-radius:18px;background:#f2f4f6;display:flex;align-items:center;justify-content:center;flex:none}
#utp .pr b{display:block;font-size:16px;font-weight:700;color:#333d4b}
#utp .pr span{font-size:13px;color:#8b95a1}
#utp .uopt{display:flex;flex-direction:column;gap:8px;padding:0 30px}
#utp .uopt button{min-height:42px;border-radius:10px;background:#f9fafb;border:1px solid rgba(0,27,55,.1)!important;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:15px;font-weight:600;color:rgba(3,24,50,.46)}
#utp .uopt button.on{background:rgba(7,25,76,.05);border-color:#4c87f5!important;color:#1660e8}
#utp .nof{display:flex;align-items:center;gap:8px;padding:12px 30px 4px;font-size:15px;color:#6b7684}
#utp .umenu{position:absolute;z-index:30;right:24px;background:#fff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.14);padding:8px;min-width:150px}
#utp .umenu button{display:block;width:100%;padding:12px 14px;font-size:16px;font-weight:500;color:#333d4b;border-radius:10px}
#utp .utoast{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(110px + var(--sab));z-index:60;background:rgba(25,31,40,.88);color:#fff;font-size:14px;font-weight:500;border-radius:14px;padding:12px 16px;white-space:nowrap;pointer-events:none;animation:utpUp .2s ease-out}

/* ---- final (11/28) ---- */
#utp .uhero{background:radial-gradient(55% 75% at 85% 5%,rgba(201,195,255,.9),rgba(201,195,255,0)),linear-gradient(180deg,#b5d3ff 0%,#dceaff 55%,#fff 100%)}
#utp .uhero img{width:307px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 30%);mask-image:linear-gradient(90deg,transparent,#000 30%)}
#utp .utops{margin-top:-79px}
#utp .uempty{background:rgba(255,255,255,.35)}
#utp .uempty .ill{display:block;margin:0 auto 14px}
#utp .uempty.dj{margin:22px 24px 0;padding:24px 16px 32px}
#utp .uempty.dj b{font-size:17px}
#utp .usnow{position:absolute;left:0;top:0;width:375px;height:812px;pointer-events:none;z-index:-1;overflow:hidden}
#utp .usnow i{position:absolute;color:#d4e3fb;font-style:normal;line-height:1}
#utp .usnow b{position:absolute;width:6px;height:6px;border-radius:3px;background:#dce8fb}
#utp .uscr{isolation:isolate}
#utp .lh .mo.sq{background:rgba(2,32,71,.05);border-radius:8px;width:38px;height:38px}
#utp .bigph{box-shadow:0 2px 10px rgba(0,0,0,.05)}
#utp .bigph .pb{background:#dae7ff;font-size:14px;padding:4px 10px 4px 8px;gap:6px;top:15px;right:15px}
#utp .bigph .pb.off{background:rgba(0,0,0,.32);color:#fff;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-weight:600}
#utp .umc{margin:16px 21px 0;background:rgba(255,255,255,.78);border-radius:20px;box-shadow:0 2px 14px rgba(0,27,55,.06);padding:18px 20px 12px;min-height:143px;display:flex;flex-direction:column;align-items:flex-start}
#utp .umc .t{font-size:17px;font-weight:700;color:#191f28;line-height:1.35;margin-top:10px}
#utp .umc .ulike{margin-top:auto;padding-top:20px;font-size:14px;color:#4e5968}
#utp .ucp{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px 0 7px;border-radius:13px;font-size:13px;font-weight:600}
#utp .ucp.tea{background:#e3efff;color:#1b64da}
#utp .ucp.org{background:#fff;color:#4e5968;box-shadow:0 0 0 1px rgba(0,27,55,.05)}
#utp .ucp.etc{background:#efe8ff;color:#7655d8}
#utp .alb{display:inline-flex;align-items:center;gap:4px;background:rgba(7,25,76,.05)}
#utp .seas button{min-height:36px;padding:0 16px}
#utp .ucol{display:flex;align-items:center;width:calc(100% - 40px);margin:14px 20px 0;height:56px;background:#fff;border-radius:14px;box-shadow:0 2px 10px rgba(0,27,55,.06);padding:0 16px}
#utp .ucol .dots{display:flex;margin-right:10px}
#utp .ucol .dots i{display:block;width:26px;height:26px;border-radius:13px;margin-right:-8px;box-shadow:0 0 0 1.5px #fff}
#utp .ucol .dots i:last-child{margin-right:0}
#utp .ucol b{font-size:17px;font-weight:700;color:#191f28;margin-left:6px}
#utp .ucol .all{margin-left:auto;font-size:13px;color:#6b7684}
#utp .dg{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:22px 20px 0}
#utp .dc{height:auto;aspect-ratio:85/110;border-radius:12px}
#utp .dc::after{background:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 60%,rgba(0,0,0,.45))}
#utp .dc .bd{left:8px;right:auto;top:8px;background:rgba(255,255,255,.3);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);color:#fff;font-size:12px;font-weight:600;padding:3px 8px;border-radius:9px}
#utp .dc .dt{left:9px;bottom:8px;font-size:12px;font-weight:600}
#utp .dc .lk{right:9px;bottom:8px;font-size:12px;gap:3px}
#utp .udone{padding:calc(150px + var(--sat)) 24px 0}
#utp .udone .ill{width:215px;display:block;margin:0 auto}
#utp .udone h3{font-size:20px;margin-top:20px}
#utp .udone p{line-height:1.6}
#utp .udone em{font-style:normal;color:#ff8a1f;font-weight:600}
#utp .ctaw .bl{background:#dbe8fd}
#utp .wfnote{margin:4px 24px 20px}
#utp .cg{gap:20px 18px;padding:0 24px 40px}
#utp .cg i{border-radius:26px;box-shadow:0 6px 14px rgba(0,27,55,.12)}
#utp .cg b{display:block;font-size:15px;font-weight:700;color:#333d4b;margin-top:2px}
#utp .cg i.nx{border:1.5px dashed #d1d6db;background:#fafbfc;box-shadow:none;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#b0b8c1}
#utp .cg .nx b,#utp .cg .nx small{color:#b0b8c1}
#utp .unf{display:block;width:100%;max-width:307px;margin:14px auto 0}
#utp .usheet h4.c{text-align:center}
#utp .usheet .sb.c{text-align:center;padding-top:14px}
`;

/* ---------- state ---------- */
let root=null,st=null,hooks=null,pid=null,tipT=null,toastT=null;
const fresh=()=>({stack:['home'],sheet:null,pop:null,sort:'인기순',feed:FEED0.map((x,i)=>({...x,rk:i,ago:[95,30,140,12,60,200,45,8][i],like:x.like-(x.liked0?1:0),liked:!!x.liked0})),pickI:0,spI:0,
  up:null,mine:[{id:'m1',img:'snowman.jpg',big:'snowman_b.jpg',date:'11.26',lab:'그 밖의 겨울',t:'올해 첫 눈사람',pub:false,like:0},{id:'m2',img:'trees.jpg',big:'trees_b.jpg',date:'11.26',lab:'그 밖의 겨울',t:'밤 산책',pub:true,like:22},{id:'m3',img:'xmas.jpg',big:'xmas_b.jpg',date:'11.25',lab:'그 밖의 겨울',t:'리스 만들기',pub:true,like:12}],
  cur:null,season:'겨울',alarm:'낮 12시',alarmSel:'낮 12시',alarmOff:false,askAlarm:true,tipShown:false,reported:{},colors:[['파랑','b','11월 셋째 주']]});
const top=()=>st.stack[st.stack.length-1];
const go=s=>{st.stack.push(s);st.pop=null;st.sheet=null;draw(true)};
const back=()=>{if(st.sheet){st.sheet=null;draw();return}if(st.pop){st.pop=null;draw();return}
  if(top()==='up'&&st.up&&st.up.dirty){st.sheet='exit';draw();return}
  if(top()==='edit'&&st.up&&st.up.dirty){st.sheet='exitEdit';draw();return}
  if(st.stack.length>1){st.stack.pop();draw(true)}};
const reset=s=>{st.stack=[s];st.pop=null;st.sheet=null;draw(true)};
const toast=t=>{clearTimeout(toastT);const o=root.querySelector('.utoast');if(o)o.remove();const d=document.createElement('div');d.className='utoast';d.textContent=t;root.appendChild(d);toastT=setTimeout(()=>d.remove(),2000)};
const startUp=(chip,photo)=>{st.up={chip:chip??null,photo:photo||null,text:'',pub:true,dirty:!!photo};
  if(!st.tipShown){st.tipShown=true;st.tipUntil=Date.now()+3000;clearTimeout(tipT);tipT=setTimeout(()=>{const t=root&&root.querySelector('.utip');if(t){t.style.opacity=0;setTimeout(()=>t.remove(),300)}},3000)}
  go('up')};
const samplePhoto=k=>k==='shoot'?'snowfall.jpg':'boots_s.jpg';
const BIG={'boots_s.jpg':'boots.jpg'};

/* ---------- pieces ---------- */
const nav=()=>`<div class="tnav"><button class="bk" data-t="상단바 뒤로" data-a="back">${I.back}</button><div class="tt" data-t="상단바 앱 이름">${I.logo}<span>사계단지</span></div><div class="upill"><button class="ib" data-t="상단바 더보기(···)">${I.dots}</button><i></i><button class="end" data-t="상단바 종료하기" data-a="end">종료하기</button></div></div>`;
const tabbar=on=>`<div class="utab"><button class="ti ${on==='home'?'on':''}" data-t="하단 탭 홈" data-a="tab:home">${on==='home'?I.home:I.homeo}홈</button><button class="camb" data-t="하단 탭 카메라" data-a="camera">${I.cam}</button><button class="ti ${on==='danji'?'on':''}" data-t="하단 탭 내 단지" data-a="tab:danji">${on==='danji'?I.jaron:I.jar}내 단지</button></div>`;
const pad='<div style="height:calc(44px + var(--sat))"></div>';
const fcard=(f)=>`<button class="ucard" data-t="사진 카드 '${esc(f.t)}'" data-a="feed:${f.id}"><span class="ph" style="background-image:url('${IMG+f.img}')"></span><span class="bdg">${esc(f.lab)}</span><span class="hb" data-t="사진 카드 '${esc(f.t)}' 하트" data-a="like:${f.id}">${I.heart(f.liked)}</span><span class="tx"><b>${esc(f.t)}</b><span>${esc(f.by)}</span></span></button>`;
const pk=(x,i,k)=>`<div class="upk" data-t="${k==='pick'?'에디터 PICK':'에디터 특별 추천'} 카드 '${esc(x.t)}'" data-a="src:${k}:${i}"><img src="${IMG}jar.jpg" alt=""><div><b>${esc(x.t)}</b><small>${esc(x.src)}</small></div><button class="ugo" data-t="${k==='pick'?'에디터 PICK':'에디터 특별 추천'} '${esc(x.pf)}로 이동'" data-a="src:${k}:${i}">${esc(x.pf)}로 이동</button></div>`;

/* ---------- screens ---------- */
const S={};
const CW={b:'linear-gradient(160deg,#d6e6ff,#3182f6)',o:'linear-gradient(160deg,#ffc9a0,#f26a10)'};
const CDOT={b:'#3182f6',o:'#ff7a1a'};
const chipPill=l=>l==='따뜻한 차'?`<span class="ucp tea">${I.cpTea}따뜻한 차</span>`:l==='주황'?`<span class="ucp org">${I.cpOrg}주황</span>`:`<span class="ucp etc">${I.cpEtc}${esc(l)}</span>`;
const snow=`<div class="usnow" aria-hidden="true"><i style="left:330px;top:98px;font-size:18px">❄</i><i style="left:6px;top:196px;font-size:14px">❄</i><i style="left:354px;top:300px;font-size:16px">❄</i><i style="left:4px;top:440px;font-size:13px">❄</i><i style="left:312px;top:690px;font-size:20px">❄</i><i style="left:36px;top:716px;font-size:15px">❄</i><b style="left:64px;top:104px"></b><b style="left:252px;top:98px"></b><b style="left:362px;top:470px"></b><b style="left:8px;top:528px"></b><b style="left:176px;top:692px"></b></div>`;
const pubBadge=pub=>pub?`<span class="pb">${I.people('#1660e8',18)}공개</span>`:`<span class="pb off">${I.lock('#fff',16)}비공개</span>`;
const metaCard=(lab,t,likeBtn)=>`<div class="umc"><div>${chipPill(lab)}</div>${t?`<div class="t">${esc(t)}</div>`:''}${likeBtn}</div>`;
S.home=()=>{const fd=st.feed.filter(f=>!st.reported[f.id]);const srt=st.sort==='인기순'?[...fd].sort((a,b)=>(a.rk??99)-(b.rk??99)):[...fd].sort((a,b)=>(a.ago??0)-(b.ago??0));
  const g1=srt.slice(0,4),g2=srt.slice(4);
  return `<div class="uscr" data-scr>
  <div class="uhero" data-t="상단 배너"><img src="${IMG}hero.jpg" alt=""><h1>오늘, 겨울을<br>이렇게 즐겨봐요</h1></div>
  <div class="utops"><button class="tc" data-t="이번 주 찾을 색 카드" data-a="upchip:0"><div class="s">이번 주 찾을 색</div><div style="display:flex;gap:8px;align-items:center;margin-top:12px"><span class="sw"></span><span class="b">주황</span></div></button>
  <button class="tc" data-t="오늘 해 볼 것 카드" data-a="upchip:1" style="padding-top:20px"><div class="s">오늘 해 볼 것</div><div class="b" style="margin-top:1px">따뜻한 차 마시기</div><div class="x">좋아하는 컵에 담아 한 장 남겨요</div></button></div>
  <div class="usec" style="position:relative"><h2 data-t="'다른 사람들의 겨울' 제목">다른 사람들의 겨울</h2><button class="sort ${st.pop==='sort'?'op':''}" data-t="정렬 버튼(${st.sort})" data-a="sortpop">${st.sort}${I.chev}</button>
  ${st.pop==='sort'?`<div class="upop" style="right:0;top:36px"><div class="h">보기 방식</div>${['인기순','최신순'].map(o=>`<button class="${st.sort===o?'on':''}" data-t="'${o}'" data-a="sort:${o}">${st.sort===o?I.check:'<span style="width:16px"></span>'}${o}</button>`).join('')}</div>`:''}</div>
  ${fd.length?`<div class="ugrid">${g1.map(fcard).join('')}</div>
  <div class="usec" style="margin-top:24px;margin-bottom:12px"><h2 data-t="'에디터의 PICK' 제목">사계단지 에디터의 PICK!</h2><span class="n">${st.pickI+1}/${PICK.length}</span></div>
  <div class="ucar" data-car="pick">${PICK.map((x,i)=>pk(x,i,'pick')).join('')}</div>
  <div class="ugrid" style="margin-top:24px">${g2.map(fcard).join('')}</div>
  <div class="usec" style="margin-top:24px;margin-bottom:12px"><h2 data-t="'에디터의 PICK'(두 번째) 제목">사계단지 에디터의 PICK!</h2><span class="n">${st.spI+1}/${SPECIAL.length}</span></div>
  <div class="ucar" data-car="sp">${SPECIAL.map((x,i)=>pk(x,i,'sp')).join('')}</div>
  <p class="endtx" data-t="피드 끝 문구">오늘 해 볼 것은 매일, 찾을 색은 월요일마다 바뀌어요</p>`
  :`<div class="uempty" data-t="빈 피드 안내"><img class="ill" src="${IMG}ill_empty.png" alt="" style="width:90px"><b>아직 올라온 사진이 없어요</b><p>오늘 첫 사진을 올리면<br>여기에서 모두가 같이 볼 수 있어요</p><button data-t="첫 사진 올리기" data-a="upchip:">첫 사진 올리기</button></div>`}
  <div style="height:calc(130px + var(--sab))"></div></div>`+tabbar('home')};
S.detail=()=>{const f=st.feed.find(x=>x.id===st.cur);if(!f)return S.home();const n=f.like+(f.liked?1:0);
  return `<div class="uscr grad" data-scr>${snow}${pad}
  <div class="lh"><button data-t="게시물 뒤로(원 화살표)" data-a="back">${I.lc}</button><div class="nm"><b>${esc(f.by)}</b><span>30분 전</span></div><button class="mo sq" data-t="게시물 신고 버튼" data-a="sheet:report">${I.siren}</button></div>
  <div class="bigph" data-t="게시물 사진" style="background-image:url('${IMG+(f.big||f.img)}')">${pubBadge(true)}</div>
  ${metaCard(f.lab,f.t,`<button class="ulike" data-t="게시물 좋아요(${f.liked?'취소':'누름'})" data-a="like:${f.id}"><span class="hi">${I.heart(f.liked,'#4e5968',18)}</span>${n}</button>`)}
  <div style="height:calc(140px + var(--sab))"></div></div>
  <div class="ucta"><button class="bp" data-t="나도 해보기" data-a="metoo:${f.id}">나도 해보기</button></div>`};
const visBtns=u=>`<div class="uvis"><button class="bm ${u.pub?'on':''}" data-t="공개 범위 '공개'" data-a="pub:1">${I.people(u.pub?'#1660e8':'#8b95a1')}공개</button><button class="bm ${!u.pub?'on':''}" data-t="공개 범위 '비공개'" data-a="pub:0">${I.lock(!u.pub?'#1660e8':'#8b95a1')}비공개</button></div>`;
S.up=()=>{const u=st.up;const ok=u.photo&&u.chip!=null;
  return `<div class="uscr" data-scr>${pad}
  <div class="uh"><button data-t="올리기 닫기(✕)" data-a="back">${I.xc}</button><h3>겨울단지에 저장하기</h3></div>
  <button class="pbox ${u.photo?'has':''}" data-t="${u.photo?'고른 사진(바꾸기)':'사진 고르기'}" data-a="sheet:pick" style="${u.photo?`background-image:url('${IMG+u.photo}')`:''}">${u.photo?'':I.plus+'사진 고르기'}</button>
  <div class="fl"><div class="lb">어떤 사진인가요?</div><div class="hp">이번 주 찾을 색과 오늘 해 볼 것만 고를 수 있어요</div>
  <div class="chr">${CHIPS.map((c,i)=>`<button class="bm ${u.chip===i?'on':''}" data-t="사진 종류 '${c}'" data-a="chip:${i}">${c}</button>`).join('')}</div></div>
  <div class="fl" style="padding-top:0"><div class="lb">한 줄 남기기 (선택)</div><div class="tf"><input maxlength="40" data-t="한 줄 남기기 입력칸" data-in="text" value="${esc(u.text)}" placeholder="이 순간을 한 줄로 남겨 보세요"></div></div>
  <div class="fl" style="padding-top:0"><div class="lb">누가 볼 수 있나요?</div><div class="hp">언제든 내 단지에서 공개 범위를 바꿀 수 있어요</div>${visBtns(u)}</div>
  <div style="height:calc(150px + var(--sab))"></div></div>
  ${(st.tipUntil||0)>Date.now()?`<div class="utip" data-t="안내 말풍선">지금 계절에 맞춰 단지가 정해져요</div>`:''}
  <div class="ucta"><button class="bp" data-t="저장하기${ok?'':'(비활성)'}" data-a="save" ${ok?'':'disabled'}>저장하기</button></div>`};
S.done=()=>{const r=st.last;return `<div class="uscr" data-scr style="background:linear-gradient(180deg,#fff,#fafbfd)">
  <div class="udone"><img class="ill" src="${IMG}ill_done.png" alt="" data-t="완료 그림"><h3>겨울 단지에 저장했어요</h3>
  <p>${r.chip===0&&r.firstColor?`오늘 <em>주황</em>을 찾았어요<br>이번 겨울에 찾은 색은 ${st.colors.length}개예요!`:(r.pub?'다른 사람들도 볼 수 있게 올렸어요':'나만 볼 수 있게 저장했어요')}</p></div>
  <div style="height:200px"></div></div>
  <div class="ctaw">${r.pub?`<button class="bp" data-t="다른 사람들 사진 보기" data-a="tohome">다른 사람들 사진 보기</button><button class="bl" data-t="내 단지 보기" data-a="todanji">내 단지 보기</button>`:`<button class="bp" data-t="내 단지 보기" data-a="todanji">내 단지 보기</button><button class="bl" data-t="홈으로" data-a="tohome">홈으로</button>`}</div>`};
S.danji=()=>{const ms=st.season==='겨울'?st.mine:[];const nc=st.colors.length;
  return `<div class="uscr grad" data-scr>${snow}${pad}
  <div class="dh"><h2 data-t="'내 단지' 제목">내 단지</h2><button class="alb" data-t="알림 버튼(${st.alarmOff?'꺼짐':st.alarm})" data-a="sheet:alarm">${I.bell}알림 · ${st.alarmOff?'꺼짐':st.alarm}</button></div>
  <div class="seas">${['봄','여름','가을','겨울'].map(s=>`<button class="${st.season===s?'on':''}" data-t="계절 '${s}'" data-a="season:${s}">${s==='겨울'?'겨울 · 지금':s}</button>`).join('')}</div>
  ${st.season==='겨울'?`<button class="ucol" data-t="찾은 색 카드" data-a="go:colors"><span class="dots">${nc?st.colors.map(c=>`<i style="background:${CDOT[c[1]]}"></i>`).join(''):'<i style="background:#4e5968"></i><i style="background:#b0b8c1"></i>'}</span><b>찾은 색 ${nc}개</b><span class="all">전체 보기 ›</span></button>`:''}
  ${ms.length?`<div class="dg">${ms.map(m=>`<button class="dc" data-t="내 기록 카드 '${esc(m.t||m.date)}'" data-a="mine:${m.id}" style="background-image:url('${IMG+m.img}')"><span class="bd">${m.pub?'공개':'비공개'}</span><span class="dt">${esc(m.date)}</span><span class="lk">${I.heart(false,'#fff',13)}${m.like}</span></button>`).join('')}</div>`
  :st.season==='겨울'?`<div class="uempty dj" data-t="빈 단지 안내"><img class="ill" src="${IMG}ill_jar.png" alt="" style="width:190px"><b>아직 올린 사진이 없어요</b><p>나의 겨울 단지에<br>첫 사진을 올려봐요</p><button data-t="첫 사진 올리기" data-a="upchip:">첫 사진 올리기</button></div>`
  :`<p class="unone" data-t="빈 계절">${esc(st.season)}에 남긴 기록이 아직 없어요</p>`}
  <div style="height:calc(130px + var(--sab))"></div></div>`+tabbar('danji')};
S.mine=()=>{const m=st.mine.find(x=>x.id===st.cur);if(!m)return S.danji();
  return `<div class="uscr grad" data-scr>${snow}${pad}
  <div class="lh"><button data-t="내 기록 뒤로(원 화살표)" data-a="back">${I.lc}</button><div class="nm"><b>${ME}</b><span>${m.fresh?'방금 전':'30분 전'}</span></div><button class="mo ${st.pop==='mm'?'op':''}" data-t="내 기록 더보기(···)" data-a="pop:mm">${I.dotsg}</button></div>
  ${st.pop==='mm'?`<div class="umenu" style="top:calc(98px + var(--sat))"><button data-t="'수정하기'" data-a="edit">수정하기</button><button data-t="'삭제하기'" data-a="sheet:del">삭제하기</button></div>`:''}
  <div class="bigph" data-t="내 기록 사진" style="background-image:url('${IMG+(m.big||m.img)}')">${pubBadge(m.pub)}</div>
  ${metaCard(m.lab,m.t,`<div class="ulike" data-t="내 기록 좋아요 수"><span class="hi">${I.heart(false,'#4e5968',18)}</span>${m.like}</div>`)}
  <div style="height:80px"></div></div>`};
S.edit=()=>{const u=st.up,m=st.mine.find(x=>x.id===st.cur);
  return `<div class="uscr" data-scr>${pad}
  <div class="uh"><button data-t="수정 닫기(✕)" data-a="back">${I.xc}</button><h3>기록 수정하기</h3></div>
  <div class="pbox has" data-t="수정 화면 사진" style="background-image:url('${IMG+(m.big||u.photo)}')"></div>
  <div class="fl"><div class="lb">어떤 사진인가요?</div><div class="hp">업로드 한 뒤에는 수정할 수 없어요</div><div class="chr"><span class="bm fix" data-t="사진 종류(고정)">${esc(m.lab==='주황'?'주황찾기':m.lab)}</span></div></div>
  <div class="fl" style="padding-top:0"><div class="lb">한 줄 남기기 (선택)</div><div class="tf"><input maxlength="40" data-t="수정 한 줄 입력칸" data-in="text" value="${esc(u.text)}" placeholder="이 순간을 한 줄로 남겨 보세요"></div></div>
  <div class="fl" style="padding-top:0"><div class="lb">누가 볼 수 있나요?</div><div class="hp">언제든 내 단지에서 공개 범위를 바꿀 수 있어요</div>${visBtns(u)}</div>
  <div style="height:calc(150px + var(--sab))"></div></div>
  <div class="ucta"><button class="bp" data-t="수정 완료" data-a="editsave">수정 완료</button></div>`};
S.colors=()=>`<div class="uscr" data-scr style="background:#fff">${pad}
  <div class="lh"><button data-t="찾은 색 뒤로(원 화살표)" data-a="back">${I.lc}</button><div class="nm"><b style="font-size:20px">찾은 색</b></div></div>
  <p class="wfnote">이번 주 찾을 색으로 사진을 올리면 한 칸씩 모여요</p>
  <div class="cg">${st.colors.map(c=>`<div data-t="찾은 색 '${c[0]}'"><i style="background:${CW[c[1]]}"></i><b>${c[0]}</b><small>${c[2]}</small></div>`).join('')}<div class="nx" data-t="'다음 주 색' 빈칸"><i class="nx">?</i><b>다음 주 색</b><small>12월 첫째 주</small></div></div></div>`;

/* ---------- sheets ---------- */
const sheet=(name,h,sb,body,ba)=>`<div class="udim" data-t="${name} 바깥(어두운 곳)" data-a="dim"><div class="usheet" data-sheet="${name}"><div class="hd"></div><h4>${h}</h4>${sb?`<p class="sb">${sb}</p>`:''}${body||''}${ba}</div></div>`;
const two=(n,l,la,r,ra,red)=>`<div class="ba"><button class="bs" data-t="'${l}'" data-a="${la}">${l}</button><button class="bp" data-t="'${r}'" data-a="${ra}">${r}</button></div>`;
const SH={
 src:()=>{const x=(st.srcK==='pick'?PICK:SPECIAL)[st.srcI];return sheet('원문 이동 확인',`${x.pf}에서 볼까요?`,`${esc(x.t)} - ${esc(x.src.split(' · ')[1]||'')}<br>잠깐 사계단지를 떠나요. 돌아오면 보던 곳에서 이어서 볼 수 있어요.`,'',two('원문 이동 확인','닫기','close',`${x.pf}로`,'srcgo'))},
 report:()=>sheet('신고 확인','이 사진을 신고할까요?','신고하면 이 사진은 바로 피드에서 사라지고, 운영진이 확인해요.','',two('신고 확인','닫기','close','신고하기','report')),
 pick:()=>sheet('사진 추가','사진을 추가해주세요','등록일 기준으로 맞는 계절에 자동 저장돼요','',`<div class="bv"><button class="bp" data-t="'앨범에서 선택'" data-a="album">앨범에서 선택</button><button class="bl" data-t="'카메라로 촬영'" data-a="sheet:perm">카메라로 촬영</button></div>`),
 perm:()=>sheet('카메라 권한','카메라 사용 권한이 필요해요','사계단지에 기록할 사진을 촬영하기 위해<br>카메라 사용 권한이 필요해요',
   [['pcam','수집항목','카메라로 촬영한 사진'],['pdoc','이용 목적','사계단지에 기록할 사진 촬영 및 업로드'],['plock','보관 기간','촬영한 사진만 사용되며, 별도로 저장하지 않아요']].map(([i,b,s])=>`<div class="pr" data-t="'${b}' 안내"><span class="ic">${I[i]}</span><div><b>${b}</b><span>${s}</span></div></div>`).join(''),
   two('카메라 권한','뒤로','sheet:pick','계속','shoot')),
 exit:()=>sheet('나가기 확인','작성한 내용이 사라져요','지금 나가면 고른 사진과 적은 글이 사라져요','',two('나가기 확인','나가기','leave','계속 쓰기','close')),
 exitEdit:()=>sheet('나가기 확인','고친 내용이 사라져요','지금 나가면 고친 내용이 저장되지 않아요','',two('나가기 확인','나가기','leave','계속 고치기','close')),
 del:()=>sheet('삭제 확인','이 기록을 삭제할까요?','사진과 받은 좋아요가 함께 사라지고, 되돌릴 수 없어요','',two('삭제 확인','닫기','close','삭제하기','del')),
 ask:()=>`<div class="udim" data-t="알림 제안 바깥(어두운 곳)" data-a="dim"><div class="usheet" data-sheet="알림 제안"><div class="hd"></div><h4 class="c">내일 점심,<br>새 추천을 알려드릴까요?</h4><img class="unf" src="${IMG}notif.png" alt="" data-t="알림 미리보기 그림"><p class="sb c">하루에 한 번,<br>새 추천이 열리면 토스 알림으로 알려드려요<br>시간은 내 단지에서 바꿀 수 있어요</p><div class="ba" style="padding-top:20px"><button class="bs" data-t="'괜찮아요'" data-a="alarmask:0">괜찮아요</button><button class="bp" data-t="'알림 받기'" data-a="alarmask:1">알림 받기</button></div></div></div>`,
 alarm:()=>sheet('알림 시간','언제 알려드릴까요?','하루 한 번, 오늘 해 볼 것이 열리면<br>토스 알림으로 알려드려요',
   `<div class="uopt">${[['sunrise','아침 8시'],['sun','낮 12시'],['moon','저녁 6시']].map(([i,t])=>{const on=!st.alarmOff&&st.alarmSel===t;return `<button class="${on?'on':''}" data-t="'${t}'" data-a="alarmsel:${t}">${I[i](on)}${t}</button>`}).join('')}</div><button class="nof" data-t="'알림 받지 않기'" data-a="alarmoff">${I.cbox(st.alarmOff)}알림 받지 않기</button>`,
   `<div class="ba"><button class="bp" data-t="'${st.alarmOff?'알림 끄기':'이 시간에 알림 받기'}'" data-a="alarmsave">${st.alarmOff?'알림 끄기':'이 시간에 알림 받기'}</button></div>`)
};

/* ---------- draw ---------- */
const SHN={src:'원문 이동 확인',report:'신고 확인',pick:'사진 추가',perm:'카메라 권한',exit:'나가기 확인',exitEdit:'나가기 확인',del:'삭제 확인',alarm:'알림 시간',ask:'알림 제안'};
function draw(resetScroll){
  if(!root)return;
  const old=root.querySelector('[data-scr]'),y=old&&!resetScroll?old.scrollTop:0;
  const cx={};root.querySelectorAll('[data-car]').forEach(c=>cx[c.dataset.car]=c.scrollLeft);
  const foc=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.in;
  root.innerHTML=S[top()]()+nav()+(st.sheet?SH[st.sheet]():'');
  const n=root.querySelector('[data-scr]');if(n)n.scrollTop=y;
  if(n){const nv=root.querySelector('.tnav');const f=()=>nv&&nv.classList.toggle('solid',n.scrollTop>8);f();n.addEventListener('scroll',f,{passive:true})}
  root.querySelectorAll('[data-car]').forEach(c=>{if(!resetScroll&&cx[c.dataset.car])c.scrollLeft=cx[c.dataset.car];c.addEventListener('scroll',()=>{const i=Math.round(c.scrollLeft/301);const k=c.dataset.car==='pick'?'pickI':'spI';if(st[k]!==i){st[k]=i;const lab=c.previousElementSibling&&c.previousElementSibling.querySelector('.n');if(lab)lab.textContent=(i+1)+'/'+(k==='pickI'?PICK.length:SPECIAL.length)}},{passive:true})});
  if(foc){const i=root.querySelector(`[data-in="${foc}"]`);if(i){i.focus();const v=i.value;i.setSelectionRange(v.length,v.length)}}
}
const where=()=>st.sheet?SHN[st.sheet]:(st.pop==='sort'?'홈 · 정렬 메뉴':st.pop==='mm'?'내 기록 · 더보기 메뉴':SCREEN[top()]);

/* ---------- actions ---------- */
function act(a){
  const [k,v]=a.split(/:(.*)/s);
  const u=st.up;
  switch(k){
  case 'back':back();return;
  case 'end':api.close(true);return;
  case 'tab':st.pop=null;reset(v);return;
  case 'go':go(v);return;
  case 'camera':st.sheet='pick';st.pickFrom='tab';draw();return;
  case 'upchip':st.pickFrom=null;startUp(v===''?null:Number(v));return;
  case 'sortpop':st.pop=st.pop==='sort'?null:'sort';draw();return;
  case 'sort':st.sort=v;st.pop=null;draw();return;
  case 'pop':st.pop=st.pop===v?null:v;draw();return;
  case 'feed':{const f=st.feed.find(x=>x.id===v);if(f&&f.mineId&&st.mine.some(m=>m.id===f.mineId)){st.cur=f.mineId;go('mine');return}st.cur=v;go('detail');return}
  case 'like':{const f=st.feed.find(x=>x.id===v);f.liked=!f.liked;draw();if(f.liked&&top()==='detail')toast('좋아요를 눌렀어요');return}
  case 'metoo':{const f=st.feed.find(x=>x.id===v);startUp(CHIPS.indexOf(f.lab==='주황'?'주황찾기':f.lab)>=0?CHIPS.indexOf(f.lab==='주황'?'주황찾기':f.lab):null);return}
  case 'src':{const [kk,i]=v.split(':');st.srcK=kk;st.srcI=Number(i);st.sheet='src';draw();return}
  case 'srcgo':st.sheet=null;draw();toast('실제 앱에서는 이때 원문으로 이동해요');return;
  case 'sheet':st.pop=null;st.sheet=v;draw();return;
  case 'close':case 'dim':st.sheet=null;draw();return;
  case 'report':st.reported[st.cur]=1;st.sheet=null;st.stack=['home'];draw(true);toast('신고했어요. 이 사진은 피드에서 사라졌어요');return;
  case 'album':case 'shoot':{st.sheet=null;const ph=samplePhoto(k);
    if(st.pickFrom==='tab'&&top()!=='up'&&top()!=='edit'){st.pickFrom=null;startUp(null,ph);return}
    if(u){u.photo=ph;u.dirty=true}draw();return}
  case 'chip':u.chip=u.chip===Number(v)?null:Number(v);u.dirty=true;draw();return;
  case 'pub':u.pub=v==='1';u.dirty=true;draw();return;
  case 'leave':st.sheet=null;st.stack.pop();st.up=null;draw(true);return;
  case 'save':{if(!(u.photo&&u.chip!=null))return;const lab=['주황','따뜻한 차','그 밖의 겨울'][u.chip];
    const first=u.chip===0&&!st.colors.some(c=>c[2]==='11월 넷째 주');if(first)st.colors=[...st.colors,['주황','o','11월 넷째 주']];
    const mid='m'+Date.now();st.mine=[{id:mid,img:u.photo,big:BIG[u.photo],date:'11.28',fresh:1,lab,t:u.text,pub:u.pub,like:0},...st.mine];
    if(u.pub)st.feed=[{id:'me'+Date.now(),t:u.text||lab,by:ME,img:u.photo,big:BIG[u.photo],lab,like:0,liked:false,mineId:mid},...st.feed];
    st.last={pub:u.pub,chip:u.chip,firstColor:first};st.up=null;st.stack=['done'];draw(true);return}
  case 'alarmask':st.askAlarm=false;st.sheet=null;draw();if(v==='1'){st.alarm='낮 12시';st.alarmOff=false;toast('낮 12시에 알려드릴게요')}return;
  case 'tohome':st.sort='최신순';reset('home');if(st.askAlarm){st.sheet='ask';draw()}return;
  case 'todanji':st.season='겨울';reset('danji');if(st.askAlarm){st.sheet='ask';draw()}return;
  case 'season':st.season=v;draw();return;
  case 'mine':st.cur=v;go('mine');return;
  case 'edit':{const m=st.mine.find(x=>x.id===st.cur);st.up={photo:m.img,text:m.t||'',pub:m.pub,dirty:false};st.pop=null;go('edit');return}
  case 'editsave':{const m=st.mine.find(x=>x.id===st.cur);m.img=u.photo;m.t=u.text;m.pub=u.pub;st.up=null;st.stack.pop();draw(true);toast('수정했어요');return}
  case 'del':st.mine=st.mine.filter(x=>x.id!==st.cur);st.sheet=null;st.stack=['danji'];draw(true);toast('기록을 삭제했어요');return;
  case 'alarmsel':st.alarmSel=v;st.alarmOff=false;draw();return;
  case 'alarmoff':st.alarmOff=!st.alarmOff;draw();return;
  case 'alarmsave':st.sheet=null;if(!st.alarmOff)st.alarm=st.alarmSel;draw();toast(st.alarmOff?'알림을 껐어요':`${st.alarm}에 알려드릴게요`);return;
  }
}

/* ---------- events ---------- */
function onClick(ev){
  let el=ev.target.closest('[data-t]');
  if(el&&el.classList.contains('udim')&&ev.target.closest('.usheet'))el=null;
  const label=where()+' · '+(el?el.dataset.t:'빈 곳');
  try{hooks.tap(label)}catch(e){}
  const a=ev.target.closest('[data-a]');
  if(!a)return;
  if(a.dataset.a==='dim'&&ev.target.closest('.usheet'))return;
  if(a.disabled)return;
  ev.preventDefault();
  act(a.dataset.a);
}
function onInput(ev){const i=ev.target;if(!i.dataset.in||!st.up)return;st.up.text=i.value;st.up.dirty=true;}

const api={
  guide:'처음 들어왔다고 생각하고 마음대로 써 보세요.',
  render(p,{esc:e,preview}={}){
    const n=(p.taps||[]).length;
    return `<div data-proto style="background:#fff;border:1px solid #e6e9ef;border-radius:16px;padding:18px 16px;margin-bottom:12px;text-align:center">
      <div style="font-size:17px;font-weight:800;margin-bottom:6px">사계단지 앱 써 보기</div>
      <p style="font-size:13px;color:#5d6470;margin:0 0 14px;line-height:1.5">버튼을 누르면 앱이 전체 화면으로 열려요.<br>다 써 보면 위쪽의 <b>종료하기</b>를 눌러 주세요.</p>
      <button ${preview?'disabled':''} data-proto-open style="width:100%;border:0;border-radius:14px;background:#2350a8;color:#fff;padding:14px;font-weight:700;font-size:16px;min-height:48px">${n?'다시 열기':'프로토타입 쓰기'}</button>
      ${n?`<p style="font-size:12px;color:#7a8190;margin:10px 0 0">다 써 봤으면 '다음'을 누르거나 진행자 안내를 기다려 주세요</p>`:''}
    </div>`;
  },
  open(p,h={}){
    if(!document.getElementById('utp-css')){const s=document.createElement('style');s.id='utp-css';s.textContent=CSS;document.head.appendChild(s)}
    api.close(false);
    hooks={tap:h.tap||(()=>{}),close:h.close||(()=>{})};pid=p.id;
    st=fresh();
    root=document.createElement('div');root.id='utp';
    const mount=h.mount||document.body;if(h.mount)root.classList.add('in');
    mount.appendChild(root);
    root.addEventListener('click',onClick);root.addEventListener('input',onInput);
    try{hooks.tap('프로토타입 시작')}catch(e){}
    draw(true);
    if(h.fs!==false&&document.documentElement.requestFullscreen&&!document.fullscreenElement){document.documentElement.requestFullscreen().catch(()=>{})}
  },
  close(byUser){
    if(!root)return;
    root.remove();root=null;clearTimeout(tipT);clearTimeout(toastT);
    if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
    const h=hooks;hooks=null;const was=pid;pid=null;
    if(h&&h.close)h.close(!!byUser,was);
  },
  openFor(){return root?pid:null}
};
window.UT_PROTO=api;
})();
