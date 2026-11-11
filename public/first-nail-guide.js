const steps=[
 {
  title:'어떤 네일을 할지 골라요',
  text:'한 가지 색을 바르는 건 원컬러, 무늬나 장식이 들어가면 아트예요. 원하는 모양이 있다면 내 설정에서 그림을 보고 골라보세요.',
  drawing:'<rect x="14" y="15" width="19" height="43" rx="9.5" fill="#edc7d4"/><rect x="38" y="10" width="19" height="48" rx="9.5" fill="#c88ba5"/><rect x="62" y="18" width="19" height="40" rx="9.5" fill="#f5ddd4"/><path d="M47.5 22v14m-7-7h14M71.5 29l3 5-3 5-3-5Z" fill="none" stroke="#fff8f3"/>'
 },
 {
  title:'제거와 연장이 필요한지 확인해요',
  text:'기존 젤을 떼어내는 건 제거, 손톱 길이를 더하는 건 연장이에요. 필요한 옵션을 정하고 매장의 공개 기본가를 비교해 보세요.',
  drawing:'<rect x="18" y="9" width="58" height="50" rx="8" fill="#fffaf7"/><rect x="26" y="19" width="10" height="10" rx="2" fill="#edc7d4"/><rect x="26" y="38" width="10" height="10" rx="2" fill="#edc7d4"/><path d="m28 24 2 2 4-4m-6 21 2 2 4-4M43 24h23M43 43h16" fill="none"/>'
 },
 {
  title:'네이버에서 방문 일정을 정해요',
  text:'견적을 저장한 뒤 네이버 예약을 열면 선택한 옵션도 복사돼요. 예약 링크가 확인되지 않은 샵은 네이버 지도에서 찾아볼 수 있어요.',
  drawing:'<rect x="16" y="13" width="49" height="45" rx="7" fill="#fffaf7"/><path d="M16 26h49M28 9v9m24-9v9M26 36h8m10 0h9M26 46h8" fill="none"/><circle cx="69" cy="48" r="14" fill="#c9e3d7"/><path d="m63 48 4 4 7-8" fill="none"/>'
 },
 {
  title:'샵에서 상담하고 시술받아요',
  text:'준비한 디자인 사진을 보여주고 길이와 모양을 상의하세요. 보통 손톱 정리, 컬러나 아트, 마무리 순으로 진행돼요. 불편하면 시술 중에도 바로 말해 주세요.',
  drawing:'<path d="M13 16q0-6 6-6h37q6 0 6 6v17q0 6-6 6H38l-9 8v-8H19q-6 0-6-6Z" fill="#fffaf7"/><path d="M23 21h28M23 29h19" fill="none"/><rect x="64" y="30" width="20" height="31" rx="9" fill="#d99eb7" transform="rotate(17 74 45)"/><path d="M73 21v-8m-4 4h8" fill="none"/>'
 }
];

export function firstNailSteps(){
 return `<ol class="first-nail-steps">${steps.map(({title,text,drawing})=>`
  <li class="first-nail-step">
   <div class="first-nail-illustration">
    <svg viewBox="0 0 94 68" aria-hidden="true" focusable="false">${drawing}</svg>
   </div>
   <div><h3>${title}</h3><p>${text}</p></div>
  </li>`).join('')}</ol>`;
}
