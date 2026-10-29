import test from 'node:test';
import assert from 'node:assert/strict';
import {naverLinks,validateNaverUrl} from '../public/naver.js';
test('booking links only accept secure Naver booking business URLs',()=>{
 assert.ok(validateNaverUrl('https://booking.naver.com/booking/13/bizes/123','booking'));
 for(const url of ['javascript:alert(1)','https://booking.naver.com.evil.com/booking/1','https://x@booking.naver.com/booking/1','http://booking.naver.com/booking/1','https://booking.naver.com/'])assert.equal(validateNaverUrl(url,'booking'),'');
});
test('unregistered demo shops search the district rather than implying a verified store',()=>{
 const links=naverLinks({id:'demo',name:'가상 이름',area:'기장군'});
 assert.equal(links.booking,'');assert.equal(links.mapIsSearch,true);assert.ok(decodeURIComponent(links.map).includes('부산 기장군 네일샵'));assert.ok(!decodeURIComponent(links.map).includes('가상 이름'));
});
