import type { ReactNode } from "react";
import type { ProfileIdentityModel, ProfileTab, ProfileTabCounts } from "../_model/profile";
import { ProfileIdentity } from "./ProfileIdentity";
import { ProfileTabs } from "./ProfileTabs";

type ProfileBodyProps = {
  profile: ProfileIdentityModel;
  activeTab: ProfileTab;
  basePath: string;
  counts: ProfileTabCounts;
  /** 프로필과 탭 사이. Figma에서 내 프로필의 매장 추천·티켓 카드가 놓이는 유일한 자리다. */
  beforeTabs?: ReactNode;
  children: ReactNode;
};

export function ProfileBody({
  profile,
  activeTab,
  basePath,
  counts,
  beforeTabs,
  children,
}: ProfileBodyProps) {
  return (
    <div className="flex flex-col bg-surface-primary">
      <ProfileIdentity profile={profile} />
      {/* 12px 밴드는 배너 영역과 탭을 가르는 것이라 배너가 있을 때만 있다.
          타인 프로필은 배너가 없고 밴드도 없다(1692:24479). */}
      {beforeTabs && (
        <>
          <div className="content-container flex flex-col gap-ds-20 py-ds-20">{beforeTabs}</div>
          <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
        </>
      )}
      <ProfileTabs activeTab={activeTab} basePath={basePath} counts={counts} />
      {children}
    </div>
  );
}
