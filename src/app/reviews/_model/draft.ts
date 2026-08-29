import type { ReviewStore } from "./store";

/** 이어쓰기 선택 목록의 한 줄. 초안을 고르는 데 필요한 것만 담는다. */
export type ContinuableDraft = {
  saveId: string;
  placeName: string;
  roadAddress: string;
  thumbnailUrl: string | null;
  canContinue: boolean;
};

export type ReviewDraftSnapshot = {
  store: ReviewStore | null;
  selectedTagIds: readonly string[];
  rating: number;
  reviewText: string;
};
