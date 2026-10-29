// Public web configuration from the existing taeeui Firebase app.
// These identifiers are not admin credentials. Never add service-account keys here.
export const firebaseConfig={apiKey:'AIzaSyAg-aUZceo2v3T_XrJkjXpx3MolGjVrZnk',authDomain:'taeeui.firebaseapp.com',databaseURL:'https://taeeui-default-rtdb.firebaseio.com',projectId:'taeeui',storageBucket:'taeeui.firebasestorage.app',messagingSenderId:'157962116241',appId:'1:157962116241:web:b7f43c4377379c15547330'};
export function normalizeShops(data){
 const text=value=>String(value??'').replace(/[<>"'&]/g,'').slice(0,160);
 if(!data||typeof data!=='object'||Array.isArray(data))return [];
 return Object.entries(data).flatMap(([id,s])=>{
  if(!s||typeof s!=='object'||!s.name||!s.area||!Array.isArray(s.designers)||!s.designers.length||!Number.isFinite(s.lat)||!Number.isFinite(s.lng)||!Number.isFinite(s.offset)||s.offset < -20000||s.offset>100000)return [];
  return [{id:text(id),naverMapUrl:typeof s.naverMapUrl==='string'?s.naverMapUrl:'',naverBookingUrl:typeof s.naverBookingUrl==='string'?s.naverBookingUrl:'',name:text(s.name),area:text(s.area),station:text(s.station),tag:text(s.tag),lat:s.lat,lng:s.lng,offset:s.offset,rating:Math.max(0,Math.min(5,Number(s.rating)||0)),reviews:Math.max(0,Math.floor(Number(s.reviews)||0)),color:/^#[0-9a-f]{6}$/i.test(s.color)?s.color:'#cca1a0',bg:/^#[0-9a-f]{6}$/i.test(s.bg)?s.bg:'#f7e8ef',designers:s.designers.map(text).slice(0,20),menus:Array.isArray(s.menus)?s.menus.filter(k=>['plain','art','monthly','gradient'].includes(k)):undefined,closedDates:Array.isArray(s.closedDates)?s.closedDates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)):[],closedWeekdays:Array.isArray(s.closedWeekdays)?s.closedWeekdays.filter(x=>Number.isInteger(x)&&x>=0&&x<=6):[],openMinute:Number.isInteger(s.openMinute)&&s.openMinute>=0&&s.openMinute<1440?s.openMinute:600,closeMinute:Number.isInteger(s.closeMinute)&&s.closeMinute>0&&s.closeMinute<=1440?s.closeMinute:1200}];
 });
}
export async function loadShops(){
 const response=await fetch(firebaseConfig.databaseURL+'/glow/shops.json',{signal:AbortSignal.timeout(10000),cache:'no-store',credentials:'omit'});
 if(!response.ok)throw new Error('Firebase catalog HTTP '+response.status);
 return normalizeShops(await response.json());
}
