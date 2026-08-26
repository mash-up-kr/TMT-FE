import { usePlaceDetail as usePlaceDetailQuery } from "@/api/gen/place-detail/place-detail.gen";
import { type PlaceDetail, toPlaceDetail } from "../_utils/placeMapper";

const SERVER_IGNORES_USER_ID = 1;

export function usePlaceDetail(placeId: string) {
  return usePlaceDetailQuery<PlaceDetail>(
    placeId,
    { userId: SERVER_IGNORES_USER_ID },
    { query: { select: toPlaceDetail } },
  );
}
