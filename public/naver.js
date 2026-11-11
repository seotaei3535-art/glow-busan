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
 return {map:map||'https://map.naver.com/p/search/'+encodeURIComponent(shop.address?shop.name+' 부산 '+shop.area:'부산 '+shop.area+' 네일샵'),booking,mapIsSearch:!map};
}

export function naverBookingForDate(booking,date){
 const valid=validateNaverUrl(booking,'booking');
 if(!valid)return '';
 const url=new URL(valid);
 if(!/^\/booking\/13\/bizes\/\d+\/items\/\d+\/?$/.test(url.pathname))return valid;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return valid;
 const day=new Date(date+'T00:00:00Z');
 if(!Number.isFinite(+day)||day.toISOString().slice(0,10)!==date)return valid;
 url.searchParams.set('startDate',date);
 return url.href;
}
