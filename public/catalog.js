// Demonstration candidates, not verified businesses or live shop availability.
export const districts=[['중구',35.106,129.032],['서구',35.098,129.024],['동구',35.129,129.045],['영도구',35.091,129.068],['부산진구',35.163,129.053],['동래구',35.205,129.083],['남구',35.137,129.084],['북구',35.197,128.99],['해운대구',35.164,129.164],['사하구',35.105,128.975],['금정구',35.243,129.092],['강서구',35.213,128.981],['연제구',35.176,129.079],['수영구',35.145,129.113],['사상구',35.152,128.991],['기장군',35.244,129.222]];
export function completeCatalog(existing){
 const result=[...existing];
 for(const [area,lat,lng] of districts){
  const count=existing.filter(s=>s.area===area).length;
  for(let i=count;i<3;i++)result.push({id:`demo-${area}-${i}`,name:`${['로지 네일','블룸 네일','페탈 네일'][i]} · ${area}`,area,station:`${area} 지역 후보`,lat:lat+i*.002,lng:lng+i*.002,rating:0,reviews:0,offset:[-5000,0,5000][i],color:['#d2a2b1','#bca2b2','#d5b5a3'][i],bg:['#f3e6ea','#ede4ef','#f3eae2'][i],tag:['내추럴 컬러','섬세한 포인트','이달의 디자인'][i],designers:['지유','서아'],openMinute:600,closeMinute:1200,closedWeekdays:i===0?[0]:[],isDemo:true});
 }
 return result;
}
