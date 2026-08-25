/** 명세의 정렬 상수. 스펙에 enum이 없어 생성 타입이 string이라 여기서 좁힌다. */
export const GROUP_SORTS = [
  { value: "RECOMMENDED", label: "추천순" },
  { value: "MEMBER_COUNT", label: "가입자 많은 수" },
  { value: "REVIEW_COUNT", label: "리뷰 많은 수" },
] as const;

export type GroupSort = (typeof GROUP_SORTS)[number]["value"];

export const DEFAULT_SORT: GroupSort = "RECOMMENDED";

export type GroupFilterId = "sort" | "category" | "region";
