/**
 * 태그 그룹 메타.
 *
 * 라벨과 힌트는 시안 문구이고, `source`는 리뷰 폼 설정 응답에서 이 그룹의 태그가 오는 필드다.
 * 짝을 배열 순서가 아니라 메타 자체에 적어야 그룹이 늘거나 순서가 바뀌어도 어긋나지 않는다.
 */
export const REVIEW_TAG_GROUPS = [
  {
    id: "companion",
    label: "누구와 함께했나요?",
    hint: "(복수 가능)",
    source: "companionTags",
  },
  {
    id: "highlight",
    label: "어떤 점이 좋았나요?",
    hint: "(복수 가능)",
    source: "positivePointTags",
  },
] as const;
