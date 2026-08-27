"use client";

import { useEffect, useRef, useState } from "react";
import {
  GroupDetailContainer,
  GroupDetailError,
  GroupDetailLoading,
} from "@/app/groups/[groupId]/_components/GroupDetailContainer";
import { GroupDetailView } from "@/app/groups/[groupId]/_components/GroupDetailView";
import { GroupLeaveModal } from "@/app/groups/[groupId]/_components/GroupLeaveModal";
import { JoinGroupTicketSheet } from "@/app/groups/[groupId]/_components/JoinGroupTicketSheet";
import {
  GROUP_DETAIL_PAGE_REVIEWS,
  requireGroupDetailPageFixture,
} from "@/app/groups/[groupId]/_constants/groupDetail";
import type { GroupJoinAction, GroupLeaveAction } from "@/app/groups/[groupId]/_model/groupDetail";
import { toast } from "@/shared/ui/Toast";
import { cn } from "@/shared/utils/cn";

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const SCENARIOS = [
  {
    section: "그룹 가입",
    key: "mock-not-joined-joinable",
    label: "티켓 보유",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 가입",
    key: "mock-not-joined-shortage",
    label: "티켓 부족",
    isMember: false,
    isJoinable: false,
    availableTicketCount: 0,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 가입",
    key: "join-confirmation",
    label: "가입 확인",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: "idle",
    leaveModalState: undefined,
  },
  {
    section: "그룹 가입",
    key: "join-pending",
    label: "가입 중",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: "pending",
    leaveModalState: undefined,
  },
  {
    section: "그룹 가입",
    key: "join-error",
    label: "가입 실패",
    isMember: false,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 가입",
    key: "join-success",
    label: "가입 성공",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 탈퇴",
    key: "leave-confirmation",
    label: "확인",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: "idle",
  },
  {
    section: "그룹 탈퇴",
    key: "leave-pending",
    label: "탈퇴 중",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: "pending",
  },
  {
    section: "그룹 탈퇴",
    key: "leave-error",
    label: "탈퇴 실패",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 탈퇴",
    key: "leave-owner-error",
    label: "그룹장 · 탈퇴 불가",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "그룹 탈퇴",
    key: "leave-success",
    label: "탈퇴 완료",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  { section: "공통 상태", key: "loading", label: "로딩" },
  { section: "공통 상태", key: "error", label: "불러오기 실패" },
  {
    section: "공통 상태",
    key: "empty-reviews",
    label: "그룹장 · 리뷰 0",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  {
    section: "공통 상태",
    key: "first-review-prompt",
    label: "생성 · 첫 리뷰 유도",
    isMember: true,
    isJoinable: true,
    availableTicketCount: 1,
    joinSheetState: undefined,
    leaveModalState: undefined,
  },
  { section: "공통 상태", key: "api", label: "API · group_1" },
] as const;

const PREVIEW_SECTIONS = ["그룹 가입", "그룹 탈퇴", "공통 상태"] as const;

const API_GROUP_ID = "group_1";
const MOCK_GROUP = requireGroupDetailPageFixture("group_1");
const PREVIEW_JOIN_ACTION: GroupJoinAction = {
  onJoin: async () => true,
  isPending: false,
};

const PREVIEW_JOIN_ACTIONS = {
  idle: PREVIEW_JOIN_ACTION,
  pending: { ...PREVIEW_JOIN_ACTION, isPending: true },
} as const satisfies Record<"idle" | "pending", GroupJoinAction>;

const PREVIEW_LEAVE_ACTION: GroupLeaveAction = {
  onLeaveAction: async () => ({ success: false }),
  isPending: false,
};

const PREVIEW_LEAVE_ACTIONS = {
  idle: { ...PREVIEW_LEAVE_ACTION, onLeaveAction: async () => ({ success: true }) },
  pending: { ...PREVIEW_LEAVE_ACTION, isPending: true },
} as const satisfies Record<"idle" | "pending", GroupLeaveAction>;

export default function GroupDetailPreviewPage() {
  const [scenarioKey, setScenarioKey] = useState<(typeof SCENARIOS)[number]["key"]>(
    "mock-not-joined-joinable",
  );
  const previewToastIdRef = useRef<string | null>(null);
  const scenario = SCENARIOS.find((item) => item.key === scenarioKey) ?? SCENARIOS[0];

  useEffect(() => {
    return () => {
      if (previewToastIdRef.current) {
        toast.close(previewToastIdRef.current);
      }
    };
  }, []);

  function handleScenarioChange(key: (typeof SCENARIOS)[number]["key"]) {
    if (previewToastIdRef.current) {
      toast.close(previewToastIdRef.current);
      previewToastIdRef.current = null;
    }

    setScenarioKey(key);

    if (key === "leave-success") {
      previewToastIdRef.current = toast.success("그룹 탈퇴가 완료되었어요.");
    }

    if (key === "leave-error") {
      previewToastIdRef.current = toast.error("그룹 탈퇴에 실패했어요. 다시 시도해 주세요.");
    }

    if (key === "leave-owner-error") {
      previewToastIdRef.current = toast.error("그룹장은 탈퇴할 수 없습니다.");
    }

    if (key === "join-error") {
      previewToastIdRef.current = toast.error("그룹 가입에 실패했어요. 다시 시도해 주세요.");
    }

    if (key === "join-success") {
      previewToastIdRef.current = toast.success("그룹 가입이 완료되었어요.");
    }
  }

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
        {PREVIEW_SECTIONS.map((section) => (
          <div key={section} className="flex flex-col gap-ds-4">
            <p className="px-ds-4 text-body-sm-medium text-content-tertiary">{section}</p>
            {SCENARIOS.filter((item) => item.section === section).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleScenarioChange(item.key)}
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
          </div>
        ))}
      </nav>
    </>
  );
}

type GroupDetailPreviewScenario = Extract<(typeof SCENARIOS)[number], { isMember: boolean }>;

function GroupDetailPreviewScreen({ scenario }: { scenario: GroupDetailPreviewScenario }) {
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(Boolean(scenario.joinSheetState));
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(Boolean(scenario.leaveModalState));
  const group = {
    ...MOCK_GROUP,
    isMember: scenario.isMember,
    isJoinable: scenario.isJoinable,
    isOwner:
      scenario.key === "leave-owner-error" ||
      scenario.key === "empty-reviews" ||
      scenario.key === "first-review-prompt",
    availableTicketCount: scenario.availableTicketCount,
  };
  const joinAction = scenario.joinSheetState
    ? PREVIEW_JOIN_ACTIONS[scenario.joinSheetState]
    : PREVIEW_JOIN_ACTION;
  const leaveAction = scenario.leaveModalState
    ? PREVIEW_LEAVE_ACTIONS[scenario.leaveModalState]
    : PREVIEW_LEAVE_ACTION;

  return (
    <>
      <GroupDetailView
        group={group}
        reviewList={{
          reviews:
            scenario.key === "empty-reviews" || scenario.key === "first-review-prompt"
              ? []
              : GROUP_DETAIL_PAGE_REVIEWS,
          hasNextPage: false,
        }}
        joinAction={joinAction}
        leaveAction={leaveAction}
        initialFirstReviewSheetOpen={scenario.key === "first-review-prompt"}
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
      {scenario.leaveModalState ? (
        <GroupLeaveModal
          open={isLeaveModalOpen}
          onOpenChangeAction={setIsLeaveModalOpen}
          leaveAction={leaveAction}
        />
      ) : null}
    </>
  );
}
