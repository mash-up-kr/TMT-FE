"use client";

import { useRouter } from "next/navigation";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
import { useUserProfileSummary, useUserProfileTabPage } from "../_hooks/useProfileData";
import { useReviewDetailSheet } from "../_hooks/useReviewDetailSheet";
import type { ProfileTab } from "../_model/profile";
import { groupHref, placeHref, userProfileHref } from "../_utils/profileHrefs";
import { ProfilePage } from "./ProfilePage";
import { ProfileScreenStatus } from "./ProfileScreenStatus";
import { ProfileTabBody } from "./ProfileTabBody";
import { ProfileTabSkeleton } from "./ProfileTabSkeleton";

type UserProfileScreenProps = {
  userId: string;
  activeTab: ProfileTab;
};

/**
 * 타인 프로필. 배너·티켓·하단 내비가 없고, 그룹 일치 칩과 좋아요 하트도 없다.
 * 프로필과 탭 사이 12px 밴드도 없다 — beforeTabs가 없으면 ProfilePage가 밴드를 그리지 않는다.
 */
export function UserProfileScreen({ userId, activeTab }: UserProfileScreenProps) {
  const router = useRouter();
  const summary = useUserProfileSummary(userId);
  const tabPage = useUserProfileTabPage(userId, activeTab);
  const sheet = useReviewDetailSheet();

  return (
    <>
      <GNB
        align="left"
        className="shrink-0"
        title={null}
        left={
          <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {summary.data ? (
          <ProfilePage
            profile={summary.data.profile}
            activeTab={activeTab}
            basePath={userProfileHref(userId)}
            counts={summary.data.counts}
          >
            {tabPage.data ? (
              <ProfileTabBody
                page={tabPage.data}
                variant="other"
                getGroupHref={groupHref}
                getPlaceHref={placeHref}
                onSelectReview={sheet.open}
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
      <ReviewDetailSheet
        open={sheet.isOpen}
        onOpenChange={sheet.onOpenChange}
        detail={sheet.detail}
      />
    </>
  );
}
