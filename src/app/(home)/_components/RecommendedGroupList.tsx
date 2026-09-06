"use client";

import Link from "next/link";
import { GroupCard } from "@/shared/components/GroupCard/GroupCard";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { setUt2Step, useUt2Step } from "@/shared/hooks/useUt2Step";
import { cn } from "@/shared/utils/cn";
import type { HomeRecommendedGroup } from "../_model/home";

/** 시안이 300px 고정 카드를 가로로 넘기는 구조라 ds 스케일 대신 값으로 둔다. */
const CARD_WIDTH = "w-[300px]";

type RecommendedGroupListProps = {
  groups: HomeRecommendedGroup[];
  className?: string;
};

/**
 * ⚠️ UT2 계측 때문에 client 컴포넌트가 됐다. 계측을 걷어낼 때 `"use client"`와
 * 스크롤·클릭 핸들러를 함께 지우면 원래대로 server 컴포넌트로 돌아간다.
 */
export function RecommendedGroupList({ groups, className }: RecommendedGroupListProps) {
  const hasGroups = groups.length > 0;

  useUt2Step(UT2_STEPS.HOME_CAROUSEL_VIEW, hasGroups);

  if (!hasGroups) {
    return null;
  }

  return (
    <section className={cn("flex flex-col gap-ds-12 bg-surface-primary p-ds-20", className)}>
      <h2 className="px-ds-4 text-heading-sm text-content-primary">혹시, 이런 그룹은 어떠세요?</h2>
      <ul
        className="-mx-ds-20 flex gap-ds-12 overflow-x-auto px-ds-20"
        onScroll={() => setUt2Step(UT2_STEPS.HOME_CAROUSEL_COMPARE)}
      >
        {groups.map((group) => (
          <li key={group.id} className={`${CARD_WIDTH} shrink-0`}>
            {/* 카드가 나란히 서므로 뱃지 유무로 높이가 갈리면 끝단이 어긋난다.
                li까지 늘어난 높이를 카드까지 잇는다. */}
            <Link
              href={ROUTES.GROUPS.DETAIL(group.id)}
              className="block h-full"
              onClick={() => setUt2Step(UT2_STEPS.GROUP_SELECT_FINAL)}
            >
              <GroupCard
                thumbnail={group.imageUrl}
                title={group.name}
                description={group.description}
                memberCount={group.memberCount}
                reviewCount={group.reviewCount}
                placeCount={group.placeCount}
                matchedCount={group.matchedCount}
                className="h-full"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
