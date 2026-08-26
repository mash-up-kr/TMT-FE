"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import type { ProfileFavoriteItem } from "../_model/profile";
import { FavoriteListItem } from "./FavoriteListItem";

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
    return <EmptyNotice title="아직 좋아요한 매장이 없어요" className="py-ds-48" />;
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
