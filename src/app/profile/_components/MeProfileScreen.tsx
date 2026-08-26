"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { ROUTES } from "@/shared/constants/routes";
import { BottomNav } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, PlusIcon } from "@/shared/ui/Icons";
import { toast } from "@/shared/ui/Toast";
import { useMyProfileSummary, useMyProfileTabPage } from "../_hooks/useProfileData";
import { useReviewDetailSheet } from "../_hooks/useReviewDetailSheet";
import type { ProfileTab } from "../_model/profile";
import { groupHref, placeHref, ticketsHref } from "../_utils/profileHrefs";
import { PlaceRecommendationCard } from "./PlaceRecommendationCard";
import { ProfilePage } from "./ProfilePage";
import { ProfileScreenStatus } from "./ProfileScreenStatus";
import { ProfileTabBody } from "./ProfileTabBody";
import { ProfileTabSkeleton } from "./ProfileTabSkeleton";
import { TicketCard } from "./TicketCard";

export function MeProfileScreen({ activeTab }: { activeTab: ProfileTab }) {
  const router = useRouter();
  const summary = useMyProfileSummary();
  const tabPage = useMyProfileTabPage(activeTab);
  const sheet = useReviewDetailSheet();
  const [pendingPlaceId, setPendingPlaceId] = useState<string | null>(null);

  const unfavorite = (placeId: string) => {
    setPendingPlaceId(placeId);
    // 계약 3-3: 해제해도 항목은 목록에 남고 다음 조회에서 빠진다.
    setTimeout(() => {
      setPendingPlaceId(null);
      toast.success("좋아요를 취소했어요");
    }, 400);
  };

  return (
    <>
      <GNB
        align="left"
        className="shrink-0"
        title={null}
        left={<BlankIcon size={28} />}
        right={
          <IconButton aria-label="리뷰 작성하기" onClick={() => router.push(ROUTES.REVIEWS.NEW)}>
            <PlusIcon size={28} />
          </IconButton>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {summary.data ? (
          <ProfilePage
            profile={summary.data.profile}
            activeTab={activeTab}
            basePath={ROUTES.PROFILE.ME}
            counts={summary.data.counts}
            beforeTabs={
              <>
                <PlaceRecommendationCard />
                <TicketCard count={summary.data.availableTicketCount ?? 0} href={ticketsHref()} />
              </>
            }
          >
            {tabPage.data ? (
              <ProfileTabBody
                page={tabPage.data}
                variant="mine"
                getGroupHref={groupHref}
                getPlaceHref={placeHref}
                onSelectReview={sheet.open}
                onUnfavorite={unfavorite}
                pendingPlaceId={pendingPlaceId}
              />
            ) : (
              <ProfileScreenStatus
                query={tabPage}
                skeleton={<ProfileTabSkeleton />}
                errorMessage="목록을 불러오지 못했어요"
              />
            )}
          </ProfilePage>
        ) : (
          <ProfileScreenStatus
            query={summary}
            skeleton={<ProfileTabSkeleton />}
            errorMessage="프로필을 불러오지 못했어요"
          />
        )}
      </div>
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value="my"
          onValueChange={() => {}}
          onCreate={() => router.push(ROUTES.REVIEWS.NEW)}
        />
      </div>
      <ReviewDetailSheet
        open={sheet.isOpen}
        onOpenChange={sheet.onOpenChange}
        detail={sheet.detail}
      />
    </>
  );
}
