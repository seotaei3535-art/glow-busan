import test from 'node:test';
import assert from 'node:assert/strict';
import {quote,overlaps,distanceKm,availableSlots} from '../public/domain.js';
test('options calculate total, deposit and time',()=>{assert.deepEqual(quote({offset:5000},{menu:'art',pieces:2,extensions:2,removal:'other'}),{total:89000,minutes:116,deposit:10000,balance:79000});});
test('monthly art does not charge general art pieces',()=>{assert.equal(quote({offset:0},{menu:'monthly',pieces:10,extensions:0,removal:'none'}).total,65000);});
test('overlap includes entire treatment, excludes cancellation and adjacent times',()=>{const a={shopId:'a',designer:'x',date:'2026-11-01',start:600,minutes:90,status:'confirmed'};assert.equal(overlaps(a,{...a,start:660}),true);assert.equal(overlaps(a,{...a,start:690}),false);assert.equal(overlaps(a,{...a,designer:'y'}),false);assert.equal(overlaps(a,{...a,status:'cancelled'}),false);});
test('distance calculation uses coordinates',()=>{assert.equal(distanceKm({lat:35,lng:129},{lat:35,lng:129}),0);assert.ok(distanceKm({lat:35,lng:129},{lat:36,lng:129})>110);});
const salon={id:'a',offset:0,designers:['x','y'],openMinute:600,closeMinute:720};
const at=new Date('2026-11-01T09:00:00+09:00');
const plain={menu:'plain',extensions:0,pieces:0,removal:'none'};
test('availability filters occupied designer and accounts for full duration',()=>{
 const booked={shopId:'a',designer:'x',date:'2026-11-01',start:600,minutes:120,status:'confirmed'};
 const slots=availableSlots(salon,'2026-11-01',plain,[booked],at);
 assert.deepEqual(slots.map(s=>[s.designer,s.start]),[['y',600],['y',630],['y',660]]);
 assert.equal(availableSlots(salon,'2026-11-01',{...plain,extensions:10},[],at).length,0);
});
test('fully occupied salons are excluded and cancellation frees time',()=>{
 const reservations=salon.designers.map(designer=>({shopId:'a',designer,date:'2026-11-01',start:600,minutes:120,status:'confirmed'}));
 assert.equal(availableSlots(salon,'2026-11-01',plain,reservations,at).length,0);
 reservations[0].status='cancelled';
 assert.equal(availableSlots(salon,'2026-11-01',plain,reservations,at).length,3);
});
test('closed dates and unsupported services have no available slots',()=>{
 assert.equal(availableSlots({...salon,closedDates:['2026-11-01']},'2026-11-01',plain,[],at).length,0);
 assert.equal(availableSlots({...salon,menus:['monthly']},'2026-11-01',plain,[],at).length,0);
 assert.equal(availableSlots({...salon,closedWeekdays:[0]},'2026-11-01',plain,[],at).length,0);
});
test('past dates and elapsed same-day slots cannot be booked',()=>{
 assert.equal(availableSlots(salon,'2026-10-31',plain,[],at).length,0);
 assert.deepEqual(availableSlots(salon,'2026-11-01',plain,[],new Date('2026-11-01T10:30:00+09:00')).map(s=>s.start),[660,660]);
});
