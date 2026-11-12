import {basicNailShapes,nailShapeIcon} from './nail-shapes.js';

export function firstNailShapes(){
 const shapes=Object.entries(basicNailShapes).filter(([key])=>key);
 return `<ul class="first-nail-shapes">
  ${shapes.map(([key,{name}])=>`<li>${nailShapeIcon(key)}<span>${name}</span></li>`).join('')}
 </ul>`;
}
