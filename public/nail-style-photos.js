export const nailStyleTones={
 warm:{label:'따뜻한 색',names:'살구 베이지 · 코랄 · 브라운'},
 cool:{label:'차분하고 시원한 색',names:'밀키 핑크 · 라벤더 · 실버'},
 neutral:{label:'어디에나 어울리는 색',names:'누드 핑크 · 밀크 베이지 · 토프'}
};
export const nailStyleLooks={
 simple:{label:'깔끔한 원컬러',name:'원컬러',menu:'plain',tag:''},
 soft:{label:'은은한 그라데이션',name:'시럽 그라데이션',menu:'gradient',tag:'그라데이션'},
 french:{label:'손끝에 포인트 · 프렌치',name:'프렌치 아트',menu:'art',tag:'프렌치'},
 point:{label:'반짝이는 포인트',name:'글리터·자석 포인트',menu:'art',tag:'글리터'},
 pearl:{label:'우아한 진주 포인트',name:'진주 포인트 아트',menu:'art',tag:''}
};
export function normalizeStyleChoice(value){
 if(!value||!Object.hasOwn(nailStyleTones,value.tone)||!Object.hasOwn(nailStyleLooks,value.look)||!['short','long'].includes(value.length))return null;
 return {tone:value.tone,look:value.look,length:value.length};
}
export function recommendNailStyle(value){
 const choice=normalizeStyleChoice(value);
 if(!choice)return null;
 const score=photo=>Number(photo.tones.includes(choice.tone))*2+Number(photo.length===choice.length);
 return {...choice,toneInfo:nailStyleTones[choice.tone],lookInfo:nailStyleLooks[choice.look],
  shape:choice.length==='long'?'almond':'round',lengthLabel:choice.length==='long'?'조금 길고 날렵하게':'짧고 편하게',
  photos:[...nailStylePhotos[choice.look]].sort((a,b)=>score(b)-score(a))};
}
// Actual on-hand manicure examples, visually reviewed 2026-11-19.
export const nailStylePhotos = {
  "simple": [
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260615_82%2F1781502028007nzF0h_JPEG%2F1000025529.jpg",
      "tones": [
        "warm",
        "neutral"
      ],
      "id": "simple-1",
      "title": "밀키 누드 원컬러",
      "length": "long",
      "fullSrc": "https://ldb-phinf.pstatic.net/20260615_82/1781502028007nzF0h_JPEG/1000025529.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250110_179%2F1736457160775RYaWK_JPEG%2FIMG_5226.jpeg",
      "tones": [
        "warm",
        "neutral"
      ],
      "id": "simple-2",
      "title": "베이지 원컬러",
      "length": "long",
      "fullSrc": "https://ldb-phinf.pstatic.net/20250110_179/1736457160775RYaWK_JPEG/IMG_5226.jpeg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260508_286%2F17782218608367qVot_JPEG%2FKakaoTalk_20260508_151649087.jpg",
      "tones": [
        "cool",
        "neutral"
      ],
      "id": "simple-3",
      "title": "차분한 그레이 원컬러",
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20260508_286/17782218608367qVot_JPEG/KakaoTalk_20260508_151649087.jpg"
    }
  ],
  "soft": [
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260331_196%2F1774927764593JuSTd_JPEG%2FKakaoTalk_20260331_122735820_03.jpg",
      "tones": [
        "neutral"
      ],
      "id": "soft-1",
      "title": "화이트 시럽 그라데이션",
      "length": "long",
      "fullSrc": "https://ldb-phinf.pstatic.net/20260331_196/1774927764593JuSTd_JPEG/KakaoTalk_20260331_122735820_03.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250531_255%2F1748639795558I4gqs_JPEG%2FIMG_20250529_134617_394.jpg",
      "tones": [
        "cool"
      ],
      "id": "soft-2",
      "title": "파스텔 시럽 그라데이션",
      "length": "long",
      "fullSrc": "https://ldb-phinf.pstatic.net/20250531_255/1748639795558I4gqs_JPEG/IMG_20250529_134617_394.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260614_188%2F17814418824368DQw1_JPEG%2FIMG_8292.jpg",
      "id": "soft-3",
      "title": "핑크 그라데이션 포인트",
      "tones": [
        "cool",
        "neutral"
      ],
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20260614_188/17814418824368DQw1_JPEG/IMG_8292.jpg"
    }
  ],
  "french": [
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240112_267%2F1705025006286LV6F0_PNG%2F163.png",
      "id": "french-1",
      "title": "핑크 프렌치",
      "tones": [
        "warm",
        "neutral"
      ],
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20240112_267/1705025006286LV6F0_PNG/163.png"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260926_126%2F1790428512897yr3ys_JPEG%2F1000055035.jpg",
      "tones": [
        "cool",
        "neutral"
      ],
      "id": "french-2",
      "title": "실버 프렌치",
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20260926_126/1790428512897yr3ys_JPEG/1000055035.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20261105_220%2F1793845202809o6NEi_JPEG%2FIMG_3384.jpg",
      "id": "french-3",
      "title": "브라운 프렌치 포인트",
      "tones": [
        "warm"
      ],
      "length": "long",
      "fullSrc": "https://ldb-phinf.pstatic.net/20261105_220/1793845202809o6NEi_JPEG/IMG_3384.jpg"
    }
  ],
  "point": [
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250531_235%2F1748654266771T3gEN_JPEG%2FKakaoTalk_20250531_101600679.jpg",
      "id": "point-1",
      "title": "은은한 글리터와 리본",
      "tones": [
        "neutral"
      ],
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20250531_235/1748654266771T3gEN_JPEG/KakaoTalk_20250531_101600679.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20251229_186%2F1766986312434GTtUN_JPEG%2FKakaoTalk_20251229_142845673.jpg",
      "id": "point-2",
      "title": "라벤더 자석 포인트",
      "tones": [
        "cool"
      ],
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20251229_186/1766986312434GTtUN_JPEG/KakaoTalk_20251229_142845673.jpg"
    },
    {
      "src": "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=f320_320&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20261101_150%2F179354500260982ah3_JPEG%2FIMG_6590.jpg",
      "id": "point-3",
      "title": "버건디 글리터 포인트",
      "tones": [
        "warm"
      ],
      "length": "short",
      "fullSrc": "https://ldb-phinf.pstatic.net/20261101_150/179354500260982ah3_JPEG/IMG_6590.jpg"
    }
  ],
  "pearl": [
    {
      "src": "https://stat.ameba.jp/user_images/20210210/23/nail-color-stella/0e/da/j/o1080108014894486803.jpg",
      "href": "https://nail-color-stella.hatenablog.com/entry/2021/02/10/233000",
      "tones": [
        "warm",
        "neutral"
      ],
      "id": "pearl-1",
      "title": "핑크 진주 포인트",
      "length": "short",
      "fullSrc": "https://stat.ameba.jp/user_images/20210210/23/nail-color-stella/0e/da/j/o1080108014894486803.jpg"
    },
    {
      "src": "https://img2.mypl.net/image.php?id=1906899&op=&p=shopn&s=490_740",
      "href": "https://fukui.mypl.net/shop/00000361714/news?d=1935709",
      "tones": [
        "warm",
        "neutral"
      ],
      "id": "pearl-2",
      "title": "누드 진주 포인트",
      "length": "long",
      "fullSrc": "https://img2.mypl.net/image.php?id=1906899&op=&p=shopn&s=490_740"
    },
    {
      "src": "https://cnv.nailbook.jp/photo/2338342/c1280q85",
      "href": "https://nailbook.jp/design/2098911/",
      "tones": [
        "cool",
        "neutral"
      ],
      "id": "pearl-3",
      "title": "밀키 핑크 진주 포인트",
      "length": "long",
      "fullSrc": "https://cnv.nailbook.jp/photo/2338342/c1280q85"
    }
  ]
};
