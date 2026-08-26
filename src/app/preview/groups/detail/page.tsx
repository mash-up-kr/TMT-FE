"use client";

import { useState } from "react";
import { GroupDetailScreen } from "@/app/groups/[groupId]/_components/GroupDetailScreen";
import {
  GroupDetailError,
  GroupDetailLoading,
  GroupDetailView,
} from "@/app/groups/[groupId]/_components/GroupDetailView";
import {
  GROUP_DETAIL_PAGE_REVIEWS,
  requireGroupDetailPageFixture,
} from "@/app/groups/[groupId]/_constants/groupDetail";
import { cn } from "@/shared/utils/cn";

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const SCENARIOS = [
  {
    key: "mock-not-joined-joinable",
    label: "티켓 보유",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
  },
  {
    key: "mock-not-joined-shortage",
    label: "티켓 부족",
    isMember: false,
    isJoinable: false,
    availableTicketCount: 0,
  },
  {
    key: "mock-joined",
    label: "가입",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
  },
  { key: "loading", label: "로딩" },
  { key: "error", label: "불러오기 실패" },
  { key: "api", label: "API · group_1" },
] as const;

const API_GROUP_ID = "group_1";
const MOCK_GROUP = requireGroupDetailPageFixture("group_1");

export default function GroupDetailPreviewPage() {
  const [scenarioKey, setScenarioKey] = useState<(typeof SCENARIOS)[number]["key"]>(
    "mock-not-joined-joinable",
  );
  const scenario = SCENARIOS.find((item) => item.key === scenarioKey) ?? SCENARIOS[0];

  return (
    <>
      {scenario.key === "api" ? (
        <GroupDetailView groupId={API_GROUP_ID} />
      ) : scenario.key === "loading" ? (
        <GroupDetailLoading />
      ) : scenario.key === "error" ? (
        <GroupDetailError />
      ) : (
        <GroupDetailScreen
          group={{
            ...MOCK_GROUP,
            isMember: scenario.isMember,
            isJoinable: scenario.isJoinable,
            availableTicketCount: scenario.availableTicketCount,
          }}
          reviews={GROUP_DETAIL_PAGE_REVIEWS}
        />
      )}

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setScenarioKey(item.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              item.key === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
