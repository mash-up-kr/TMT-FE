import type { ReviewCardData } from "@/shared/components/ReviewCard/ReviewCard";

export type GroupJoinInfo = Readonly<{
  name: string;
  imageUrl: string | null;
  availableTicketCount: number;
}>;

export type GroupJoinAction = Readonly<{
  onJoin: () => Promise<boolean>;
  isPending: boolean;
  isError: boolean;
}>;

export type GroupReviewListState = Readonly<{
  reviews: ReviewCardData[];
}> &
  (
    | {
        hasNextPage: false;
        isFetchingNextPage?: never;
        onLoadMore?: never;
      }
    | {
        hasNextPage: true;
        isFetchingNextPage: boolean;
        onLoadMore: () => void;
      }
  );
