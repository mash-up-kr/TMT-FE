import type { RecommendStore } from "../_model/recommend";

/**
 * 매장 추천 endpoint가 OpenAPI에 없어 화면을 더미로 세운다.
 * 계약이 생기면 이 파일을 지우고 `_hooks/`에서 생성 hook으로 바꾼다. 화면은 건드리지 않는다.
 *
 * 구성은 시안 기본 화면(Figma 1792:24634)의 8곳을 그대로 옮긴 것이다.
 */
export const DUMMY_STORES: readonly RecommendStore[] = [
  { placeId: "1", name: "온화커피", category: "grill" },
  { placeId: "2", name: "한판승부", category: "bar" },
  { placeId: "3", name: "이자카야 고코", category: "snack" },
  { placeId: "4", name: "청와옥 삼계탕", category: "buffet" },
  { placeId: "5", name: "브런치카페", category: "brunch" },
  { placeId: "6", name: "화로연탄구이", category: "asian" },
  { placeId: "7", name: "육회한마리", category: "western" },
  { placeId: "8", name: "스시오마카세 온 압구정 로데오", category: "japanese" },
];
