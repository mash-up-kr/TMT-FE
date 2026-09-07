"use client";

import Link from "next/link";
import { useListSaves } from "@/api/gen/save/save.gen";
import { ROUTES } from "@/shared/constants/routes";
import { useReviewReturnTo } from "@/shared/hooks/useReviewEntryPath";
import { ChevronRightIcon } from "@/shared/ui/Icons";
import { isContinuableSave } from "@/shared/utils/continuableSave";
import { withReviewReturnTo } from "@/shared/utils/reviewNavigation";
import PenIllustration from "./assets/pen.svg?react";

/**
 * 쓰다 만 리뷰로 들어가는 배너. 이어 쓸 초안이 하나라도 있을 때만 그린다.
 *
 * 초안이 하나뿐이어도 이어쓰기 선택 화면으로 보낸다. 진입 안내 시트(useContinueDraftPrompt)는
 * 하나면 곧장 그 초안으로 가지만, 이 배너는 시안상 목록으로 가는 입구다. 사용자가 스스로 누른
 * 자리라 무엇을 이어 쓰는지 고를 기회를 남긴다.
 *
 * 목록 조회는 파라미터 없이 호출해 안내 시트·이어쓰기 선택 화면과 같은 캐시를 쓴다.
 */
export function ContinueDraftBanner() {
  const saves = useListSaves();
  const returnTo = useReviewReturnTo();
  const hasContinuableDraft = (saves.data?.items ?? []).some(isContinuableSave);

  if (!hasContinuableDraft) {
    return null;
  }

  return (
    <Link
      href={withReviewReturnTo(ROUTES.REVIEWS.DRAFTS, returnTo)}
      className="flex items-center gap-ds-12 rounded-ds-md bg-surface-secondary p-ds-16"
    >
      <div aria-hidden="true" className="relative size-[60px] shrink-0">
        <PenIllustration className="absolute top-[10px] left-[6.5px] h-[40px] w-[46.9982px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-ds-4 text-content-primary">
        <p className="text-body-md-bold">작성 중인 리뷰가 있어요</p>
        <p className="text-body-md-medium">이어서 완성해볼까요?</p>
      </div>
      <ChevronRightIcon aria-hidden="true" className="shrink-0 text-icon-primary" />
    </Link>
  );
}
