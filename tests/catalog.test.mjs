import test from 'node:test';
import assert from 'node:assert/strict';
import {completeCatalog,districts} from '../public/catalog.js';
import {availableSlots} from '../public/domain.js';
test('all sixteen districts have three candidates',()=>{
 const list=completeCatalog([]);assert.equal(list.length,48);
 for(const [area] of districts)assert.equal(list.filter(s=>s.area===area).length,3);
 assert.equal(new Set(list.map(s=>s.id)).size,48);
});
test('each district has multiple available candidates on weekdays and Sundays',()=>{
 const list=completeCatalog([]),options={menu:'monthly',extensions:0,pieces:0,removal:'none'},now=new Date('2026-10-29T09:00:00+09:00');
 for(const date of ['2026-11-01','2026-11-02'])for(const [area] of districts)assert.ok(list.filter(s=>s.area===area&&availableSlots(s,date,options,[],now).length).length>=2,area+' '+date);
});
