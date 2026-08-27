import { usePlaceDetail as usePlaceDetailQuery } from "@/api/gen/place-detail/place-detail.gen";
import { type PlaceDetail, toPlaceDetail } from "../_utils/placeMapper";

export function usePlaceDetail(placeId: string) {
  return usePlaceDetailQuery<PlaceDetail>(placeId, { query: { select: toPlaceDetail } });
}
