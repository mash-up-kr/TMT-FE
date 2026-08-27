import Link from "next/link";
import { chipStyles } from "@/shared/ui/Chip";
import { PROFILE_TABS, type ProfileTab, type ProfileTabCounts } from "../_model/profile";

const TAB_LABELS: Record<ProfileTab, string> = {
  reviews: "리뷰",
  groups: "그룹",
  favorites: "좋아요",
};

type ProfileTabsProps = {
  activeTab: ProfileTab;
  basePath: string;
  /** 없으면 라벨만 그린다. 개수를 몰라도 탭 이동은 동작해야 한다. */
  counts?: ProfileTabCounts;
};

export function ProfileTabs({ activeTab, basePath, counts }: ProfileTabsProps) {
  return (
    <nav aria-label="프로필 탭" className="bg-surface-primary px-ds-20 py-ds-12">
      <ul className="flex flex-wrap content-center items-center gap-ds-8">
        {PROFILE_TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <li key={tab}>
              <Link
                href={`${basePath}/${tab}`}
                aria-current={isActive ? "page" : undefined}
                className={chipStyles({ selected: isActive })}
              >
                {counts ? `${TAB_LABELS[tab]} ${counts[tab]}` : TAB_LABELS[tab]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
