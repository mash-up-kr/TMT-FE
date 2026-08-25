/** 그룹 목록 화면이 카드에 넘기는 표시 모델. */
export type GroupListItem = {
  id: string;
  thumbnail: string | null;
  name: string;
  description: string;
  memberCount: number;
  reviewCount: number;
  placeCount: number;
  /** 내가 저장한 가게와 겹치는 수. 0이면 카드에서 뱃지가 사라진다. */
  matchedCount: number;
};
