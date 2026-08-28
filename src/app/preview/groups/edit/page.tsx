"use client";

import { useEffect, useRef, useState } from "react";
import type { GroupTagOptionsState } from "@/app/groups/_model/groupTag";
import {
  GroupEditError,
  GroupEditLoading,
} from "@/app/groups/[groupId]/edit/_components/GroupEditFeedback";
import { GroupEditView } from "@/app/groups/[groupId]/edit/_components/GroupEditView";
import type {
  GroupDeleteAction,
  GroupEditFormData,
} from "@/app/groups/[groupId]/edit/_model/groupEdit";
import { toast } from "@/shared/ui/Toast";
import { cn } from "@/shared/utils/cn";

const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

const GROUP_ID = "group_2";

const INITIAL_FORM: GroupEditFormData = {
  groupName: "나는야 초밥왕",
  summaryDescription: "회전 초밥부터 오마카세까지",
  foodCategoryId: "food_2",
  regionIds: ["region_1", "region_2"],
  imageUrl: null,
  detailedDescription: "맛있는 초밥을 찾아다니는 사람들과 새로운 가게를 함께 발견해요.",
};

const TAG_OPTIONS_STATE: GroupTagOptionsState = {
  status: "success",
  options: {
    categories: [
      { id: "food_1", label: "한식" },
      { id: "food_2", label: "일식" },
      { id: "food_3", label: "중식" },
      { id: "food_4", label: "양식" },
      { id: "food_5", label: "카페·디저트" },
    ],
    regions: [
      { id: "region_1", label: "서울 전체" },
      { id: "region_2", label: "성동구" },
      { id: "region_3", label: "마포구" },
      { id: "region_4", label: "강남구" },
    ],
  },
};

const SCENARIOS = [
  { key: "default", label: "기본 화면" },
  { key: "delete-confirm", label: "삭제 확인" },
  { key: "delete-pending", label: "삭제 중" },
  { key: "save-pending", label: "저장 중" },
  { key: "delete-success", label: "삭제 완료" },
  { key: "delete-error", label: "삭제 실패" },
  { key: "loading", label: "로딩" },
  { key: "error", label: "불러오기 실패" },
] as const;

type ScenarioKey = (typeof SCENARIOS)[number]["key"];

export default function GroupEditPreviewPage() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("default");
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (toastIdRef.current) toast.close(toastIdRef.current);
    };
  }, []);

  function handleScenarioChange(nextKey: ScenarioKey) {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
    }

    setScenarioKey(nextKey);

    if (nextKey === "delete-success") {
      toastIdRef.current = toast.success("그룹 삭제가 완료되었어요.");
    }

    if (nextKey === "delete-error") {
      toastIdRef.current = toast.error("그룹을 삭제하지 못했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <>
      {scenarioKey === "loading" ? (
        <GroupEditLoading />
      ) : scenarioKey === "error" ? (
        <GroupEditError />
      ) : (
        <GroupEditView
          key={scenarioKey}
          groupId={GROUP_ID}
          initialForm={INITIAL_FORM}
          tagOptionsState={TAG_OPTIONS_STATE}
          isSaving={scenarioKey === "save-pending"}
          initialDeleteModalOpen={
            scenarioKey === "delete-confirm" || scenarioKey === "delete-pending"
          }
          deleteAction={createDeleteAction(scenarioKey === "delete-pending")}
          onSaveAction={async () => ({ success: false })}
          onRetryTagOptionsAction={() => undefined}
        />
      )}

      <nav aria-label="프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => handleScenarioChange(scenario.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              scenario.key === scenarioKey
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {scenario.label}
          </button>
        ))}
      </nav>
    </>
  );
}

function createDeleteAction(isPending: boolean): GroupDeleteAction {
  return {
    isPending,
    onDeleteAction: async () => ({ success: false }),
  };
}
