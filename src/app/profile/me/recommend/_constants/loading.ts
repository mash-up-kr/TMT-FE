/**
 * 로딩 중 보여주는 문구. 시안(Figma 1821:43408)의 글자 노드를 그대로 옮긴 것으로,
 * 마지막 점은 세 개다.
 */
export const LOADING_CAPTION = "매장의 리뷰 꼼꼼히 검토 중...";

/**
 * 문구 뒤에서 번지는 따뜻한 빛.
 *
 * 시안은 280 정원이고 14프레임 내내 크기가 변하지 않는다. 글자 중심보다 20px 아래에 있다.
 * 색은 semantic 토큰으로 표현되지 않는 일러스트 값이라 여기 둔다.
 */
export const CAPTION_GLOW = {
  size: 280,
  offsetY: 20,
  background:
    "radial-gradient(circle, rgba(255, 197, 92, 0.42) 0%, rgba(255, 214, 140, 0.22) 45%, rgba(255, 224, 170, 0) 70%)",
} as const;

/** 문구 색. 시안 실측값이고 토큰에 같은 역할이 없다. */
export const CAPTION_COLOR = "#403326";
