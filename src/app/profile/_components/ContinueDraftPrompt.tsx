"use client";

import { usePathname } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useContinueDraftPrompt } from "../_hooks/useContinueDraftPrompt";
import { useMyProfileSummary } from "../_hooks/useMyProfileSummary";
import { PROFILE_TABS } from "../_model/profile";
import { ContinueDraftSheet } from "./ContinueDraftSheet";

const TAB_PATHS: readonly string[] = PROFILE_TABS.map((tab) => ROUTES.PROFILE.ME_TAB(tab));

/**
 * 이어쓰기 안내 시트의 마운트 지점.
 *
 * 마이페이지 layout이 소유한다. 탭은 동적 세그먼트라 화면 쪽에 두면 탭을 옮길 때마다
 * 리마운트되어 "한 번 보여줬다"는 사실이 매번 사라진다.
 *
 * 티켓·추천 화면에서는 띄우지 않는다. 시안의 노출 지점은 프로필 본화면이고, 추천은 전체 화면
 * 연출이라 시트가 덮으면 안 된다. 다만 layout은 그대로 살아 있어 그 화면들을 다녀와도 다시 뜨지 않는다.
 */
export function ContinueDraftPrompt() {
  const pathname = usePathname();
  const summary = useMyProfileSummary();
  const isProfileTabScreen = TAB_PATHS.includes(pathname);

  // 프로필 상단이 그려진 뒤에 시트를 올린다. 로딩 화면을 덮으면 어디에서 뜬 시트인지 읽히지 않는다.
  const continueDraft = useContinueDraftPrompt({
    ready: isProfileTabScreen && !summary.isPending,
  });

  return (
    <ContinueDraftSheet
      open={continueDraft.isOpen}
      onOpenChangeAction={continueDraft.onOpenChange}
      onContinueAction={continueDraft.continueWriting}
    />
  );
}
