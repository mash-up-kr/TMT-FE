import { keepPreviousData } from "@tanstack/react-query";
import { useNearbyPlaces } from "@/api/gen/nearby/nearby.gen";
import { type FeedPins, toFeedPins } from "../_utils/feedMapper";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * viewport 안의 핀을 조회한다. 지도를 움직이는 것이 페이지 이동이라 커서를 쓰지 않고
 * bounds가 바뀔 때마다 다시 조회한다 (명세 §2-3).
 */
export function useFeedPins(
  bounds: MapBounds | null,
  curationTagId: string | null,
  query: string | null,
) {
  return useNearbyPlaces<FeedPins>(
    {
      north: bounds?.north ?? 0,
      south: bounds?.south ?? 0,
      east: bounds?.east ?? 0,
      west: bounds?.west ?? 0,
      curationTagId: curationTagId ?? undefined,
      query: query ?? undefined,
    },
    {
      // bounds가 곧 queryKey라 지도를 움직일 때마다 캐시가 비어 핀이 사라진다.
      // 새 응답이 올 때까지 이전 핀을 화면에 남긴다.
      query: { enabled: bounds !== null, select: toFeedPins, placeholderData: keepPreviousData },
    },
  );
}
