"use client";

import { PlaceRating, PlaceSummary } from "@/shared/components/PlaceSummary/PlaceSummary";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, HeartIcon, LoadingIcon } from "@/shared/ui/Icons";
import { usePinPlace } from "../_hooks/usePinPlace";
import type { PinPlace } from "../_utils/nearbyMapper";

type PlacePinSheetProps = {
  placeId: string | null;
  onClose: () => void;
};

/**
 * 지도 핀을 눌렀을 때 올라오는 시트. 가게 상세 상단과 같은 응답을 쓴다 (B 명세 §3-1).
 * 리뷰 목록은 부르지 않는다 — 상세 화면으로 들어간 뒤에 조회한다.
 */
export function PlacePinSheet({ placeId, onClose }: PlacePinSheetProps) {
  const { data, isPending, isError } = usePinPlace(placeId);

  return (
    <BottomSheet
      label="가게 요약"
      open={placeId !== null}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      footer={data ? <PinSheetActions place={data} /> : undefined}
    >
      <PinSheetBody place={data} isPending={isPending} isError={isError} onClose={onClose} />
    </BottomSheet>
  );
}

type PinSheetBodyProps = {
  place: PinPlace | undefined;
  isPending: boolean;
  isError: boolean;
  onClose: () => void;
};

function PinSheetBody({ place, isPending, isError, onClose }: PinSheetBodyProps) {
  if (isPending) {
    return (
      <output className="flex items-center justify-center py-ds-32">
        <LoadingIcon className="animate-spin text-icon-secondary" />
      </output>
    );
  }

  if (isError || !place) {
    return (
      <p className="py-ds-32 text-center text-body-md-medium text-content-secondary">
        가게 정보를 불러오지 못했어요.
      </p>
    );
  }

  return (
    // PlaceSummary가 자체 좌우 여백을 가져 시트 본문 여백과 겹친다.
    <div className="-mx-ds-20">
      <PinSheetHeader place={place} onClose={onClose} />
      <PlaceSummary place={place} hidePhone />
    </div>
  );
}

type PinSheetHeaderProps = {
  place: PinPlace;
  onClose: () => void;
};

function PinSheetHeader({ place, onClose }: PinSheetHeaderProps) {
  return (
    <div className="flex items-center gap-ds-4 px-ds-20 pb-ds-12">
      <h2 className="truncate text-heading-sm text-content-primary">{place.name}</h2>
      <PlaceRating value={place.averageRating} />
      <div className="ml-auto flex shrink-0 items-center gap-ds-16">
        <IconButton aria-label="찜하기">
          <HeartIcon size={28} />
        </IconButton>
        <IconButton aria-label="닫기" onClick={onClose}>
          <CancelIcon size={28} />
        </IconButton>
      </div>
    </div>
  );
}

function PinSheetActions({ place }: { place: PinPlace }) {
  return (
    <ButtonStack type="horizontal">
      {/* 나침반 동작이 시안에 정의돼 있지 않아 자리만 잡는다. */}
      <Button variant="tertiary" size="md">
        나침반
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={() => {
          window.open(directionsUrl(place), "_blank", "noopener");
        }}
      >
        길찾기
      </Button>
    </ButtonStack>
  );
}

/** 좌표로 네이버 지도 길찾기 딥링크를 만든다 (B 명세 §3-1 — 클라이언트가 조립). */
function directionsUrl({ name, latitude, longitude }: PinPlace) {
  return `https://map.naver.com/p/directions/-/${longitude},${latitude},${encodeURIComponent(name)}/-/car`;
}
