import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import type { ReviewCardFavoriteAction } from "@/shared/components/ReviewCard/ReviewCard";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import type { FeedReview, HomeSummary } from "../_model/home";
import { HomeFeed } from "./HomeFeed";
import { MyGroupList } from "./MyGroupList";
import { RecommendedGroupList } from "./RecommendedGroupList";

type HomeViewProps = {
  summary: HomeSummary;
  position: CurrentPosition;
  feedIsPending: boolean;
  feedIsError: boolean;
  reviews: FeedReview[] | undefined;
  favoriteAction?: ReviewCardFavoriteAction;
};

export function HomeView({
  summary,
  position,
  feedIsPending,
  feedIsError,
  reviews,
  favoriteAction,
}: HomeViewProps) {
  const hasGroups = summary.myGroups.length > 0;

  return (
    <main className="flex flex-1 flex-col bg-surface-secondary">
      <h1 className="truncate bg-surface-primary px-ds-20 py-ds-12 text-heading-lg text-content-primary">
        {summary.nickname}님 안녕하세요
      </h1>

      <MyGroupList groups={summary.myGroups} />

      {hasGroups ? (
        <HomeFeed
          position={position}
          isPending={feedIsPending}
          isError={feedIsError}
          reviews={reviews}
          favoriteAction={favoriteAction}
        />
      ) : (
        <>
          <EmptyFeed />
          <RecommendedGroupList groups={summary.recommendedGroups} />
        </>
      )}
    </main>
  );
}

function EmptyFeed() {
  return (
    <section className="mt-ds-4 flex min-h-0 flex-1 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20">
      <h2 className="text-heading-md text-content-primary">최근 게시물</h2>
      <div className="flex min-h-0 flex-1 items-center justify-center py-ds-32">
        <EmptyNotice title="아직 가입한 그룹이 없어요.">
          그룹에 가입하고 내 취향 가게 리뷰를 모아보세요!
        </EmptyNotice>
      </div>
    </section>
  );
}
