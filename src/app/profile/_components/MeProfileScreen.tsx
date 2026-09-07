"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";
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

export function MeProfileScreen({ activeTab }: { activeTab: ProfileTab }) {
  const router = useRouter();
  const summary = useMyProfileSummary();
  const tabPage = useMyProfileTabPage(activeTab);
  const sheet = useReviewDetailSheet();
  // 어느 카드가 대기 중인지 표시해야 해서 mutation의 isPending으로 대체하지 않는다.
  const [pendingPlaceId, setPendingPlaceId] = useState<string | null>(null);
  const favorite = usePlaceFavorite({
    onSuccessAction: () => toast.success("좋아요를 취소했어요"),
  });

  // 목록 갱신은 usePlaceFavorite의 query 무효화가 맡는다.
  const unfavorite = async (placeId: string) => {
    setPendingPlaceId(placeId);
    await favorite.onToggleAction({ id: placeId, isFavorite: true });
    setPendingPlaceId(null);
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
      <ScreenLayout header={header}>
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
      </ScreenLayout>
      <ReviewDetailSheet
        open={sheet.isOpen}
        onOpenChange={sheet.onOpenChange}
        detail={sheet.detail}
      />
    </>
  );
}
