import test from 'node:test';
import assert from 'node:assert/strict';
import {nailStylePhotos,normalizeStyleChoice,recommendNailStyle} from '../public/nail-style-photos.js';
test('invalid or stale browser preferences do not break the style finder',()=>{
 for(const value of [null,{},'hello',{tone:'__proto__',look:'simple',length:'short'},{tone:'neutral',look:'unknown',length:'short'},{tone:'neutral',look:'simple',length:'medium'}])assert.equal(normalizeStyleChoice(value),null);
});
test('the nearest colour and length example comes first without changing the gallery',()=>{
 const before=nailStylePhotos.simple.map(p=>p.id);
 const result=recommendNailStyle({tone:'cool',look:'simple',length:'short'});
 assert.equal(result.photos[0].id,'simple-3');
 assert.equal(result.shape,'round');
 assert.deepEqual(nailStylePhotos.simple.map(p=>p.id),before);
});
test('five styles each have three distinct real-photo references and enlargement sources',()=>{
 const all=new Set();
 for(const look of ['simple','soft','french','point','pearl']){
  const result=recommendNailStyle({tone:'neutral',look,length:'long'});
  assert.equal(result.photos.length,3);
  assert.equal(result.shape,'almond');
  for(const photo of result.photos){assert.ok(!all.has(photo.src));all.add(photo.src);assert.equal(new URL(photo.fullSrc).protocol,'https:');assert.ok(photo.title);}
 }
 assert.equal(all.size,15);
});
