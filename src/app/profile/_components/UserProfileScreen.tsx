"use client";

import { useRouter } from "next/navigation";
import { ReviewDetailSheet } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
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
  const summary = useUserProfileSummary(userId);
  const tabPage = useUserProfileTabPage(userId, activeTab);
  const sheet = useReviewDetailSheet();

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
