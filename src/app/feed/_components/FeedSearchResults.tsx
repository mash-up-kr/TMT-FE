"use client";

import { useMemo, useState } from "react";

import emptyMascot from "@/shared/components/assets/mascot-empty.png";
import searchMascot from "@/shared/components/assets/mascot-search.png";
import { usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { Skeleton } from "@/shared/ui/Skeleton";
import { usePlaceSearch } from "../_hooks/usePlaceSearch";
import { FeedNotice } from "./FeedNotice";
import { PlaceResultCard } from "./PlaceResultCard";

const SKELETON_ROWS = [0, 1, 2, 3, 4];

type FeedSearchResultsProps = {
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
};

/** 검색어·칩이 있을 때의 가게 카드 목록 (명세 §2-2). */
export function FeedSearchResults({ position, query, curationTagId }: FeedSearchResultsProps) {
  const { data, isPending, isError } = usePlaceSearch({ query, curationTagId, position });
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const favorite = usePlaceFavorite({
    onSuccessAction: (result) => {
      setFavoriteOverrides((current) => ({ ...current, [result.placeId]: result.isFavorite }));
    },
  });
  const places = useMemo(
    () =>
      data?.map((place) => {
        const isFavorite = favoriteOverrides[place.id];

        return isFavorite === undefined ? place : { ...place, isFavorite };
      }),
    [data, favoriteOverrides],
  );

  // 로딩 중에도 자리와 배경을 잡아야 한다. 비워두면 뒤 회색이 비쳤다가 흰 콘텐츠로 바뀐다.
  if (position === null || isPending) {
    return <PlaceResultSkeleton />;
  }

  if (isError) {
    return <FeedNotice src={emptyMascot} title="검색에 실패했어요." />;
  }

  if (!places || places.length === 0) {
    return (
      <FeedNotice title="검색 결과가 없어요." src={searchMascot}>
        {query
          ? "다른 이름이나 태그로 찾아보세요!"
          : position.isFallback
            ? "위치 권한이 없어 강남역 주변 1km에서만 찾았어요."
            : "내 위치에서 1km 안에서만 찾았어요."}
      </FeedNotice>
    );
  }

  return (
    <ul className="scroll-under-navigation flex flex-1 flex-col gap-ds-4">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceResultCard
            place={place}
            favoriteAction={{
              isPending: favorite.isPending,
              onToggleAction: favorite.onToggleAction,
            }}
          />
        </li>
      ))}
    </ul>
  );
}

/** PlaceResultCard 형태를 흉내낸다 — 80px 썸네일 + 텍스트 세 줄. */
function PlaceResultSkeleton() {
  return (
    <ul aria-busy="true" className="scroll-under-navigation flex flex-1 flex-col gap-ds-4">
      {SKELETON_ROWS.map((row) => (
        <li key={row} className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
          <Skeleton className="size-[80px] shrink-0 rounded-ds-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-ds-4">
            <Skeleton className="h-ds-20 w-1/2" />
            <Skeleton className="h-ds-16 w-3/4" />
            <Skeleton className="h-ds-16 w-1/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
