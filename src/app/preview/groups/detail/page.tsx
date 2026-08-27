"use client";

import { useState } from "react";
import {
  GroupDetailContainer,
  GroupDetailError,
  GroupDetailLoading,
} from "@/app/groups/[groupId]/_components/GroupDetailContainer";
import { GroupDetailView } from "@/app/groups/[groupId]/_components/GroupDetailView";
import { JoinGroupTicketSheet } from "@/app/groups/[groupId]/_components/JoinGroupTicketSheet";
import {
  GROUP_DETAIL_PAGE_REVIEWS,
  requireGroupDetailPageFixture,
} from "@/app/groups/[groupId]/_constants/groupDetail";
import type { GroupJoinAction } from "@/app/groups/[groupId]/_model/groupDetail";
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
    joinSheetState: undefined,
  },
  {
    key: "mock-not-joined-shortage",
    label: "티켓 부족",
    isMember: false,
    isJoinable: false,
    availableTicketCount: 0,
    joinSheetState: undefined,
  },
  {
    key: "join-confirmation",
    label: "가입 확인",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: "idle",
  },
  {
    key: "join-pending",
    label: "가입 중",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: "pending",
  },
  {
    key: "join-error",
    label: "가입 실패",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: "error",
  },
  {
    key: "join-success",
    label: "가입 성공",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
  },
  { key: "loading", label: "로딩" },
  { key: "error", label: "불러오기 실패" },
  { key: "api", label: "API · group_1" },
] as const;

const API_GROUP_ID = "group_1";
const MOCK_GROUP = requireGroupDetailPageFixture("group_1");
const PREVIEW_JOIN_ACTION: GroupJoinAction = {
  onJoin: async () => true,
  isPending: false,
  isError: false,
};

const PREVIEW_JOIN_ACTIONS = {
  idle: PREVIEW_JOIN_ACTION,
  pending: { ...PREVIEW_JOIN_ACTION, isPending: true },
  error: { ...PREVIEW_JOIN_ACTION, isError: true },
} as const satisfies Record<"idle" | "pending" | "error", GroupJoinAction>;

export default function GroupDetailPreviewPage() {
  const [scenarioKey, setScenarioKey] = useState<(typeof SCENARIOS)[number]["key"]>(
    "mock-not-joined-joinable",
  );
  const scenario = SCENARIOS.find((item) => item.key === scenarioKey) ?? SCENARIOS[0];

  return (
    <>
      {scenario.key === "api" ? (
        <GroupDetailContainer groupId={API_GROUP_ID} />
      ) : scenario.key === "loading" ? (
        <GroupDetailLoading />
      ) : scenario.key === "error" ? (
        <GroupDetailError />
      ) : (
        <GroupDetailPreviewScreen key={scenario.key} scenario={scenario} />
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

type GroupDetailPreviewScenario = Extract<(typeof SCENARIOS)[number], { isMember: boolean }>;

function GroupDetailPreviewScreen({ scenario }: { scenario: GroupDetailPreviewScenario }) {
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(Boolean(scenario.joinSheetState));
  const group = {
    ...MOCK_GROUP,
    isMember: scenario.isMember,
    isJoinable: scenario.isJoinable,
    availableTicketCount: scenario.availableTicketCount,
  };
  const joinAction = scenario.joinSheetState
    ? PREVIEW_JOIN_ACTIONS[scenario.joinSheetState]
    : PREVIEW_JOIN_ACTION;

  return (
    <>
      <GroupDetailView
        group={group}
        reviewList={{ reviews: GROUP_DETAIL_PAGE_REVIEWS, hasNextPage: false }}
        joinAction={joinAction}
      />
      {scenario.joinSheetState ? (
        <JoinGroupTicketSheet
          open={isJoinSheetOpen}
          onOpenChangeAction={setIsJoinSheetOpen}
          group={{
            name: group.name,
            imageUrl: group.imageUrl,
            availableTicketCount: group.availableTicketCount,
          }}
          joinAction={joinAction}
        />
      ) : null}
    </>
  );
}
