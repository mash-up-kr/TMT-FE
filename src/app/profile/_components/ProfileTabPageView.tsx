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

export function ProfileTabPageView({
  summary,
  tabPage,
  activeTab,
  basePath,
  beforeTabs,
  tabBody,
}: ProfileTabPageViewProps) {
  // 요약이 실패하면 목록도 의미가 없으므로 프로필 쪽 실패를 먼저 알린다.
  const tabArea = summary.isError ? (
    <ProfileQueryFallback query={summary} errorMessage="프로필을 불러오지 못했어요" />
  ) : tabPage.data ? (
    <ProfileTabBody page={tabPage.data} {...tabBody} />
  ) : (
    <ProfileQueryFallback query={tabPage} errorMessage="목록을 불러오지 못했어요" />
  );

  return (
    <ProfileBody
      profile={summary.data?.profile}
      counts={summary.data?.counts}
      activeTab={activeTab}
      basePath={basePath}
      beforeTabs={beforeTabs}
    >
      {tabArea}
    </ProfileBody>
  );
}
