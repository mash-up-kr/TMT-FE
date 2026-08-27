import { useSearchPlaces } from "@/api/gen/place/place.gen";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { type PlaceCard, toPlaceCards } from "../_utils/nearbyMapper";

type PlaceSearchInput = {
  query: string | null;
  curationTagId: string | null;
  position: ResolvedPosition | null;
};

/**
 * 검색어·큐레이션 칩 결과. 명세 §2-2 — 둘 중 최소 하나가 있어야 호출한다.
 *
 * 범위는 의도에 따라 나눈다. 칩은 "주변에 뭐 있나" 둘러보기라 명세대로 반경 1km로 제한하고,
 * 검색어는 "이 가게 찾기"라 1km 밖도 찾도록 전역으로 둔다.
 *
 * 명세는 근처보기 검색 전체를 `nearbyOnly=true`로 정하고 있어 검색어 쪽은 벗어난 상태다.
 * 팀 확인 후 명세대로 되돌리거나 명세를 갱신한다 — 되돌릴 때는 아래 한 줄만 `true`로 바꾼다.
 */
export function usePlaceSearch({ query, curationTagId, position }: PlaceSearchInput) {
  const hasCondition = Boolean(query || curationTagId);
  const nearbyOnly = !query;

  return useSearchPlaces<PlaceCard[]>(
    {
      query: query ?? undefined,
      curationTagId: curationTagId ?? undefined,
      latitude: position?.latitude,
      longitude: position?.longitude,
      nearbyOnly,
    },
    { query: { enabled: hasCondition && position !== null, select: toPlaceCards } },
  );
}
