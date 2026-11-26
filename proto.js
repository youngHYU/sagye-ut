/* =====================================================================
   프로토타입 모듈 — 디자이너 최종 디자인이 나오면 이 파일만 바꾸면 됩니다.
   - guide: 자유 사용 단계 맨 위 안내 문구
   - render(p, ctx): 참가자 화면에 들어갈 HTML. 바깥 요소에 data-proto 를 붙이고,
     누른 순서를 기록하고 싶은 요소에 data-tap="이름" 을 붙이면 운영진 결과표
     '누른 순서'에 자동으로 쌓입니다.
   - onTap(p, el): (선택) 눌렀을 때 화면 상태 바꾸기. p.tab 처럼 p 에 값을 두면 저장됩니다.
   피그마 프로토타입을 그대로 넣고 싶으면 아래 FIGMA_EMBED 에 공유 링크를 넣으세요.
   (이 경우 피그마 안에서 누른 순서는 기록되지 않습니다.)
   ===================================================================== */
const FIGMA_EMBED='';
window.UT_PROTO={
  guide:'처음 들어왔다고 생각하고 1분 동안 마음대로 써 보세요.',
  render(p,{esc}){
    if(FIGMA_EMBED)return `<div data-proto class="app" style="height:560px"><iframe style="border:0;width:100%;height:100%" src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(FIGMA_EMBED)}" allowfullscreen></iframe></div>`;
    const tabs=`<div class="atabs"><button class="${p.tab==='today'?'on':''}" data-tap="오늘 탭" data-apptab="today">오늘</button><button class="${p.tab==='danji'?'on':''}" data-tap="내 단지 탭" data-apptab="danji">내 단지</button></div>`;
    if(p.tab==='danji'){
      const jars=[['봄','#f4b8c8','30%'],['여름','#7fc8a9','45%'],['가을','#e9a35b','60%'],['겨울','#dfe6f0','20%']];
      return `<div class="app" data-proto><div class="apph">사계단지<span class="small">내 단지</span></div>${tabs}<div class="abody"><div class="jars">${jars.map(([n,c,f])=>`<button class="jar" data-tap="${n} 단지"><i style="--c:${c};--f:${f}"></i>${n}</button>`).join('')}</div><p class="small" style="margin:10px 0 0">겨울 단지에 방금 찍은 흰색 사진이 들어갔어요</p></div></div>`;
    }
    const tiles=[['#c9d6e3','눈 내린 길'],['#e8e2d6','흰 머그'],['#b7c4d4','하늘'],['#d6cfc4','붕어빵'],['#aebbc9','창가'],['#e1d8cc','목도리']];
    return `<div class="app" data-proto><div class="apph">사계단지<span class="small">오늘</span></div>${tabs}<div class="abody">
    <button class="acard" data-tap="이번 주 색 카드"><span class="sw"></span><b>이번 주 색 · 흰색</b><br><span class="small">주변의 흰색을 찾아 담아 보세요</span></button>
    <button class="acard" data-tap="오늘의 주제"><b>오늘의 주제</b><br><span class="small">동지 전에 팥죽 먹어 보기</span></button>
    <div class="small" style="margin:6px 0">오늘 피드</div>
    <div class="feed">${tiles.map(([c,n])=>`<button data-tap="피드 사진" style="background:${c}">${n}</button>`).join('')}</div>
    <button class="fab" data-tap="기록하기">+ 기록하기</button></div></div>`;
  },
  onTap(p,el){if(el.dataset.apptab)p.tab=el.dataset.apptab}
};
