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
