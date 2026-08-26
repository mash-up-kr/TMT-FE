import { ChevronRightIcon } from "@/shared/ui/Icons";
import PotIllustration from "./assets/pot.svg?react";

/**
 * 매장 추천 진입 배너.
 *
 * 목적지 화면(계약 5-1의 격자)이 아직 없어 지금은 이동하지 않는다.
 * 화면이 생기면 Link로 감싼다.
 */
export function PlaceRecommendationCard() {
  return (
    <div className="flex items-center gap-ds-12 rounded-ds-md bg-surface-secondary p-ds-16">
      <div aria-hidden="true" className="relative size-[60px] shrink-0">
        <PotIllustration className="absolute top-[10px] left-[2px] h-[40px] w-[56.4286px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
        <p className="text-body-md-bold">새로운 매장을 추천받아보세요</p>
        <p className="text-body-md-medium">내가 작성한 리뷰로 새로운 매장을 추천받을 수 있어요</p>
      </div>
      <ChevronRightIcon aria-hidden="true" className="shrink-0 text-icon-primary" />
    </div>
  );
}
