import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeShops} from '../public/firebase.js';
const s={name:'네일',area:'부산진구',lat:35,lng:129,offset:0,designers:['지유'],rating:4.9};
test('catalog parser rejects invalid records rather than breaking shop search',()=>{
 assert.equal(normalizeShops(null).length,0);
 assert.equal(normalizeShops({a:{...s,offset:'bad'},b:s}).length,1);
});
test('catalog only returns supported fields and strips HTML markup',()=>{
 const [shop]=normalizeShops({a:{...s,name:'<b>네일</b>',color:'url(bad)',privatePhone:'private'}});
 assert.equal(shop.color,'#cca1a0');
 assert.equal(shop.name.includes('<'),false);
 assert.equal('privatePhone' in shop,false);
 assert.equal(shop.openMinute,600);
});
