import {naverLinks,naverBookingForDate,validateNaverUrl} from './naver.js';
import {districts} from './catalog.js';
import {publicShops as verifiedShops} from './verified-shops.js';
import {directoryUpdated,registryShops} from './busan-directory.js';
import {publishedPrices} from './published-prices.js';
import {loadShops} from './firebase.js';
import {basicNailShapes,nailShapes,nailShapeIcon} from './nail-shapes.js';
import {menus,distanceKm} from './domain.js';
import {firstNailSteps} from './first-nail-guide.js';
const $=s=>document.querySelector(s),money=n=>Number(n).toLocaleString('ko-KR')+'원';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem('glow-'+key))??fallback;}catch{return fallback;}}
function save(key,value){
 try{localStorage.setItem('glow-'+key,JSON.stringify(value));return true;}
 catch{toast('저장 공간이 부족하거나 브라우저 저장이 차단되었습니다.');return false;}
}
let shops=read('shops',[
{id:'s1',name:'오브 네일',area:'부산진구',station:'서면역 도보 4분',lat:35.157,lng:129.059,rating:4.9,reviews:128,offset:0,color:'#c99d99',bg:'#e9ddd3',tag:'차분한 무드',designers:['지유','서아']},
{id:'s2',name:'모먼트 네일',area:'해운대구',station:'해운대역 도보 6분',lat:35.163,lng:129.159,rating:4.8,reviews:96,offset:5000,color:'#c7bb9e',bg:'#e2e1d6',tag:'섬세한 아트',designers:['하린','유나']},
{id:'s3',name:'네일 드 온유',area:'수영구',station:'광안역 도보 3분',lat:35.157,lng:129.113,rating:4.9,reviews:87,offset:-5000,color:'#9eaaa0',bg:'#dce0d8',tag:'감각적인 컬러',designers:['온유','나린']},
{id:'s4',name:'살롱 드 루나',area:'동래구',station:'동래역 도보 5분',lat:35.205,lng:129.078,rating:4.7,reviews:74,offset:0,color:'#a494a6',bg:'#e8e0e8',tag:'포인트 디자인',designers:['루나','다은']},
{id:'s5',name:'디어 네일',area:'남구',station:'경성대·부경대역 도보 3분',lat:35.137,lng:129.1,rating:4.8,reviews:112,offset:-5000,color:'#c6a078',bg:'#e7dfd0',tag:'따뜻한 취향',designers:['서진','민서']},
{id:'s6',name:'누아 네일 스튜디오',area:'중구',station:'남포역 도보 5분',lat:35.099,lng:129.033,rating:4.9,reviews:61,offset:10000,color:'#626967',bg:'#d9dcd8',tag:'시크한 무드',designers:['이서','수아']}
]);
const verifiedPermits=new Set(verifiedShops.map(shop=>shop.permitId).filter(Boolean));
const publicShops=[
 ...verifiedShops,
 ...registryShops.filter(([permit])=>!verifiedPermits.has(permit)).map(([permit,name,area,address])=>({
  id:'permit-'+permit,name,area,address,color:'#bd95a5',bg:'#f6ecef'
 }))
].map(shop=>publishedPrices[shop.id]?{...shop,...publishedPrices[shop.id]}:shop);
const publicAreas=districts.map(([area])=>area);
const directBookingCount=verifiedShops.length;
const directoryPageSize=24;
let resultsLimit=directoryPageSize;
const areaCenters=Object.fromEntries(districts.map(([area,lat,lng])=>[area,{lat,lng}]));
const naverMyUrl='https://m.place.naver.com/my';
let bookings=read('bookings',[]),favorites=read('favorites',[]),compared=read('compared',[]).filter(id=>publicShops.some(shop=>shop.id===id)),origin=null;
let ownerSession=null,loginFailures=0,loginBlockedUntil=0;
let filters={area:'all',date:'',menu:'plain',sort:'price',favorites:false,query:'',directOnly:false,priceOnly:true};
const savedPreferences=read('estimate-preferences',{});
let preferences={
 shape:Object.hasOwn(basicNailShapes,savedPreferences.shape)?savedPreferences.shape:'',
 extensions:Number.isInteger(savedPreferences.extensions)&&savedPreferences.extensions>=0&&savedPreferences.extensions<=10?savedPreferences.extensions:0
};
const main=$('#main'),modal=$('#modal');
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function open(html){$('#modal-body').innerHTML=html;if(!modal.open)modal.showModal();}
$('.close').onclick=()=>modal.close();
const art=(s,small=false)=>`<div class="art" style="--nail:${s.color};--bg:${s.bg}">${'<i class="nail"></i>'.repeat(5)}${small?'':`<span class="sample-tag">디자인 일러스트</span><span class="art-label">THE ART OF YOUR EVERYDAY</span>`}</div>`;
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function options(){return {menu:filters.menu,extensions:preferences.extensions,pieces:0,removal:'none'};}
function extensionOptions(selected){
 return Array.from({length:11},(_,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${i?`${i}개`:'연장 안 함'}</option>`).join('');
}
function formatPublishedPrice(price){
 if(!price)return '가격 미확인';
 if(price.max)return `${money(price.amount)}~${money(price.max)}`;
 return money(price.amount)+(price.from?'부터':'');
}
function priceText(shop,menu){
 return formatPublishedPrice(shop.prices?.[menu]);
}
function priceCondition(shop,menu){
 return shop.prices?.[menu]?.note||'';
}
function sourceLink(shop){
 if(!shop.sourceUrl)return '';
 return `<a class="naver-link" href="${escape(shop.sourceUrl)}" target="_blank" rel="noopener noreferrer">공개 가격 출처 ↗</a>`;
}
function updateCount(){$('#compare-count').textContent=compared.length;}
function route(){updateCount();const page=location.hash.slice(1)||'home';if(page==='compare')renderCompare();else if(page==='reservations')renderBookings();else if(page==='owner')renderOwner();else renderHome();}
window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});
function renderHome(){resultsLimit=directoryPageSize;main.innerHTML=`<section class="hero"><div class="eyebrow">YOUR NAIL, YOUR MOMENT</div><h1>부산의 네일, 한눈에.<br>내 취향에 꼭 맞는 <em>Glow.</em></h1><p>부산 16개 구·군의 네일샵을 찾고,<br>공개 가격과 네이버 예약 정보를 비교해 보세요.</p></section><form class="searchbar" id="search"><label>어디에서 찾으세요?<select id="area"><option value="all">부산 전체</option>${publicAreas.map(x=>`<option ${filters.area===x?'selected':''}>${x}</option>`).join('')}</select></label><label>희망 방문일 (견적에 적용)<input aria-label="방문 날짜" type="date" id="search-date" min="${today()}" value="${filters.date}"></label><label>어떤 네일을 원하세요?<select id="search-menu">${Object.entries(menus).map(([k,v])=>`<option value="${k}" ${filters.menu===k?'selected':''}>${v.name}</option>`).join('')}</select></label><button class="primary gold">네일샵 찾기 ↗</button></form><section class="content"><div class="guide-banner"><span class="spark">✧</span><div><strong>네일이 처음이라면, 여기부터 시작해요.</strong><p>메뉴 고르기부터 예약과 시술까지 그림으로 따라가요.</p></div><button class="text-button" id="guide">첫 네일 가이드 ↗</button></div><div class="section-head"><div><div class="eyebrow">FIND YOUR FAVORITE</div><h2>당신을 위한 네일샵</h2><button class="location" id="locate">⌖ ${origin?'현재 위치 기준 · 가까운 지역 순':'현재 위치로 찾기'}</button></div><select class="outline small" id="sort" aria-label="정렬"><option value="price">공개 가격 낮은 순</option><option value="distance">가까운 지역 순</option></select></div><div class="filters">${[['monthly','이달의 아트'],['plain','원컬러'],['gradient','그라데이션'],['art','일반 아트']].map(([k,v])=>`<button class="chip ${filters.menu===k?'active':''}" data-menu="${k}">${v}</button>`).join('')}<button id="only-favorites" class="chip ${filters.favorites?'active':''}">♡ 찜한 샵</button></div><div class="directory-tools">
  <label class="directory-search" for="shop-query">매장명·주소 검색<input id="shop-query" type="search" maxlength="80" placeholder="예: 전포동, 네일이지" value="${escape(filters.query)}"></label>
  <label class="directory-check"><input type="checkbox" id="price-only" ${filters.priceOnly?'checked':''}> 가격이 확인된 샵만</label>
  <label class="directory-check"><input type="checkbox" id="direct-only" ${filters.directOnly?'checked':''}> 네이버 직접 예약이 확인된 샵만</label>
 </div>
 <p class="note directory-source">부산 16개 구·군 ${publicShops.length.toLocaleString('ko-KR')}곳 · 직접 예약 확인 ${directBookingCount}곳 · <a href="https://www.data.go.kr/data/15045037/fileData.do" target="_blank" rel="noopener noreferrer">미용업 인허가 자료 ${directoryUpdated} ↗</a></p>
 <p id="directory-results" class="note" role="status"></p><div class="grid" id="shops"></div><div id="directory-pagination"></div></section>`;
$('#sort').value=filters.sort;
$('#sort').onchange=e=>{
 filters.sort=e.target.value;
 if(filters.sort==='distance'&&!origin)toast('가까운 지역 순으로 보려면 현재 위치를 먼저 설정해 주세요.');
 renderFirstPage();
};
$('#shop-query').oninput=e=>{filters.query=e.target.value;renderFirstPage();};
$('#direct-only').onchange=e=>{filters.directOnly=e.target.checked;renderFirstPage();};
$('#price-only').onchange=e=>{filters.priceOnly=e.target.checked;renderFirstPage();};
$('#search').onsubmit=e=>{e.preventDefault();applySearch(true);};
function applySearch(scroll=false){filters.area=$('#area').value;filters.date=$('#search-date').value;filters.menu=$('#search-menu').value;filters.favorites=false;renderHome();if(scroll)$('#shops').scrollIntoView({behavior:'smooth',block:'start'});}
['area','search-date','search-menu'].forEach(id=>$('#'+id).onchange=()=>applySearch());
$('#guide').onclick=guide;$('#locate').onclick=locate;$('#only-favorites').onclick=()=>{filters.favorites=!filters.favorites;renderHome();};document.querySelectorAll('[data-menu]').forEach(el=>el.onclick=()=>{filters.menu=el.dataset.menu;renderHome();});renderCards();}
function searchable(value){
 return value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
}
function renderFirstPage(){
 resultsLimit=directoryPageSize;
 renderCards();
}
function renderCards(){
 const terms=filters.query.trim().split(/\s+/).map(searchable).filter(Boolean);
 const matches=publicShops.filter(shop=>{
  if(filters.area!=='all'&&shop.area!==filters.area)return false;
  if(filters.favorites&&!favorites.includes(shop.id))return false;
  if(filters.directOnly&&!shop.naverBookingUrl)return false;
  const searchableAddress=searchable(shop.name+' '+shop.address);
  return terms.every(term=>searchableAddress.includes(term));
 });
 const priced=matches.filter(shop=>shop.prices?.[filters.menu]);
 const list=filters.priceOnly?priced:matches;
 if(filters.sort==='distance'&&origin){
  list.sort((a,b)=>distanceKm(origin,areaCenters[a.area])-distanceKm(origin,areaCenters[b.area]));
 }else{
  list.sort((a,b)=>(a.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER)-(b.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER));
 }
 const visible=list.slice(0,resultsLimit);
 $('#directory-results').textContent=`선택한 메뉴 가격 확인 ${priced.length.toLocaleString('ko-KR')}곳 · ${visible.length.toLocaleString('ko-KR')} / ${list.length.toLocaleString('ko-KR')}곳 표시`;
 $('#shops').innerHTML=visible.length?visible.map(shop=>`
  <article class="shop-card">
   <div style="position:relative">${art(shop)}
    <button class="heart ${favorites.includes(shop.id)?'saved':''}" aria-label="${escape(shop.name)} 찜" aria-pressed="${favorites.includes(shop.id)}" data-fav="${shop.id}">${favorites.includes(shop.id)?'♥':'♡'}</button>
   </div>
   <div class="card-body">
    <div class="card-top"><h3>${escape(shop.name)}</h3></div>
    <p class="sub">${escape(shop.address)}</p>
    <div class="price-line"><div><small>${menus[filters.menu].name} · 매장 공개가</small><br><strong>${priceText(shop,filters.menu)}</strong>${priceCondition(shop,filters.menu)?`<br><small>${escape(priceCondition(shop,filters.menu))}</small>`:''}</div>${sourceLink(shop)}</div>
    ${shop.deposit?`<p class="note">예약금 · ${shop.deposit}</p>`:''}
    ${naverActions(shop)}
    <div class="card-actions">
     <button class="outline" data-compare="${shop.id}">${compared.includes(shop.id)?'✓ 비교 중':'+ 비교'}</button>
     <button class="primary" data-book="${shop.id}">견적 · 예약 보기 ↗</button>
    </div>
   </div>
  </article>`).join(''):`<div class="empty" style="grid-column:1/-1">${filters.priceOnly&&matches.length?'이 조건에서 확인된 가격이 없어요.':'조건에 맞는 샵이 없어요.'}<p>검색어 또는 시술 메뉴를 바꿔 보세요.</p>${filters.priceOnly&&matches.length?'<button class="outline" id="show-all-prices">가격 미확인 매장도 보기</button>':'<button class="outline" id="reset">필터 초기화</button>'}</div>`;
 document.querySelectorAll('[data-fav]').forEach(button=>button.onclick=()=>{
  const id=button.dataset.fav;
  favorites=favorites.includes(id)?favorites.filter(saved=>saved!==id):[...favorites,id];
  save('favorites',favorites);
  renderCards();
 });
 document.querySelectorAll('[data-compare]').forEach(button=>button.onclick=()=>toggleCompare(button.dataset.compare));
 bindBook();
 if($('#show-all-prices'))$('#show-all-prices').onclick=()=>{
  filters.priceOnly=false;
  $('#price-only').checked=false;
  renderFirstPage();
 };
 if($('#reset'))$('#reset').onclick=()=>{
  filters.area='all';filters.favorites=false;filters.query='';filters.directOnly=false;
  renderHome();
 };
 const pagination=$('#directory-pagination');
 pagination.innerHTML=visible.length<list.length?`<button class="outline" id="load-more">매장 더 보기 · ${(list.length-visible.length).toLocaleString('ko-KR')}곳 남음</button>`:'';
 if($('#load-more'))$('#load-more').onclick=()=>{
  resultsLimit+=directoryPageSize;
  renderCards();
  $('#shops').children[visible.length]?.querySelector('button')?.focus({preventScroll:true});
 };
}
function shopNaver(shop){return naverLinks(shop);}
function naverActions(shop){
 const links=shopNaver(shop);
 const map=`<a class="naver-link" href="${escape(links.map)}" target="_blank" rel="noopener noreferrer">${links.booking?'네이버 지도 ↗':'네이버 지도에서 예약 확인 ↗'}</a>`;
 const booking=links.booking?`<a class="naver-link" href="${escape(links.booking)}" target="_blank" rel="noopener noreferrer">네이버 예약 ↗</a>`:'<span class="naver-pending">직접 예약 링크 미확인</span>';
 return `<div class="naver-actions">${map}${booking}</div>`;
}
function bindBook(){document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>booking(b.dataset.book));}
function toggleCompare(id){if(compared.includes(id))compared=compared.filter(x=>x!==id);else if(compared.length>=3){toast('최대 3개 샵까지 비교할 수 있어요.');return;}else compared.push(id);save('compared',compared);updateCount();route();}
function locate(){if(!navigator.geolocation){toast('위치 기능을 지원하지 않습니다. 지역을 직접 선택해주세요.');return;}toast('위치를 확인하고 있어요.');navigator.geolocation.getCurrentPosition(p=>{origin={lat:p.coords.latitude,lng:p.coords.longitude};filters.sort='distance';renderHome();toast('현재 위치에서 가까운 지역 순으로 정렬했어요.');},()=>toast('위치를 확인할 수 없어요. 지역을 직접 선택해주세요.'),{timeout:10000,maximumAge:60000});}
function guide(){
 open(`<div class="eyebrow">YOUR FIRST NAIL</div>
  <h2 class="modal-title" id="first-nail-title" tabindex="-1">처음 네일샵에 가는 날</h2>
  <p class="sub">메뉴 고르기부터 샵에서 시술받기까지, 처음이라면 그림을 따라 한 단계씩 살펴보세요.</p>
  ${firstNailSteps()}
  <button class="primary full" id="guide-next">내 견적 기본값 설정</button>`);
 modal.scrollTop=0;
 $('#first-nail-title').focus();
 $('#guide-next').onclick=showPreferences;
}
function shapeChoices(shapes){
 return Object.entries(shapes).map(([key,{name}])=>`
  <label class="shape-option">
   <input type="radio" name="shape" value="${key}" ${key===preferences.shape?'checked':''}>
   <span>${nailShapeIcon(key)}${name}</span>
  </label>`).join('');
}
function showPreferences(){
 open(`<div class="eyebrow">MY NAIL PREFERENCES</div>
  <h2 class="modal-title">내 견적 기본값</h2>
  <p class="sub">고른 모양과 연장 개수를 새 견적에 적용해요.</p>
  <form id="preferences-form">
   <label class="field">기본 연장 개수<select name="extensions">${extensionOptions(preferences.extensions)}</select></label>
   <fieldset class="shape-picker">
    <legend>손톱 모양</legend>
    <p class="sub shape-description" id="shape-description" role="status">${nailShapes[preferences.shape].description}</p>
    <div class="shape-options">${shapeChoices(basicNailShapes)}</div>
   </fieldset>
   <p class="note">견적마다 연장 개수를 바꿀 수 있어요. 기본값은 이 브라우저에 저장돼요.</p>
   <p id="preferences-error" class="note" role="alert" hidden>브라우저에 설정을 저장할 수 없어요. 저장 권한을 확인해주세요.</p>
   <button class="primary full">기본값 저장</button>
  </form>`);
 modal.scrollTop=0;
 $('#preferences-form [name=extensions]').focus();
 const preferencesForm=$('#preferences-form');
 preferencesForm.onchange=e=>{
  if(e.target.name==='shape')$('#shape-description').textContent=nailShapes[e.target.value].description;
 };
 preferencesForm.onsubmit=e=>{
  e.preventDefault();
  const form=new FormData(e.currentTarget);
  const next={
   shape:form.get('shape'),
   extensions:Number(form.get('extensions'))
  };
  if(!save('estimate-preferences',next)){
   $('#preferences-error').hidden=false;
   return;
  }
  preferences=next;
  modal.close();
  route();
  $('#estimate-settings').focus();
  toast('견적 기본값을 저장했어요.');
 };
}
function onboarding(){open(`<div class="eyebrow">WELCOME TO GLOW BUSAN</div><h2 class="modal-title">어떤 네일 경험을 찾고 있나요?</h2><p class="sub">로그인 없이도 샵과 가격을 비교할 수 있어요.</p><button id="first-time" class="primary full">네일이 처음이에요 · 가이드 보기</button><button id="experienced" class="outline full">경험이 있어요 · 바로 둘러보기</button><button id="skip" class="text-button full">지금은 건너뛰기</button>`);$('#first-time').onclick=()=>{save('onboarded',true);guide();};['experienced','skip'].forEach(id=>$('#'+id).onclick=()=>{save('onboarded',true);modal.close();});}
function renderCompare(){
 const list=publicShops.filter(shop=>compared.includes(shop.id));
 const rows=[
  ['주소',shop=>escape(shop.address)],
  ['매장 공개가',shop=>priceText(shop,filters.menu)],
  ['가격 조건',shop=>escape(priceCondition(shop,filters.menu)||'—')],
  ['가격 출처',shop=>sourceLink(shop)||'—'],
  ['예약금 안내',shop=>shop.deposit||'예약 화면에서 확인'],
  ['네이버 예약',naverActions],
  ['견적 저장',shop=>`<button class="primary small" data-book="${shop.id}">견적 · 예약 보기</button>`]
 ];
 main.innerHTML=`<section class="content">
  <div class="page-head"><div class="eyebrow">SIDE BY SIDE</div><h1>네일샵 한눈에 비교</h1><p class="sub">같은 메뉴의 공개 가격과 적용 조건을 비교해 보세요.</p></div>
  <div class="filters">${Object.entries(menus).map(([key,menu])=>`<button class="chip ${filters.menu===key?'active':''}" data-cmenu="${key}">${menu.name}</button>`).join('')}</div>
  ${list.length?`<div class="table-scroll"><table class="compare-table"><tbody>
   <tr><th>비교 기준</th>${list.map(shop=>`<th>${escape(shop.name)}<br><button class="text-button small" data-remove="${shop.id}">삭제 ×</button></th>`).join('')}</tr>
   ${rows.map(([label,cell])=>`<tr><th>${label}</th>${list.map(shop=>`<td>${cell(shop)}</td>`).join('')}</tr>`).join('')}
  </tbody></table></div>`:`<div class="empty">비교할 샵을 골라주세요.<p>샵 카드에서 ‘+ 비교’를 누르면 최대 3곳을 비교할 수 있어요.</p><a class="primary" href="#home">샵 둘러보기</a></div>`}
 </section>`;
 bindBook();
 document.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>toggleCompare(button.dataset.remove));
 document.querySelectorAll('[data-cmenu]').forEach(button=>button.onclick=()=>{filters.menu=button.dataset.cmenu;renderCompare();});
}
function booking(id,previous){
 const shop=publicShops.find(item=>item.id===id);
 if(!shop)return;
 const selected=previous?.options||options();
 const preferredShape=previous?selected.shape:preferences.shape;
 const shape=Object.hasOwn(basicNailShapes,preferredShape)?preferredShape:'';
 const date=previous?.date>=today()?previous.date:filters.date||today();
 open(`<div class="eyebrow">MAKE YOUR MOMENT</div>
  <h2 class="modal-title">${escape(shop.name)}</h2><p class="sub">${escape(shop.address)}</p>
  ${naverActions(shop)}${shape?`<p class="sub">선호 모양 · ${nailShapes[shape].name}</p>`:''}
  <form id="book-form">
   <div class="form-grid">
    <label class="field">시술 메뉴<select id="b-menu">${Object.entries(menus).map(([key,menu])=>`<option value="${key}" ${key===selected.menu?'selected':''}>${menu.name}</option>`).join('')}</select></label>
    <label class="field">연장 개수<select id="b-extensions">${extensionOptions(selected.extensions)}</select></label>
    <label class="field">제거 여부<select id="b-removal"><option value="none">제거 없음</option><option value="own">자샵 제거</option><option value="other">타샵 제거</option></select></label>
    <label class="field" id="pieces-field">일반 아트 개수<select id="b-pieces">${Array.from({length:11},(_,i)=>`<option value="${i}" ${i===Number(selected.pieces)?'selected':''}>${i}개</option>`).join('')}</select></label>
    <label class="field">희망 방문 날짜<input id="b-date" type="date" required min="${today()}" value="${escape(date)}"></label>
    <label class="field">희망 시작 시간 (선택)<input id="b-time" type="time" value="${escape(previous?.visitTime||'')}"></label>
   </div>
   <label class="field">참고 사진 (선택 · 최대 5MB)<input id="b-photo" type="file" accept="image/jpeg,image/png,image/webp"><span id="photo-output"></span></label>
   <p class="note">사진은 여기서 미리 볼 수 있어요. 매장에 보여줄 사진은 네이버 예약 안내에 따라 준비해 주세요.</p>
   <label class="field">예약에 참고할 요청사항<textarea id="b-note" maxlength="500" placeholder="선호하는 색상, 원하는 스타일 등을 적어주세요."></textarea></label>
   <div class="summary" id="quote"></div>
   <p class="note">실제 빈 시간과 옵션별 요금은 네이버에서 확인해 주세요. 예약금은 상품에 따라 달라요. Npay 결제가 표시되면 네이버에서 결제할 수 있어요.</p>
   <label class="consent"><input type="checkbox" required> 견적과 희망 일정을 이 기기에 저장합니다.</label>
   <button class="primary full gold">견적 저장하고 이어가기</button>
  </form>`);
 $('#b-removal').value=selected.removal;
 $('#b-note').value=previous?.note||'';
 function refresh(){
  const menu=$('#b-menu').value;
  $('#pieces-field').hidden=menu!=='art';
  $('#quote').innerHTML=`<div class="summary-row"><span>매장 공개가</span><strong>${priceText(shop,menu)}</strong></div>${priceCondition(shop,menu)?`<p class="note">${escape(priceCondition(shop,menu))}</p>`:''}${sourceLink(shop)}`;
 }
 $('#b-menu').onchange=refresh;
 refresh();
 $('#b-photo').onchange=event=>{
  const input=event.currentTarget;
  const output=$('#photo-output');
  const file=input.files[0];
  output.replaceChildren();
  if(!file)return;
  if(file.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type)){
   input.value='';
   output.textContent='5MB 이하 JPG, PNG, WebP 사진을 골라 주세요.';
   return;
  }
  const photo=document.createElement('img');
  const url=URL.createObjectURL(file);
  photo.className='photo-preview';
  photo.alt='첨부한 참고 사진 미리보기';
  photo.onload=photo.onerror=()=>URL.revokeObjectURL(url);
  photo.src=url;
  output.append(photo);
 };
 $('#book-form').onsubmit=event=>{
  event.preventDefault();
  const opt={
   menu:$('#b-menu').value,shape,extensions:Number($('#b-extensions').value),
   pieces:Number($('#b-pieces').value),removal:$('#b-removal').value
  };
  const saved={
   id:crypto.randomUUID(),shopId:id,shopName:shop.name,
   date:$('#b-date').value,visitTime:$('#b-time').value,options:opt,
   publishedPrice:shop.prices?.[opt.menu]??null,note:$('#b-note').value,
   kind:'estimate',status:'draft',createdAt:new Date().toISOString()
  };
  const next=[...read('bookings',[]),saved];
  if(!save('bookings',next))return;
  bookings=next;
  showSavedBooking(saved,shop);
 };
}

function bookingOptionText(opt){
 const removal={own:'자샵 제거',other:'타샵 제거'}[opt.removal];
 const shape=opt.shape&&Object.hasOwn(nailShapes,opt.shape)?nailShapes[opt.shape].name:'';
 return [menus[opt.menu].name,shape,opt.extensions?`연장 ${opt.extensions}개`:'',removal,opt.menu==='art'&&opt.pieces?`아트 ${opt.pieces}개`:''].filter(Boolean).join(' · ');
}

function savedSchedule(saved){
 const hour=saved.visitTime||(Number.isFinite(saved.start)?time(saved.start):'');
 return [saved.date,hour,saved.designer?`${saved.designer} 디자이너`:''].filter(Boolean).join(' · ');
}

function savedPrice(saved){
 if(Object.hasOwn(saved,'publishedPrice')){
  const price=saved.publishedPrice;
  return formatPublishedPrice(price)+(price?.note?` · ${price.note}`:'');
 }
 if(Object.hasOwn(saved,'basePrice'))return saved.basePrice===null?'매장 확인':money(saved.basePrice)+'부터';
 return Number.isFinite(saved.total)?money(saved.total):'매장 확인';
}

function showSavedBooking(saved,shop){
 const links=shopNaver(shop);
 const product=shop.menuBookingUrls?.[saved.options.menu]||links.booking;
 const bookingUrl=naverBookingForDate(product,saved.date>=today()?saved.date:'');
 const details=[
  saved.shopName,
  `희망 일정 ${savedSchedule(saved)}`,
  bookingOptionText(saved.options),
  `매장 공개가 ${savedPrice(saved)}`,
  saved.note?`요청사항 ${saved.note}`:''
 ].filter(Boolean);
 const quote=details.join('\n');
 open(`<div class="success-icon">✓</div>
  <h2 class="modal-title">저장한 견적으로 예약 이어가기</h2>
  <div class="summary booking-handoff">${details.map(detail=>`<p>${escape(detail)}</p>`).join('')}</div>
  <p class="note">${bookingUrl?'네이버에서 가능한 날짜와 시간, 최종 금액을 확인하세요. 요청사항 칸이 있으면 복사한 견적을 붙여넣을 수 있어요. 예약 신청과 예약금 결제는 네이버에서 진행해요.':'네이버 지도에서 매장을 찾은 뒤 예약 버튼이 있는지 확인하세요. 견적을 복사해 매장 문의에도 쓸 수 있어요.'}</p>
  <div class="card-actions"><a class="primary" id="open-handoff" href="${escape(bookingUrl||links.map)}" target="_blank" rel="noopener noreferrer">${bookingUrl?'견적 복사하고 네이버 예약 열기 ↗':'견적 복사하고 네이버 지도 열기 ↗'}</a>
   <button class="outline" id="copy-booking">견적만 복사</button></div>
  <p class="note" role="status" id="copy-booking-status"></p>
  <details id="manual-booking-copy" hidden><summary>복사용 견적 보기</summary><label class="field">저장한 견적<textarea id="booking-copy-text" rows="5" readonly>${escape(quote)}</textarea></label></details>
  <button class="outline full" id="show-booking">내 예약 보기</button>`);
 modal.scrollTop=0;
 const copy=async()=>{
  const status=$('#copy-booking-status');
  const manual=$('#manual-booking-copy');
  const field=$('#booking-copy-text');
  try{
   await navigator.clipboard.writeText(quote);
   status.textContent='견적 내용을 복사했어요.';
  }catch{
   status.textContent='자동 복사를 할 수 없어요. 아래 견적을 직접 복사해 주세요.';
   manual.hidden=false;
   manual.open=true;
   field.select();
  }
 };
 $('#open-handoff').onclick=copy;
 $('#copy-booking').onclick=copy;
 $('#show-booking').onclick=()=>{modal.close();location.hash='reservations';route();};
}
function time(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
function savedBookingAction(saved){
 if(saved.status==='cancelled'||saved.status==='completed')return '';
 const shop=publicShops.find(s=>s.id===saved.shopId);
 if(!shop)return '';
 return `<button class="primary" data-handoff="${escape(saved.id)}">저장한 견적으로 예약 이어가기</button>`;
}
function renderBookings(){
 bookings=read('bookings',bookings);
 main.innerHTML=`<section class="content">
  <div class="page-head">
   <div class="eyebrow">YOUR NAIL JOURNEY</div><h1>내 예약과 저장한 견적</h1>
   <p class="sub">희망 일정과 견적은 이 브라우저에 저장돼요. 네이버에서 신청한 예약, 확정 여부와 결제 내역은 MY플레이스의 예약 탭에서 확인할 수 있어요.</p>
   <a class="outline" href="${naverMyUrl}" target="_blank" rel="noopener noreferrer">네이버 예약 내역 확인 ↗</a>
  </div>
  ${bookings.length?bookings.slice().reverse().map(saved=>`<article class="booking-card">
   <div class="booking-top"><h3>${escape(saved.shopName)}</h3><span class="status">${saved.status==='cancelled'?'저장 내역 취소':saved.status==='completed'?'시술 완료 (시연)':'견적 저장'}</span></div>
   <p>희망 일정 · ${escape(savedSchedule(saved))}</p>
   <p class="sub">${escape(bookingOptionText(saved.options))}</p>
   <p>${Object.hasOwn(saved,'publishedPrice')||Object.hasOwn(saved,'basePrice')?'저장 당시 공개가':'저장 당시 견적'} <strong>${escape(savedPrice(saved))}</strong></p>
   ${saved.note?`<p class="sub">요청사항 · ${escape(saved.note)}</p>`:''}
   ${saved.record?`<p class="sub">시술 메모 · ${escape(saved.record)}</p>`:''}
   <div class="card-actions">
    ${savedBookingAction(saved)}
    ${publicShops.some(shop=>shop.id===saved.shopId)?`<button class="outline" data-rebook="${saved.id}">같은 옵션으로 다시 견적</button>`:''}
    ${['draft','confirmed'].includes(saved.status)?`<button class="outline" data-cancel="${saved.id}">저장 내역 취소</button>`:''}
   </div>
  </article>`).join(''):`<div class="empty">아직 저장한 견적이 없어요.<p>마음에 드는 샵부터 찾아볼까요?</p><a class="primary" href="#home">샵 둘러보기</a></div>`}
  <div class="modal-section"><button class="outline full" id="member">샵 회원 인증 안내</button></div>
 </section>`;
 document.querySelectorAll('[data-handoff]').forEach(button=>button.onclick=()=>{
  const saved=bookings.find(item=>item.id===button.dataset.handoff);
  const shop=saved&&publicShops.find(item=>item.id===saved.shopId);
  if(shop)showSavedBooking(saved,shop);
 });
 document.querySelectorAll('[data-rebook]').forEach(button=>button.onclick=()=>{
  const saved=bookings.find(item=>item.id===button.dataset.rebook);
  booking(saved.shopId,saved);
 });
 document.querySelectorAll('[data-cancel]').forEach(button=>button.onclick=()=>cancelBooking(button.dataset.cancel));
 $('#member').onclick=memberInfo;
}
function cancelBooking(id){open(`<h2 class="modal-title">저장 내역을 취소할까요?</h2><p>네이버에서 신청한 예약은 네이버 예약 내역에서 따로 취소해 주세요.</p><button class="primary full" id="confirm-cancel">저장 내역 취소</button>`);$('#confirm-cancel').onclick=()=>{bookings=bookings.map(b=>b.id===id?{...b,status:'cancelled'}:b);save('bookings',bookings);modal.close();route();toast('저장한 예약 내용이 취소됐어요.');};}
function memberInfo(){open(`<div class="eyebrow">MEMBERSHIP</div><h2 class="modal-title">샵 회원 연결 안내</h2><p>실서비스에서는 이름·전화번호 입력 후 본인확인과 샵 회원정보 대조가 필요합니다.</p><p class="note">과제 버전에서는 실제 이름·전화번호를 수집하지 않으며 문자 인증과 회원 혜택은 연결되지 않았습니다.</p><button class="primary full" id="member-close">확인</button>`);$('#member-close').onclick=()=>modal.close();}
function renderOwner(){if(!ownerSession){main.innerHTML=`<section class="content"><div class="page-head"><div class="eyebrow">SALON LOGIN</div><h1>네일샵 사업자 전용</h1><p class="sub">로그인 후 연결된 샵의 예약·가격·시술 기록을 확인할 수 있습니다.</p></div><div class="empty"><p>사업자 로그인이 필요합니다.</p><button class="primary" id="open-owner-login">사업자 로그인</button></div><p class="note">테스트 로그인 시연입니다. 실제 접근 보호는 Firebase 서버 인증 연결 후 적용해야 합니다.</p></section>`;$('#open-owner-login').onclick=ownerLogin;return;}main.innerHTML=`<section class="content"><div class="page-head"><div class="eyebrow">SALON WORKSPACE · DEMO</div><h1>사장님 관리 화면</h1><p class="sub">로그인한 샵의 정보를 관리합니다. 테스트 브라우저 로그인 시연이며 서버 인증은 미연결입니다.</p></div><button class="outline small" id="owner-logout">로그아웃</button><div class="admin-layout" style="margin-top:20px"><aside class="admin-sidebar"><button id="admin-res">예약 관리</button><button id="admin-menus">메뉴 · 가격 관리</button><button id="admin-links">네이버 연결</button></aside><div><label class="field">관리할 네일샵<select id="owner-shop">${shops.filter(s=>s.id===ownerSession.shopId).map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></label><div id="owner-body"></div></div></div></section>`;$('#owner-logout').onclick=()=>{ownerSession=null;$('#account').textContent='파트너 로그인';renderOwner();toast('로그아웃되었습니다.');};$('#owner-shop').onchange=()=>ownerReservations();$('#admin-res').onclick=ownerReservations;$('#admin-menus').onclick=ownerMenus;$('#admin-links').onclick=ownerNaver;ownerReservations();}
function ownerNaver(){const shop=shops.find(s=>s.id===$('#owner-shop').value),saved=read('naverLinks',{})[shop.id]||{};$('#owner-body').innerHTML=`<h3>네이버 지도 · 예약 연결</h3><p class="note">해당 샵의 실제 네이버 URL을 등록하세요. 네이버 예약 내역을 앱으로 가져오는 기능은 연결되지 않았습니다.</p><form id="naver-form"><label class="field">네이버 지도 URL<input type="url" id="naver-map-url" placeholder="https://map.naver.com/…" value="${escape(saved.mapUrl||shop.naverMapUrl||'')}"></label><label class="field">네이버 예약 URL<input type="url" id="naver-book-url" placeholder="https://booking.naver.com/booking/…" value="${escape(saved.bookingUrl||shop.naverBookingUrl||'')}"></label><p class="note">등록한 링크는 현재 기기에 저장됩니다.</p><p id="naver-error" class="note" role="alert"></p><button class="primary">연결 정보 저장</button></form>`;$('#naver-form').onsubmit=e=>{e.preventDefault();const rawMap=$('#naver-map-url').value.trim(),rawBooking=$('#naver-book-url').value.trim(),mapUrl=validateNaverUrl(rawMap,'map'),bookingUrl=validateNaverUrl(rawBooking,'booking');if(rawMap&&!mapUrl||rawBooking&&!bookingUrl){$('#naver-error').textContent='네이버 지도 또는 예약의 올바른 HTTPS 주소를 입력해주세요.';return;}const links=read('naverLinks',{});links[shop.id]={mapUrl,bookingUrl};save('naverLinks',links);toast('네이버 연결 정보를 저장했습니다.');};}
function ownerReservations(){const id=$('#owner-shop').value,list=bookings.filter(b=>b.shopId===id&&b.kind!=='estimate');$('#owner-body').innerHTML=`<div class="stats"><div class="stat">전체 시연 예약<strong>${list.length}</strong></div><div class="stat">예약 확정<strong>${list.filter(b=>b.status==='confirmed').length}</strong></div><div class="stat">시술 완료<strong>${list.filter(b=>b.status==='completed').length}</strong></div></div><h3>예약 일정</h3>${list.length?list.slice().sort((a,b)=>(a.date+time(a.start)).localeCompare(b.date+time(b.start))).map(b=>`<div class="booking-card"><div class="booking-top"><strong>${b.date} ${time(b.start)} · ${escape(b.designer)}</strong><span class="status">${b.status==='confirmed'?'예약 확정':b.status==='completed'?'시술 완료':'취소됨'}</span></div><p class="sub">${menus[b.options.menu].name} · ${b.minutes}분 · ${money(b.total)}</p>${b.note?`<p class="sub">요청: ${escape(b.note)}</p>`:''}${b.record?`<p class="sub">시술 메모: ${escape(b.record)}</p>`:''}${b.status==='confirmed'?`<button class="outline small" data-complete="${b.id}">시술 완료 · 컬러 기록</button> <button class="text-button small" data-owner-cancel="${b.id}">저장 내역 취소</button>`:''}</div>`).join(''):'<div class="empty">등록된 테스트 예약이 없습니다.</div>'}`;document.querySelectorAll('[data-owner-cancel]').forEach(b=>b.onclick=()=>cancelBooking(b.dataset.ownerCancel));document.querySelectorAll('[data-complete]').forEach(b=>b.onclick=()=>{open(`<h2 class="modal-title">시술 기록 남기기</h2><form id="record-form"><label class="field">사용 컬러·고객 요청사항<textarea required maxlength="500" id="record" placeholder="예: 로즈베이지 03 · 짧은 라운드 모양"></textarea></label><button class="primary full">시연 시술 완료</button></form>`);$('#record-form').onsubmit=e=>{e.preventDefault();bookings=bookings.map(x=>x.id===b.dataset.complete?{...x,status:'completed',record:$('#record').value}:x);save('bookings',bookings);modal.close();ownerReservations();};});}
function ownerMenus(){const s=shops.find(s=>s.id===$('#owner-shop').value);$('#owner-body').innerHTML=`<h3>${s.name} · 메뉴와 가격</h3><p class="note">기본 메뉴 가격에 샵별 조정금액을 더합니다. 기존 예약의 가격은 바뀌지 않습니다.</p>${Object.entries(menus).map(([k,v])=>`<div class="admin-shop"><strong>${v.name}</strong><span>${money(v.price+s.offset)} · ${v.minutes}분</span></div>`).join('')}<form id="price-form"><label class="field">샵별 기본가격 조정 (원)<input type="number" id="offset" step="1000" min="-20000" max="100000" required value="${s.offset}"></label><button class="primary">가격 저장</button></form><p class="note">연장 1개 7,000원 · 자샵 제거 5,000원 · 타샵 제거 15,000원 · 일반 아트 1개 5,000원</p>`;$('#price-form').onsubmit=e=>{e.preventDefault();s.offset=Number($('#offset').value);save('shops',shops);ownerMenus();toast('가격이 저장됐어요.');};}
function ownerLogin(){if(ownerSession){location.hash='owner';renderOwner();return;}open(`<div class="eyebrow">SALON BUSINESS LOGIN</div><h2 class="modal-title">파트너 로그인</h2><p class="sub">등록된 관리자 계정으로 로그인해주세요.</p><form id="owner-login-form"><label class="field">사업자등록번호<input id="business-number" inputmode="numeric" autocomplete="username" maxlength="12" pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{5}" placeholder="000-00-00000" required></label><label class="field">비밀번호 (숫자 4자리)<input id="business-pin" type="password" inputmode="numeric" autocomplete="current-password" minlength="4" maxlength="4" pattern="[0-9]{4}" placeholder="숫자 4자리" required></label><p id="login-error" role="alert" class="note" style="color:#a33b59"></p><button class="primary full">관리자 로그인</button></form><div class="summary"><strong>테스트 계정 · 오브 네일</strong><p class="note">사업자번호: 000-00-00000 / 비밀번호: 1234<br>실제 사업자번호가 아닌 시연 계정입니다. 브라우저 코드에 포함된 시연 로그인은 실제 보안 인증이 아닙니다.</p></div>`);$('#business-pin').oninput=e=>e.target.value=e.target.value.replace(/[^0-9]/g,'').slice(0,4);$('#owner-login-form').onsubmit=e=>{e.preventDefault();const error=$('#login-error');if(Date.now()<loginBlockedUntil){error.textContent='시도가 많습니다. 잠시 후 다시 시도해주세요.';return;}const number=$('#business-number').value.replace(/-/g,''),pin=$('#business-pin').value;if(number!=='0000000000'||pin!=='1234'){loginFailures++;if(loginFailures>=5){loginBlockedUntil=Date.now()+30000;loginFailures=0;}error.textContent='등록된 사업자번호와 비밀번호를 확인해주세요.';$('#business-pin').value='';return;}loginFailures=0;ownerSession={shopId:'s1'};$('#account').textContent='오브 네일 · 관리';modal.close();location.hash='owner';renderOwner();toast('오브 네일 관리 화면에 로그인했습니다.');};}
$('#estimate-settings').onclick=showPreferences;
$('#account').onclick=ownerLogin;
route();if(!read('onboarded',false))onboarding();

loadShops().then(list=>{
 if(!list.length)return;
 shops=list;
 if(location.hash==='#owner')renderOwner();
}).catch(()=>{});
