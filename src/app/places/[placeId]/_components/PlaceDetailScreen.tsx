"use client";

import { useRouter } from "next/navigation";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { PlaceRating, PlaceSummary } from "@/shared/components/PlaceSummary/PlaceSummary";
import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import { useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon, HeartIcon, LoadingIcon } from "@/shared/ui/Icons";
import { usePlaceDetail } from "../_hooks/usePlaceDetail";
import { usePlaceReviews } from "../_hooks/usePlaceReviews";

/** 명세 §5 — 태그는 2개 노출하고 나머지는 클라이언트가 `+N`으로 접는다. */
const MAX_VISIBLE_TAGS = 2;

type PlaceDetailScreenProps = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: PlaceDetailScreenProps) {
  const detail = usePlaceDetail(placeId);
  const position = useCurrentPosition();
  const reviews = usePlaceReviews(placeId, position);

  return (
    <>
      <PlaceDetailHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {detail.isPending ? (
          <output className="flex flex-1 items-center justify-center">
            <LoadingIcon className="animate-spin text-icon-secondary" />
          </output>
        ) : detail.isError ? (
          <EmptyNotice title="가게 정보를 불러오지 못했어요." />
        ) : (
          <>
            <section className="flex shrink-0 flex-col">
              <div className="flex items-center gap-ds-4 px-ds-20 py-ds-12">
                <h1 className="truncate text-heading-sm text-content-primary">
                  {detail.data.name}
                </h1>
                <PlaceRating value={detail.data.averageRating} />
              </div>
              <PlaceSummary place={detail.data} />
            </section>
            <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
            <PlaceReviews
              count={detail.data.reviewCount}
              isPending={reviews.isPending}
              isError={reviews.isError}
              reviews={reviews.data}
            />
          </>
        )}
      </div>
    </>
  );
}

function PlaceDetailHeader() {
  const router = useRouter();

  return (
    <GNB
      align="left"
      className="shrink-0"
      title={null}
      left={
        <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
          <ChevronLeftIcon size={28} />
        </IconButton>
      }
      right={
        <>
          <IconButton aria-label="찜하기">
            <HeartIcon size={28} />
          </IconButton>
          <IconButton aria-label="닫기" onClick={() => router.back()}>
            <CancelIcon size={28} />
          </IconButton>
        </>
      }
    />
  );
}

type PlaceReviewsProps = {
  count: number;
  isPending: boolean;
  isError: boolean;
  reviews: ReturnType<typeof usePlaceReviews>["data"];
};

function PlaceReviews({ count, isPending, isError, reviews }: PlaceReviewsProps) {
  return (
    <section className="flex flex-1 flex-col gap-ds-8 py-ds-20">
      <h2 className="px-ds-20 text-heading-sm text-content-primary">리뷰 {count}</h2>

      {isPending ? (
        <EmptyNotice title="리뷰를 불러오는 중이에요." />
      ) : isError ? (
        <EmptyNotice title="리뷰를 불러오지 못했어요." />
      ) : !reviews || reviews.length === 0 ? (
        <EmptyNotice title="아직 올라온 리뷰가 없어요.">
          이 가게의 첫 번째 리뷰를 남겨보세요!
        </EmptyNotice>
      ) : (
        <ul className="flex flex-col">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} hidePlace maxVisibleTags={MAX_VISIBLE_TAGS} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
