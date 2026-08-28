"use client";

import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { usePlaceSearch } from "../_hooks/usePlaceSearch";
import { NearbyNotice } from "./NearbyNotice";
import { PlaceResultCard } from "./PlaceResultCard";

type NearbySearchResultsProps = {
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
};

/** 검색어·칩이 있을 때의 가게 카드 목록 (명세 §2-2). */
export function NearbySearchResults({ position, query, curationTagId }: NearbySearchResultsProps) {
  const { data, isPending, isError } = usePlaceSearch({ query, curationTagId, position });

  if (position === null || isPending) {
    return <NearbyNotice title="검색 중이에요." />;
  }

  if (isError) {
    return <NearbyNotice title="검색에 실패했어요." />;
  }

  if (!data || data.length === 0) {
    return (
      <NearbyNotice title="검색 결과가 없어요.">
        {query
          ? "다른 이름이나 태그로 찾아보세요!"
          : position.isFallback
            ? "위치 권한이 없어 강남역 주변 1km에서만 찾았어요."
            : "내 위치에서 1km 안에서만 찾았어요."}
      </NearbyNotice>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-ds-4">
      {data.map((place) => (
        <li key={place.id}>
          <PlaceResultCard place={place} />
        </li>
      ))}
    </ul>
  );
}
