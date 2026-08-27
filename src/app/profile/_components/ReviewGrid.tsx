"use client";

import dummyImage from "@/shared/assets/dummy-image.png";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileReviewItem } from "../_model/profile";
import { ProfileEmptyNotice } from "./ProfileEmptyNotice";

type ReviewGridProps = {
  reviews: readonly ProfileReviewItem[];
  onSelect: (review: ProfileReviewItem) => void;
};

export function ReviewGrid({ reviews, onSelect }: ReviewGridProps) {
  if (reviews.length === 0) {
    return <ProfileEmptyNotice title="아직 작성한 리뷰가 없어요" />;
  }

  return (
    <ul className="grid grid-cols-2 gap-ds-8 bg-surface-primary px-ds-20 py-ds-12">
      {reviews.map((review) => (
        <li key={review.reviewId}>
          <button
            type="button"
            aria-label={`${review.placeName} 리뷰 상세`}
            className="block w-full overflow-hidden rounded-ds-md bg-surface-tertiary"
            onClick={() => onSelect(review)}
          >
            <ImageWithFallback
              src={review.thumbnailUrl}
              fallbackSrc={dummyImage}
              alt=""
              className="aspect-square w-full object-cover"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
