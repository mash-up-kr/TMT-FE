import type { RecommendResult } from "../_model/recommend";

/**
 * 추천 결과 더미. 시안 로딩 프레임(Figma 1843:24946)의 카드 내용을 그대로 옮겼다.
 * 계약이 생기면 이 파일을 지우고 `_hooks/`에서 생성 hook으로 바꾼다.
 */
export const DUMMY_RESULT: RecommendResult = {
  placeId: "101",
  name: "델리스피자",
  roadAddress: "서울 마포구 도화동 200-14",
  categoryName: "양식",
  thumbnailUrl: null,
  summaries: [
    { id: "up-1", tone: "up", text: "분위기가 좋아요" },
    { id: "down-1", tone: "down", text: "웨이팅이 길어요" },
  ],
};
