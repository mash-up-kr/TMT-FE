import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import {
  ReviewCard,
  type ReviewCardFavoriteAction,
} from "@/shared/components/ReviewCard/ReviewCard";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import type { FeedReview } from "../_model/home";

type HomeFeedProps = {
  position: CurrentPosition;
  isPending: boolean;
  isError: boolean;
  reviews: FeedReview[] | undefined;
  favoriteAction?: ReviewCardFavoriteAction;
};

type FeedNotice = {
  title: string;
  description?: string;
};

function resolveNotice({
  position,
  isPending,
  isError,
  reviews,
}: HomeFeedProps): FeedNotice | null {
  if (position.status === "unavailable") {
    return {
      title: "위치를 확인할 수 없어요.",
      description: "가까운 순으로 보여드리려면 위치 권한이 필요해요.",
    };
  }

  if (position.status === "pending" || isPending) {
    return { title: "게시물을 불러오는 중이에요." };
  }

  if (isError) {
    return { title: "게시물을 불러오지 못했어요." };
  }

  if (!reviews || reviews.length === 0) {
    return {
      title: "아직 올라온 게시물이 없어요.",
      description: "그룹에 리뷰가 공유되면 여기에 모아드릴게요!",
    };
  }

  return null;
}

export function HomeFeed(props: HomeFeedProps) {
  const notice = resolveNotice(props);

  if (notice) {
    return (
      <section className="mt-ds-4 flex min-h-0 flex-1 flex-col">
        <h2 className="bg-surface-primary px-ds-20 pt-ds-20 pb-ds-12 text-heading-md text-content-primary">
          최근 게시물
        </h2>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-primary px-ds-20 py-ds-32">
          <div className="translate-y-[calc(0px_-_clamp(0px,calc(50dvh_-_320px),var(--spacing-ds-64)))]">
            <EmptyNotice title={notice.title}>{notice.description}</EmptyNotice>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="최근 게시물" className="mt-ds-4 flex min-h-0 flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-ds-4">
        {props.reviews?.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} favoriteAction={props.favoriteAction} />
          </li>
        ))}
      </ul>
    </section>
  );
}
