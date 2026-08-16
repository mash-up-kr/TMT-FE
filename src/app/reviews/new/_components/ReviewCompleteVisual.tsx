import Image from "next/image";
import type { ReviewPhoto } from "../_model/photo";
import ReviewCompleteIllustration from "./assets/review-complete.svg?react";
import mascotImage from "./assets/review-complete-mascot.png";

type ReviewCompleteVisualProps = Readonly<{
  photos: readonly ReviewPhoto[];
}>;

/**
 * 완료 화면의 큰 비주얼.
 *
 * 두 벌 모두 브랜드 에셋이다. 사용자가 올린 사진을 여기에 보여주지 않는다 — 시안의 220 자리는
 * 파일명이 사진처럼 보이지만 실제로는 고정 마스코트 이미지다.
 *
 * 사진형(마스코트 220)과 일러스트형(240) 중 무엇을 언제 쓰는지는 시안 주석에 없다.
 * 사진 유무로 갈리는 것으로 두었으나 확인이 필요하다(짝 문서 미결 5번).
 */
export function ReviewCompleteVisual({ photos }: ReviewCompleteVisualProps) {
  if (photos.length === 0) {
    return (
      <ReviewCompleteIllustration role="img" aria-label="리뷰 작성 완료" className="size-[240px]" />
    );
  }

  return (
    // 원본이 세로로 긴 이미지라 정사각 자리에서 잘리지 않게 contain으로 맞춘다.
    <Image src={mascotImage} alt="" priority className="size-[220px] object-contain" />
  );
}
