"use client";

import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import emptyMascot from "@/shared/components/assets/mascot-empty.png";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { PlaceFavoriteButton } from "@/shared/components/PlaceFavoriteButton";
import { PlaceRating, PlaceSummary } from "@/shared/components/PlaceSummary/PlaceSummary";
import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { useSuspensePlaceDetail } from "../_hooks/usePlaceDetail";
import { usePlaceReviews } from "../_hooks/usePlaceReviews";

/** 명세 §5 — 태그는 2개 노출하고 나머지는 클라이언트가 `+N`으로 접는다. */
const MAX_VISIBLE_TAGS = 2;

type PlaceDetailScreenProps = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: PlaceDetailScreenProps) {
  const { data: detail } = useSuspensePlaceDetail(placeId);
  const favorite = usePlaceFavorite();
  const position = useCurrentPosition();
  const reviews = usePlaceReviews(placeId, position);
  const isFavorite = detail.isFavorite;

  // ⚠️ UT2 임시 계측. UT 스크립트에서 가게 상세는 Task 2의 그룹 내 가게 탐색에서만 열린다.
  useUt2Step(UT2_STEPS.GROUP_STORE_LIST);

  return (
    <>
      <PlaceDetailHeader
        favorite={{
          isFavorite,
          isPending: favorite.isPending,
          isDisabled: favorite.isPending,
          placeName: detail.name,
          onToggleAction: () => favorite.onToggleAction({ id: placeId, isFavorite }),
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <section className="flex shrink-0 flex-col">
          <div className="flex items-center gap-ds-4 px-ds-20 py-ds-12">
            <h1 className="truncate text-heading-sm text-content-primary">{detail.name}</h1>
            <PlaceRating value={detail.averageRating} />
          </div>
          <PlaceSummary place={detail} />
        </section>
        <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
        <PlaceReviews
          count={detail.reviewCount}
          isPending={reviews.isPending}
          isError={reviews.isError}
          onRetry={() => reviews.refetch()}
          reviews={reviews.data}
        />
      </div>
    </>
  );
}

type PlaceDetailFavoriteAction = Readonly<{
  placeName: string;
  isFavorite: boolean;
  isPending: boolean;
  isDisabled: boolean;
  onToggleAction: () => void;
}>;

function PlaceDetailHeader({ favorite }: { favorite: PlaceDetailFavoriteAction }) {
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
          <PlaceFavoriteButton
            placeName={favorite.placeName}
            isFavorite={favorite.isFavorite}
            isPending={favorite.isPending}
            disabled={favorite.isDisabled}
            onToggleAction={favorite.onToggleAction}
          />
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
  onRetry: () => void;
  reviews: ReturnType<typeof usePlaceReviews>["data"];
};

function PlaceReviews({ count, isPending, isError, onRetry, reviews }: PlaceReviewsProps) {
  return (
    <section className="flex flex-1 flex-col gap-ds-8 py-ds-20">
      <h2 className="px-ds-20 text-heading-sm text-content-primary">리뷰 {count}</h2>

      {isPending ? (
        <PlaceDetailNotice title="리뷰를 불러오는 중이에요." />
      ) : isError ? (
        <RetryNotice message="리뷰를 불러오지 못했어요." onRetry={onRetry} />
      ) : !reviews || reviews.length === 0 ? (
        <PlaceDetailNotice src={emptyMascot} title="아직 올라온 리뷰가 없어요.">
          이 가게의 첫 번째 리뷰를 남겨보세요!
        </PlaceDetailNotice>
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

function PlaceDetailNotice({
  title,
  children,
  src,
}: {
  title: string;
  children?: string;
  src?: StaticImageData;
}) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-ds-20 py-ds-32">
      <EmptyNotice title={title} src={src}>
        {children}
      </EmptyNotice>
    </div>
  );
}
