import { usePlaceDetail } from "@/api/gen/place-detail/place-detail.gen";
import { type PinPlace, toPinPlace } from "../_utils/nearbyMapper";

/** 핀 클릭 시트용. placeId가 없으면 조회하지 않는다. */
export function usePinPlace(placeId: string | null) {
  return usePlaceDetail<PinPlace>(
    // 생성 훅이 string만 받아 빈 값을 넣지만, enabled가 막고 있어 이 키로는 호출되지 않는다.
    placeId ?? "",
    { query: { enabled: placeId !== null, select: toPinPlace } },
  );
}
