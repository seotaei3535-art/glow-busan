export const basicNailShapes = {
  '': {
    name: '모양 미정', description: '모양은 나중에 정해도 괜찮아요.',
    outline: 'M11 47V25a9 9 0 0 1 18 0v22q-9 7-18 0Z'
  },
  round: {
    name: '라운드', description: '곧은 옆선에서 손끝을 따라 부드럽게 둥글어져요.',
    outline: 'M7 45V27a13 13 0 0 1 26 0v18q0 9-13 9T7 45Z'
  },
  oval: {
    name: '오벌', description: '옆선부터 끝까지 길고 완만한 타원형이에요.',
    outline: 'M7 45c0-13 3-36 13-36s13 23 13 36q0 9-13 9T7 45Z'
  },
  square: {
    name: '스퀘어', description: '곧은 옆선과 일자로 자른 끝에 각이 살아 있어요.',
    outline: 'M7 45V12h26v33q0 9-13 9T7 45Z'
  },
  squoval: {
    name: '스퀘오벌', description: '스퀘어의 평평한 끝에 모서리만 둥글게 다듬은 모양이에요.',
    outline: 'M7 45V19q0-7 7-7h12q7 0 7 7v26q0 9-13 9T7 45Z'
  },
  almond: {
    name: '아몬드', description: '끝으로 갈수록 좁아지면서 꼭지는 부드럽게 둥글어요.',
    outline: 'M7 45C7 29 15 10 20 8c5 2 13 21 13 37q0 9-13 9T7 45Z'
  },
  'tapered-square': {
    name: '테이퍼드 스퀘어', description: '평평한 끝을 유지하면서 양옆이 끝으로 갈수록 살짝 좁아져요.',
    outline: 'M7 45 10 10h20l3 35q0 9-13 9T7 45Z'
  },
  coffin: {
    name: '코핀 · 발레리나', description: '길고 가늘게 모이는 옆선 끝을 짧은 일자로 다듬어요.',
    outline: 'M7 45V38L15 7h10l8 31v7q0 9-13 9T7 45Z'
  }
};

export const specialNailShapes = {
  stiletto: {
    name: '스틸레토', description: '긴 옆선이 바늘처럼 뾰족한 한 점으로 모여요.',
    outline: 'M7 45C7 33 16 16 20 3c4 13 13 30 13 42q0 9-13 9T7 45Z'
  },
  'mountain-peak': {
    name: '마운틴 피크', description: '짧은 길이에서 산봉우리처럼 끝이 뾰족해요.',
    outline: 'M7 45V36c0-9 8-14 13-20 5 6 13 11 13 20v9q0 9-13 9T7 45Z'
  },
  arrowhead: {
    name: '애로헤드 · 화살촉', description: '끝의 두 사선이 각진 화살촉 모양을 만들어요.',
    outline: 'M7 45V29L20 11l13 18v16q0 9-13 9T7 45Z'
  },
  edge: {
    name: '엣지', description: '끝이 V자로 모이고 가운데 능선이 도드라져요.',
    outline: 'M7 45V19L20 5l13 14v26q0 9-13 9T7 45Z', detail: 'M20 6v43'
  },
  lipstick: {
    name: '립스틱', description: '립스틱을 비스듬히 자른 듯 한쪽 끝이 더 길어요.',
    outline: 'M7 45V23L33 9v36q0 9-13 9T7 45Z'
  },
  flare: {
    name: '플레어 · 덕', description: '끝이 양옆으로 넓게 퍼져 오리발처럼 보여요.',
    outline: 'M9 45 3 14h34l-6 31q0 9-11 9T9 45Z'
  },
  pipe: {
    name: '파이프', description: '끝을 정면에서 보면 터널처럼 깊은 C자 곡선이 있어요.',
    outline: 'M8 45V15q12-12 24 0v30q0 9-12 9T8 45Z', detail: 'M9 20q11-12 22 0'
  },
  'russian-almond': {
    name: '러시안 아몬드', description: '긴 아몬드형에 깊은 C자 곡선과 각이 살아 있는 옆선을 더해요.',
    outline: 'M7 45V34L17 8q3-6 6 0l10 26v11q0 9-13 9T7 45Z', detail: 'M12 33q8-6 16 0'
  },
  'gothic-almond': {
    name: '고딕 아몬드', description: '끝이 클래식 아몬드보다 날렵하고 스틸레토보다 짧아요.',
    outline: 'M7 45C7 26 17 16 20 6c3 10 13 20 13 39q0 9-13 9T7 45Z'
  },
  marilyn: {
    name: '마릴린', description: '끝이 평평한 특수형으로, 옆에서 봤을 때 도드라지는 아치가 특징이에요.',
    outline: 'M7 45C8 31 10 19 12 6h16c2 13 4 25 5 39q0 9-13 9T7 45Z', detail: 'M12 18q8-5 16 0'
  }
};

export const nailShapes = {...basicNailShapes, ...specialNailShapes};

export function nailShapeIcon(key) {
  const {outline, detail} = nailShapes[key];
  return `<svg class="nail-shape-icon${key ? '' : ' is-undecided'}" viewBox="0 0 40 58" aria-hidden="true" focusable="false">
    <path d="${outline}"/>${detail ? `<path class="nail-shape-detail" d="${detail}"/>` : ''}
  </svg>`;
}
