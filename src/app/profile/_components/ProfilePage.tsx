import type { ReactNode } from "react";
import type { ProfileIdentityModel, ProfileTab, ProfileTabCounts } from "../_model/profile";
import { ProfileIdentity } from "./ProfileIdentity";
import { ProfileTabs } from "./ProfileTabs";

type ProfilePageProps = {
  profile: ProfileIdentityModel;
  activeTab: ProfileTab;
  basePath: string;
  counts: ProfileTabCounts;
  /** 프로필과 탭 사이. Figma에서 내 프로필의 매장 추천·티켓 카드가 놓이는 유일한 자리다. */
  beforeTabs?: ReactNode;
  children: ReactNode;
};

export function ProfilePage({
  profile,
  activeTab,
  basePath,
  counts,
  beforeTabs,
  children,
}: ProfilePageProps) {
  return (
    <div className="flex flex-col bg-surface-primary">
      <ProfileIdentity profile={profile} />
      {beforeTabs ? (
        <div className="content-container flex flex-col gap-ds-20 py-ds-20">{beforeTabs}</div>
      ) : null}
      <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
      <ProfileTabs activeTab={activeTab} basePath={basePath} counts={counts} />
      {children}
    </div>
  );
}
