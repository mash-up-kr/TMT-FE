"use client";

import type { ProfileFavoriteItem } from "../_model/profile";
import { FavoriteListItem } from "./FavoriteListItem";
import { ProfileEmptyNotice } from "./ProfileEmptyNotice";

type FavoriteListProps = {
  places: readonly ProfileFavoriteItem[];
  getPlaceHref: (placeId: string) => string;
  onUnfavorite?: (placeId: string) => void;
  pendingPlaceId?: string | null;
};

export function FavoriteList({
  places,
  getPlaceHref,
  onUnfavorite,
  pendingPlaceId,
}: FavoriteListProps) {
  if (places.length === 0) {
    return <ProfileEmptyNotice title="아직 좋아요한 매장이 없어요" />;
  }

  return (
    <ul className="content-container bg-surface-primary">
      {places.map((place) => (
        <FavoriteListItem
          key={place.placeId}
          place={place}
          href={getPlaceHref(place.placeId)}
          onUnfavorite={onUnfavorite}
          pending={pendingPlaceId === place.placeId}
        />
      ))}
    </ul>
  );
}
