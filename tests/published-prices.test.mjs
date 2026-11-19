import test from 'node:test';
import assert from 'node:assert/strict';
import {publishedPrices,estimatePublishedPrice as estimate} from '../public/published-prices.js';
const options={menu:'plain',extensions:0,removal:'none',pieces:0};
test('a verified base, extension and removal produce a priced estimate',()=>{
 const shop=publishedPrices['permit-3290000-213-2024-00073'];
 const result=estimate(shop,{...options,extensions:2,removal:'other'});
 assert.equal(result.base.amount,40000);
 assert.equal(result.total.amount,70000);
 assert.deepEqual(result.missing,[]);
});
test('the published ten-finger extension package is used instead of ten individual fees',()=>{
 const shop=publishedPrices['permit-3290000-215-2023-00004'];
 assert.equal(estimate(shop,{...options,extensions:10}).total.amount,115000);
 assert.equal(estimate(shop,{...options,extensions:1}).total,null);
});
test('unpublished additions stay outside the subtotal and prevent a complete total',()=>{
 const result=estimate({prices:{plain:{amount:30000}}},{...options,extensions:2});
 assert.equal(result.total,null);
 assert.equal(result.subtotal.amount,30000);
 assert.deepEqual(result.missing,['연장 2개']);
});
test('a free published removal is different from an unpublished fee',()=>{
 const shop=publishedPrices['permit-3290000-213-2021-00026'];
 const result=estimate(shop,{...options,removal:'other'});
 assert.equal(result.rows[0].price.amount,0);
 assert.equal(result.total.amount,30000);
});
test('per-finger removal uses the chosen removal quantity',()=>{
 const shop={prices:{plain:{amount:35000}},addOns:{removal:{other:{amount:1500,unit:'finger'}}}};
 assert.equal(estimate(shop,{...options,removal:'other',removalCount:4}).total.amount,41000);
});
test('ranges and from-prices keep their uncertainty when additions are summed',()=>{
 const shop={prices:{plain:{amount:35000,max:45000}},addOns:{extension:{amount:10000,from:true}}};
 assert.deepEqual(estimate(shop,{...options,extensions:2}).total,{amount:55000,max:65000,from:true});
});
test('menu-specific removal offers do not apply to other menus',()=>{
 const shop={prices:{plain:{amount:35000},monthly:{amount:50000}},addOns:{removal:{other:{amount:5000,menus:['monthly']}}}};
 assert.equal(estimate(shop,{...options,removal:'other'}).total,null);
 assert.equal(estimate(shop,{...options,menu:'monthly',removal:'other'}).total.amount,55000);
});
test('reviewed records retain a Naver source and valid menu amounts',()=>{
 const reviewed=Object.values(publishedPrices).filter(s=>s.checkedAt==='2026-11-19');
 assert.equal(reviewed.length,150);
 for(const shop of reviewed){
  assert.match(new URL(shop.sourceUrl).hostname,/(^|\.)naver\.com$/);
  for(const price of Object.values(shop.prices)){
   assert.ok(Number.isFinite(price.amount)&&price.amount>0);
   assert.ok(price.max===undefined||price.max>=price.amount);
  }
 }
});
