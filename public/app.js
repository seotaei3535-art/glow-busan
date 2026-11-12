import {naverLinks,naverBookingForDate} from './naver.js';
import {districts} from './catalog.js';
import {publicShops as verifiedShops} from './verified-shops.js';
import {directoryUpdated,registryShops} from './busan-directory.js';
import {publishedPrices} from './published-prices.js';
import {basicNailShapes,nailShapes} from './nail-shapes.js';
import {menus,distanceKm} from './domain.js';
import {firstNailGuide} from './first-nail-guide.js?v=20261112-7';
const $=s=>document.querySelector(s),money=n=>Number(n).toLocaleString('ko-KR')+'원';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem('glow-'+key))??fallback;}catch{return fallback;}}
function save(key,value){
 try{localStorage.setItem('glow-'+key,JSON.stringify(value));return true;}
 catch{toast('저장 공간이 부족하거나 브라우저 저장이 차단되었습니다.');return false;}
}
const activePermits=new Set(registryShops.map(([permit])=>permit));
const activeVerifiedShops=verifiedShops.filter(shop=>activePermits.has(shop.permitId));
const verifiedPermits=new Set(activeVerifiedShops.map(shop=>shop.permitId));
const publicShops=[
 ...activeVerifiedShops,
 ...registryShops.filter(([permit])=>!verifiedPermits.has(permit)).map(([permit,name,area,address])=>({
  id:'permit-'+permit,name,area,address,color:'#bd95a5',bg:'#f6ecef'
 }))
].map(shop=>publishedPrices[shop.id]?{...shop,...publishedPrices[shop.id]}:shop);
const publicAreas=districts.map(([area])=>area);
const directBookingCount=publicShops.filter(shop=>shopNaver(shop).booking).length;
const directoryPageSize=24;
let resultsLimit=directoryPageSize;
const areaCenters=Object.fromEntries(districts.map(([area,lat,lng])=>[area,{lat,lng}]));
const naverMyUrl='https://m.place.naver.com/my';
let bookings=read('bookings',[]),favorites=read('favorites',[]),compared=read('compared',[]).filter(id=>publicShops.some(shop=>shop.id===id)),origin=null;
let filters={area:'all',date:'',menu:'plain',sort:'price',favorites:false,query:''};
const main=$('#main'),modal=$('#modal');
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function open(html){$('#modal-body').innerHTML=html;if(!modal.open)modal.showModal();}
$('.close').onclick=()=>modal.close();
function shopExterior(shop){
 const photo=shop.exterior;
 const fallback=`<div class="shop-photo-missing"${photo?' hidden':''}><span>외관 사진 미확인</span><a href="${escape(shopNaver(shop).map)}" target="_blank" rel="noopener noreferrer">지도에서 위치 확인 ↗</a></div>`;
 if(!photo)return fallback;
 return `<figure class="shop-exterior">
  <img src="${escape(photo.image)}" alt="${escape(shop.name+' '+photo.label)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
  <figcaption><span>${escape(photo.label)}</span><a href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer">매장 사진 출처 ↗</a></figcaption>
 </figure>${fallback}`;
}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function options(){return {menu:filters.menu,extensions:0,pieces:0,removal:'none'};}
function extensionOptions(selected){
 return Array.from({length:11},(_,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${i?`${i}개`:'연장 안 함'}</option>`).join('');
}
function formatPublishedPrice(price){
 if(!price)return '공개 가격 없음';
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
function catalogView(){
 if(location.hash==='#directory')return 'directory';
 if(location.hash==='#prices')return 'prices';
 return 'booking';
}
function updateCount(){$('#compare-count').textContent=compared.length;}
function route(){updateCount();const page=location.hash.slice(1)||'home';if(page==='compare')renderCompare();else if(page==='reservations')renderBookings();else renderHome();}
window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});
function renderHome(){resultsLimit=directoryPageSize;main.innerHTML=`<section class="hero"><div class="eyebrow">YOUR NAIL, YOUR MOMENT</div><h1>부산의 네일, 한눈에.<br>내 취향에 꼭 맞는 <em>Glow.</em></h1><p>부산 16개 구·군의 네일샵을 찾고,<br>공개 가격과 네이버 예약 정보를 비교해 보세요.</p></section><form class="searchbar" id="search"><label>어디에서 찾으세요?<select id="area"><option value="all">부산 전체</option>${publicAreas.map(x=>`<option ${filters.area===x?'selected':''}>${x}</option>`).join('')}</select></label><label>희망 방문일 (견적에 적용)<input aria-label="방문 날짜" type="date" id="search-date" min="${today()}" value="${filters.date}"></label><label>어떤 네일을 원하세요?<select id="search-menu">${Object.entries(menus).map(([k,v])=>`<option value="${k}" ${filters.menu===k?'selected':''}>${v.name}</option>`).join('')}</select></label><button class="primary gold">네일샵 찾기 ↗</button></form><section class="content"><div class="guide-banner"><span class="spark">✧</span><div><strong>네일이 처음이라면, 여기부터 시작해요.</strong><p>손톱 모양과 아트 종류, 시술 전후 알아둘 점을 확인해요.</p></div><button class="text-button" id="guide">첫 네일 가이드 ↗</button></div><div class="section-head"><div><div class="eyebrow">FIND YOUR FAVORITE</div><h2>당신을 위한 네일샵</h2><button class="location" id="locate">⌖ ${origin?'현재 위치 기준 · 가까운 지역 순':'현재 위치로 찾기'}</button></div><select class="outline small" id="sort" aria-label="정렬"><option value="price">공개 가격 낮은 순</option><option value="distance">가까운 지역 순</option></select></div><div class="filters">${[['monthly','이달의 아트'],['plain','원컬러'],['gradient','그라데이션'],['art','일반 아트']].map(([k,v])=>`<button class="chip ${filters.menu===k?'active':''}" data-menu="${k}">${v}</button>`).join('')}<button id="only-favorites" class="chip ${filters.favorites?'active':''}">♡ 찜한 샵</button></div><div class="directory-tools">
  <label class="directory-search" for="shop-query">매장명·주소 검색<input id="shop-query" type="search" maxlength="80" placeholder="예: 전포동, 네일이지" value="${escape(filters.query)}"></label>
 </div>
 <div class="filters catalog-views" role="group" aria-label="매장 목록 보기">
  ${[['booking','#home','네이버 바로 예약'],['prices','#prices','공개 가격 비교'],['directory','#directory','전체 영업 매장']].map(([view,href,label])=>
   `<a class="chip ${view===catalogView()?'active':''}" href="${href}" ${view===catalogView()?'aria-current="page"':''}>${label}</a>`).join('')}
 </div>
 <p class="note">${{booking:'견적을 저장하면 각 매장의 네이버 예약창으로 바로 이동해요.',prices:'선택한 메뉴의 가격을 매장이 공개한 곳만 보여요.',directory:'전체 영업 매장의 위치와 예약 정보를 볼 수 있어요.'}[catalogView()]}</p>
 <p class="note directory-source">부산 16개 구·군 인허가상 영업 중 ${publicShops.length.toLocaleString('ko-KR')}곳 · 직접 예약 확인 ${directBookingCount}곳 · <a href="https://www.data.go.kr/data/15045037/fileData.do" target="_blank" rel="noopener noreferrer">미용업 인허가 자료 ${directoryUpdated} ↗</a><br>오늘 영업시간이나 임시휴무는 방문 전 네이버 지도에서 확인해 주세요.</p>
 <p id="directory-results" class="note" role="status"></p><div class="grid" id="shops"></div><div id="directory-pagination"></div></section>`;
$('#sort').value=filters.sort;
$('#sort').onchange=e=>{
 filters.sort=e.target.value;
 if(filters.sort==='distance'&&!origin)toast('가까운 지역 순으로 보려면 현재 위치를 먼저 설정해 주세요.');
 renderFirstPage();
};
$('#shop-query').oninput=e=>{filters.query=e.target.value;renderFirstPage();};
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
 const view=catalogView();
 const terms=filters.query.trim().split(/\s+/).map(searchable).filter(Boolean);
 const matches=publicShops.filter(shop=>{
  if(filters.area!=='all'&&shop.area!==filters.area)return false;
  if(filters.favorites&&!favorites.includes(shop.id))return false;
  const searchableAddress=searchable(shop.name+' '+shop.address);
  return terms.every(term=>searchableAddress.includes(term));
 });
 const list=view==='booking'?matches.filter(shop=>bookingUrlForShop(shop,filters.menu)):
  view==='prices'?matches.filter(shop=>shop.prices?.[filters.menu]):matches;
 if(filters.sort==='distance'&&origin){
  list.sort((a,b)=>distanceKm(origin,areaCenters[a.area])-distanceKm(origin,areaCenters[b.area]));
 }else{
  list.sort((a,b)=>(a.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER)-(b.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER));
 }
 const visible=list.slice(0,resultsLimit);
 const resultLabel={booking:'네이버 바로 예약',prices:menus[filters.menu].name+' 공개가 확인',directory:'영업 매장'}[view];
 $('#directory-results').textContent=`${resultLabel} ${list.length.toLocaleString('ko-KR')}곳 · ${visible.length.toLocaleString('ko-KR')}곳 표시`;
 $('#shops').innerHTML=visible.length?visible.map(shop=>`
  <article class="shop-card">
   <div class="shop-card-media">${shopExterior(shop)}
    <button class="heart ${favorites.includes(shop.id)?'saved':''}" aria-label="${escape(shop.name)} 찜" aria-pressed="${favorites.includes(shop.id)}" data-fav="${shop.id}">${favorites.includes(shop.id)?'♥':'♡'}</button>
   </div>
   <div class="card-body">
    <div class="card-top"><h3>${escape(shop.name)}</h3></div>
    <p class="sub">${escape(shop.address)}</p>
    ${shop.prices?.[filters.menu]?`<div class="price-line"><div><small>${menus[filters.menu].name} · 공개 기본가</small><br><strong>${priceText(shop,filters.menu)}</strong>${priceCondition(shop,filters.menu)?`<br><small>${escape(priceCondition(shop,filters.menu))}</small>`:''}</div>${sourceLink(shop)}</div>`:''}
    ${shop.deposit?`<p class="note">예약금 · ${shop.deposit}</p>`:''}
    ${naverActions(shop)}
    <div class="card-actions">
     ${shop.prices?.[filters.menu]?`<button class="outline" data-compare="${shop.id}">${compared.includes(shop.id)?'✓ 비교 중':'+ 비교'}</button>`:''}
     ${bookingUrlForShop(shop,filters.menu)?`<button class="primary" data-book="${shop.id}">견적 · 예약 보기 ↗</button>`:''}
    </div>
   </div>
  </article>`).join(''):`<div class="empty" style="grid-column:1/-1">${view==='booking'?'이 조건에서 네이버 예약 링크가 확인된 매장이 없어요.':view==='prices'&&matches.length?'이 조건에서 공개된 메뉴 가격이 없어요.':'조건에 맞는 샵이 없어요.'}
  <p>지역이나 검색 조건을 바꿔 보세요.</p>
  <button class="outline" id="reset">필터 초기화</button>
  ${view==='directory'?'':'<a class="outline" href="#directory">전체 영업 매장에서 찾기</a>'}</div>`;
 document.querySelectorAll('.shop-exterior img').forEach(img=>{
  const showFallback=()=>{
   const figure=img.closest('figure');
   figure.hidden=true;
   figure.nextElementSibling.hidden=false;
  };
  img.addEventListener('error',showFallback,{once:true});
  if(img.complete&&!img.naturalWidth)showFallback();
 });
 document.querySelectorAll('[data-fav]').forEach(button=>button.onclick=()=>{
  const id=button.dataset.fav;
  favorites=favorites.includes(id)?favorites.filter(saved=>saved!==id):[...favorites,id];
  save('favorites',favorites);
  renderCards();
 });
 document.querySelectorAll('[data-compare]').forEach(button=>button.onclick=()=>toggleCompare(button.dataset.compare));
 bindBook();
 if($('#reset'))$('#reset').onclick=()=>{
  filters.area='all';filters.favorites=false;filters.query='';
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
function bookingUrlForShop(shop,menu,date=''){
 const links=shopNaver(shop);
 const visitDate=date&&date>=today()?date:'';
 return naverBookingForDate(shop.menuBookingUrls?.[menu],visitDate)||naverBookingForDate(links.booking,visitDate);
}
function naverActions(shop){
 const links=shopNaver(shop);
 const map=`<a class="naver-link" href="${escape(links.map)}" target="_blank" rel="noopener noreferrer">네이버 지도 ↗</a>`;
 const booking=links.booking?`<a class="naver-link" href="${escape(links.booking)}" target="_blank" rel="noopener noreferrer">네이버 예약 ↗</a>`:'<span class="naver-pending">직접 예약 링크 미확인</span>';
 return `<div class="naver-actions">${map}${booking}</div>`;
}
function bindBook(){document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>booking(b.dataset.book));}
function toggleCompare(id){if(compared.includes(id))compared=compared.filter(x=>x!==id);else if(compared.length>=3){toast('최대 3개 샵까지 비교할 수 있어요.');return;}else compared.push(id);save('compared',compared);updateCount();route();}
function locate(){if(!navigator.geolocation){toast('위치 기능을 지원하지 않습니다. 지역을 직접 선택해주세요.');return;}toast('위치를 확인하고 있어요.');navigator.geolocation.getCurrentPosition(p=>{origin={lat:p.coords.latitude,lng:p.coords.longitude};filters.sort='distance';renderHome();toast('현재 위치에서 가까운 지역 순으로 정렬했어요.');},()=>toast('위치를 확인할 수 없어요. 지역을 직접 선택해주세요.'),{timeout:10000,maximumAge:60000});}
function guide(){
 open(`<h2 class="modal-title" id="first-nail-title" tabindex="-1">첫 네일 가이드</h2>
  ${firstNailGuide()}`);
 modal.scrollTop=0;
 $('#first-nail-title').focus();
}
function onboarding(){open(`<div class="eyebrow">WELCOME TO GLOW BUSAN</div><h2 class="modal-title">어떤 네일 경험을 찾고 있나요?</h2><p class="sub">로그인 없이도 샵과 가격을 비교할 수 있어요.</p><button id="first-time" class="primary full">네일이 처음이에요 · 가이드 보기</button><button id="experienced" class="outline full">경험이 있어요 · 바로 둘러보기</button><button id="skip" class="text-button full">지금은 건너뛰기</button>`);$('#first-time').onclick=()=>{save('onboarded',true);guide();};['experienced','skip'].forEach(id=>$('#'+id).onclick=()=>{save('onboarded',true);modal.close();});}
function renderCompare(){
 const selected=publicShops.filter(shop=>compared.includes(shop.id));
 const list=selected.filter(shop=>shop.prices?.[filters.menu]);
 const unavailable=selected.filter(shop=>!shop.prices?.[filters.menu]);
 const rows=[
  ['주소',shop=>escape(shop.address)],
  ['공개 기본가',shop=>priceText(shop,filters.menu)],
  ['가격 조건',shop=>escape(priceCondition(shop,filters.menu)||'—')],
  ['가격 출처',shop=>sourceLink(shop)||'—'],
  ['예약금 안내',shop=>shop.deposit||'예약 화면에서 확인'],
  ['네이버 예약',naverActions],
  ['견적 · 예약',shop=>bookingUrlForShop(shop,filters.menu)?`<button class="primary small" data-book="${shop.id}">견적 · 예약 보기</button>`:'직접 예약 링크 미확인']
 ];
 main.innerHTML=`<section class="content">
  <div class="page-head"><div class="eyebrow">SIDE BY SIDE</div><h1>네일샵 한눈에 비교</h1><p class="sub">같은 메뉴의 기본가를 비교하세요. 연장·제거 비용은 매장마다 달라요.</p></div>
  <div class="filters">${Object.entries(menus).map(([key,menu])=>`<button class="chip ${filters.menu===key?'active':''}" data-cmenu="${key}">${menu.name}</button>`).join('')}</div>
  ${list.length?`<div class="table-scroll"><table class="compare-table"><tbody>
   <tr><th>비교 기준</th>${list.map(shop=>`<th>${escape(shop.name)}<br><button class="text-button small" data-remove="${shop.id}">삭제 ×</button></th>`).join('')}</tr>
   ${rows.map(([label,cell])=>`<tr><th>${label}</th>${list.map(shop=>`<td>${cell(shop)}</td>`).join('')}</tr>`).join('')}
  </tbody></table></div>`:`<div class="empty">${selected.length?'선택한 메뉴의 공개 가격이 없어요.':'비교할 샵을 골라주세요.'}<p>${selected.length?'다른 메뉴를 선택하거나 가격이 공개된 샵을 추가해 보세요.':'샵 카드에서 ‘+ 비교’를 누르면 최대 3곳을 비교할 수 있어요.'}</p><a class="primary" href="#prices">공개 가격 비교</a></div>`}
  ${unavailable.length?`<p class="note">이 메뉴의 가격이 공개되지 않은 매장</p><div class="filters">${unavailable.map(shop=>`<button class="outline small" data-remove="${shop.id}" aria-label="${escape(shop.name)} 비교함에서 삭제">${escape(shop.name)} 삭제 ×</button>`).join('')}</div>`:''}
 </section>`;
 bindBook();
 document.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>toggleCompare(button.dataset.remove));
 document.querySelectorAll('[data-cmenu]').forEach(button=>button.onclick=()=>{filters.menu=button.dataset.cmenu;renderCompare();});
}
function booking(id,previous,{reschedule=false}={}){
 const shop=publicShops.find(item=>item.id===id);
 if(!shop)return;
 const selected=previous?.options||options();
 if(!bookingUrlForShop(shop,selected.menu))return;
 const shape=Object.hasOwn(basicNailShapes,selected.shape)?selected.shape:'';
 const minDate=today();
 const requestedDate=previous?.date||filters.date;
 const date=requestedDate>=minDate?requestedDate:minDate;
 open(`<div class="eyebrow">MAKE YOUR MOMENT</div>
  <h2 class="modal-title">${escape(shop.name)}</h2><p class="sub">${escape(shop.address)}</p>
  ${naverActions(shop)}${shape?`<p class="sub">선호 모양 · ${nailShapes[shape].name}</p>`:''}
  <form id="book-form">
   <div class="form-grid">
    <label class="field">시술 메뉴<select id="b-menu">${Object.entries(menus).map(([key,menu])=>`<option value="${key}" ${key===selected.menu?'selected':''}>${menu.name}</option>`).join('')}</select></label>
    <label class="field">연장 개수<select id="b-extensions">${extensionOptions(selected.extensions)}</select></label>
    <label class="field">기존 젤 제거<select id="b-removal"><option value="none">제거 없음</option><option value="own">이 매장에서 받은 젤</option><option value="other">다른 매장에서 받은 젤</option></select></label>
    <label class="field" id="pieces-field">일반 아트 개수<select id="b-pieces">${Array.from({length:11},(_,i)=>`<option value="${i}" ${i===Number(selected.pieces)?'selected':''}>${i}개</option>`).join('')}</select></label>
    <label class="field">희망 방문 날짜<input id="b-date" type="date" required min="${minDate}" value="${escape(date)}"></label>
   </div>
   <div class="summary" id="quote" aria-live="polite"></div>
   <details class="quote-extras"${previous?.note?' open':''}>
    <summary>요청사항과 참고 사진 추가 (선택)</summary>
    <label class="field">예약 요청사항<textarea id="b-note" maxlength="500" placeholder="원하는 색상이나 스타일을 적어주세요."></textarea></label>
    <label class="field">참고 사진 미리보기 (최대 5MB)<input id="b-photo" type="file" accept="image/jpeg,image/png,image/webp"><span id="photo-output"></span></label>
   </details>
   <button class="primary full gold" id="save-and-book" type="submit"></button>
   <p class="note" id="save-and-book-help"></p>
  </form>`);
 $('#b-removal').value=selected.removal;
 $('#b-note').value=previous?.note||'';
 const readOptions=()=>({
  menu:$('#b-menu').value,shape,extensions:Number($('#b-extensions').value),
  pieces:Number($('#b-pieces').value),removal:$('#b-removal').value
 });
 function refresh(){
  const opt=readOptions();
  const bookingUrl=bookingUrlForShop(shop,opt.menu);
  $('#save-and-book').textContent='견적 저장하고 네이버 예약으로 바로 가기';
  $('#save-and-book').disabled=!bookingUrl;
  $('#save-and-book-help').textContent=bookingUrl?'예약 가능한 시간은 네이버에서 확인해요. 휴무나 마감이면 앱으로 돌아와 날짜나 매장을 바꿀 수 있어요.':'이 메뉴의 네이버 예약 링크가 확인되지 않았어요.';
  $('#pieces-field').hidden=opt.menu!=='art';
  const extras=estimateAddOns(opt);
  $('#quote').innerHTML=`<div class="summary-row"><span>${menus[opt.menu].name} 기본가</span><strong>${priceText(shop,opt.menu)}</strong></div>
   ${priceCondition(shop,opt.menu)?`<p class="note">${escape(priceCondition(shop,opt.menu))}</p>`:''}
   ${extras.map(label=>`<div class="summary-row quote-add-on"><span>${label}</span><strong>추가요금 미확인</strong></div>`).join('')}
   ${extras.length?'<p class="note">선택한 옵션의 추가요금은 네이버 예약 화면이나 매장에서 확인해 주세요.</p>':''}
   ${shop.prices?.[opt.menu]?sourceLink(shop):''}`;
 }
 ['#b-menu','#b-extensions','#b-removal','#b-pieces'].forEach(selector=>$(selector).onchange=refresh);
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
  const opt=readOptions();
  if(!bookingUrlForShop(shop,opt.menu))return;
  const allBookings=read('bookings',[]);
  const existing=reschedule&&allBookings.find(item=>item.id===previous?.id&&item.status==='draft');
  const saved={
   id:existing?.id||crypto.randomUUID(),shopId:id,shopName:shop.name,
   date:$('#b-date').value,options:opt,
   publishedPrice:shop.prices?.[opt.menu]??null,note:$('#b-note').value,
   kind:'estimate',status:'draft',createdAt:existing?.createdAt||new Date().toISOString()
  };
  const next=existing?allBookings.map(item=>item.id===saved.id?saved:item):[...allBookings,saved];
  if(!save('bookings',next))return;
  bookings=next;
  openSavedBooking(saved,shop,{justSaved:true});
 };
 if(reschedule)$('#b-date').focus();
}

function estimateAddOns(opt){
 const removal={own:'이 매장에서 받은 젤 제거',other:'다른 매장에서 받은 젤 제거'}[opt.removal];
 return [opt.extensions?`연장 ${Number(opt.extensions)}개`:'',removal,opt.menu==='art'&&opt.pieces?`아트 ${Number(opt.pieces)}개`:''].filter(Boolean);
}
function bookingOptionText(opt,includeAddOns=true){
 const shape=opt.shape&&Object.hasOwn(nailShapes,opt.shape)?nailShapes[opt.shape].name:'';
 return [menus[opt.menu].name,shape,...(includeAddOns?estimateAddOns(opt):[])].filter(Boolean).join(' · ');
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
function savedPriceLabel(saved){
 return Object.hasOwn(saved,'publishedPrice')||Object.hasOwn(saved,'basePrice')?'저장 당시 기본가':'저장 당시 견적';
}

function openSavedBooking(saved,shop,{justSaved=false}={}){
 const bookingUrl=bookingUrlForShop(shop,saved.options.menu,saved.date);
 const details=[
  saved.shopName,
  `희망 일정 ${savedSchedule(saved)}`,
  bookingOptionText(saved.options,saved.kind!=='estimate'),
  `${savedPriceLabel(saved)} ${savedPrice(saved)}`,
  ...(saved.kind==='estimate'?estimateAddOns(saved.options).map(label=>`${label} · 추가요금 미확인`):[]),
  saved.note?`요청사항 ${saved.note}`:''
 ].filter(Boolean);
 const quote=details.join('\n');
 open(`<h2 class="modal-title">${justSaved?'견적을 저장했어요':'저장한 견적'}</h2>
  ${bookingUrl?`<a class="primary full booking-time-action" id="open-handoff" href="${escape(bookingUrl)}">네이버 예약으로 바로 가기</a>
  <p class="handoff-instructions">복사한 옵션은 네이버 요청사항 칸이 있을 때 붙여넣을 수 있어요.</p>`:
  '<p class="handoff-instructions">이 매장의 네이버 예약 링크는 아직 확인되지 않았어요.</p>'}
  <div class="summary booking-handoff">${details.map(detail=>`<p>${escape(detail)}</p>`).join('')}</div>
  <button class="outline" id="copy-booking">견적만 복사</button>
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
 $('#copy-booking').onclick=copy;
 $('#show-booking').onclick=()=>{modal.close();location.hash='reservations';route();};
 if(bookingUrl){
  // Start copying during the click, but do not let clipboard prompts block booking.
  let copyDeadline;
  Promise.race([copy(),new Promise(resolve=>{copyDeadline=setTimeout(resolve,350);})])
   .then(()=>{
    clearTimeout(copyDeadline);
    // Returning from Naver should show the saved estimate and its next actions.
    modal.close();
    history.replaceState(history.state,'','#reservations');
    route();
    window.location.assign(bookingUrl);
   });
 }
}
function time(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
function savedBookingAction(saved){
 if(saved.status==='cancelled'||saved.status==='completed')return '';
 const shop=publicShops.find(s=>s.id===saved.shopId);
 if(!shop)return '';
 const bookingUrl=bookingUrlForShop(shop,saved.options.menu);
 return `<button class="primary" data-handoff="${escape(saved.id)}">${bookingUrl?'네이버 예약으로 바로 가기':'저장한 견적 보기'}</button>`;
}
function showAlternativeShops(saved){
 const menu=saved.options.menu;
 const minDate=today();
 const date=saved.date>=minDate?saved.date:minDate;
 const original=publicShops.find(shop=>shop.id===saved.shopId);
 const alternatives=publicShops.filter(shop=>shop.id!==saved.shopId&&shop.prices?.[menu]&&bookingUrlForShop(shop,menu));
 alternatives.sort((a,b)=>Number(b.area===original?.area)-Number(a.area===original?.area)||a.prices[menu].amount-b.prices[menu].amount);
 open(`<h2 class="modal-title">다른 매장 찾기</h2>
  <p class="sub">${escape(date)} · ${menus[menu].name}</p>
  <p class="note">같은 메뉴의 공개 가격과 네이버 예약 링크가 확인된 매장이에요. 해당 날짜의 빈자리는 매장의 네이버 예약창에서 확인해 주세요.</p>
  ${alternatives.length?`<ul class="booking-alternatives">${alternatives.map(shop=>`<li>
   <button type="button" class="outline" data-alternative="${escape(shop.id)}">
    <strong>${escape(shop.name)}</strong><span>${escape(shop.area)} · ${priceText(shop,menu)}</span>
    ${priceCondition(shop,menu)?`<span>${escape(priceCondition(shop,menu))}</span>`:''}
   </button></li>`).join('')}</ul>`:'<p>이 메뉴로 바로 연결할 수 있는 다른 매장을 찾지 못했어요. 같은 매장에서 다른 날짜를 골라 보세요.</p>'}`);
 modal.scrollTop=0;
 modal.querySelectorAll('[data-alternative]').forEach(button=>button.onclick=()=>{
  const removal=saved.options.removal==='own'?'other':saved.options.removal;
  booking(button.dataset.alternative,{...saved,date,options:{...saved.options,removal}});
 });
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
   <p>${savedPriceLabel(saved)} <strong>${escape(savedPrice(saved))}</strong></p>
   ${saved.kind==='estimate'&&estimateAddOns(saved.options).length?'<p class="sub">선택한 옵션 · 추가요금 미확인</p>':''}
   ${saved.note?`<p class="sub">요청사항 · ${escape(saved.note)}</p>`:''}
   ${saved.record?`<p class="sub">시술 메모 · ${escape(saved.record)}</p>`:''}
   <div class="card-actions">
    ${savedBookingAction(saved)}
    ${publicShops.some(shop=>shop.id===saved.shopId&&bookingUrlForShop(shop,saved.options.menu))?`<button class="outline" data-rebook="${escape(saved.id)}">${saved.status==='draft'?'다른 날짜 고르기':'같은 옵션으로 다시 견적'}</button>`:''}
    ${saved.status==='draft'?`<button class="outline" data-alternatives="${escape(saved.id)}">다른 매장 찾기</button>`:''}
    ${['draft','confirmed'].includes(saved.status)?`<button class="outline" data-cancel="${saved.id}">저장 내역 취소</button>`:''}
   </div>
  </article>`).join(''):`<div class="empty">아직 저장한 견적이 없어요.<p>마음에 드는 샵부터 찾아볼까요?</p><a class="primary" href="#home">샵 둘러보기</a></div>`}
  <div class="modal-section"><button class="outline full" id="member">샵 회원 인증 안내</button></div>
 </section>`;
 document.querySelectorAll('[data-handoff]').forEach(button=>button.onclick=()=>{
  const saved=bookings.find(item=>item.id===button.dataset.handoff);
  const shop=saved&&publicShops.find(item=>item.id===saved.shopId);
  if(shop)openSavedBooking(saved,shop);
 });
 document.querySelectorAll('[data-rebook]').forEach(button=>button.onclick=()=>{
  const saved=bookings.find(item=>item.id===button.dataset.rebook);
  if(saved)booking(saved.shopId,saved,{reschedule:saved.status==='draft'});
 });
 document.querySelectorAll('[data-alternatives]').forEach(button=>button.onclick=()=>{
  const saved=bookings.find(item=>item.id===button.dataset.alternatives);
  if(saved)showAlternativeShops(saved);
 });
 document.querySelectorAll('[data-cancel]').forEach(button=>button.onclick=()=>cancelBooking(button.dataset.cancel));
 $('#member').onclick=memberInfo;
}
function cancelBooking(id){open(`<h2 class="modal-title">저장 내역을 취소할까요?</h2><p>네이버에서 신청한 예약은 네이버 예약 내역에서 따로 취소해 주세요.</p><button class="primary full" id="confirm-cancel">저장 내역 취소</button>`);$('#confirm-cancel').onclick=()=>{bookings=bookings.map(b=>b.id===id?{...b,status:'cancelled'}:b);save('bookings',bookings);modal.close();route();toast('저장한 예약 내용이 취소됐어요.');};}
function memberInfo(){open(`<div class="eyebrow">MEMBERSHIP</div><h2 class="modal-title">샵 회원 연결 안내</h2><p>실서비스에서는 이름·전화번호 입력 후 본인확인과 샵 회원정보 대조가 필요합니다.</p><p class="note">과제 버전에서는 실제 이름·전화번호를 수집하지 않으며 문자 인증과 회원 혜택은 연결되지 않았습니다.</p><button class="primary full" id="member-close">확인</button>`);$('#member-close').onclick=()=>modal.close();}
route();if(!read('onboarded',false))onboarding();
