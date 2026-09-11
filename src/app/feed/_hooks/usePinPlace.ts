import { keepPreviousData } from "@tanstack/react-query";
import { useRef } from "react";
import { usePlaceDetail } from "@/api/gen/place-detail/place-detail.gen";
import { type PinPlace, toPinPlace } from "../_utils/feedMapper";

/** 핀 클릭 시트용. placeId가 없으면 조회하지 않는다. */
export function usePinPlace(placeId: string | null) {
  // 시트가 떠 있는 동안에는 새 응답이 올 때까지 이전 가게를 남긴다. 본문이 스피너로 바뀌면
  // 내용을 따라가는 시트 높이가 쪼그라들었다 펴진다. 닫혀 있다 열릴 때만 남기지 않는다 —
  // 그때는 직전에 보던 가게가 새 시트에 비친다.
  const openedWithRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  if (placeId !== null && !wasOpenRef.current) {
    openedWithRef.current = placeId;
  }

  wasOpenRef.current = placeId !== null;

  return usePlaceDetail<PinPlace>(
    // 생성 훅이 string만 받아 빈 값을 넣지만, enabled가 막고 있어 이 키로는 호출되지 않는다.
    placeId ?? "",
    {
      query: {
        enabled: placeId !== null,
        select: toPinPlace,
        placeholderData: placeId === openedWithRef.current ? undefined : keepPreviousData,
      },
    },
  );
}
