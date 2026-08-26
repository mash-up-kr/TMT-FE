"use client";

import type { ProfileTabPage } from "../_hooks/useProfileData";
import type { ProfileReviewItem } from "../_model/profile";
import { FavoriteList } from "./FavoriteList";
import { GroupList } from "./GroupList";
import type { GroupListVariant } from "./GroupListItem";
import { ReviewGrid } from "./ReviewGrid";

type ProfileTabBodyProps = {
  page: ProfileTabPage;
  variant: GroupListVariant;
  getGroupHref: (groupId: string) => string;
  getPlaceHref: (placeId: string) => string;
  onSelectReview: (review: ProfileReviewItem) => void;
  /** 내 프로필에만 있다. 없으면 하트를 그리지 않는다. */
  onUnfavorite?: (placeId: string) => void;
  pendingPlaceId?: string | null;
};

export function ProfileTabBody({
  page,
  variant,
  getGroupHref,
  getPlaceHref,
  onSelectReview,
  onUnfavorite,
  pendingPlaceId,
}: ProfileTabBodyProps) {
  switch (page.tab) {
    case "reviews":
      return <ReviewGrid reviews={page.items} onSelect={onSelectReview} />;
    case "groups":
      return <GroupList groups={page.items} getGroupHref={getGroupHref} variant={variant} />;
    case "favorites":
      return (
        <FavoriteList
          places={page.items}
          getPlaceHref={getPlaceHref}
          onUnfavorite={onUnfavorite}
          pendingPlaceId={pendingPlaceId}
        />
      );
  }
}
