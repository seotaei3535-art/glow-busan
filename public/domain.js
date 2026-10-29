export const menus={monthly:{name:'이달의 아트',price:65000,minutes:90},plain:{name:'원컬러',price:35000,minutes:60},gradient:{name:'그라데이션',price:45000,minutes:70},art:{name:'일반 아트',price:45000,minutes:70}};
export function quote(shop,options){const menu=menus[options.menu]||menus.plain;const pieces=options.menu==='art'?Math.max(0,Math.min(10,Number(options.pieces)||0)):0;const extensions=Math.max(0,Math.min(10,Number(options.extensions)||0));const removal=options.removal==='other'?15000:options.removal==='own'?5000:0;const total=menu.price+shop.offset+pieces*5000+extensions*7000+removal;return {total,minutes:menu.minutes+pieces*5+extensions*8+(removal?20:0),deposit:10000,balance:total-10000};}
export function distanceKm(a,b){const r=Math.PI/180;const dlat=(b.lat-a.lat)*r,dlng=(b.lng-a.lng)*r;const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlng/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export function overlaps(a,b){return a.shopId===b.shopId&&a.designer===b.designer&&a.date===b.date&&a.status!=='cancelled'&&b.status!=='cancelled'&&a.start<b.start+b.minutes&&b.start<a.start+a.minutes;}
export function availableSlots(shop,date,options,bookings=[],now=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||shop.closedDates?.includes(date)||shop.menus&&!shop.menus.includes(options.menu))return [];
 const day=new Date(date+'T12:00:00+09:00').getUTCDay();
 if(shop.closedWeekdays?.includes(day))return [];
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
 const currentDate=`${parts.year}-${parts.month}-${parts.day}`;
 if(date<currentDate)return [];
 const minutes=quote(shop,options).minutes,slots=[];
 for(const designer of shop.designers||[])for(let start=shop.openMinute??600;start+minutes<=(shop.closeMinute??1200);start+=30){
  if(date===currentDate&&start<=Number(parts.hour)*60+Number(parts.minute))continue;
  const candidate={shopId:shop.id,designer,date,start,minutes,status:'confirmed'};
  if(!bookings.some(b=>overlaps(candidate,b)))slots.push(candidate);
 }
 return slots.sort((a,b)=>a.start-b.start);
}
