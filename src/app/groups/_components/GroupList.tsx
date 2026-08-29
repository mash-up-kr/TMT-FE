"use client";

import Link from "next/link";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { GroupCard } from "@/shared/components/GroupCard/GroupCard";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { setUt2Step } from "@/shared/hooks/useUt2Step";
import type { GroupListItem } from "../_model/group";

type GroupListProps = {
  groups: GroupListItem[];
};

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return <GroupListEmpty />;
  }

  return (
    <ul className="flex flex-col gap-ds-20 pb-ds-20">
      {groups.map((group) => (
        <li key={group.id}>
          <Link
            href={ROUTES.GROUPS.DETAIL(group.id)}
            className="block rounded-ds-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary"
            /* ⚠️ UT2 임시 계측. 이 클릭이 곧 최종 그룹 선택이다. */
            onClick={() => setUt2Step(UT2_STEPS.GROUP_SELECT_FINAL)}
          >
            <GroupCard
              thumbnail={group.thumbnail}
              title={group.name}
              description={group.description}
              memberCount={group.memberCount}
              reviewCount={group.reviewCount}
              placeCount={group.placeCount}
              matchedCount={group.matchedCount}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GroupListEmpty() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center py-ds-32">
      <EmptyNotice title="검색 결과가 없어요">
        찾으시는 음식 종류, 가게명 등으로 검색해 보세요
      </EmptyNotice>
    </div>
  );
}
