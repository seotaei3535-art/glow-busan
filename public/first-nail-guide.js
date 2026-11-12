import {basicNailShapes,nailShapeIcon} from './nail-shapes.js';

const artSamples=[
 {style:'solid',name:'원컬러',caption:'한 가지 색'},
 {style:'gradient',name:'그라데이션',caption:'색이 부드럽게 변해요'},
 {style:'french',name:'프렌치',caption:'끝에만 넣은 색'},
 {style:'accent',name:'일반 아트',caption:'원하는 무늬·장식'},
 {style:'monthly',name:'이달의 아트',caption:'매장 추천 디자인'}
];

function careStep(title,tip,icon){
 return `<li>
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${icon}</svg>
  <div><strong>${title}</strong><p>${tip}</p></div>
 </li>`;
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
 <h3 class="first-nail-heading first-nail-spaced">손톱 모양</h3>
 <ul class="first-nail-shapes">
  ${shapes.map(([key,{name}])=>`<li>${nailShapeIcon(key)}<span>${name}</span></li>`).join('')}
 </ul>
 <h3 class="first-nail-heading first-nail-spaced">방문부터 시술 후 관리까지</h3>
 <ol class="first-nail-topics" role="list">
  ${careStep('방문 전','원하는 디자인 사진을 준비하고, 젤 제거·연장 비용을 확인해요.','<rect x="8" y="9" width="32" height="26" rx="5"/><circle cx="18" cy="18" r="3"/><path d="m9 31 9-8 6 5 6-8 9 11"/><path d="M15 41h18"/>')}
  ${careStep('시술 직후','매장을 나오기 전에 색과 모양을 확인하고, 불편한 점이 있으면 알려요.','<path d="M8 12q0-4 4-4h24q4 0 4 4v16q0 4-4 4H23l-9 8v-8h-2q-4 0-4-4Z"/><path d="M24 14v8m0 4h.1"/>')}
  ${careStep('집에서 관리','손톱 주변을 보습하고, 젤이 들뜨면 손으로 뜯지 말고 매장에 문의해요.','<path d="M24 7C19 15 13 21 13 29a11 11 0 0 0 22 0c0-8-6-14-11-22Z"/><path d="M19 29a5 5 0 0 0 5 5m14-19h6m-3-3v6"/>')}
 </ol>
 <p class="note first-nail-source">손톱 관리 참고 · <a class="naver-link" href="https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/gel-manicures" target="_blank" rel="noopener noreferrer">미국피부과학회 젤 네일 안내 ↗</a> · <a class="naver-link" href="https://www.fda.gov/cosmetics/cosmetic-products/nail-care-products" target="_blank" rel="noopener noreferrer">미국 FDA 네일 제품 안내 ↗</a></p>`;
}
