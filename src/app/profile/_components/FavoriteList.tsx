"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import type { ProfileFavoriteItem } from "../_model/profile";
import { FavoriteListItem } from "./FavoriteListItem";

type FavoriteListProps = {
  places: readonly ProfileFavoriteItem[];
  getPlaceHref: (placeId: string) => string;
  /** 없으면 하트를 렌더하지 않는다. 타인 프로필 좋아요 탭이 그렇다. */
  onUnfavorite?: (placeId: string) => void;
  /** 해제 요청이 진행 중인 매장. 그 행의 하트만 잠근다. */
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
