"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNavScreenLayout } from "@/shared/components/BottomNavScreenLayout";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { PlusIcon } from "@/shared/ui/Icons";
import { toast } from "@/shared/ui/Toast";
import { useMyProfileSummary } from "../_hooks/useMyProfileSummary";
import { useMyProfileTabPage } from "../_hooks/useMyProfileTabPage";
import { useReviewDetailSheet } from "../_hooks/useReviewDetailSheet";
import type { ProfileTab } from "../_model/profile";
import { toGroupHref, toPlaceHref } from "../_utils/profileHrefs";
import { PlaceRecommendationCard } from "./PlaceRecommendationCard";
import { ProfileTabPageView } from "./ProfileTabPageView";
import { TicketCard } from "./TicketCard";

/** 연동 시 useMutation의 isPending으로 바뀐다. */
const UNFAVORITE_DELAY_MS = 400;

export function MeProfileScreen({ activeTab }: { activeTab: ProfileTab }) {
  const router = useRouter();
  const summary = useMyProfileSummary();
  const tabPage = useMyProfileTabPage(activeTab);
  const sheet = useReviewDetailSheet();
  const [pendingPlaceId, setPendingPlaceId] = useState<string | null>(null);

  // 해제해도 항목은 목록에 남고 다음 조회에서 빠진다.
  const unfavorite = (placeId: string) => {
    setPendingPlaceId(placeId);
    setTimeout(() => {
      setPendingPlaceId(null);
      toast.success("좋아요를 취소했어요");
    }, UNFAVORITE_DELAY_MS);
  };

  const header = (
    <GNB
      align="left"
      className="shrink-0"
      title={null}
      left={<TMTLogoHomeLink />}
      right={
        <IconButton aria-label="리뷰 작성하기" onClick={() => router.push(ROUTES.REVIEWS.NEW)}>
          <PlusIcon size={28} />
        </IconButton>
      }
    />
  );

  return (
    <>
      <BottomNavScreenLayout activeTab="my" header={header}>
        <ProfileTabPageView
          summary={summary}
          tabPage={tabPage}
          activeTab={activeTab}
          basePath={ROUTES.PROFILE.ME}
          beforeTabs={
            <>
              <PlaceRecommendationCard />
              <TicketCard
                count={summary.data?.availableTicketCount}
                href={ROUTES.PROFILE.TICKETS}
              />
            </>
          }
          tabBody={{
            viewer: "mine",
            getGroupHref: toGroupHref,
            getPlaceHref: toPlaceHref,
            onSelectReview: sheet.open,
            onUnfavorite: unfavorite,
            pendingPlaceId,
          }}
        />
      </BottomNavScreenLayout>
      <ReviewDetailSheet
        open={sheet.isOpen}
        onOpenChange={sheet.onOpenChange}
        detail={sheet.detail}
      />
    </>
  );
}
