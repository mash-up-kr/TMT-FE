import type { ReviewCardData } from "@/shared/model/review";

export type GroupProfileData = {
  name: string;
  oneLineDescription: string;
  description: string | null;
  coverImageUrl: string | null;
  imageUrl: string | null;
  memberCount: number;
  reviewCount: number;
  placeCount: number;
  tags: string[];
  matchedSavedPlaceCount: number;
};

export type GroupDetailViewData = GroupProfileData & {
  id: string;
  isOwner: boolean;
  isMember: boolean;
};

export type GroupJoinInfo = Readonly<{
  name: string;
  imageUrl: string | null;
  availableTicketCount: number;
}>;

export type GroupJoinAction = Readonly<{
  onJoin: () => Promise<boolean>;
  isPending: boolean;
}>;

export type GroupLeaveResult =
  | Readonly<{ success: true }>
  | Readonly<{ success: false; errorTitle?: string }>;

export type GroupLeaveAction = Readonly<{
  onLeaveAction: () => Promise<GroupLeaveResult>;
  isPending: boolean;
}>;

export type GroupJoinPreviewState =
  | Readonly<{ status: "not-required" }>
  | Readonly<{ status: "pending" }>
  | Readonly<{ status: "error"; onRetry: () => void }>
  | Readonly<{ status: "ready"; availableTicketCount: number; isJoinable: boolean }>;

export type GroupReviewListState =
  | Readonly<{ status: "pending" }>
  | Readonly<{ status: "error"; onRetry: () => void }>
  | (Readonly<{ status: "ready"; reviews: ReviewCardData[] }> &
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
      ));
