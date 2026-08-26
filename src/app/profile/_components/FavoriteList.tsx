"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import type { ProfileFavoriteItem } from "../_model/profile";
import { FavoriteListItem } from "./FavoriteListItem";

type FavoriteListProps = {
  places: readonly ProfileFavoriteItem[];
  getPlaceHref: (placeId: string) => string;
  onUnfavorite: (placeId: string) => void;
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
    // 그룹 탭 빈 상태(1674:61016)와 같은 형태. 좋아요 탭 빈 상태는 아직 Figma에 없어
    // 문구를 지어내지 않고 제목만 둔다.
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
