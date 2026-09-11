"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
import { PageLoading } from "@/shared/ui/PageLoading";
import { useIsMyProfile } from "../_hooks/useIsMyProfile";
import { useReviewDetailSheet } from "../_hooks/useReviewDetailSheet";
import { useUserProfileSummary } from "../_hooks/useUserProfileSummary";
import { useUserProfileTabPage } from "../_hooks/useUserProfileTabPage";
import type { ProfileTab } from "../_model/profile";
import { toGroupHref, toPlaceHref, toUserProfileHref } from "../_utils/profileHrefs";
import { ProfileTabPageView } from "./ProfileTabPageView";

type UserProfileScreenProps = {
  userId: string;
  activeTab: ProfileTab;
};

export function UserProfileScreen({ userId, activeTab }: UserProfileScreenProps) {
  const router = useRouter();
  const isMyProfile = useIsMyProfile(userId);
  const summary = useUserProfileSummary(userId);
  const tabPage = useUserProfileTabPage(userId, activeTab);
  const sheet = useReviewDetailSheet();

  // 리뷰 카드는 작성자가 나인지 따지지 않고 링크를 건다. 내 식별자로 들어왔으면 여기서 마이페이지로
  // 넘겨, 티켓·로그아웃이 빠진 읽기 전용 내 프로필을 보게 두지 않는다. URL 직접 진입도 같이 걸린다.
  useEffect(() => {
    if (isMyProfile) router.replace(ROUTES.PROFILE.ME_TAB(activeTab));
  }, [activeTab, isMyProfile, router]);

  if (isMyProfile) {
    return <PageLoading />;
  }

  const header = (
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
  );

  return (
    <>
      <ScreenLayout header={header}>
        <ProfileTabPageView
          summary={summary}
          tabPage={tabPage}
          activeTab={activeTab}
          basePath={toUserProfileHref(userId)}
          tabBody={{
            viewer: "other",
            getGroupHref: toGroupHref,
            getPlaceHref: toPlaceHref,
            onSelectReview: sheet.open,
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
