import type { ReviewTagGroup } from "../_model/tag";

/**
 * 3단계 태그 목록. 문구와 순서는 시안이 정본이다.
 *
 * 시안의 칩에는 20x20 컬러 일러스트 아이콘이 함께 붙는다. 아직 에셋을 확보하지 못해 라벨만
 * 넣었고, 익스포트를 받으면 각 태그에 `icon` 필드를 더한다.
 */
export const REVIEW_TAG_GROUPS: readonly ReviewTagGroup[] = [
  {
    id: "companion",
    label: "누구와 함께했나요?",
    hint: "(복수 가능)",
    tags: [
      { id: "alone", label: "혼자" },
      { id: "lover", label: "연인" },
      { id: "friend", label: "친구" },
      { id: "colleague", label: "동료·지인" },
      { id: "family", label: "가족" },
    ],
  },
  {
    id: "highlight",
    label: "어떤 점이 좋았나요?",
    hint: "(복수 가능)",
    tags: [
      { id: "food", label: "음식이 맛있어요" },
      { id: "response", label: "응대가 친절해요" },
      { id: "mood", label: "분위기가 좋아요" },
      { id: "money", label: "가성비가 좋아요" },
      { id: "clean", label: "청결하고 깔끔해요" },
      { id: "subway", label: "교통이 편리해요" },
      { id: "seat", label: "자리가 넓고 편해요" },
    ],
  },
];
