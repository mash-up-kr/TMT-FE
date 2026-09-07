import { usePlaceDetailSuspense } from "@/api/gen/place-detail/place-detail.gen";
import { type PlaceDetail, toPlaceDetail } from "../_utils/placeMapper";

export function useSuspensePlaceDetail(placeId: string) {
  return usePlaceDetailSuspense<PlaceDetail>(placeId, { query: { select: toPlaceDetail } });
}
