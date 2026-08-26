"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { ProfileSummary, ProfileTabPage } from "../_hooks/profileQueries";
import type { ProfileTab } from "../_model/profile";
import { ProfileBody } from "./ProfileBody";
import { ProfileQueryFallback } from "./ProfileQueryFallback";
import { ProfileTabBody, type ProfileTabBodyProps } from "./ProfileTabBody";

type ProfileTabPageViewProps = {
  summary: UseQueryResult<ProfileSummary>;
  tabPage: UseQueryResult<ProfileTabPage>;
  activeTab: ProfileTab;
  basePath: string;
  beforeTabs?: ReactNode;
  tabBody: Omit<ProfileTabBodyProps, "page">;
};

/**
 * 요약과 탭 목록, 두 query의 결과를 프로필 본문으로 조립한다.
 * 내/타인 Screen이 공유하며, 두 화면의 차이는 props로만 들어온다.
 */
export function ProfileTabPageView({
  summary,
  tabPage,
  activeTab,
  basePath,
  beforeTabs,
  tabBody,
}: ProfileTabPageViewProps) {
  if (!summary.data) {
    return <ProfileQueryFallback query={summary} errorMessage="프로필을 불러오지 못했어요" />;
  }

  return (
    <ProfileBody
      profile={summary.data.profile}
      counts={summary.data.counts}
      activeTab={activeTab}
      basePath={basePath}
      beforeTabs={beforeTabs}
    >
      {tabPage.data ? (
        <ProfileTabBody page={tabPage.data} {...tabBody} />
      ) : (
        <ProfileQueryFallback query={tabPage} errorMessage="목록을 불러오지 못했어요" />
      )}
    </ProfileBody>
  );
}
