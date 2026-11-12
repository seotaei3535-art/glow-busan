import {basicNailShapes,nailShapeIcon} from './nail-shapes.js';

export function firstNailGuide(){
 const shapes=Object.entries(basicNailShapes).filter(([key])=>key);
 return `<h3 class="first-nail-heading">손톱 모양</h3>
 <ul class="first-nail-shapes">
  ${shapes.map(([key,{name}])=>`<li>${nailShapeIcon(key)}<span>${name}</span></li>`).join('')}
 </ul>
 <div class="first-nail-topics">
  <details open>
   <summary>네일 아트 종류와 메뉴 고르기</summary>
   <dl class="first-nail-terms">
    <div><dt>원컬러</dt><dd>손톱 전체에 한 가지 색을 발라요.</dd></div>
    <div><dt>그라데이션</dt><dd>손톱 끝이나 중간부터 색이 서서히 옅어지게 표현해요.</dd></div>
    <div><dt>프렌치</dt><dd>손톱 끝에만 선을 그리듯 색을 넣어요.</dd></div>
    <div><dt>일반 아트</dt><dd>원하는 무늬나 장식을 골라요. 처음이라면 한두 손톱에만 포인트를 줄 수도 있어요.</dd></div>
    <div><dt>이달의 아트</dt><dd>매장이 정해 둔 디자인 중에서 골라요. 색이나 장식을 바꿀 수 있는지 확인해 보세요.</dd></div>
   </dl>
  </details>
  <details>
   <summary>방문 전 준비할 것</summary>
   <ul>
    <li>원하는 사진이 있다면 보여주고, 색·길이·장식 중 꼭 살리고 싶은 부분을 말해 주세요.</li>
    <li><strong>제거</strong>는 기존 젤을 떼는 작업이에요. <strong>연장</strong>은 짧은 손톱에 길이를 더하는 작업이에요. 다른 매장에서 받은 젤이나 연장이 남아 있다면 미리 알려주세요.</li>
    <li>기본 시술에 제거·연장·장식이 포함되는지, 추가요금과 예상 소요 시간은 얼마인지 시술 전에 물어보세요.</li>
    <li>이전에 젤이나 접착제로 피부가 가렵거나 붓는 반응이 있었다면 시술 전에 알려주세요. 손톱 주변에 상처나 붓기가 있으면 시술을 미루고, 증상이 계속되면 피부과에 상담하세요.</li>
   </ul>
   <p class="first-nail-example">“짧은 오벌 모양에 베이지색으로 하고, 양손 약지에만 작은 장식을 넣고 싶어요.”</p>
  </details>
  <details>
   <summary>시술 중 확인할 것</summary>
   <ul>
    <li>기구를 손님마다 소독하는지 확인하고, 큐티클을 깊게 자르거나 세게 밀지 말아 달라고 요청하세요.</li>
    <li>손톱 길이와 모양을 먼저 맞춘 뒤 색과 장식 위치를 확인하세요. 손톱을 다듬거나 젤을 굳힐 때 아프거나 뜨거우면 바로 말해 주세요.</li>
    <li>젤을 굳히는 램프에 손을 넣기 전, 손 피부 보호를 위해 광범위 차단·내수성 SPF 30 이상 자외선 차단제나 손끝이 열린 불투명 장갑을 사용할 수 있어요.</li>
   </ul>
  </details>
  <details>
   <summary>시술 후 손톱 관리</summary>
   <ul>
    <li>젤 끝이 들뜨더라도 손으로 뜯지 말고, 매장에 제거 방법이나 제거 일정을 문의하세요.</li>
    <li>손톱과 주변 피부가 건조하면 핸드크림이나 보습제를 발라 주세요.</li>
    <li>붉어짐, 붓기, 가려움이 지속되거나 손톱에 평소와 다른 변화가 생기면 피부과에 상담하세요.</li>
   </ul>
  </details>
 </div>
 <p class="note first-nail-source">손톱 관리 참고 · <a class="naver-link" href="https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/gel-manicures" target="_blank" rel="noopener noreferrer">미국피부과학회 젤 네일 안내 ↗</a> · <a class="naver-link" href="https://www.fda.gov/cosmetics/cosmetic-products/nail-care-products" target="_blank" rel="noopener noreferrer">미국 FDA 네일 제품 안내 ↗</a></p>`;
}
