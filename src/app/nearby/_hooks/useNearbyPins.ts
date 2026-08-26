import { useNearbyPlaces } from "@/api/gen/nearby/nearby.gen";
import { type NearbyPins, toNearbyPins } from "../_utils/nearbyMapper";

const SERVER_IGNORES_USER_ID = 1;

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
export function useNearbyPins(bounds: MapBounds | null) {
  return useNearbyPlaces<NearbyPins>(
    {
      userId: SERVER_IGNORES_USER_ID,
      north: bounds?.north,
      south: bounds?.south,
      east: bounds?.east,
      west: bounds?.west,
    },
    { query: { enabled: bounds !== null, select: toNearbyPins } },
  );
}
