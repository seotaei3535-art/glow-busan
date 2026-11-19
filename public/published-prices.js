// Merchant-published prices. Records with checkedAt 2026-11-19 were reviewed on Naver.
// Add only explicitly published fees; never treat an unpublished add-on as free.
export function estimatePublishedPrice(shop,options={}){
 const valid=price=>price&&Number.isFinite(price.amount)&&price.amount>=0;
 const base=valid(shop.prices?.[options.menu])?{...shop.prices[options.menu]}:null;
 const rows=[];
 const count=value=>Math.max(0,Math.min(10,Math.floor(Number(value)||0)));
 const offered=price=>price&&(!price.menus||price.menus.includes(options.menu));
 const multiply=(price,n)=>valid(price)?{...price,amount:price.amount*n,...(price.max!==undefined?{max:price.max*n}:{})}:null;
 const extensions=count(options.extensions);
 if(extensions){
  const price=shop.addOns?.extension;
  const fee=offered(price)?extensions===10&&Number.isFinite(price.fullSet)
   ?{amount:price.fullSet,from:!!price.from,note:price.note}:multiply(price,extensions):null;
  rows.push({label:`연장 ${extensions}개`,price:fee});
 }
 if(['own','other'].includes(options.removal)){
  const price=shop.addOns?.removal?.[options.removal];
  const n=price?.unit==='finger'?count(options.removalCount??10):1;
  rows.push({label:`${options.removal==='own'?'자샵':'타샵'} 젤 제거${price?.unit==='finger'?` ${n}개`:''}`,price:offered(price)?multiply(price,n):null});
 }
 const pieces=options.menu==='art'?count(options.pieces):0;
 if(pieces)rows.push({label:`아트 ${pieces}개`,price:offered(shop.addOns?.artPiece)?multiply(shop.addOns.artPiece,pieces):null});
 const parts=[base,...rows.map(row=>row.price)].filter(valid);
 const amount=parts.reduce((sum,price)=>sum+price.amount,0);
 const max=parts.reduce((sum,price)=>sum+(price.max??price.amount),0);
 const subtotal=parts.length?{amount,...(max!==amount?{max}:{}),...(parts.some(price=>price.from)?{from:true}:{})}:null;
 const missing=[...(!base?['기본 시술비']:[]),...rows.filter(row=>!valid(row.price)).map(row=>row.label)];
 return {base,rows,subtotal,total:missing.length?null:subtotal,missing};
}
export const publishedPrices = {
  "naver-1534398": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/1534398/items/7184421",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "naver-505353": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/505353/items/3864513",
    "menuBookingUrls": {
      "plain": "https://m.booking.naver.com/booking/13/bizes/505353/items/3864513"
    },
    "prices": {
      "plain": {
        "amount": 45000,
        "note": "유진 원장 메뉴 기준"
      }
    }
  },
  "naver-866240": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1703326180/price",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "monthly": {
        "amount": 55000,
        "max": 75000
      }
    }
  },
  "naver-635997": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/635997/items/4275641",
    "prices": {
      "plain": {
        "amount": 29000,
        "note": "은서 디자이너 공개 할인가"
      }
    }
  },
  "naver-595633": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1810946003/price",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3380000-225-2018-00001": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/스타일뷰티-di8xg2b3wehd/",
    "prices": {
      "plain": {
        "amount": 20000,
        "from": true
      }
    }
  },
  "permit-3370000-215-2025-00015": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/비비네일-sj9xemu9zimi/",
    "prices": {
      "plain": {
        "amount": 30000,
        "from": true
      }
    }
  },
  "permit-3330000-215-2026-00012": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/작은도화지네일-g9jq6ca3rivz/",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "일반가 · 첫 방문 할인 별도"
      }
    }
  },
  "permit-3300000-215-2024-00024": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/이즈네일-8qzdcp2i5urm/",
    "prices": {
      "plain": {
        "amount": 40000,
        "from": true
      }
    }
  },
  "permit-3370000-222-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1290184827/price",
    "prices": {
      "plain": {
        "amount": 45000
      }
    },
    "checkedAt": "2026-11-19"
  },
  "permit-3390000-213-2024-00005": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/달처럼-예뻐라-6y38jxa3o8sk/",
    "prices": {
      "plain": {
        "amount": 45000,
        "from": true
      },
      "monthly": {
        "amount": 55000,
        "from": true
      }
    }
  },
  "permit-3290000-215-2026-00016": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/네일그리밍-tf9dyvaxetgr/",
    "prices": {
      "plain": {
        "amount": 35000,
        "from": true,
        "note": "회원가"
      }
    }
  },
  "permit-3250000-213-2025-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2014599026/price",
    "prices": {
      "plain": {
        "amount": 30000
      }
    },
    "checkedAt": "2026-11-19"
  },
  "permit-3330000-215-2024-00011": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/유네일-7tqhbhk3mqep/",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "비회원가 · 회원가 35,000원부터"
      }
    }
  },
  "permit-3270000-213-2013-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1332294520/price",
    "prices": {
      "plain": {
        "amount": 25000
      }
    },
    "checkedAt": "2026-11-19"
  },
  "permit-3370000-222-2025-00002": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/효리의-빛나는-네일-ohvcf6ysqzna/",
    "naverBookingUrl": "https://m.booking.naver.com/booking/13/bizes/1433504/items/6828198",
    "prices": {
      "plain": {
        "amount": 40000,
        "from": true,
        "note": "비회원가 · 첫 방문 할인 별도"
      }
    }
  },
  "permit-3290000-218-2025-00001": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/245139/items/3129145",
    "naverBookingUrl": "https://m.booking.naver.com/booking/13/bizes/245139/items/3129145",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 60000
      },
      "monthly": {
        "amount": 55000,
        "max": 99000,
        "note": "디자인별 금액 상이"
      }
    }
  },
  "permit-3340000-215-2025-00003": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/르온네일-aoozozeafks9/",
    "naverBookingUrl": "https://m.booking.naver.com/booking/13/bizes/1399690/items/6699245",
    "prices": {
      "plain": {
        "amount": 35000,
        "from": true,
        "note": "오버레이 포함 · 제거 별도"
      },
      "gradient": {
        "amount": 50000,
        "from": true,
        "note": "오버레이 포함 · 제거 별도"
      },
      "monthly": {
        "amount": 50000,
        "from": true,
        "note": "디자인별 금액 상이"
      }
    }
  },
  "permit-3300000-215-2025-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2087893318/price",
    "prices": {
      "plain": {
        "amount": 25000,
        "note": "케어·컬러 무제한 · 손소독 별도"
      },
      "gradient": {
        "amount": 35000,
        "note": "손소독 별도"
      }
    },
    "checkedAt": "2026-11-19",
    "addOns": {
      "extension": {
        "amount": 5000,
        "note": "손 연장"
      }
    },
    "menuPhotoUrl": "https://ldb-phinf.pstatic.net/20261019_12/1792392076339YoBz1_JPEG/1000000130.jpg"
  },
  "permit-3380000-213-2025-00007": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/메이무드-네일-j1oja914e1qg/",
    "prices": {
      "plain": {
        "amount": 35000,
        "from": true,
        "note": "회원가"
      }
    }
  },
  "permit-3290000-215-2022-00046": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/네일디스튜디오-mdy5uq5cvpn5/",
    "naverBookingUrl": "https://m.booking.naver.com/booking/13/bizes/1569190/items/7324515",
    "prices": {
      "plain": {
        "amount": 40000,
        "from": true,
        "note": "오버레이 포함"
      }
    }
  },
  "permit-3320000-215-2025-00006": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/오아이네일-7mwe8ejmacfg/",
    "prices": {
      "plain": {
        "amount": 35000,
        "from": true,
        "note": "회원권 할인 별도"
      }
    }
  },
  "permit-3290000-222-2025-00003": {
    "sourceUrl": "https://www.daangn.com/kr/local-profile/시어네일-d3muaq4jjy74/",
    "prices": {
      "plain": {
        "amount": 40000,
        "from": true,
        "note": "제거 별도"
      },
      "art": {
        "amount": 55000,
        "from": true,
        "note": "제거 별도"
      }
    }
  },
  "permit-3390000-213-2017-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1328657179/price",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "케어·2컬러 포함"
      },
      "gradient": {
        "amount": 45000
      }
    },
    "checkedAt": "2026-11-19",
    "addOns": {
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3290000-213-2020-00020": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1893558568/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "비회원가 · VAT 별도"
      },
      "gradient": {
        "amount": 55000,
        "note": "기본젤 40,000원 + 그라데이션 15,000원부터 · VAT 별도",
        "from": true
      }
    },
    "addOns": {
      "extension": {
        "amount": 9000,
        "note": "팁 연장 기준 · 젤 연장 12,000원/개 · VAT 별도"
      },
      "removal": {
        "own": {
          "amount": 10000
        },
        "other": {
          "amount": 15000,
          "from": true
        }
      }
    }
  },
  "permit-3290000-213-2013-00015": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1407803013/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 50000
      }
    }
  },
  "permit-3290000-213-2021-00026": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1708955952/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "케어·젤 시술 시 제거 포함"
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 50000,
        "note": "팁 열손연장"
      },
      "removal": {
        "own": {
          "amount": 0
        },
        "other": {
          "amount": 0,
          "note": "젤 시술 시 무료 · 연장·파츠 제거 별도"
        }
      }
    }
  },
  "permit-3290000-213-2023-00027": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1064629780/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      }
    }
  },
  "permit-3290000-215-2025-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1135587389/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 50000
      },
      "monthly": {
        "amount": 35000,
        "max": 50000,
        "note": "디자인별 35,000·40,000·45,000·50,000원"
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 5000,
          "menus": [
            "monthly"
          ]
        }
      }
    }
  },
  "permit-3290000-213-2024-00073": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1129176625/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 60000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 100000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3290000-215-2023-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1869713427/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 80000,
        "note": "팁 열손연장 · 젤 열손연장 100,000원"
      }
    }
  },
  "permit-3290000-215-2024-00019": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1816260437/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "기본 젤 · 투컬러 서비스"
      },
      "gradient": {
        "amount": 45000
      }
    }
  },
  "permit-3290000-213-2022-00046": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1893057725/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3290000-215-2022-00032": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1252642591/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3250000-215-2023-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1165703720/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3250000-213-2022-00008": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1946317931/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 50000
      },
      "monthly": {
        "amount": 40000,
        "max": 70000,
        "note": "디자인별 금액"
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 70000
      }
    }
  },
  "permit-3250000-215-2024-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1911971963/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 80000
      }
    }
  },
  "permit-3250000-215-2025-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1631435764/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "회원가"
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 65000,
        "note": "열손연장 행사가 · 기본젤/아트 별도"
      }
    }
  },
  "permit-3250000-215-2025-00007": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2078571138/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 60000
      }
    }
  },
  "permit-3250000-215-2023-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1479860666/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "amount": 8000,
        "fullSet": 80000,
        "note": "팁 연장"
      }
    }
  },
  "permit-3250000-213-2026-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2094725418/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3250000-213-2023-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1865318390/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "네이버 게시 현금 이벤트가"
      }
    }
  },
  "permit-3250000-215-2024-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1335843653/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 45000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 1000,
          "unit": "finger"
        },
        "other": {
          "amount": 1500,
          "unit": "finger"
        }
      }
    }
  },
  "permit-3330000-213-2011-00042": {
    "sourceUrl": "https://m.place.naver.com/nailshop/20059772/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 49500,
        "note": "회원·네이버 예약가 · 초보 이벤트 별도"
      }
    }
  },
  "permit-3330000-218-2022-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1579592409/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 29900,
        "note": "회원 이벤트가"
      }
    }
  },
  "permit-3330000-222-2024-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/31481858/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 50000,
        "note": "비회원가 · 회원가 40,000원"
      },
      "gradient": {
        "amount": 60000,
        "note": "비회원가"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "note": "젤/팁 연장"
      },
      "removal": {
        "own": {
          "amount": 20000,
          "note": "비회원가"
        },
        "other": {
          "amount": 20000,
          "note": "비회원가"
        }
      }
    },
    "menuPhotoUrl": "https://ldb-phinf.pstatic.net/20250901_165/1756657228479IxYYS_JPEG/%C1%A6%B8%F1%C0%BB-%C0%D4%B7%C2%C7%D8%C1%D6%BC%BC%BF%E4_-001_%283%29.jpg"
  },
  "permit-3330000-213-2024-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1372852498/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000
      }
    }
  },
  "permit-3330000-215-2005-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/37903478/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 39000
      },
      "monthly": {
        "amount": 69000,
        "max": 89000,
        "note": "베이직 69,000원 · 스페셜 89,000원"
      }
    }
  },
  "permit-3330000-218-2025-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1118215617/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "max": 40000,
        "note": "네이버에 게시된 손젤기본 메뉴별 금액"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 1000,
          "unit": "finger"
        },
        "other": {
          "amount": 1500,
          "unit": "finger"
        }
      }
    }
  },
  "permit-3330000-215-2022-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1083270681/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 55000
      }
    }
  },
  "permit-3330000-215-2025-00020": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2096090617/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3330000-213-2023-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1635651164/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3330000-213-2022-00014": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1111062804/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "네일리스트 기준 · 원장 45,000원"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 10000
        },
        "other": {
          "amount": 15000
        }
      }
    }
  },
  "permit-3380000-215-2020-00010": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/393873/items/7114070",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "챠미 디자이너 일반가 · 오버레이 포함"
      },
      "monthly": {
        "amount": 69000,
        "note": "챠미 디자이너 · 달리무드 행사 메뉴"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 80000
      }
    }
  },
  "permit-3380000-213-2023-00016": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1822655185/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      }
    }
  },
  "permit-3380000-213-2022-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1480483955/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 33000
      }
    }
  },
  "permit-3380000-215-2021-00017": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1459699745/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "max": 45000,
        "note": "회원 여부별 가격 · 대표원장 지정 +5,000원"
      },
      "gradient": {
        "amount": 55000,
        "max": 65000,
        "note": "회원 여부별 금액 · 대표원장 지정 +5,000원"
      },
      "monthly": {
        "amount": 74000,
        "max": 90000,
        "note": "비회원가 · 회원가 69,000~85,000원"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 80000
      },
      "removal": {
        "own": {
          "amount": 10000
        },
        "other": {
          "amount": 15000
        }
      }
    },
    "menuPhotoUrl": "https://ldb-phinf.pstatic.net/20260728_130/1785250282348Euurg_JPEG/Beige_Pastel_Simple_Minimalist_Aesthetic_Feminine_Beauty_Salon_Price_List_A5_Doc.jpg"
  },
  "permit-3380000-215-2020-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1348096993/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 45000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3380000-215-2022-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1723387167/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    }
  },
  "permit-3380000-215-2021-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1216220820/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000,
        "note": "2컬러 · 제거 별도 · 첫 방문 40,000원 별도"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        }
      }
    }
  },
  "permit-3380000-215-2021-00014": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1444102259/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 44000
      },
      "monthly": {
        "amount": 60000,
        "note": "이벤트아트 메뉴 기준"
      }
    }
  },
  "permit-3380000-215-2016-00019": {
    "sourceUrl": "https://m.place.naver.com/nailshop/615908005/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "VAT 별도"
      },
      "gradient": {
        "amount": 50000,
        "note": "VAT 별도"
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 15000,
          "note": "VAT 별도"
        }
      }
    }
  },
  "permit-3380000-213-2025-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1040804856/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "일반가 · 첫 방문 25,000원 별도"
      }
    }
  },
  "permit-3370000-226-2018-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1708779082/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "케어 포함"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3370000-215-2022-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1960748053/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "일반가 · 첫 방문 30,000원 별도"
      }
    }
  },
  "permit-3370000-215-2026-00007": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2081922656/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000,
        "note": "일반가 · 이벤트 35,000원 별도"
      }
    }
  },
  "permit-3370000-215-2026-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2029616168/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "일반가 · 첫 방문 29,000원 별도"
      },
      "monthly": {
        "amount": 49000,
        "note": "네이버 게시 이달의아트 49,000원부터",
        "from": true
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3370000-215-2021-00020": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1884949089/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 50000
      }
    }
  },
  "permit-3370000-215-2022-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1458074178/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "컬러 추가비 없음"
      }
    }
  },
  "permit-3370000-215-2023-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1462213612/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 80000
      }
    }
  },
  "permit-3370000-213-2026-00017": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2006377387/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000
      }
    }
  },
  "permit-3370000-215-2026-00012": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2065727929/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      },
      "gradient": {
        "amount": 40000
      }
    }
  },
  "permit-3300000-215-2022-00022": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1536541715/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "monthly": {
        "amount": 65000
      }
    }
  },
  "permit-3300000-215-2020-00010": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1988579472/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 60000
      }
    }
  },
  "permit-3300000-222-2018-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1605040007/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3300000-213-2024-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/32713764/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3300000-215-2021-00014": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1599336454/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 50000
      }
    }
  },
  "permit-3300000-215-2022-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1840491047/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 25000,
        "note": "2컬러 기준"
      },
      "gradient": {
        "amount": 40000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        }
      }
    }
  },
  "permit-3300000-213-2026-00008": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2015330064/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3300000-213-2026-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2014963151/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      }
    }
  },
  "permit-3310000-215-2016-00021": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1698195411/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 40000
      }
    }
  },
  "permit-3310000-226-2019-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1767584393/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "유지 오버레이 포함"
      }
    }
  },
  "permit-3310000-215-2021-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1220069801/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 25000
      },
      "gradient": {
        "amount": 35000
      },
      "art": {
        "amount": 35000,
        "note": "네이버 게시 아트 35,000원부터",
        "from": true
      }
    }
  },
  "permit-3310000-226-2013-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/21854019/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "회원가"
      },
      "gradient": {
        "amount": 40000,
        "note": "회원가"
      }
    }
  },
  "permit-3310000-215-2020-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1220224738/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "오버레이 포함"
      }
    }
  },
  "permit-3310000-213-2024-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1016622270/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 25000
      },
      "gradient": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "amount": 7000,
        "fullSet": 60000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 5000
        }
      }
    }
  },
  "permit-3310000-213-2011-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/36476643/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "art": {
        "amount": 60000
      }
    }
  },
  "permit-3310000-215-2026-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2055802564/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 29000,
        "note": "첫 방문 베이직코스 이벤트가"
      }
    }
  },
  "permit-3310000-213-2023-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1137056872/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "오버레이 포함"
      },
      "gradient": {
        "amount": 50000,
        "note": "오버레이 포함"
      }
    }
  },
  "permit-3310000-213-2023-00007": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1913841113/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "오픈 이벤트가"
      },
      "gradient": {
        "amount": 45000,
        "note": "오픈 이벤트가"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3320000-222-2018-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1185060687/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "정상가 · 첫 방문 현금 32,000원 별도"
      }
    }
  },
  "permit-3320000-213-2025-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1188044614/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "비회원가 · 회원가 36,000원"
      }
    }
  },
  "permit-3320000-215-2025-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1184090945/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 33000
      },
      "gradient": {
        "amount": 50000
      },
      "monthly": {
        "amount": 55000
      }
    }
  },
  "permit-3320000-215-2014-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/36939357/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 29000
      }
    }
  },
  "permit-3320000-222-2021-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1317927522/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "일반 풀컬러 · 디자이너·회원가 별도"
      }
    }
  },
  "permit-3320000-215-2024-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1454228916/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3320000-213-2018-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2053008756/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "손관리 포함 · 첫 방문 25,000원 별도"
      }
    }
  },
  "permit-3320000-215-2026-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2067196224/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    }
  },
  "permit-3320000-213-2026-00025": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2003364722/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 55000,
        "note": "기본젤 35,000원 + 그라데이션 20,000원"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    },
    "menuPhotoUrl": "https://ldb-phinf.pstatic.net/20260904_100/1788525706317psNye_JPEG/ATELIER_NOUV_6%28%B0%A1%B0%DD%29.jpg"
  },
  "permit-3340000-226-2017-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/119188313/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "기본 오버레이 포함"
      }
    }
  },
  "permit-3340000-213-2020-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1834431145/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3340000-226-2018-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1222506050/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3340000-222-2020-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1822417486/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    }
  },
  "permit-3340000-215-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1698312497/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3340000-215-2026-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2066847806/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 20000
      }
    }
  },
  "permit-3340000-222-2019-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1819104793/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 59000
      },
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3350000-215-2021-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1940524491/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 10000
      }
    }
  },
  "permit-3350000-218-2020-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1341516489/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "오버레이 포함"
      },
      "monthly": {
        "amount": 65000
      }
    }
  },
  "permit-3350000-215-2024-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1685299745/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3350000-215-2020-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1951126509/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 50000
      }
    }
  },
  "permit-3350000-215-2017-00009": {
    "sourceUrl": "https://m.place.naver.com/nailshop/258028925/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      },
      "monthly": {
        "amount": 50000
      }
    }
  },
  "permit-3350000-226-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2089655168/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3350000-215-2026-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2052763525/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3350000-218-2016-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/37779075/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "풀컬러·투컬러+케어 · 현금/회원권가 · 카드 VAT 별도"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3350000-215-2024-00008": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1463819365/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3350000-215-2021-00015": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1994031880/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 10000,
        "note": "현금 이벤트가"
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 59000
      }
    }
  },
  "permit-3360000-222-2021-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1476934942/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 39000,
        "note": "비회원가 · VAT 포함"
      },
      "monthly": {
        "amount": 59000
      }
    }
  },
  "permit-3360000-215-2024-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1635358745/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 100000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3360000-215-2023-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1754386598/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "monthly": {
        "amount": 55000
      }
    }
  },
  "permit-3360000-226-2022-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1594729031/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3360000-222-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1953927981/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3360000-215-2026-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1647062774/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "monthly": {
        "amount": 45000,
        "max": 65000,
        "note": "베이직·시그니처·프리미엄별 금액"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 70000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3360000-215-2025-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2091564866/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "오버레이 포함"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 80000
      },
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3360000-215-2024-00005": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/1121263/items/5794121?area=ple&lang=ko&startDate=2026-11-19&tab=book&theme=place",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "비회원가 · 2컬러 · 회원가 30,000원"
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 0
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3360000-222-2017-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/976570194/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "원장 기본젤 · 디자이너 이벤트 별도"
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3390000-215-2023-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1433672492/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3390000-215-2021-00014": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1303113106/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "monthly": {
        "amount": 65000
      }
    }
  },
  "permit-3390000-226-2019-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1908955863/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 100000
      },
      "removal": {
        "own": {
          "amount": 0,
          "note": "젤 시술 시 서비스"
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3390000-215-2023-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1434085437/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3390000-215-2025-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1798118492/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      },
      "art": {
        "amount": 40000
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3390000-213-2021-00009": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2022663439/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "케어·굳은살·2컬러 포함"
      },
      "gradient": {
        "amount": 45000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3390000-215-2025-00007": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2067519657/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 25000
      },
      "monthly": {
        "amount": 39000
      }
    }
  },
  "permit-3390000-215-2026-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2061673122/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "자샵 제거 포함"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 0
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3390000-215-2025-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2145722253/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "note": "3컬러 무료"
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3400000-215-2023-00001": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/1366342/items/6588522?area=ple&lang=ko&startDate=2026-11-19&tab=book&theme=place",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "오버레이 포함"
      }
    }
  },
  "permit-3400000-226-2021-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1059332253/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3400000-215-2023-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1626526500/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 20000,
        "note": "컬러 무제한"
      }
    }
  },
  "permit-3400000-222-2020-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1538578837/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 45000
      }
    }
  },
  "permit-3400000-226-2021-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1202615718/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 50000,
        "note": "비회원가 · 회원가 40,000원"
      }
    }
  },
  "permit-3400000-215-2025-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2043055430/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 55000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000,
        "fullSet": 100000
      }
    }
  },
  "permit-3400000-215-2026-00005": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/1684862/items/7808527?area=ple&lang=ko&startDate=2026-11-19&tab=book&theme=place",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 55000,
        "note": "케어 포함 · 일반가 · 특수젤 추가 별도"
      },
      "gradient": {
        "amount": 65000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3400000-215-2024-00005": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1905392632/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 45000
      },
      "monthly": {
        "amount": 60000
      }
    }
  },
  "permit-3260000-215-2023-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1193691071/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3260000-215-2017-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/691652589/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 45000
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 15000
        }
      }
    }
  },
  "permit-3260000-215-2016-00002": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/1587974/items/7398133?area=ple&lang=ko&startDate=2026-11-19&tab=book&theme=place",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 50000,
        "note": "자샵 제거 포함 · 현금 결제 10,000원 할인"
      },
      "gradient": {
        "amount": 60000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 0
        },
        "other": {
          "amount": 10000,
          "note": "파츠 있을 시 5,000원 추가"
        }
      }
    }
  },
  "permit-3260000-215-2024-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1667862272/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3260000-215-2019-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1494606308/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 50000
      }
    }
  },
  "permit-3260000-215-2018-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1437080440/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000,
        "max": 40000,
        "note": "케어·투컬러 · 메뉴별 금액"
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 10000,
          "max": 20000
        }
      }
    }
  },
  "permit-3260000-215-2026-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2061176133/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 55000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 10000
        },
        "other": {
          "amount": 15000
        }
      }
    }
  },
  "permit-3260000-223-2020-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1329116860/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000
      }
    }
  },
  "permit-3260000-222-2017-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/118286649/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      }
    }
  },
  "permit-3260000-215-2026-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2051718721/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 55000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 20000
        }
      }
    }
  },
  "permit-3270000-222-2024-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1796240243/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 20000
        }
      }
    }
  },
  "permit-3270000-215-2021-00006": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1010659510/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "일반가 · 첫 방문 35,000원 별도"
      }
    }
  },
  "permit-3270000-215-2026-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1314996517/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 55000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        }
      }
    }
  },
  "permit-3270000-218-2024-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1695427059/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 55000
      }
    }
  },
  "permit-3270000-215-2024-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1514744527/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "monthly": {
        "amount": 55000,
        "max": 65000,
        "note": "디자인별 55,000·60,000·65,000원"
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3270000-213-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/2065573196/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "extension": {
        "amount": 10000
      },
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3270000-215-2019-00011": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1914602054/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000,
        "note": "컬러 무제한"
      },
      "gradient": {
        "amount": 40000
      }
    },
    "addOns": {
      "extension": {
        "fullSet": 70000
      },
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3270000-215-2016-00001": {
    "sourceUrl": "https://m.booking.naver.com/booking/13/bizes/752181/items/5177671?area=ple&lang=ko&startDate=2026-11-19&tab=book&theme=place",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "하지현 실장 · 투컬러 기준"
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 0
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3270000-213-2022-00003": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1213155346/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 35000
      },
      "gradient": {
        "amount": 50000
      }
    },
    "addOns": {
      "removal": {
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3280000-215-2016-00004": {
    "sourceUrl": "https://m.place.naver.com/nailshop/53146158/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000,
        "note": "딥케어·굳은살·오버레이 포함"
      },
      "gradient": {
        "amount": 55000
      }
    }
  },
  "permit-3280000-218-2023-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1958309487/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3280000-215-2015-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/36636875/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3280000-215-2022-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1237521512/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 5000
        },
        "other": {
          "amount": 10000
        }
      }
    }
  },
  "permit-3280000-215-2017-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1829607863/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  },
  "permit-3280000-226-2024-00002": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1931140160/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 45000,
        "note": "일반가 · 회원 전용 35,000원 별도"
      }
    }
  },
  "permit-3280000-213-2022-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1216411669/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 30000
      }
    },
    "addOns": {
      "removal": {
        "own": {
          "amount": 10000
        },
        "other": {
          "amount": 15000
        }
      }
    }
  },
  "permit-3280000-215-2025-00001": {
    "sourceUrl": "https://m.place.naver.com/nailshop/1707859953/price",
    "checkedAt": "2026-11-19",
    "prices": {
      "plain": {
        "amount": 40000
      }
    }
  }
};
