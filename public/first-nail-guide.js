import {basicNailShapes,nailShapeIcon} from './nail-shapes.js';

const artSamples=[
 {style:'solid',name:'원컬러',caption:'한 가지 색'},
 {style:'gradient',name:'그라데이션',caption:'색이 부드럽게 변해요'},
 {style:'french',name:'프렌치',caption:'끝에만 넣은 색'},
 {style:'accent',name:'일반 아트',caption:'원하는 무늬·장식'},
 {style:'monthly',name:'이달의 아트',caption:'매장 추천 디자인'}
];

function careSummary(title,tip,icon){
 return `<summary>
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${icon}</svg>
  <span><strong>${title}</strong><small>${tip}</small></span>
 </summary>`;
}

export function firstNailGuide(){
 const shapes=Object.entries(basicNailShapes).filter(([key])=>key);
 return `<h3 class="first-nail-heading">네일 아트 종류</h3>
 <ul class="first-nail-art">
  ${artSamples.map(({style,name,caption})=>`<li>
   <div class="art-sample art-sample--${style}" aria-hidden="true"><i></i><i></i><i></i></div>
   <strong>${name}</strong><span>${caption}</span>
  </li>`).join('')}
 </ul>
 <h3 class="first-nail-heading first-nail-spaced">시술 전후 체크</h3>
 <div class="first-nail-topics">
  <details>
   ${careSummary('방문 전','사진 준비 · 추가요금 확인','<rect x="8" y="9" width="32" height="26" rx="5"/><circle cx="18" cy="18" r="3"/><path d="m9 31 9-8 6 5 6-8 9 11"/><path d="M15 41h18"/>')}
   <ul>
    <li>원하는 사진이 있다면 보여주고, 색·길이·장식 중 꼭 살리고 싶은 부분을 말해 주세요.</li>
    <li>한두 손톱에만 포인트를 줄 수도 있어요. 이달의 아트는 색이나 장식을 바꿀 수 있는지 물어보세요.</li>
    <li><strong>제거</strong>는 기존 젤을 떼는 작업이에요. <strong>연장</strong>은 짧은 손톱에 길이를 더하는 작업이에요. 다른 매장에서 받은 젤이나 연장이 남아 있다면 미리 알려주세요.</li>
    <li>기본 시술에 제거·연장·장식이 포함되는지, 추가요금과 예상 소요 시간은 얼마인지 시술 전에 물어보세요.</li>
    <li>이전에 젤이나 접착제로 피부가 가렵거나 붓는 반응이 있었다면 시술 전에 알려주세요. 손톱 주변에 상처나 붓기가 있으면 시술을 미루고, 증상이 계속되면 피부과에 상담하세요.</li>
   </ul>
   <p class="first-nail-example">“짧은 오벌 모양에 베이지색으로 하고, 양손 약지에만 작은 장식을 넣고 싶어요.”</p>
  </details>
  <details>
   ${careSummary('시술 중','길이·색 확인 · 불편하면 말하기','<path d="M8 12q0-4 4-4h24q4 0 4 4v16q0 4-4 4H23l-9 8v-8h-2q-4 0-4-4Z"/><path d="M24 14v8m0 4h.1"/>')}
   <ul>
    <li>기구를 손님마다 소독하는지 확인하고, 큐티클을 깊게 자르거나 세게 밀지 말아 달라고 요청하세요.</li>
    <li>손톱 길이와 모양을 먼저 맞춘 뒤 색과 장식 위치를 확인하세요. 손톱을 다듬거나 젤을 굳힐 때 아프거나 뜨거우면 바로 말해 주세요.</li>
    <li>젤을 굳히는 램프에 손을 넣기 전, 손 피부 보호를 위해 광범위 차단·내수성 SPF 30 이상 자외선 차단제나 손끝이 열린 불투명 장갑을 사용할 수 있어요.</li>
   </ul>
  </details>
  <details>
   ${careSummary('시술 후','들뜬 젤은 손으로 뜯지 않기','<path d="M24 7C19 15 13 21 13 29a11 11 0 0 0 22 0c0-8-6-14-11-22Z"/><path d="M19 29a5 5 0 0 0 5 5m14-19h6m-3-3v6"/>')}
   <ul>
    <li>젤 끝이 들뜨더라도 손으로 뜯지 말고, 매장에 제거 방법이나 제거 일정을 문의하세요.</li>
    <li>손톱과 주변 피부가 건조하면 핸드크림이나 보습제를 발라 주세요.</li>
    <li>붉어짐, 붓기, 가려움이 지속되거나 손톱에 평소와 다른 변화가 생기면 피부과에 상담하세요.</li>
   </ul>
  </details>
 </div>
 <h3 class="first-nail-heading first-nail-spaced">손톱 모양</h3>
 <ul class="first-nail-shapes">
  ${shapes.map(([key,{name}])=>`<li>${nailShapeIcon(key)}<span>${name}</span></li>`).join('')}
 </ul>
 <p class="note first-nail-source">손톱 관리 참고 · <a class="naver-link" href="https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/gel-manicures" target="_blank" rel="noopener noreferrer">미국피부과학회 젤 네일 안내 ↗</a> · <a class="naver-link" href="https://www.fda.gov/cosmetics/cosmetic-products/nail-care-products" target="_blank" rel="noopener noreferrer">미국 FDA 네일 제품 안내 ↗</a></p>`;
}
