import {naverLinks,naverBookingForDate,validateNaverUrl} from './naver.js?v=20261112-15';
import {naverBookingByPermit} from './naver-booking-directory.js?v=20261112-21';
import {districts} from './catalog.js';
import {publicShops as verifiedShops} from './verified-shops.js?v=20261112-14';
import {registryShops} from './busan-directory.js';
import {publishedPrices} from './published-prices.js?v=20261112-14';
import {shopArt} from './shop-art.js?v=20261112-16';
import {shopDiscovery} from './shop-discovery.js?v=20261112-21';
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
  id:'permit-'+permit,permitId:permit,name,area,address,color:'#bd95a5',bg:'#f6ecef'
 }))
].map(shop=>publishedPrices[shop.id]?{...shop,...publishedPrices[shop.id]}:shop);
const publicAreas=districts.map(([area])=>area);
const defaultArea='부산진구';
const districtLimit=10;
const areaCenters=Object.fromEntries(districts.map(([area,lat,lng])=>[area,{lat,lng}]));
const naverMyUrl='https://m.place.naver.com/my';
let bookings=read('bookings',[]),favorites=read('favorites',[]),compared=read('compared',[]).filter(id=>publicShops.some(shop=>shop.id===id)),origin=null;
let filters={area:defaultArea,date:'',menu:'plain',sort:'recommended',favorites:false,query:''};
const featuredTags=['연말','가을','겨울','자석네일','프렌치','글리터','시럽네일'];
let beginnerArea=defaultArea;
let styleChoice=read('nail-style',null);
const main=$('#main'),modal=$('#modal');
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function open(html){$('#modal-body').innerHTML=html;if(!modal.open)modal.showModal();}
$('.close').onclick=()=>modal.close();
function shopArtBackground(shop){
 const photo=shopArt[shop.permitId];
 if(!photo)return '';
 return `<img class="shop-art-background" src="${escape(photo)}"
  alt="${escape(shop.name+' 네일 시술 사진')}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function options(){return {menu:filters.menu,extensions:0,pieces:0,removal:'none'};}
function extensionOptions(selected){
 return Array.from({length:11},(_,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${i?`${i}개`:'연장 안 함'}</option>`).join('');
}
function formatPublishedPrice(price){
 if(!price)return '가격은 매장에 문의';
 if(price.max)return `${money(price.amount)}~${money(price.max)}`;
 return money(price.amount)+(price.from?'부터':'');
}
function priceText(shop,menu){
 return formatPublishedPrice(shop.prices?.[menu]);
}
function priceCondition(price){
 const note=price?.note||'';
 if(note==='공개 손젤 기본가'||note==='매장 소개에 공개된 손젤 아트 가격')return '';
 return note.replace('공개 할인가','할인가');
}
function catalogView(){
 if(location.hash==='#prices')return 'prices';
 if(location.hash==='#booking'||(!location.hash&&new URLSearchParams(location.search).get('booking')==='direct'))return 'booking';
 return 'directory';
}
function updateCount(){$('#compare-count').textContent=compared.length;}
function route(){
 updateCount();
 const page=location.hash.slice(1)||(catalogView()==='booking'?'booking':'home');
 if(page==='home')renderEntry();
 else if(page==='beginner')renderBeginner();
 else if(page==='compare')renderCompare();
 else if(page==='reservations')renderBookings();
 else renderHome();
}
window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});
function areaOptions(selected){
 return publicAreas.map(area=>`<option${area===selected?' selected':''}>${area}</option>`).join('');
}
function renderEntry(){
 const invitation=(tone,href,greeting,label)=>`<a href="${href}" class="journey-choice journey-choice--${tone}">
  <span class="journey-envelope-flap" aria-hidden="true"></span>
  <span class="journey-invitation-paper">
   <span class="journey-invitation-brand" lang="fr" aria-hidden="true">ÉCRIN</span>
   <strong lang="en" class="journey-invitation"><span>${greeting}</span> <span>Princess</span></strong>
   <span class="journey-choice-label">${label}</span>
  </span>
  <span class="journey-envelope-fold" aria-hidden="true"></span>
 </a>`;
 main.innerHTML=`<section class="pastel-sky journey-entry"><div class="journey-inner">
  <h1>오늘은 어떤 네일을 할까요?</h1>
  <div class="journey-choices">
   ${invitation('rookie','#beginner','Welcome,','첫 네일 가이드 · 내 스타일 찾기')}
   ${invitation('experienced','#experienced','Welcome back,','해시태그 검색 · 단골샵 예약')}
  </div>
 </div></section>`;
}
const nailPalettes={
 warm:{label:'따뜻한 색',colors:['#efd3ad','#d9987e','#ac605c'],names:'살구 베이지 · 코랄 · 로즈 브라운'},
 cool:{label:'차분하고 시원한 색',colors:['#f1c7d6','#b5a4d9','#946184'],names:'밀키 핑크 · 라벤더 · 모브'},
 neutral:{label:'어디에나 어울리는 색',colors:['#f7e7e0','#d0aaa3','#9b7c79'],names:'밀크 베이지 · 누드 핑크 · 토프'}
};
const nailLooks={
 simple:{label:'깔끔한 원컬러',menu:'plain',tag:'',name:'원컬러'},
 soft:{label:'은은하게 물든 느낌',menu:'gradient',tag:'그라데이션',name:'그라데이션'},
 point:{label:'한두 손톱에 포인트',menu:'art',tag:'글리터',name:'글리터 포인트 아트'}
};
function styleOptions(choices,selected){
 return Object.entries(choices).map(([key,value])=>`<option value="${key}"${key===selected?' selected':''}>${value.label}</option>`).join('');
}
function renderBeginner(){
 main.innerHTML=`<section class="pastel-sky journey-heading"><div class="journey-inner"><a class="journey-back" href="#home">← 코너 선택</a><h1>첫 네일 가이드</h1><a class="primary gold" href="#beginner" id="jump-style">내 스타일 찾기 ↓</a></div></section>
 <div class="content journey-content">
  <section class="journey-panel">${firstNailGuide()}</section>
  <section class="journey-panel" aria-labelledby="care-video-title">
   <h2 id="care-video-title">젤 네일 전후 유의사항 영상</h2>
   <iframe class="care-video" src="https://www.youtube-nocookie.com/embed/wyGnWOVIMec?rel=0" title="미국피부과학회 젤 네일 전후 관리 영상" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
   <p class="sub">영상은 영어예요. 도구 소독을 확인하고, 들뜬 젤은 손으로 뜯지 마세요.</p>
   <a class="naver-link" href="https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/gel-manicures" target="_blank" rel="noopener noreferrer">미국피부과학회에서 영상 보기 ↗</a>
  </section>
  <section class="journey-panel" id="nail-style" aria-labelledby="nail-style-title">
   <h2 id="nail-style-title">내 스타일 찾기</h2>
   <form id="style-form" class="form-grid">
    <label class="field">끌리는 색<select name="tone">${styleOptions(nailPalettes,styleChoice?.tone||'neutral')}</select></label>
    <label class="field">원하는 분위기<select name="look">${styleOptions(nailLooks,styleChoice?.look||'simple')}</select></label>
    <label class="field">편한 손톱 길이<select name="length"><option value="short"${styleChoice?.length==='short'?' selected':''}>짧고 편하게</option><option value="long"${styleChoice?.length==='long'?' selected':''}>조금 길고 날렵하게</option></select></label>
    <button type="submit" class="primary gold">내 스타일 추천 받기</button>
   </form>
   <div id="style-result"></div>
  </section>
  <section class="journey-panel">
   <div class="journey-section-heading"><h2>첫 네일 예약</h2><label>지역 <select id="beginner-area" class="outline small">${areaOptions(beginnerArea)}</select></label></div>
   <div id="beginner-shops"></div>
  </section>
 </div>`;
 $('#jump-style').onclick=event=>{event.preventDefault();$('#nail-style').scrollIntoView({block:'start'});$('#style-form select').focus({preventScroll:true});};
 $('#style-form').onsubmit=event=>{
  event.preventDefault();
  styleChoice=Object.fromEntries(new FormData(event.currentTarget));
  save('nail-style',styleChoice);
  renderStyleResult();
  renderBeginnerShops();
  $('#style-result').focus();
 };
 $('#beginner-area').onchange=event=>{beginnerArea=event.target.value;renderBeginnerShops();};
 renderStyleResult();
 renderBeginnerShops();
}
function renderStyleResult(){
 const target=$('#style-result');
 if(!styleChoice||!Object.hasOwn(nailPalettes,styleChoice.tone)||!Object.hasOwn(nailLooks,styleChoice.look))return;
 const palette=nailPalettes[styleChoice.tone],look=nailLooks[styleChoice.look];
 const shape=styleChoice.length==='long'?'almond':'oval';
 target.tabIndex=-1;
 target.innerHTML=`<div class="style-result">
  <h3>${look.name} · ${nailShapes[shape].name}</h3>
  <div class="style-colors" aria-hidden="true">${palette.colors.map(color=>`<i style="--swatch:${color}"></i>`).join('')}</div>
  <p>${palette.names}</p><p class="sub">고른 스타일은 견적의 예약 요청사항에 담겨요.</p>
 </div>`;
}
function renderBeginnerShops(){
 const look=styleChoice&&Object.hasOwn(nailLooks,styleChoice.look)?nailLooks[styleChoice.look]:null;
 const list=rankedShops(beginnerArea).filter(shop=>bookingUrlForShop(shop,look?.menu||'plain'));
 if(look?.tag){
  const hasTag=shop=>(shopDiscovery[shop.permitId]?.tags||[]).includes(look.tag);
  list.sort((a,b)=>Number(hasTag(b))-Number(hasTag(a)));
 }
 const target=$('#beginner-shops');
 target.innerHTML=list.length?`<ul class="journey-shop-list">${list.map(shop=>`<li>
  <div><strong>${escape(shop.name)}</strong><small>${escape(shop.address)}</small></div>
  <button class="primary small" type="button" data-first-book="${escape(shop.id)}">견적 · 예약</button>
 </li>`).join('')}</ul>`:'<p class="note">이 지역에서 예약 링크를 확인한 매장이 없어요.</p>';
 target.querySelectorAll('[data-first-book]').forEach(button=>button.onclick=()=>{
  const palette=styleChoice&&Object.hasOwn(nailPalettes,styleChoice.tone)?nailPalettes[styleChoice.tone]:null;
  const previous=palette&&look?{
   options:{...options(),menu:look.menu,shape:styleChoice.length==='long'?'almond':'oval'},
   note:`원하는 스타일 · ${look.name}, ${palette.names}`
  }:{options:{...options(),menu:'plain'}};
  booking(button.dataset.firstBook,previous);
 });
}
function regularShopPanel(){
 return `<section class="journey-panel regular-panel">
  <h2>내 단골샵</h2>
  <div id="regular-shops"></div>
  <details class="regular-add"><summary>단골샵 등록</summary>
   <label class="field">매장명 검색<input id="regular-search" type="search" placeholder="예: 네일이지" maxlength="80"></label>
   <div id="regular-matches" aria-live="polite"></div>
   <form id="regular-form" class="regular-form">
    <label class="field">매장 이름<input name="name" required maxlength="80"></label>
    <label class="field">네이버 예약 링크<input name="url" type="url" required maxlength="1000" placeholder="https://m.booking.naver.com/…"></label>
    <button class="outline small" type="submit">링크로 등록</button>
    <p class="note" id="regular-error" role="status"></p>
   </form>
  </details>
 </section>`;
}
function renderRegularShops(){
 const target=$('#regular-shops');
 const entries=read('regular-shops',[]).map(entry=>({...entry,url:validateNaverUrl(entry.url,'booking')})).filter(entry=>entry.url);
 target.innerHTML=entries.length?`<ul class="journey-shop-list">${entries.map(entry=>`<li>
  <strong>${escape(entry.name)}</strong><div class="regular-actions">
   <a class="primary small" href="${escape(entry.url)}">네이버 예약 ↗</a>
   <button class="text-button small" type="button" data-regular-remove="${escape(entry.url)}" aria-label="${escape(entry.name)} 삭제">삭제</button>
  </div>
 </li>`).join('')}</ul>`:'<p class="note">자주 가는 매장을 저장해 바로 예약하세요.</p>';
 target.querySelectorAll('[data-regular-remove]').forEach(button=>button.onclick=()=>{
  const next=read('regular-shops',[]).filter(entry=>validateNaverUrl(entry.url,'booking')!==button.dataset.regularRemove);
  if(save('regular-shops',next))renderRegularShops();
 });
}
function addRegularShop(name,url){
 const bookingUrl=validateNaverUrl(url,'booking');
 if(!bookingUrl||!name.trim()){
  $('#regular-error').textContent='매장 이름과 네이버의 직접 예약 링크를 입력해 주세요.';
  return false;
 }
 const entries=read('regular-shops',[]);
 if(entries.some(entry=>validateNaverUrl(entry.url,'booking')===bookingUrl)){
  $('#regular-error').textContent='이미 등록한 예약 링크예요.';
  return false;
 }
 if(!save('regular-shops',[...entries,{name:name.trim(),url:bookingUrl}]))return false;
 $('#regular-error').textContent='';
 renderRegularShops();
 toast('단골샵을 등록했어요.');
 return true;
}
function bindRegularShopPanel(){
 renderRegularShops();
 $('#regular-search').oninput=event=>{
  const term=searchable(event.target.value);
  const matches=term?publicShops.filter(shop=>searchable(shop.name+' '+shop.area).includes(term)&&shopNaver(shop).booking).slice(0,6):[];
  const target=$('#regular-matches');
  target.innerHTML=matches.length?`<ul class="journey-shop-list">${matches.map(shop=>`<li>
   <div><strong>${escape(shop.name)}</strong><small>${escape(shop.address)}</small></div>
   <button class="outline small" type="button" data-regular-add="${escape(shop.id)}">등록</button>
  </li>`).join('')}</ul>`:term?'<p class="note">예약 링크가 있는 매장을 찾지 못했어요. 아래에 링크를 입력해 주세요.</p>':'';
  target.querySelectorAll('[data-regular-add]').forEach(button=>button.onclick=()=>{
   const shop=matches.find(item=>item.id===button.dataset.regularAdd);
   if(addRegularShop(shop.name,shopNaver(shop).booking))button.disabled=true;
  });
 };
 $('#regular-form').onsubmit=event=>{
  event.preventDefault();
  const values=new FormData(event.currentTarget);
  if(addRegularShop(values.get('name'),values.get('url')))event.currentTarget.reset();
 };
}
function renderHome(){
 main.innerHTML=`<section class="pastel-sky journey-heading"><div class="journey-inner"><a class="journey-back" href="#home">← 코너 선택</a><h1>경험자 코너</h1><p>해시태그로 찾거나 단골샵에서 바로 예약하세요.</p></div></section>
 <section class="content browse-content">
 ${regularShopPanel()}
 <form class="browse-search" id="search">
  <div class="browse-search-main">
   <label class="directory-search" for="shop-query">매장·주소·해시태그<input id="shop-query" type="search" maxlength="80" placeholder="매장명, 전포동, #연말" value="${escape(filters.query)}"></label>
   <button class="primary gold" type="submit">검색</button>
  </div>
  <div class="browse-search-options">
   <label>지역<select id="area">${areaOptions(filters.area)}</select></label>
   <label>시술<select id="search-menu">${Object.entries(menus).map(([key,menu])=>`<option value="${key}" ${filters.menu===key?'selected':''}>${menu.name}</option>`).join('')}</select></label>
   <label>희망 방문일<input aria-label="방문 날짜" type="date" id="search-date" min="${today()}" value="${filters.date}"></label>
  </div>
  <div class="tag-filters" aria-label="인기 해시태그">${featuredTags.map(tag=>`<button type="button" class="tag-chip" data-style-tag="${tag}">#${tag}</button>`).join('')}</div>
 </form>
 <div class="browse-shortcuts">
  <div class="filters catalog-views" role="group" aria-label="매장 목록 보기">
   ${[['directory','#directory','전체 매장'],['booking','#booking','네이버 바로 예약'],['prices','#prices','가격 있는 매장']].map(([view,href,label])=>
    `<a class="chip ${view===catalogView()?'active':''}" href="${href}" ${view===catalogView()?'aria-current="page"':''}>${label}</a>`).join('')}
  </div>
 </div>
 <div class="section-head browse-list-heading">
  <div><h2>${escape(filters.area)} 인기 TOP 10</h2><p id="directory-results" class="note" role="status"></p></div>
  <div class="browse-list-controls">
   <button class="chip ${filters.favorites?'active':''}" id="only-favorites" aria-pressed="${filters.favorites}">♡ 찜한 샵</button>
   <select class="outline small" id="sort" aria-label="정렬"><option value="recommended">네이버 리뷰 많은 순</option><option value="price">가격 낮은 순</option></select>
   <button class="location" id="locate">⌖ ${origin?'현재 위치 기준':'내 주변'}</button>
  </div>
 </div>
 <div class="grid browse-results" id="shops"></div></section>`;
$('#sort').value=filters.sort;
$('#sort').onchange=e=>{
 filters.sort=e.target.value;
 renderCards();
};
$('#shop-query').oninput=e=>{filters.query=e.target.value;renderCards();};
document.querySelectorAll('[data-style-tag]').forEach(button=>button.onclick=()=>{
 const tag=button.dataset.styleTag;
 const selected=searchParts(filters.query).tags.includes(tag);
 const tokens=filters.query.match(/#[\p{L}\p{N}_-]+|[^#\s,]+/gu)||[];
 filters.query=(selected?tokens.filter(token=>!token.startsWith('#')||searchable(token)!==tag):[...tokens,'#'+tag]).join(' ');
 $('#shop-query').value=filters.query;
 renderCards();
});
$('#search').onsubmit=e=>{e.preventDefault();applySearch({scroll:true});};
function applySearch({scroll=false}={}){
 filters.area=$('#area').value;
 filters.date=$('#search-date').value;
 filters.menu=$('#search-menu').value;
 filters.favorites=false;
 renderHome();
 if(scroll)$('#directory-results').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#area').onchange=()=>applySearch();
['search-date','search-menu'].forEach(id=>$('#'+id).onchange=()=>applySearch());
$('#locate').onclick=locate;
$('#only-favorites').onclick=()=>{filters.favorites=!filters.favorites;renderHome();};
bindRegularShopPanel();
renderCards();}
function searchable(value){
 return value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
}
function searchParts(query){
 const tokens=query.match(/#[\p{L}\p{N}_-]+|[^#\s,]+/gu)||[];
 return {
  terms:tokens.filter(token=>!token.startsWith('#')).map(searchable).filter(Boolean),
  tags:tokens.filter(token=>token.startsWith('#')).map(searchable).filter(Boolean)
 };
}
function reviewCount(shop){
 return shopDiscovery[shop.permitId]?.reviews??-1;
}
function rankedShops(area){
 return publicShops.filter(shop=>shop.area===area&&reviewCount(shop)>=0)
  .sort((a,b)=>reviewCount(b)-reviewCount(a)||a.name.localeCompare(b.name,'ko')).slice(0,districtLimit);
}
function renderCards(){
 const view=catalogView();
 const {terms,tags}=searchParts(filters.query);
 document.querySelectorAll('[data-style-tag]').forEach(button=>button.setAttribute('aria-pressed',tags.includes(button.dataset.styleTag)));
 const ranked=rankedShops(filters.area);
 const matches=ranked.filter(shop=>{
  if(filters.favorites&&!favorites.includes(shop.id))return false;
  const searchableAddress=searchable(shop.name+' '+shop.address);
  const availableTags=shopDiscovery[shop.permitId]?.tags||[];
  return terms.every(term=>searchableAddress.includes(term))&&tags.every(tag=>availableTags.includes(tag));
 });
 const list=view==='booking'?matches.filter(shop=>bookingUrlForShop(shop,filters.menu)):
  view==='prices'?matches.filter(shop=>shop.prices?.[filters.menu]):matches;
 if(filters.sort==='price'){
  list.sort((a,b)=>(a.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER)-(b.prices?.[filters.menu]?.amount??Number.MAX_SAFE_INTEGER));
 }
 const visible=list;
 const resultLabel=tags.length?tags.map(tag=>'#'+tag).join(' ')+' 검색 결과':{booking:'네이버 바로 예약',prices:'가격 있는 매장',directory:'전체 매장'}[view];
 $('#directory-results').textContent=`${resultLabel} ${list.length.toLocaleString('ko-KR')}곳 · 네이버 리뷰 확인 매장 기준`;
 $('#shops').innerHTML=visible.length?visible.map(shop=>`
  <article class="shop-card">
   ${shopArtBackground(shop)}
   <button class="heart ${favorites.includes(shop.id)?'saved':''}" aria-label="${escape(shop.name)} 찜" aria-pressed="${favorites.includes(shop.id)}" data-fav="${shop.id}">${favorites.includes(shop.id)?'♥':'♡'}</button>
   <div class="card-body">
    <div class="card-top"><h3><span class="district-rank">${ranked.indexOf(shop)+1}</span> ${escape(shop.name)}</h3></div>
    <p class="sub shop-address">${escape(shop.address)}</p>
    <div class="shop-style-tags">${tags.map(tag=>`<span>#${escape(tag)}</span>`).join('')}<small>리뷰 ${reviewCount(shop).toLocaleString('ko-KR')}</small></div>
    ${shop.prices?.[filters.menu]?`<div class="price-line"><div><small>${menus[filters.menu].name} 기본가</small> <strong>${priceText(shop,filters.menu)}</strong>${priceCondition(shop.prices[filters.menu])?`<small class="price-condition">${escape(priceCondition(shop.prices[filters.menu]))}</small>`:''}</div></div>`:'<p class="note shop-price-missing">가격 정보 없음</p>'}
    ${shop.deposit?`<p class="note">예약금 · ${shop.deposit}</p>`:''}
    ${naverActions(shop)}
    <div class="card-actions">
     ${shop.prices?.[filters.menu]?`<button class="outline" data-compare="${shop.id}">${compared.includes(shop.id)?'✓ 비교 중':'+ 비교'}</button>`:''}
     ${bookingUrlForShop(shop,filters.menu)?`<button class="primary" data-book="${shop.id}">견적 · 예약 보기 ↗</button>`:''}
    </div>
   </div>
  </article>`).join(''):`<div class="empty" style="grid-column:1/-1">${tags.length?'이 해시태그에 맞는 매장을 찾지 못했어요.':view==='booking'?'이 조건에 맞는 네이버 예약 매장이 없어요.':view==='prices'&&matches.length?'선택한 시술의 가격 정보가 없어요.':'조건에 맞는 샵이 없어요.'}
  <p>지역이나 검색 조건을 바꿔 보세요.</p>
  <button class="outline" id="reset">필터 초기화</button>
  ${view==='directory'?'':'<a class="outline" href="#directory">전체 영업 매장에서 찾기</a>'}</div>`;
 document.querySelectorAll('.shop-art-background').forEach(img=>{
  const removePhoto=()=>img.remove();
  img.addEventListener('error',removePhoto,{once:true});
  if(img.complete&&!img.naturalWidth)removePhoto();
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
  filters.favorites=false;filters.query='';
  renderHome();
 };
}
function shopNaver(shop){
 return naverLinks(shop.naverBookingUrl?shop:{...shop,naverBookingUrl:naverBookingByPermit[shop.permitId]});
}
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
function locate(){
 if(!navigator.geolocation){toast('지역을 직접 선택해 주세요.');return;}
 navigator.geolocation.getCurrentPosition(({coords})=>{
  origin={lat:coords.latitude,lng:coords.longitude};
  filters.area=[...publicAreas].sort((a,b)=>distanceKm(origin,areaCenters[a])-distanceKm(origin,areaCenters[b]))[0];
  if($('#area'))renderHome();
 },()=>toast('위치를 확인할 수 없어요. 지역을 직접 선택해 주세요.'),{timeout:10000,maximumAge:60000});
}
function renderCompare(){
 const selected=publicShops.filter(shop=>compared.includes(shop.id));
 const list=selected.filter(shop=>shop.prices?.[filters.menu]);
 const unavailable=selected.filter(shop=>!shop.prices?.[filters.menu]);
 const rows=[
  ['주소',shop=>escape(shop.address)],
  ['기본가',shop=>priceText(shop,filters.menu)],
  ['가격 조건',shop=>escape(priceCondition(shop.prices[filters.menu])||'—')],
  ['예약금 안내',shop=>shop.deposit||'예약 화면에서 확인'],
  ['네이버 예약',naverActions],
  ['견적 · 예약',shop=>bookingUrlForShop(shop,filters.menu)?`<button class="primary small" data-book="${shop.id}">견적 · 예약 보기</button>`:'직접 예약 링크 미확인']
 ];
 main.innerHTML=`<section class="content">
  <div class="page-head"><h1>비교함</h1></div>
  <div class="filters">${Object.entries(menus).map(([key,menu])=>`<button class="chip ${filters.menu===key?'active':''}" data-cmenu="${key}">${menu.name}</button>`).join('')}</div>
  ${list.length?`<div class="table-scroll"><table class="compare-table"><tbody>
   <tr><th>비교 기준</th>${list.map(shop=>`<th>${escape(shop.name)}<br><button class="text-button small" data-remove="${shop.id}">삭제 ×</button></th>`).join('')}</tr>
   ${rows.map(([label,cell])=>`<tr><th>${label}</th>${list.map(shop=>`<td>${cell(shop)}</td>`).join('')}</tr>`).join('')}
  </tbody></table></div>`:`<div class="empty">${selected.length?'선택한 시술의 가격 정보가 없어요.':'비교할 샵을 골라주세요.'}<p>${selected.length?'다른 시술을 선택해 보세요.':'샵 카드의 ‘+ 비교’로 최대 3곳을 담을 수 있어요.'}</p><a class="primary" href="#prices">매장 둘러보기</a></div>`}
  ${unavailable.length?`<p class="note">가격 정보가 없는 매장</p><div class="filters">${unavailable.map(shop=>`<button class="outline small" data-remove="${shop.id}" aria-label="${escape(shop.name)} 비교함에서 삭제">${escape(shop.name)} 삭제 ×</button>`).join('')}</div>`:''}
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
  const condition=priceCondition(shop.prices?.[opt.menu]);
  $('#quote').innerHTML=`<div class="summary-row"><span>${menus[opt.menu].name} 기본가</span><strong>${priceText(shop,opt.menu)}</strong></div>
   ${condition?`<p class="note">${escape(condition)}</p>`:''}
   ${extras.map(label=>`<div class="summary-row quote-add-on"><span>${label}</span><strong>추가요금 미확인</strong></div>`).join('')}
   ${extras.length?'<p class="note">추가 요금은 매장에서 확인해 주세요.</p>':''}`;
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
  const condition=priceCondition(price);
  return formatPublishedPrice(price)+(condition?` · ${condition}`:'');
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
  <p class="note">빈 시간은 네이버 예약에서 확인해 주세요.</p>
  ${alternatives.length?`<ul class="booking-alternatives">${alternatives.map(shop=>`<li>
   <button type="button" class="outline" data-alternative="${escape(shop.id)}">
    <strong>${escape(shop.name)}</strong><span>${escape(shop.area)} · ${priceText(shop,menu)}</span>
    ${priceCondition(shop.prices[menu])?`<span>${escape(priceCondition(shop.prices[menu]))}</span>`:''}
   </button></li>`).join('')}</ul>`:'<p>이 메뉴로 바로 연결할 수 있는 다른 매장을 찾지 못했어요. 같은 매장에서 다른 날짜를 골라 보세요.</p>'}`);
 modal.scrollTop=0;
 modal.querySelectorAll('[data-alternative]').forEach(button=>button.onclick=()=>{
  const removal=saved.options.removal==='own'?'other':saved.options.removal;
  booking(button.dataset.alternative,{...saved,date,options:{...saved.options,removal}});
 });
}
function canCancelSavedBooking(saved){
 return saved.status==='draft'||saved.status==='confirmed';
}
function renderBookings(){
 bookings=read('bookings',bookings);
 const cancellable=bookings.filter(canCancelSavedBooking);
 main.innerHTML=`<section class="content">
  <div class="page-head">
   <div class="eyebrow">YOUR NAIL JOURNEY</div><h1>내 예약과 저장한 견적</h1>
   <p class="sub">저장한 견적은 이 브라우저에 남아요. 예약 확인과 취소는 네이버에서 할 수 있어요.</p>
   <div class="card-actions">
    <a class="outline" href="${naverMyUrl}" target="_blank" rel="noopener noreferrer">네이버 예약 내역 확인 ↗</a>
    ${cancellable.length?'<button type="button" class="outline" id="cancel-all-bookings">저장 내역 모두 취소</button>':''}
   </div>
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
    ${canCancelSavedBooking(saved)?`<button class="outline" data-cancel="${escape(saved.id)}">저장 내역 취소</button>`:''}
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
 const cancelAll=$('#cancel-all-bookings');
 if(cancelAll)cancelAll.onclick=()=>confirmCancelAllBookings(cancellable);
 $('#member').onclick=memberInfo;
}
function cancelSavedBookings(ids){
 const current=read('bookings',bookings);
 const selected=new Set(ids);
 let cancelled=0;
 const next=current.map(saved=>{
  if(!selected.has(saved.id)||!canCancelSavedBooking(saved))return saved;
  cancelled++;
  return {...saved,status:'cancelled'};
 });
 if(cancelled&&!save('bookings',next))return;
 bookings=next;
 modal.close();
 route();
 toast(cancelled?`저장 내역 ${cancelled.toLocaleString('ko-KR')}건을 취소했어요.`:'취소할 저장 내역이 없어요.');
}
function cancelBooking(id){
 open(`<h2 class="modal-title">저장 내역을 취소할까요?</h2><p>네이버에서 신청한 예약은 네이버 예약 내역에서 따로 취소해 주세요.</p><button class="primary full" id="confirm-cancel">저장 내역 취소</button>`);
 $('#confirm-cancel').onclick=()=>cancelSavedBookings([id]);
}
function confirmCancelAllBookings(entries){
 const ids=entries.map(saved=>saved.id);
 const count=ids.length.toLocaleString('ko-KR');
 open(`<h2 class="modal-title">저장 내역 ${count}건을 모두 취소할까요?</h2>
  <p>네이버에서 신청한 예약은 네이버 예약 내역에서 따로 취소해 주세요.</p>
  <div class="card-actions">
   <button type="button" class="outline" id="keep-bookings">돌아가기</button>
   <button type="button" class="primary" id="confirm-cancel-all">모두 취소하기</button>
  </div>`);
 $('#keep-bookings').onclick=()=>modal.close();
 $('#keep-bookings').focus();
 $('#confirm-cancel-all').onclick=()=>cancelSavedBookings(ids);
}
function memberInfo(){open(`<div class="eyebrow">MEMBERSHIP</div><h2 class="modal-title">샵 회원 연결 안내</h2><p>실서비스에서는 이름·전화번호 입력 후 본인확인과 샵 회원정보 대조가 필요합니다.</p><p class="note">과제 버전에서는 실제 이름·전화번호를 수집하지 않으며 문자 인증과 회원 혜택은 연결되지 않았습니다.</p><button class="primary full" id="member-close">확인</button>`);$('#member-close').onclick=()=>modal.close();}
route();
