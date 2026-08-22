import type { ReviewStore } from "./store";

/**
 * 초안을 열 때 채워 넣을 값.
 *
 * 새 리뷰는 이 값 없이 빈 초안으로 시작하고, 이어쓰기는 서버 초안을 이 모양으로 바꿔 넘긴다.
 * Provider가 두 경로를 같은 방식으로 받도록 진입값을 하나의 타입으로 모은다.
 *
 * 사진은 아직 담지 않는다. 서버 초안의 사진은 URL이고 새로 고른 사진은 `File`이라 한 모델로
 * 합치려면 업로드 흐름이 먼저 정해져야 한다 (docs/review-draft-resume-migration.md).
 */
export type ReviewDraftSnapshot = {
  store: ReviewStore | null;
  selectedTagIds: readonly string[];
  /** 0은 미선택. */
  rating: number;
  reviewText: string;
};
