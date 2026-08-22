import Image from "next/image";
import type { ReviewPhoto } from "../_model/photo";
import ReviewCompleteIllustration from "./assets/review-complete.svg?react";
import mascotImage from "./assets/review-complete-mascot.png";

type ReviewCompleteVisualProps = Readonly<{
  photos: readonly ReviewPhoto[];
}>;

export function ReviewCompleteVisual({ photos }: ReviewCompleteVisualProps) {
  if (photos.length === 0) {
    return (
      <ReviewCompleteIllustration role="img" aria-label="리뷰 작성 완료" className="size-[240px]" />
    );
  }

  return <Image src={mascotImage} alt="" priority className="size-[220px] object-contain" />;
}
