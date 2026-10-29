export function validateNaverUrl(value,kind){
 if(!String(value??'').trim())return '';
 try{const u=new URL(String(value).trim());if(u.protocol!=='https:'||u.username||u.password||u.port)return '';
 const hosts=kind==='booking'?['booking.naver.com','m.booking.naver.com']:['map.naver.com','m.map.naver.com'];
 if(!hosts.includes(u.hostname))return '';
 if(kind==='booking'&&!/\/b\/businesses\/\d+/.test(u.pathname)&&!/^\/booking\//.test(u.pathname))return '';
 return u.href;
 }catch{return '';}
}
export function naverLinks(shop,saved={}){
 const entry=saved[shop.id]||{};
 const map=validateNaverUrl(entry.mapUrl||shop.naverMapUrl,'map');
 const booking=validateNaverUrl(entry.bookingUrl||shop.naverBookingUrl,'booking');
 return {map:map||'https://map.naver.com/p/search/'+encodeURIComponent('부산 '+shop.area+' 네일샵'),booking,mapIsSearch:!map};
}
